import { React, PropTypes, ExportableGrid, Loading, ComponentManager, connect, redux, elements, axios, GenericForm, createHashHistory, utils } from 'perun-core'
const { labelsManager, jsonToURI, flattenObject, updateIdScreen } = utils
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
  const [toggleSearch, setToggleSearch] = useState(true)

  useEffect(() => {
    updateIdScreen('farm_registry', context, 'farm_registry')
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
          alertUserV2({ type: 'info', title: labelsManager('no_farm_data', context, 'farm_registry') })
        } else {
          const href = `/main/registry/${businessObjectName}/${res.data[0][`${businessObjectName}.OBJECT_ID`]}/summary`
          hashHistory.push(href)
        }
      }
    }).catch(err => {
      console.error(err)
      setLoading(false)
      alertUserResponse({ response: err })
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
      alertUserResponse({ response: err })
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
      alertUserResponse({ response: err })
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
    if (!readOnly) {
      const addButton = {
        type: 'button',
        id: 'add-new-record-btn-grid-toolbar',
        action: () => setShowRegistrationModal(true),
        name: `${labelsManager('add', context, 'farm_registry')}`
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
      alertUserResponse({ response: err })
    })
  }

  const generateForm = () => {
    const searchConfig = configuration?.searchForm
    return (
      <GenericForm
        className='farm-registry-search-form'
        params='FORM_DATA'
        key='AR_SEARCH_FORM'
        id='AR_SEARCH_FORM'
        method={searchConfig?.configuration?.onSubmit}
        uiSchemaConfigMethod={searchConfig?.uischema?.onSubmit}
        tableFormDataMethod={searchConfig?.data?.onSubmit}
        hideBtns='closeAndDelete'
        customSaveButtonName={labelsManager('search', context, 'farm_registry')}
        addSaveFunction={() => handleSearch()}
        customSave
      />
    )
  }
  return (
    <>
      {loading && <Loading />}
      <div className='farm-registry-search-main-container'>
        <div className='sidemenu-main-container farm-registry-sidemenu-main-container hide-all-form-legends'>
          <div className='back-button-container'>
            <button className='btn back-btn' onClick={() => hashHistory.push('/main')}>
              <i className='fas fa-chevron-left' />
              <span className='back-btn-text'>{labelsManager('back', context, 'farm_registry')}</span>
            </button>
          </div>
          <div className="farm-registry-sidemenu-buttons-container">

            {(!configuration?.readOnly) && <button id="add_vmp" onClick={() => setShowRegistrationModal(true)} className="sidemenu-btn_sub">
              <span className="sidemenu-btn-title">
                <span className="sidemenu-dynamic-comp-icon-holder">
                  {iconManager.getIcon('ADD_FARM')}
                </span><p>{labelsManager(`add_${businessObjectName?.toLowerCase()}`, context, 'farm_registry')}</p></span></button>}

            {configuration && <button id="search_vmp" onClick={() => setToggleSearch(!toggleSearch)} className={`sidemenu-btn_sub ${toggleSearch && 'sidemenu-active'}`}>
              <span className="sidemenu-btn-title">
                <span className="sidemenu-dynamic-comp-icon-holder">
                  {iconManager.getIcon('SEARCH_FARM')}
                </span><p>{labelsManager(`search_${businessObjectName?.toLowerCase()}`, context, 'farm_registry')}</p></span></button>}
          </div>
          {configuration && toggleSearch && generateForm()}
        </div>
        <div className='farm-registry-search-grid-container farm-search-container-background'>
          {resultsData && generateGrid(resultsData)}
        </div>
        {showRegistrationModal && (
          <Modal className='farm-registry-modal' show={showRegistrationModal} onHide={() => setShowRegistrationModal(false)}>
            <Modal.Header className='farm-registry-modal-header' closeButton>
              <Modal.Title>{labelsManager(`register_new_${businessObjectName?.toLowerCase()}`, context, 'farm_registry')}</Modal.Title>
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
