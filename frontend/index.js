/**
 * Import all internal indexes, thus including the code in the final build.
 * export all content representing the surface of your plugin API. Noone is expected to call, but wth.
 * Wait to be called for render, Core will call you.
 */
import FarmRegistry from "./FarmRegistry/FarmRegistry";
import mapDataReducer from './FarmRegistry/reducerMap'

import { redux, persistBundleReducers } from 'perun-core'
const { store, injectAsyncReducer } = redux;
persistBundleReducers(['farm_registry.mapData'])
injectAsyncReducer(store, 'farm_registry.mapData', mapDataReducer)

const routes = [
  {
    name: "farm-registry-main",
    path: "/main/farm-registry",
    render: FarmRegistry,
    isExact: true,
  },
  {
    name: "farm-registry-registration",
    path: "/main/farm-registry/registration/:params",
    render: FarmRegistry,
    isExact: false,
  },
];

export { FarmRegistry, routes };
