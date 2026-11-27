import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { build } from 'vite';

// The shipped bundle is a UMD plugin the shell fetches, not a page, so this serves the shell,
// its vendor bundles and a watch build of this module, and proxies the rest to the backend.

const root = path.resolve(import.meta.dirname, '..');
const www = path.join(root, 'backend/www');
const require = createRequire(import.meta.url);

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

// Served as separate scripts, as in a deployment, not bundled in. A sibling checkout wins over
// the install, so a rebuild next door shows up on reload.
const vendorBundle = (name, from, sibling) => {
  const local = sibling && path.resolve(root, '..', sibling);

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
    `vite: ${name} is neither installed nor built in a sibling checkout. ` +
    `Run \`pnpm install\`, or build it in ../${sibling.split('/')[0]}.`
  );
};

// Anchored so commented-out hosts are skipped; built per call because a `g` regex keeps lastIndex.
const serverLine = () => /^([ \t]*)window\.server\s*=\s*['"]([^'"]+)['"]/gm;

// The last live assignment is the one the page ends up with.
const readApiUrl = () => {
  const source = fs.readFileSync(path.join(www, 'config.js'), 'utf8');
  const found = [...source.matchAll(serverLine())];
  return found.length ? new URL(found[found.length - 1][2]) : null;
};

const TYPES = {
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
};

// no-store: the shell loads this module's script with no version in the URL, so a cached copy
// would hide every rebuild.
const serveDir = (prefix, dir) => (req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') return next();
  const { pathname } = new URL(req.url, 'http://localhost');
  if (!pathname.startsWith(prefix)) return next();

  let relative;
  try {
    relative = decodeURIComponent(pathname.slice(prefix.length));
  } catch {
    return next();
  }
  const file = path.join(dir, relative);
  if (file !== dir && !file.startsWith(dir + path.sep)) return next();

  fs.stat(file, (error, stat) => {
    if (error || !stat.isFile()) return next();
    res.setHeader('Content-Type', TYPES[path.extname(file)] ?? 'application/octet-stream');
    res.setHeader('Content-Length', stat.size);
    res.setHeader('Cache-Control', 'no-store');
    if (req.method === 'HEAD') return res.end();
    fs.createReadStream(file).pipe(res);
  });
};

/**
 * @param {{ name: string, file: string }} self  This module's context path and bundle file.
 */
export function devServer(self) {
  // Lazy: `vite build` loads this config on CI, where there is no config.js or sibling checkout.
  const resolve = () => {
    const perunCore = vendorBundle('perun-core', null, 'perun-core/www');
    const perunAtlas = vendorBundle('perun-atlas', null, 'perun-atlas/backend/www');
    // Not a dependency here: it comes in under perun-atlas, but the shell loads it as its own script.
    const spatial = vendorBundle(
      'spatial',
      path.dirname(require.resolve('perun-atlas/package.json')),
      'svarog-spatial/backend/www'
    );
    const vendors = [perunCore, spatial, perunAtlas];
    // Each package's name is its context path on the server, so these mounts shadow the deployed copies.
    const owned = [...vendors, self].map(v => `/${v.name}/`);

    return { perunCore, vendors, owned, api: readApiUrl() };
  };
  let site;
  // Vite's client imports env.mjs from under /node_modules/; proxied, it would 404 and never run.
  const viteOwned = ['/@', '/node_modules/'];

  return {
    name: 'farm-registry:dev-server',
    apply: 'serve',

    config: () => {
      site = resolve();
      const { api, owned } = site;
      return {
        appType: 'custom',
        publicDir: false,
        server: {
          port: 8080,
          proxy: api ? {
            // Everything not owned here goes to the backend, including assets whose location the
            // server only reveals at runtime (FRONTEND_ASSETS_LOCATION).
            '^/': {
              target: api.origin,
              changeOrigin: true,
              secure: false,
              bypass: (req) => {
                const { pathname } = new URL(req.url, 'http://localhost');
                return [...owned, ...viteOwned].some(prefix => pathname.startsWith(prefix))
                  ? req.url
                  : undefined;
              },
            },
          } : undefined,
        },
      };
    },

    async configureServer(server) {
      const { perunCore, vendors, api } = site;
      const watcher = await build({
        configFile: server.config.configFile,
        mode: 'development',
        build: { watch: {} },
      });

      // Wait for the first bundle, so the first page load does not get a stale one.
      let ready;
      const built = new Promise(resolve => { ready = resolve; });
      watcher.on('event', (event) => {
        if (event.code === 'BUNDLE_END') {
          event.result.close();
          server.ws.send({ type: 'full-reload', path: '*' });
          ready();
        } else if (event.code === 'ERROR') {
          ready();
        }
      });
      server.httpServer?.once('close', () => watcher.close());
      await built;

      if (api) {
        // A relative window.server, so the API goes through the proxy and CORS never applies.
        server.middlewares.use((req, res, next) => {
          if (req.method !== 'GET' || new URL(req.url, 'http://localhost').pathname !== '/config.js') {
            return next();
          }
          const source = fs.readFileSync(path.join(www, 'config.js'), 'utf8');
          res.setHeader('Content-Type', TYPES['.js']);
          res.setHeader('Cache-Control', 'no-store');
          res.end(
            source.replace(serverLine(), (_match, indent) => `${indent}window.server = '${api.pathname}'`)
          );
        });

        // The committed page loads this module itself; here the shell does, as in a deployment,
        // and a script tag as well would evaluate the bundle twice.
        server.middlewares.use(async (req, res, next) => {
          const { pathname } = new URL(req.url, 'http://localhost');
          if (req.method !== 'GET' || (pathname !== '/' && pathname !== '/index.html')) return next();
          const html = fs.readFileSync(path.join(www, 'index.html'), 'utf8').replace(
            `<script src="${self.file}"></script>`,
            `<script src="/${perunCore.name}/${perunCore.file}"></script>`
          );
          res.setHeader('Content-Type', TYPES['.html']);
          res.setHeader('Cache-Control', 'no-store');
          res.end(await server.transformIndexHtml(req.url, html));
        });
      }

      for (const v of vendors) server.middlewares.use(serveDir(`/${v.name}/`, v.dir));
      // Without this the shell loads the deployed copy of this module from the API origin.
      server.middlewares.use(serveDir(`/${self.name}/`, www));
      if (!api) server.middlewares.use(serveDir('/', www));
    },
  };
}
