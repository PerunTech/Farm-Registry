import { React } from 'perun-core'
import WrapperSearch from '../components/utils_tools/WrapperSearch'
import SearchComponent from '../components/SearchComp/SearchComponent'
import SaveFormAndAttachments from '../components/utils_tools/SaveFormAndAttachments'

const utils = { WrapperSearch, SearchComponent, SaveFormAndAttachments }

export const loadWrappers = () => new Promise(resolve => {
  const script = document.createElement('script')
  script.src = '/wrappers/wrappers.js'
  script.onload = () => {
    const bundle = window['wrappers']
    if (bundle?.wrapperMap) {
      const { register } = window.__farmRegistryWrappers
      Object.entries(bundle.wrapperMap).forEach(([key, Comp]) => {
        register(key, (props) => React.createElement(Comp, { ...utils, ...props }))
      })
    }
    resolve()
  }
  script.onerror = (e) => { console.error('wrappers failed to load', e); resolve() }
  document.head.appendChild(script)
})
