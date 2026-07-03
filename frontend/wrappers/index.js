import { wrapperMap } from '../components/Wrapper'
import { loadWrappers } from './loadWrappers'

const _wrappers = {}
window.__farmRegistryWrappers = {
  register: (key, comp) => { _wrappers[key] = comp },
  getWrapper: (key) => _wrappers[key],
}

Object.entries(wrapperMap).forEach(([key, Comp]) => window.__farmRegistryWrappers.register(key, Comp))
loadWrappers()
