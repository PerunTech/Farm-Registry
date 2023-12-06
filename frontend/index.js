/**
 * Import all internal indexes, thus including the code in the final build.
 * export all content representing the surface of your plugin API. Noone is expected to call, but wth.
 * Wait to be called for render, Core will call you.
 */
import FarmRegistryMainHolder from "./components/FarmRegistryMainHolder";
import mapDataReducer from './components/reducerMap'
import "./components/style/style.css";

import { redux, persistBundleReducers } from 'perun-core'
const { store, injectAsyncReducer } = redux;
persistBundleReducers(['farm_registry.mapData'])
injectAsyncReducer(store, 'farm_registry.mapData', mapDataReducer)

const routes = [
  {
    name: "farm-registry-main",
    path: "/main/farm-registry",
    render: FarmRegistryMainHolder,
    isExact: true,
  },
  {
    name: "farm-registry-farm",
    path: "/main/farm-registry/farm/:params",
    render: FarmRegistryMainHolder,
    isExact: false,
  },
];

export { FarmRegistryMainHolder, routes };
