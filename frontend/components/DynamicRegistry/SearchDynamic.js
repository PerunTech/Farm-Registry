import { React, PropTypes, ExportableGrid, connect, redux, elements, axios, GenericForm, ComponentManager, GridManager, Loading, createHashHistory, utils } from 'perun-core'
import TopButtons from './TopButtons'
const { jsonToURI, flattenObject, labelsManager } = utils
const { alertUserResponse, alertUserV2, ReactBootstrap } = elements
const { Modal } = ReactBootstrap
const { store, dataToRedux, removeAsyncReducer, updateSelectedRows } = redux
const { useState } = React

const SearchDynamic = (props, context) => {
    const hashHistory = createHashHistory()
    const tableName = props.tableName?.toUpperCase() || ''
    const gridId = `${props.tableName}_SEARCH`
    const [loading, setLoading] = useState(false)
    const [resultsData, setResultsData] = useState(undefined)
    const [lastSearchData, setLastSearchData] = useState(undefined)
    const [showRowFormModal, setShowRowFormModal] = useState(false)
    const [clickedRow, setClickedRow] = useState(undefined)

    const generateForm = () => {
        const searchConfig = props.configuration?.searchForm
        return (
            <GenericForm
                className={`sectioned-search-form aims-forms hide-all-form-legends`}
                params='FORM_DATA'
                key={gridId + '_FORM'}
                id={gridId + '_FORM'}
                method={searchConfig?.configuration?.onSubmit}
                uiSchemaConfigMethod={searchConfig?.uischema?.onSubmit}
                tableFormDataMethod={searchConfig?.data?.onSubmit}
                hideBtns='closeAndDelete'
                customSave
                addSaveFunction={(e) => {
                    performSearch(e.formData, true)
                }}
                customSaveButtonName={labelsManager('search', context, 'farm_registry')}
            />
        )
    }

    const onRowClick = (_id, _idx, row) => {
        const href = `/main/aims/${tableName}/${row[`${tableName}.OBJECT_ID`]}/summary`
        hashHistory.push(href)
    }
    const customRowClick = (_id, _rowIdx, row) => {
        store.dispatch({ type: 'SAVE', payload: { key: 'farm-registry-object-id', value: props.objectId } })
        store.dispatch({ type: 'SAVE', payload: { key: 'farm-registry-route', value: hashHistory.location.pathname } })
        const customRowClickConfig = props.configuration?.customRowClick
        const route = customRowClickConfig?.route?.replace("{rowObjectId}", row[`${customRowClickConfig?.tableName}.OBJECT_ID`]);
        hashHistory.push(route)
    }
    const formRowClick = (_id, _idx, row) => {
        setClickedRow(row)
        setShowRowFormModal(true)
    }

    const closeRowFormModal = () => {
        setShowRowFormModal(false)
        setClickedRow(undefined)
    }

    const saveRowForm = (e, saveWs, contentType, params) => {
        let formData = e.formData
        if (params && Object.keys(params).length > 0) {
            Object.assign(formData, { ...params })
        }
        setLoading(true)
        axios({
            method: 'post',
            data: contentType && contentType.includes('application/json') ? formData : encodeURIComponent(JSON.stringify(formData)),
            url: `${window.server}${saveWs}`,
            headers: { 'Content-Type': contentType || 'application/x-www-form-urlencoded' },
        }).then(res => {
            setLoading(false)
            if (res?.data) {
                const resType = res.data?.type?.toLowerCase() || 'info'
                alertUserResponse({
                    response: res.data, onConfirm: () => {
                        if (resType !== 'error') {
                            closeRowFormModal()
                            reloadGrid(gridId + '_GRID', props.configuration?.multiSelect)
                        }
                    }
                })
            }
        }).catch(err => {
            setLoading(false)
            console.error(err)
            alertUserResponse({ response: err })
        })
    }

    const generateRowFormModal = () => {
        const formConfig = props.configuration?.form
        if (!formConfig) return null
        const rowTableName = props.configuration?.tableName?.toUpperCase() || tableName
        const rowObjectId = clickedRow?.[`${rowTableName}.OBJECT_ID`]
        const jsonSchemaWs = formConfig?.configuration?.onSubmit
        const uiSchemaWs = formConfig?.uischema?.onSubmit
        const formDataWs = formConfig?.data?.onSubmit?.replace('{rowObjectId}', rowObjectId)
        const saveWs = formConfig?.save?.onSave
        const saveContentType = formConfig?.save?.contentType
        const saveParams = formConfig?.save?.params
        const readOnly = !saveWs

        return (
            <Modal className='farm-registry-modal' show={showRowFormModal} onHide={closeRowFormModal}>
                <Modal.Header className='farm-registry-modal-header' closeButton />
                <Modal.Body className='farm-registry-modal-body'>
                    <GenericForm
                        className='form-test aims-forms custom-farm-registry-form'
                        params='FORM_DATA'
                        key={gridId + '_ROW_FORM'}
                        id={gridId + '_ROW_FORM'}
                        method={jsonSchemaWs}
                        uiSchemaConfigMethod={uiSchemaWs}
                        tableFormDataMethod={formDataWs}
                        hideBtns={readOnly ? 'all' : 'closeAndDelete'}
                        disabled={readOnly}
                        customSave={!readOnly}
                        addSaveFunction={(e) => saveRowForm(e, saveWs, saveContentType, saveParams)}
                    />
                </Modal.Body>
                <Modal.Footer className='farm-registry-modal-footer' />
            </Modal>
        )
    }

    const customRowSelection = (selectedRows, selectedGridId) => {
        store.dispatch(updateSelectedRows(selectedRows, selectedGridId));
    };

    const reloadGrid = (reloadGridId, multiSelect) => {
        if (lastSearchData) {
            performSearch(lastSearchData, true)
        } else {
            GridManager.reloadAllGrids()
        }
        if (multiSelect) {
            store.dispatch({ type: 'UPDATE_SELECTED_GRID_ROWS', payload: [[], reloadGridId] })
            ComponentManager.setStateForComponent(reloadGridId, 'selectedIndexes', [])
            ComponentManager.setStateForComponent(reloadGridId, 'selectedIndexesBeforeFilters', [])
            ComponentManager.setStateForComponent(reloadGridId, 'selectedRowsBeforeFilters', [])
        }
    }

    const customBtnAction = (el, multiSelect) => {
        const selectedGridRows = store.getState()?.['selectedGridRows']?.['selectedGridRows'] || []

        const executeAction = () => {
            let promptLabel = labelsManager('confirm_submit_action', context, 'farm_registry')
            if (el.useMulti) {
                promptLabel = labelsManager('confirm_action_execution', context, 'farm_registry')
            }
            let saveUrl = `${window.server}${el?.['onSave']}`
            let data
            switch (el['type']) {
                case 'GET': {
                    const executeGetAction = () => {
                        setLoading(true)
                        axios.get(saveUrl).then(res => {
                            setLoading(false)
                            if (res?.data) {
                                alertUserResponse({ response: res.data })
                            }
                        }).catch(err => {
                            setLoading(false)
                            console.error(err)
                            alertUserResponse({ response: err })
                        });
                    }
                    alertUserV2({
                        type: 'info',
                        title: promptLabel,
                        confirmButtonText: labelsManager('yes', context, 'farm_registry'),
                        onConfirm: executeGetAction,
                        showCancel: true,
                        cancelButtonText: labelsManager('no', context, 'farm_registry')
                    })
                    break;
                }
                case 'POST': {
                    const executePostAction = () => {
                        setLoading(true)
                        data = JSON.stringify(selectedGridRows)
                        axios({
                            method: "post",
                            data,
                            url: saveUrl,
                            headers: { "Content-Type": "application/x-www-form-urlencoded" },
                        }).then(res => {
                            if (res?.data) {
                                alertUserResponse({
                                    response: res.data, onConfirm: () => {
                                        reloadGrid(gridId + '_GRID', multiSelect)
                                        setLoading(false)
                                    }
                                })
                            }
                        }).catch(err => {
                            setLoading(false)
                            console.error(err)
                            alertUserResponse({ response: err })
                        });
                    }
                    alertUserV2({
                        type: 'info',
                        title: promptLabel,
                        confirmButtonText: labelsManager('yes', context, 'farm_registry'),
                        onConfirm: executePostAction,
                        showCancel: true,
                        cancelButtonText: labelsManager('no', context, 'farm_registry')
                    })
                    break;
                }
                case 'action': {
                    const action = () => {
                        setLoading(true)
                        data = {
                            "objectArray": selectedGridRows,
                            "objectParams": [{}]
                        }
                        axios({
                            method: el.method,
                            data: JSON.stringify(data),
                            url: `${window.server}${el.url}`,
                            headers: { "Content-Type": el.contentType },
                        }).then(res => {
                            if (res?.data) {
                                alertUserResponse({
                                    response: res.data, onConfirm: () => {
                                        reloadGrid(gridId + '_GRID', multiSelect)
                                        setLoading(false)
                                    }
                                })
                            }
                        }).catch(err => {
                            console.error(err)
                            setLoading(false)
                            alertUserResponse({ response: err })
                        });
                    }
                    alertUserV2({
                        type: 'info',
                        title: promptLabel,
                        confirmButtonText: labelsManager('yes', context, 'farm_registry'),
                        onConfirm: action,
                        showCancel: true,
                        cancelButtonText: labelsManager('no', context, 'farm_registry')
                    })
                    break;
                }
                case 'link': {
                    let href = el['route']
                    hashHistory.push(href)
                    break;
                }
                default:
                    break;
            }
        }

        if (el.useMulti) {
            if (selectedGridRows.length > 0) {
                executeAction()
            } else {
                alertUserV2({ type: 'info', title: labelsManager('select_multi', context, 'farm_registry') })
            }
        } else {
            executeAction()
        }
    }

    const btnArrCreate = (btnArray, multiSelect) => {
        let btnTest = []
        btnArray.map((el, i) => {
            btnTest.push({
                name: el['label'],
                action: () => customBtnAction(el, multiSelect),
                id: `btn-${i}-${el['ID'].replace('.', '-')}`,
                class: 'test'
            })
        })
        return btnTest
    }

    const generateGrid = () => {
        const multiSelect = props.configuration?.multiSelect || false
        const btnArray = props.configuration?.additionalBtns
        const configWs = props.configuration?.configuration?.onSubmit
        const additionalTopBtns = props.configuration?.additionalTopButtons
        return (
            <>
                {additionalTopBtns && Array.isArray(additionalTopBtns) && additionalTopBtns.length > 0 && (
                    <TopButtons configuration={additionalTopBtns} tableName={props.tableName} refreshResults={() => reloadGrid(gridId + '_GRID', multiSelect)} />
                )}
                <ExportableGrid
                    gridType='SEARCH_GRID_DATA'
                    key={gridId + '_GRID'}
                    id={gridId + '_GRID'}
                    heightRatio={0.6}
                    configTableName={configWs}
                    dataTableName={resultsData}
                    onRowClickFunct={props?.configuration?.form ? formRowClick : props?.configuration?.disableRowClick ? () => { } : props?.configuration?.customRowClick ? customRowClick : onRowClick}
                    className='animals-search-grid'
                    refreshData={() => reloadGrid(gridId + '_GRID', multiSelect)}
                    enableMultiSelect={multiSelect}
                    onSelectChangeFunct={customRowSelection}
                    buttonsArray={btnArray ? btnArrCreate(btnArray, multiSelect) : []}
                />
            </>
        )
    }

    const performSearch = (formData, isForm) => {
        setLastSearchData(formData)
        const searchConfig = props.configuration?.searchForm;
        const searchType = searchConfig?.save?.type || 'GET';
        const url = searchConfig?.save?.onSave;
        const reqConfig = { method: searchType, url: `${window.server}${url}` };
        const shouldEncode = props.configuration?.searchForm.save.encode;
        const params = props.configuration?.searchForm.params
        if (params) {
            Object.assign(formData, { ...params })
        }

        if (searchType === 'POST') {
            reqConfig.data = shouldEncode ? jsonToURI(flattenObject(formData)) : JSON.stringify(formData)
        }
        // Handle form-specific logic
        if (isForm) {
            setResultsData(undefined);
            removeAsyncReducer(store, gridId + '_GRID');
            dataToRedux(null, 'componentIndex', gridId + '_GRID', '');
        }
        setLoading(true)
        axios(reqConfig)
            .then(res => {
                setLoading(false)
                if (res?.data?.data && Array.isArray(res.data.data) && res.data.data?.length > 0) {
                    setResultsData(res.data.data)
                } else if (res?.data && Array.isArray(res?.data) && res.data?.length > 0) {
                    setResultsData(res.data)
                } else {
                    alertUserResponse({ response: res })
                }
            })
            .catch(err => {
                console.error(err);
                setLoading(false)
                alertUserResponse({ response: err })
                // Handle form-specific error logic
                if (isForm) {
                    ComponentManager.setStateForComponent(`${gridId}_FORM`, null, {
                        saveExecuted: false,
                    });
                }
            });
    };

    return (
        <>
            {loading && <Loading />}
            <div className='dynamic-search-main-container'>
                <div className='dynamic-search-form'>
                    {props.configuration && generateForm()}
                </div>
                <div className='dynamic-search-grid-container'>
                    {resultsData && generateGrid()}
                </div>
            </div>
            {showRowFormModal && generateRowFormModal()}
        </>
    )
}

const mapStateToProps = (state) => ({
    svSession: state.security.svSession,
})

SearchDynamic.contextTypes = {
    intl: PropTypes.object.isRequired,
}

export default connect(mapStateToProps)(SearchDynamic)
