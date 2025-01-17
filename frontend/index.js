import { Search } from './components/Search'
import { DynamicRegistry } from './components/DynamicRegistry'
import mapDataReducer from './reducers/reducerMap'
import refreshSummary from './reducers/refreshSummaryReducer'

import { redux, persistBundleReducers } from 'perun-core'
const { store, injectAsyncReducer } = redux;
injectAsyncReducer(store, 'farm_registry.mapData', mapDataReducer)
injectAsyncReducer(store, 'refreshSummary', refreshSummary)
persistBundleReducers(['farm_registry.mapData,registry.refreshSummary'])
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
