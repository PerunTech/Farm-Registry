import { Search } from './components/Search'
import { DynamicRegistry } from './components/DynamicRegistry'
import mapDataReducer from './components/reducerMap'

import { redux, persistBundleReducers } from 'perun-core'
const { store, injectAsyncReducer } = redux;
persistBundleReducers(['farm_registry.mapData'])
injectAsyncReducer(store, 'farm_registry.mapData', mapDataReducer)

const routes = [
  {
    name: 'dynamic-registry-search',
    path: '/main/farm-registry',
    render: Search,
    isExact: true,
  },
  {
    name: 'dynamic-registry-main',
    path: '/main/registry/:tableName/:objectId/:component',
    render: DynamicRegistry,
    isExact: true
  }
];

export { routes };
