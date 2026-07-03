import pkg from '../package.json'
import { pluginManager } from 'perun-core';
import * as perunCore from 'perun-core';
import * as plugin from './index';

// In production, perun-core is exposed as a window global by its bundle.
// Locally it's bundled internally, so we expose it manually here.
window['perun-core'] = perunCore;
pluginManager.registerPlugin(pkg.name, plugin);