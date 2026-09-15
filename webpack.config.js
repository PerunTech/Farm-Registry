const path = require('path');
const fs = require('fs');
const pkg = require('./package.json');

/**
 * This module, as the shell addresses it.
 *
 * The backend registers every plugin under a context path and the shell fetches
 * it from `/<context>/<file>.js`. Both halves are already in package.json, and
 * PerunPluginInfo agrees with it.
 */
const self = { name: pkg.name, file: path.basename(pkg.main) };

/** The nearest package.json at or above a directory, or null. */
const manifestNear = (dir) => {
  let current = dir;
  for (;;) {
    const candidate = path.join(current, 'package.json');
    if (fs.existsSync(candidate)) return candidate;
    const parent = path.dirname(current);
    if (parent === current) return null;
    current = parent;
  }
};

/**
 * The bundles the shell provides at runtime.
 *
 * In a deployment these are loaded as separate plugin scripts and every module
 * shares one copy. Locally we serve the very same files, rather than bundling
 * them into this one, so dev behaves like production.
 *
 * Bundling them instead does not work: perun-core's package entry is a full,
 * code-split application, and the chunks it lazy-loads are not published -- a
 * dev-bundled copy dies on `Loading chunk 304 failed` partway through its own
 * bootstrap.
 *
 * A sibling checkout wins over the installed package when one is present. Two
 * reasons, and the first is not a convenience: perun-core code-splits with
 * chunkFilename '[name].perun-core.js', but only the entry chunk is committed,
 * so the installed package asks for chunks that were never published. A local
 * build has them. The second is the dev loop -- rebuild perun-atlas next door
 * and reload this page, with no publish and no reinstall in between.
 *
 * The checkout is also the fallback when the package is not installed at all,
 * which is the state of any machine that cannot reach gitlab.prtech.mk.
 */
const vendorBundle = (name, from, sibling) => {
  const local = sibling && path.resolve(__dirname, '..', sibling);

  let installed = null;
  try {
    const manifest = require.resolve(`${name}/package.json`, from ? { paths: [from] } : undefined);
    installed = path.join(path.dirname(manifest), require(manifest).main);
  } catch {
    installed = null;
  }

  const localManifest = local && manifestNear(local);
  const file = installed
    ? path.basename(installed)
    : localManifest && path.basename(require(localManifest).main);

  if (local && file && fs.existsSync(path.join(local, file))) {
    return { name, dir: local, file, source: 'checkout' };
  }

  if (installed) {
    return { name, dir: path.dirname(installed), file, source: 'installed' };
  }

  throw new Error(
    `webpack: ${name} is neither installed nor built in a sibling checkout. ` +
    `Run \`pnpm install\`, or build it in ../${sibling.split('/')[0]}.`
  );
};

const perunCore = vendorBundle('perun-core', null, 'perun-core/www');
const perunAtlas = vendorBundle('perun-atlas', null, 'perun-atlas/backend/www');
// spatial is not a dependency of this module, and deliberately so -- it comes in
// under perun-atlas, which is the only thing that talks to the map engine. The
// shell still loads it as its own script, so the dev server still serves it.
const spatialInstalledFrom = require.resolve('perun-atlas/package.json');
const spatial = vendorBundle('spatial', path.dirname(spatialInstalledFrom), 'svarog-spatial/backend/www');

const vendors = [perunCore, spatial, perunAtlas];

/**
 * The paths the dev server answers for itself. Everything else is the backend's.
 *
 * Each package's npm name is also its context path on the server, so mounting
 * them under `/<name>` puts the local copy at the very URL the shell asks for,
 * and the shell loads it without knowing the difference.
 */
const devOwned = [...vendors, self].map(v => `/${v.name}/`);

/**
 * The API origin, taken from the config.js that already sits beside index.html
 * so there is only one place to change it.
 *
 * The browser refuses a cross-origin request from localhost to that host, so in
 * dev we proxy the same path instead and hand the page a relative URL.
 */
const readApiUrl = () => {
  const source = fs.readFileSync(path.join(__dirname, 'backend/www/config.js'), 'utf8');
  const found = source.match(/window\.server\s*=\s*['"]([^'"]+)['"]/);
  return found ? new URL(found[1]) : null;
};

module.exports = (_, { mode }) => {
  const api = mode === 'production' ? null : readApiUrl();
  return {
    devtool: 'source-map',
    mode: mode,
    entry: mode === 'production' ? './frontend/index.js' : './frontend/client.js',
    output: {
      path: path.resolve('./backend/www'),
      filename: self.file,
      // Publish the dev build at the path the shell fetches plugins from.
      // Without this the page runs the copy deployed on the server and quietly
      // discards the local one: perun-core's Router loads `/<context>/<file>.js`
      // off the API origin. Images and hot updates resolve from here too.
      ...(api ? { publicPath: `/${self.name}/` } : {}),
      library: self.name,
      libraryTarget: 'umd',
      globalObject: 'this'
    },
    devServer: {
      client: {
        overlay: false
      },
      static: [
        { directory: path.join(__dirname, './backend/www') },
        ...vendors.map(v => ({ directory: v.dir, publicPath: `/${v.name}` })),
      ],
      compress: true,
      ...(api ? {
        proxy: [{
          // Inverted on purpose. The dev server owns a short, known list of
          // paths; everything else belongs to the backend -- the API, the other
          // plugins, and the shared assets whose location the server only
          // reveals at runtime through FRONTEND_ASSETS_LOCATION, so they cannot
          // be listed here.
          context: (pathname) =>
            !devOwned.some(prefix => pathname.startsWith(prefix)) &&
            !pathname.startsWith('/ws') &&
            !pathname.startsWith('/__webpack') &&
            !pathname.includes('.hot-update.') &&
            pathname !== '/config.js' &&
            pathname !== '/' &&
            pathname !== '/index.html',
          target: api.origin,
          changeOrigin: true,
          secure: false,
        }],
      } : {}),
      setupMiddlewares: (middlewares, server) => {
        if (!api) return middlewares;

        // Serve the real config.js with only the API URL rewritten.
        //
        // Same-origin in dev, so the proxy above handles the API and CORS never
        // applies. Everything else in the file is left alone.
        server.app.get('/config.js', (_req, res) => {
          const source = fs.readFileSync(path.join(__dirname, 'backend/www/config.js'), 'utf8');
          res.type('application/javascript').send(
            source.replace(/window\.server\s*=\s*['"][^'"]+['"]/, `window.server = '${api.pathname}'`)
          );
        });

        // Serve index.html as the shell's own page: perun-core and nothing else.
        //
        // The committed file loads this module directly, which is right for the
        // standalone page it describes but wrong here -- the shell loads every
        // plugin itself, in dependency order, and a second copy from a script tag
        // would be a second evaluation of the same bundle. Hand the page the
        // shell and let it do the loading, exactly as a deployment does.
        //
        // The page declares no map settings of its own. spatial 5.0 reads none
        // from the page, and perun-atlas resolves them from the deployment's
        // SPATIAL_* parameters -- so dev and production get their projection,
        // centre and bounds from the same place, which is the whole point of
        // serving the shell's own page here.
        const serveIndex = (_req, res) => {
          const html = fs.readFileSync(path.join(__dirname, 'backend/www/index.html'), 'utf8');
          res.type('html').send(html.replace(
            `<script src="${self.file}"></script>`,
            `<script src="/${perunCore.name}/${perunCore.file}"></script>`
          ));
        };
        server.app.get('/', serveIndex);
        server.app.get('/index.html', serveIndex);

        return middlewares;
      },
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)?$/,
          exclude: /(node_modules)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react'],
              cacheDirectory: true
            }
          }
        },
        {
          // For pure CSS (without CSS modules)
          test: /\.css$/i,
          exclude: /\.module\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
        {
          // For CSS modules
          test: /\.module\.css$/i,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: {
                  localIdentName: '[name]-[local]'
                }
              },
            },
          ],
        },
        {
          test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
          type: 'asset/resource',
        },
      ]
    },
    resolve: {
      extensions: ['.js', '.jsx'],
    },
    // Externalised in dev as well as production: these load as their own
    // scripts either way, so the bundle should reference them, never inline
    // them. Keeping the two modes identical is also why dev now catches
    // problems that used to appear only after deployment.
    externals: { 'perun-core': 'perun-core', 'perun-atlas': 'perun-atlas' },
  }
};
