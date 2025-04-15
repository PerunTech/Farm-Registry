import { React, PropTypes, ExportableGrid, Loading, ComponentManager, connect, redux, elements, axios, createHashHistory } from 'perun-core'
import { getMainLabel, labelsManager } from '../utils_tools/LabelsExport'
import { updateIdScreen } from '../utils_tools/UtilFunctions'
import { jsonToURI, flattenObject } from '../../utils'
import SearchForm from './SearchForm'
import CreateNewRecordForm from './CreateNewRecordForm'
import { iconManager } from "../utils_tools/svgHolder";
const { alertUserResponse, alertUserV2, ReactBootstrap } = elements
const { Modal } = ReactBootstrap
const { store, dataToRedux, removeAsyncReducer } = redux
const { useState, useEffect } = React
const hashHistory = createHashHistory()

const Search = (props, context) => {
  const [businessObjectName, setBusinessObjectName] = useState(undefined)
  const [gridId, setGridId] = useState(undefined)
  const [loading, setLoading] = useState(false)
  const [configuration, setConfiguration] = useState(undefined)
  const [resultsData, setResultsData] = useState(undefined)
  const [showRegistrationModal, setShowRegistrationModal] = useState(false)
  const [toggleSearch, setToggleSearch] = useState(undefined)

  useEffect(() => {
    updateIdScreen(context)
    getBusinessObjectName()
    ssOLogin()
    store.dispatch({ type: 'SAVE', payload: { key: 'refreshSummary', value: false } })
    store.dispatch({ type: 'SAVE', payload: { key: 'refreshSideMenu', value: false } })
    store.dispatch({ type: 'SAVE', payload: { key: 'farm-registry-route', value: '' } })
    store.dispatch({ type: 'SAVE', payload: { key: 'farm-registry-object-id', value: '' } })
  }, [])

  useEffect(() => {
    if (businessObjectName) {
      getConfiguration()
    }
  }, [businessObjectName])

  const ssOLogin = () => {
    if (props?.samlFlag) {
      let url = window.server + `/SvSecurity/getPersonalUserInfo/${props.svSession}/user_info`
      axios.get(url).then(res => {
        if (res.data?.data) {
          const userName = res.data?.data?.['com.prtech.svarog_common.DbDataObject']?.values[2]?.['USER_NAME'] || undefined
          const userGroup = res.data?.data?.['default_user_group']?.['GROUP_SECURITY_TYPE'] || undefined
          if (userGroup === 'POA') {
            let data = {
              "SEARCH_OPTION": "PERSON.ID_NO",
              "SEARCH_VALUES": userName
            }
            searchCurrentUser(data)
          }

        }
      }).catch(err => {
        console.error(err)
      })
    }
  }
  const searchCurrentUser = (data) => {
    let url = `${window.server}/WsFarmUtils/search-farm-person/sid/${props.svSession}`
    setLoading(true)
    axios({
      method: 'post',
      data: JSON.stringify(data),
      url,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).then(res => {
      setLoading(false)
      if (res?.data) {
        if (res.data.length === 0) {
          alertUserV2({ type: 'info', title: labelsManager.importLabel('no_farm_data', context, 'farm_registry') })
        } else {
          const href = `/main/registry/${businessObjectName}/${res.data[0][`${businessObjectName}.OBJECT_ID`]}/summary`
          hashHistory.push(href)
        }
      }
    }).catch(err => {
      console.error(err)
      setLoading(false)
      alertUserResponse({ response: err.response?.data })
    })
  }

  const getBusinessObjectName = () => {
    setLoading(true)
    const url = `${window.server}/WsConf/params/get/sys/BUSINESS_OBJECT_NAME`
    axios.get(url).then(res => {
      setLoading(false)
      if (res?.data?.VALUE) {
        const objectName = res.data.VALUE
        setBusinessObjectName(objectName)
        setGridId(`${objectName}_SEARCH_GRID`)
      }
    }).catch(err => {
      setLoading(false)
      console.error(err)
      alertUserResponse({ response: err.response?.data })
    })
  }

  const getConfiguration = () => {
    setLoading(true)
    const { svSession } = props
    const url = `${window.server}/custom-menu/get-configuration/sid/${svSession}/component-name/main-registry-search-menu/object-id/0/object-type/${businessObjectName}`
    axios.get(url).then(res => {
      setLoading(false)
      if (res?.data) {
        const resType = res.data?.type?.toLowerCase()
        if (resType && resType === 'error') {
          alertUserResponse({ response: res.data })
        } else {
          if (res.data?.data && Array.isArray(res.data?.data) && res.data?.data?.length > 0) {
            res.data.data.forEach(item => {
              // Match the appropriate configuration item according to the selected table
              if (item.ID === businessObjectName) {
                setConfiguration(item.objectConfiguration)
              }
            })
          }
        }
      }

    }).catch(err => {
      setLoading(false)
      console.error(err)
      alertUserResponse({ response: err.response?.data })
    })
  }

  const onRowClick = (_id, _idx, row) => {
    const href = `/main/registry/${businessObjectName}/${row[`${businessObjectName}.OBJECT_ID`]}/summary`
    hashHistory.push(href)
  }

  const generateGrid = (data) => {
    const buttonsArray = []
    const configWs = configuration?.configuration?.onSubmit
    const readOnly = configuration?.readOnly
    const addFormConfig = configuration?.addForm
    if (!readOnly && addFormConfig) {
      const addButton = {
        type: 'button',
        id: 'add-new-record-btn-grid-toolbar',
        action: () => setShowRegistrationModal(true),
        name: `${getMainLabel('add', context)}`
      }
      buttonsArray.push(addButton)
    }
    return (
      <ExportableGrid
        gridType='SEARCH_GRID_DATA'
        key={gridId}
        id={gridId}
        configTableName={configWs}
        dataTableName={data}
        onRowClickFunct={onRowClick}
        className='animals-search-grid'
        buttonsArray={buttonsArray}
        heightRatio={0.8}
      />
    )
  }

  const handleSearch = () => {
    setLoading(true)
    setResultsData(undefined)
    removeAsyncReducer(store, gridId)
    dataToRedux(null, 'componentIndex', gridId, '')
    const searchConfig = configuration?.searchForm
    const searchType = searchConfig?.save?.type || 'GET'
    const contentType = searchConfig?.save?.contentType || 'application/x-www-form-urlencoded'
    const url = searchConfig?.save?.onSave
    const shouldEncode = searchConfig?.save?.encode
    const formData = ComponentManager.getStateForComponent('AR_SEARCH_FORM', 'formTableData')
    const reqConfig = { method: searchType, url: `${window.server}${url}` }
    if (searchType === 'POST') {
      reqConfig.data = shouldEncode ? jsonToURI(flattenObject(formData)) : encodeURIComponent(JSON.stringify(flattenObject(formData)))
      reqConfig.headers = { 'Content-Type': contentType }
    }
    axios(reqConfig).then(res => {
      setLoading(false)
      if (res?.data) {
        if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
          setResultsData(res.data)
        } else if (res?.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
          setResultsData(res.data.data)
        } else {
          if (res?.data && Array.isArray(res?.data)) {
            setResultsData([])
          } else {
            alertUserResponse({ response: res.data })
          }
        }
      }
    }).catch(err => {
      setLoading(false)
      console.error(err)
      alertUserResponse({ response: err.response?.data })
    })
  }

  return (
    <>
      {loading && <Loading />}
      <div className='farm-registry-search-main-container'>
        <div className='sidemenu-main-container farm-registry-sidemenu-main-container hide-all-form-legends'>
          <div className='back-button-conainer'>
            <button className='btn back-btn' onClick={() => hashHistory.push('/main')}>
              <i className='fas fa-chevron-left' />
              <span className='back-btn-text'>{getMainLabel('back', context)}</span>
            </button>
          </div>
          <div className="farm-registry-sidemenu-buttons-container">

            {(!configuration?.readOnly && configuration?.addForm) && <button id="add_vmp" onClick={() => setShowRegistrationModal(true)} className="sidemenu-btn_sub">
              <span className="sidemenu-btn-title">
                <span className="sidemenu-dynamic-comp-icon-holder">
                  {iconManager.getIcon('ADD_FARM')}
                </span><p>{getMainLabel('add', context)}</p></span></button>}

            {configuration && <button id="search_vmp" onClick={() => setToggleSearch(!toggleSearch)} className={`sidemenu-btn_sub ${toggleSearch && 'sidemenu-active'}`}>
              <span className="sidemenu-btn-title">
                <span className="sidemenu-dynamic-comp-icon-holder">
                  {iconManager.getIcon('SEARCH_FARM')}
                </span><p>{getMainLabel('search', context)}</p></span></button>}
          </div>

          {configuration && toggleSearch && <SearchForm hideAdd={true} configuration={configuration} handleSearch={handleSearch} setShowRegistrationModal={setShowRegistrationModal} />}
        </div>
        <div className='farm-registry-search-grid-container farm-search-container-background'>
          {resultsData && generateGrid(resultsData)}
        </div>
        {showRegistrationModal && (
          <Modal className='farm-registry-modal' show={showRegistrationModal} onHide={() => setShowRegistrationModal(false)}>
            <Modal.Header className='farm-registry-modal-header' closeButton>
              <Modal.Title>{getMainLabel(`register_new_${businessObjectName?.toLowerCase()}`, context)}</Modal.Title>
            </Modal.Header>
            <Modal.Body className='farm-registry-modal-body'>
              <CreateNewRecordForm
                configuration={configuration}
                setShowRegistrationModal={setShowRegistrationModal}
                businessObjectName={businessObjectName}
              />
            </Modal.Body>
            <Modal.Footer className='farm-registry-modal-footer' />
          </Modal>
        )}
      </div>
    </>
  )
}

const mapStateToProps = (state) => ({
  svSession: state.security.svSession,
  samlFlag: state.security?.saml
})

Search.contextTypes = {
  intl: PropTypes.object.isRequired,
}

export default connect(mapStateToProps)(Search)
