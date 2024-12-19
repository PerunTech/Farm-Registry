import { React, PropTypes, ExportableGrid, Loading, ComponentManager, connect, redux, elements, axios, createHashHistory } from 'perun-core'
import { getMainLabel } from '../utils_tools/LabelsExport'
import { updateIdScreen } from '../utils_tools/UtilFunctions'
import { jsonToURI, flattenObject } from '../../utils'
import SearchForm from './SearchForm'
import CreateNewRecordForm from './CreateNewRecordForm'
const { alertUser, ReactBootstrap } = elements
const { Modal } = ReactBootstrap
const { store, dataToRedux, removeAsyncReducer } = redux
const { useState, useEffect } = React
const hashHistory = createHashHistory()

const Search = (props, context) => {
  const [bussinessObjectName, setBussinessObjectName] = useState(undefined)
  const [gridId, setGridId] = useState(undefined)
  const [loading, setLoading] = useState(false)
  const [configuration, setConfiguration] = useState(undefined)
  const [resultsData, setResultsData] = useState(undefined)
  const [showRegistrationModal, setShowRegistrationModal] = useState(false)

  useEffect(() => {
    updateIdScreen(context)
    getBussinessObjectName()
    store.dispatch({ type: 'SAVE', payload: { 'farm-registry': {} } })
  }, [])

  useEffect(() => {
    if (bussinessObjectName) {
      getConfiguration()
    }
  }, [bussinessObjectName])

  const getBussinessObjectName = () => {
    setLoading(true)
    const url = `${window.server}/WsConf/params/get/sys/BUSINESS_OBJECT_NAME`
    axios.get(url).then(res => {
      setLoading(false)
      if (res?.data?.VALUE) {
        const objectName = res.data.VALUE
        setBussinessObjectName(objectName)
        setGridId(`${objectName}_SEARCH_GRID`)
      }
    }).catch(err => {
      setLoading(false)
      console.error(err)
      const title = err.response?.data?.title || err
      const msg = err.response?.data?.message || ''
      alertUser(true, 'error', title, msg)
    })
  }

  const getConfiguration = () => {
    setLoading(true)
    const { svSession } = props
    const url = `${window.server}/custom-menu/get-configuration/sid/${svSession}/component-name/main-registry-search-menu/object-id/0/object-type/${bussinessObjectName}`
    axios.get(url).then(res => {
      setLoading(false)
      const resType = res?.data?.type?.toLowerCase()
      if (resType && resType === 'error') {
        const title = res.data?.title || ''
        const msg = res.data?.message || ''
        alertUser(true, 'error', title, msg)
      } else {
        if (res?.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
          res.data.data.forEach(item => {
            // Match the appropriate configuration item according to the selected table
            if (item.ID === bussinessObjectName) {
              setConfiguration(item.objectConfiguration)
            }
          })
        }
      }
    }).catch(err => {
      setLoading(false)
      console.error(err)
      const title = err.response?.data?.title || err
      const msg = err.response?.data?.message || ''
      alertUser(true, 'error', title, msg)
    })
  }

  const onRowClick = (_id, _idx, row) => {
    const href = `/main/registry/${bussinessObjectName}/${row[`${bussinessObjectName}.OBJECT_ID`]}/summary`
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
        id: 'add-new-record-btn',
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
      const resType = res?.data?.type?.toLowerCase() || 'info'
      const title = res?.data?.title || ''
      const msg = res?.data?.message || ''
      if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
        setResultsData(res.data)
      } else if (res?.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
        setResultsData(res.data.data)
      } else {
        if (res?.data && Array.isArray(res?.data)) {
          setResultsData([])
        } else {
          alertUser(true, resType, title, msg)
        }
      }
    }).catch(err => {
      setLoading(false)
      console.error(err)
      const title = err.response?.data?.title || err
      const msg = err.response?.data?.message || ''
      alertUser(true, 'error', title, msg)
    })
  }

  return (
    <>
      {loading && <Loading />}
      <div className='animals-search-main-container'>
        <div className='aims-search-form-container hide-all-form-legends'>
          <button className='btn back-btn' onClick={() => hashHistory.push('/main')}>
            <i className='fas fa-chevron-left' />
            <span className='back-btn-text'>{getMainLabel('back', context)}</span>
          </button>
          {configuration && <SearchForm configuration={configuration} handleSearch={handleSearch} setShowRegistrationModal={setShowRegistrationModal} />}
        </div>
        <div className='animals-search-grid-container'>
          {resultsData && generateGrid(resultsData)}
        </div>
        {showRegistrationModal && (
          <Modal className={'farm-registry-modal'} show={showRegistrationModal} onHide={() => setShowRegistrationModal(false)}>
            <Modal.Header className={'farm-registry-modal-header'} closeButton>
              <Modal.Title>{getMainLabel(`register_new_${bussinessObjectName?.toLowerCase()}`, context)}</Modal.Title>
            </Modal.Header>
            <Modal.Body className={'farm-registry-modal-body'}>
              <CreateNewRecordForm
                configuration={configuration}
                setShowRegistrationModal={setShowRegistrationModal}
              />
            </Modal.Body>
            <Modal.Footer className={'farm-registry-modal-footer'} />
          </Modal>
        )}
      </div>
    </>
  )
}

const mapStateToProps = (state) => ({
  svSession: state.security.svSession,
})

Search.contextTypes = {
  intl: PropTypes.object.isRequired,
}

export default connect(mapStateToProps)(Search)
