/**
 * When running a dev environment, you need to register with Core.
 * Import your plugin assembly, i.e. whatever you exported from your entry file, 
 * and call the pluginManager with:
 *  - The name of your plugin, by convention the name specified in package.json
 *  - Your plugin implementation, assembled as an object.
 */
import { name } from '../package.json'
import { pluginManager } from 'perun-core';
import * as pr from 'persons-registry'
import * as plugin from './index';

pluginManager.registerPlugin('persons-registry', pr);
pluginManager.registerPlugin(name, plugin);
console.log(pluginManager.getRegistry())