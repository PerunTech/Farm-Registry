import { React, connect, axios, PropTypes, Loading, elements, ExportableGrid, GridManager, ComponentManager, GenericForm, redux, createHashHistory } from 'perun-core'
import { getMainLabel } from '../utils_tools/LabelsExport';
import { replaceFunc, generateDynamicKey } from '../utils_tools/UtilFunctions';
import DoubleGrid from './DoubleGrid';
import SearchDynamic from './SearchDynamic';
import { iconManager } from '../utils_tools/svgHolder';
import ParentChildGrids from './ParentChildGrids'
import Documents from './Documents'
//WRAPPERS
import FarmmembersWrapper from '../Wrapper/FarmmembersWrapper';
import CadparcelWrapper from '../Wrapper/CadparcelWrapper'
import FarmWrapper from '../Wrapper/FarmWrapper'
import HoldingWrapper from '../Wrapper/HoldingWrapper'
const { ReactBootstrap, alertUserResponse, alertUserV2 } = elements;
const { Modal } = ReactBootstrap;
const { useState, useEffect } = React
const { store, updateSelectedRows } = redux;

const CustomButtons = (props, context) => {
    const hashHistory = createHashHistory();
    const [loading, setLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [dynamicFormId, setDynamicFormId] = useState(generateDynamicKey())
    const [clickedRowObjectId, setClickedRowObjectId] = useState(0)
    const [wrapperName, setWrapper] = useState(undefined)
    const [wrappers, _setWrappers] = useState([{ Farmmembers: FarmmembersWrapper }, { Cadparcel: CadparcelWrapper }, { Farm: FarmWrapper }, { Holding: HoldingWrapper }])
    const [renderForm, setRender] = useState(true)
    const [rowCliked, setRowClicked] = useState(undefined)
    const [cssTableName, _setT] = useState(props.tableName.replace(/\d/g, '').replace(/_$/, ''))
    const [actionToggle, setActionToggle] = useState(undefined)
    useEffect(() => {
        let wrapper = props.tableName.replace(/\d/g, '').replace(/_$/, '').replace(/(\w)(\w*)/g, function (g0, g1, g2) {
            return g1.toUpperCase() + g2.toLowerCase();
        }).replace(/_/g, '').replaceAll(' ', '');
        wrapper = wrapper.charAt(0).toUpperCase() + wrapper.slice(1).toLowerCase();
        wrapper = wrapper.replace(/[0-9]/g, '');
        setWrapper(wrapper)
        return () => {
            ComponentManager.cleanComponentReducerState(props.tableName + props.appObjId);
            store.dispatch({ type: 'UPDATE_SELECTED_GRID_ROWS', payload: [[], props.tableName + props.appObjId] })
            ComponentManager.setStateForComponent(props.tableName + props.appObjId, 'selectedIndexes', [])
            ComponentManager.setStateForComponent(props.tableName + props.appObjId, 'selectedIndexesBeforeFilters', [])
            ComponentManager.setStateForComponent(props.tableName + props.appObjId, 'selectedRowsBeforeFilters', [])
        }
    }, [])

    const customBtnAction = (el, multiSelect) => {
        const selectedGridRows = store.getState()?.['selectedGridRows']?.['selectedGridRows'] || []

        const executeAction = () => {
            let promptLabel = getMainLabel('confirm_submit_action', context)
            if (el.useMulti) {
                promptLabel = getMainLabel('confirm_action_execution', context)
            }
            let saveUrl = `${window.server}${el?.['onSave']}`
            let data
            switch (el['type']) {
                case 'GET':
                    const executeGetAction = () => {
                        setLoading(true)
                        axios.get(saveUrl).then(res => {
                            setLoading(false)
                            if (res?.data) {
                                alertUserResponse({ response: res.data })
                            }
                            if (el.refreshSummary) store.dispatch({ type: 'REFRESH_SUMMARY', payload: true })
                        }).catch(err => {
                            setLoading(false)
                            console.error(err)
                            alertUserResponse({ response: err.response?.data })
                        });
                    }
                    alertUserV2({
                        type: 'info',
                        title: promptLabel,
                        confirmButtonText: getMainLabel('yes', context),
                        onConfirm: executeGetAction,
                        showCancel: true,
                        cancelButtonText: getMainLabel('no', context)
                    })
                    break;
                case 'POST':
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
                                        reloadGrid(props.tableName + props.appObjId, multiSelect)
                                        setLoading(false)
                                        if (el.refreshSummary) store.dispatch({ type: 'REFRESH_SUMMARY', payload: true })
                                    }
                                })
                            }
                        }).catch(err => {
                            setLoading(false)
                            console.error(err)
                            alertUserResponse({ response: err.response?.data })
                        });
                    }
                    alertUserV2({
                        type: 'info',
                        title: promptLabel,
                        confirmButtonText: getMainLabel('yes', context),
                        onConfirm: executePostAction,
                        showCancel: true,
                        cancelButtonText: getMainLabel('no', context)
                    })
                    break;
                case 'action':
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
                                        reloadGrid(props.tableName + props.appObjId, multiSelect)
                                        setLoading(false)
                                        if (el.refreshSummary) store.dispatch({ type: 'REFRESH_SUMMARY', payload: true })
                                    }
                                })
                            }
                        }).catch(err => {
                            console.error(err)
                            setLoading(false)
                            alertUserResponse({ response: err.response?.data })
                        });
                    }
                    alertUserV2({
                        type: 'info',
                        title: promptLabel,
                        confirmButtonText: getMainLabel('yes', context),
                        onConfirm: action,
                        showCancel: true,
                        cancelButtonText: getMainLabel('no', context)
                    })
                    break;
                case 'toggle-action':
                    if (actionToggle === el.ID) {
                        setActionToggle(undefined)
                    } else {
                        setActionToggle(el.ID)
                    }
                    break;
                case 'link':
                    let href = el['route']
                    hashHistory.push(href)
                    break;
                default:
                    break;
            }
        }

        if (el.useMulti) {
            if (selectedGridRows.length > 0) {
                executeAction()
            } else {
                alertUserV2({ type: 'info', title: getMainLabel('select_multi', context) })
            }
        } else {
            executeAction()
        }
    }
    const customRowClick = (_id, _rowIdx, row) => {
        store.dispatch({ type: 'SAVE', payload: { "farm-registry": { "objectId": props.objectId, "route": hashHistory.location.pathname } } })
        const customRowClickConfig = props.configuration?.objectConfiguration?.customRowClick
        const route = customRowClickConfig?.route?.replace("{rowObjectId}", row[`${props.tableName}.OBJECT_ID`]);
        hashHistory.push(route)
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

    const generateOuterBtns = (outerBtnArray, multiSelect, togglableChild) => {
        if (outerBtnArray && outerBtnArray.length > 0) {
            return (
                <div className={`${togglableChild ? 'farm-registry-outer-btn-container-togglable-child' : 'farm-registry-outer-btn-container'}`}>
                    {outerBtnArray.map(el => {
                        return (
                            <div className={`${el.childBtnArray ? 'farm-registry-outer-togglable-child' : ''}`}>
                                <button
                                    onClick={() => customBtnAction(el, multiSelect)}
                                    className={`${togglableChild ? 'farm-registry-outer-btn-togglableChild' : 'farm-registry-outer-btn'} ${el.ID.toLowerCase()}-farm-registry-btn`}
                                    id={el.ID}>
                                    {!togglableChild && <span className={iconManager.getIcon(el.icon) ? "farm-registry-outer-btn-img" : ''}>{el.icon && iconManager.getIcon(el.icon)}</span>} {el.label}</button>
                                {el.childBtnArray && actionToggle === el.ID && generateOuterBtns(el.childBtnArray, multiSelect, true)}
                            </div>
                        );
                    })}
                </div>
            );
        }
        return null;
    };

    const generateGrid = () => {
        const configWs = props.configuration.objectConfiguration.configuration.onSubmit
        const dataWs = props.configuration.objectConfiguration.data.onSubmit
        const multiSelect = props.configuration.objectConfiguration.multiSelect || false
        const btnArray = props.configuration.objectConfiguration.additionalBtns
        const outerBtnArray = props.configuration.objectConfiguration.outerBtnArray
        const maxLength = props.configuration.objectConfiguration.maxLength || 9999
        const grid = <div className={`${`custom-grid-container-${props.tableName.toLowerCase()}`} ${props.configuration.objectConfiguration.readOnly && 'read-only-grid'}`}>
            {outerBtnArray && generateOuterBtns(outerBtnArray, multiSelect)}
            <ExportableGrid
                gridType={"READ_URL"}
                key={props.tableName + props.appObjId}
                id={props.tableName + props.appObjId}
                configTableName={configWs}
                dataTableName={dataWs}
                onRowClickFunct={props.configuration.objectConfiguration.disableRowClick ? () => { } : props.configuration.objectConfiguration.customRowClick ? customRowClick : handleRowClick}
                refreshData={() => reloadGrid(props.tableName + props.appObjId, multiSelect)}
                toggleCustomButton={!props.configuration.objectConfiguration.configuration.readOnly}
                customButton={() => setShowModal(true)}
                customButtonLabel={getMainLabel('add', context)}
                enableMultiSelect={multiSelect}
                onSelectChangeFunct={customRowSelection}
                buttonsArray={btnArray ? btnArrCreate(btnArray, multiSelect) : undefined}
                heightRatio={outerBtnArray ? 0.7 : 0.8}
            />

        </div >
        return grid
    }

    //multiselect functions 
    const customRowSelection = (selectedRows, gridId) => {
        store.dispatch(updateSelectedRows(selectedRows, gridId));
    };
    const reloadGrid = (gridId, multiSelect) => {
        GridManager.reloadGridData(gridId)
        if (multiSelect) {
            store.dispatch({ type: 'UPDATE_SELECTED_GRID_ROWS', payload: [[], gridId] })
            ComponentManager.setStateForComponent(gridId, 'selectedIndexes', [])
            ComponentManager.setStateForComponent(gridId, 'selectedIndexesBeforeFilters', [])
            ComponentManager.setStateForComponent(gridId, 'selectedRowsBeforeFilters', [])
        }
    }
    const handleRowClick = (_id, _rowIdx, row) => {
        if (props.configuration.objectConfiguration?.isSvarogForm) {
            setClickedRowObjectId(row[`SVAROG_FORM.OBJECT_ID`] || 0)
        } else {
            setClickedRowObjectId(row[`${props.tableName}.OBJECT_ID`] || 0)
            setRowClicked(row)
        }
        setShowModal(true)
    }
    const generateForm = (isModal, resetTheId) => {
        let inputWrapper
        if (props.configuration.objectConfiguration.wrapper) {
            wrappers.forEach(wrap => {
                const keys = Object.keys(wrap);
                if (wrapperName === keys[0]) {
                    inputWrapper = wrap[wrapperName];
                }
            });
        }
        // Set a new ID for the form, so we get a re-render
        if (resetTheId) {
            setDynamicFormId(generateDynamicKey())
        }
        // Get the WS paths from the configuration object
        let jsonSchemaConfig = props.configuration.objectConfiguration?.configuration?.onSubmit
        let uiSchemaConfig = props.configuration.objectConfiguration?.uischema?.onSubmit
        let formDataWs = props.configuration.objectConfiguration?.data?.onSubmit
        let onSubmitWs = props.configuration.objectConfiguration?.save?.onSave
        // If we're rendering a modal, the configuration services are a bit nested
        let refreshSummary = props.configuration.objectConfiguration?.refreshSummary
        if (isModal) {
            // #revise_me
            // We need to find a smarter way to get the WS paths, instead of duplicating the nested properties all over again
            jsonSchemaConfig = props.configuration.objectConfiguration?.form?.configuration?.onSubmit
            uiSchemaConfig = props.configuration.objectConfiguration?.form?.uischema?.onSubmit
            formDataWs = props.configuration.objectConfiguration?.form?.data?.onSubmit
            // If the form data WS contains something like {TABLE_NAME.OBJECT_ID} find it and replace it with the clicked object's ID
            formDataWs = replaceFunc(formDataWs, props.tableName, clickedRowObjectId, props.configuration.objectConfiguration?.isSvarogForm)
            onSubmitWs = props.configuration.objectConfiguration?.form?.save?.onSave
        }
        let hideBtns = 'close'

        let readOnlyConfig
        let deleteConfig
        if (props.configuration.objectConfiguration.form) {
            readOnlyConfig = props.configuration.objectConfiguration?.form?.configuration?.readOnly || false;
            deleteConfig = props.configuration.objectConfiguration?.form?.delete?.enabled || false;
        } else if (props.configuration.objectConfiguration.type === 'form') {
            readOnlyConfig = props.configuration.objectConfiguration?.configuration?.readOnly || false;
            deleteConfig = props.configuration.objectConfiguration?.delete?.enabled || false;
        }
        switch (true) {
            case readOnlyConfig:
                hideBtns = 'all';
                break;
            case clickedRowObjectId === 0:
                hideBtns = 'closeAndDelete';
                break;
            case !readOnlyConfig && deleteConfig:
                hideBtns = 'close';
                break;
            case !readOnlyConfig && !deleteConfig:
                hideBtns = 'closeAndDelete';
                break;
            default:
                break;
        }
        return (
            <GenericForm
                className={`form-test aims-forms custom-farm-registry-form ${isModal && 'hide-legend-form'} ${props.tableName.toLowerCase()}-farm-registry-form ${props.configuration.objectConfiguration?.readOnly && 'read-only-form'} `}
                params={'READ_URL'}
                key={dynamicFormId}
                id={dynamicFormId}
                method={jsonSchemaConfig}
                uiSchemaConfigMethod={uiSchemaConfig}
                tableFormDataMethod={formDataWs}
                addSaveFunction={(e) => saveForm(e, onSubmitWs, isModal, refreshSummary)}
                addDeleteFunction={(_id, _action, _session, formData) => deleteFunc(_id, _action, _session, formData, refreshSummary)}
                hideBtns={hideBtns}
                inputWrapper={inputWrapper}
                closeModalFunc={() => setShowModal(false)}
                objId={props.appObjId}
                appObjId={props.appObjId}
                onSubmitWs={onSubmitWs}
                rowClicked={rowCliked}
                tableName={props.tableName}
                disabled={hideBtns === 'all' ? true : false}
                config={props.configuration.objectConfiguration}
                formName={props.tableName}
                heightRatio={0.8}
            />
        )
    }
    const closeFormModal = () => {
        setShowModal(false)
        setClickedRowObjectId(0)
        ComponentManager.setStateForComponent(props.tableName + props.appObjId, null, { rowClicked: undefined })
    }
    const resetFormDeleteState = () => {
        setLoading(false)
        ComponentManager.setStateForComponent(dynamicFormId, null, { deleteExecuted: false })
    }
    const resetFormSaveState = () => {
        ComponentManager.setStateForComponent(dynamicFormId, null, { saveExecuted: false })
        setRender(true)
    }
    const saveForm = (e, wsPath, isModal, refreshSummary) => {
        console.log(isModal)
        let formData = e.formData
        // // Check if every value in the form data object is nullish
        const isEmpty = Object.values(formData).every(v => v === null || v === undefined)
        // // Filter out every nullish value from the form data object
        const nonNullishFormData = Object.fromEntries(Object.entries(formData).filter(([_, v]) => v !== null && v !== undefined))
        // // Check if the filtered form data object has only four keys and they are only system fields
        const onlyHasSystemFields = Object.keys(nonNullishFormData).length === 4 && Object.keys(nonNullishFormData).every(k => k === 'OBJECT_ID' || k === 'OBJECT_TYPE' || k === 'PKID' || k === 'PARENT_ID')
        if (isEmpty || onlyHasSystemFields) {
            const label = getMainLabel('enter_some_values', context)
            alertUserV2({ type: 'info', title: label, onConfirm: resetFormSaveState })
        } else {
            const url = `${window.server}${wsPath}`
            axios({
                method: "post",
                data: JSON.stringify(formData),
                url,
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
            }).then(res => {
                if (res?.data) {
                    const resType = res.data?.type?.toLowerCase() || 'info'
                    if (resType === 'error') {
                        alertUserResponse({ response: res.data, onConfirm: resetFormSaveState })
                    } else {
                        setRender(false)
                        alertUserResponse({ response: res.data, onConfirm: resetFormSaveState })
                        if (isModal) {
                            GridManager.reloadGridData(props.tableName + props.appObjId)
                            closeFormModal()
                        }
                        if (refreshSummary) store.dispatch({ type: 'REFRESH_SUMMARY', payload: true })
                    }
                }
            }).catch(err => {
                console.error(err)
                alertUserResponse({ response: err.response?.data, onConfirm: resetFormSaveState })
            });
        }
    };
    const deleteFunc = (_id, _action, _session, formData, refreshSummary) => {
        const { svSession } = props;
        let url = window.server + `/ReactElements/deleteObject/${svSession}`;
        axios({
            method: "post",
            data: JSON.stringify(formData[4]["PARAM_VALUE"]),
            url: url,
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }).then((res) => {
            if (res?.data) {
                const resType = res.data?.type?.toLowerCase() || 'info'
                alertUserResponse({ response: res.data, onConfirm: resetFormDeleteState })
                if (resType === 'success') {
                    closeFormModal()
                    GridManager.reloadGridData(props.tableName + props.appObjId);
                    if (refreshSummary) store.dispatch({ type: 'REFRESH_SUMMARY', payload: true })
                }
            }
        }).catch(err => {
            console.error(err)
            alertUserResponse({ response: err.response?.data, onConfirm: resetFormDeleteState })
        });
    };

    return (
        <>
            {loading && <Loading />}
            <div className={`custom-menu-holder ${`custom-menu-${props.tableName.toLowerCase()}-container`}`}>
                {/* FORM */}
                {renderForm && props.configuration?.objectConfiguration?.type === 'form' && generateForm()}
                {/* GRID */}
                {props.configuration?.objectConfiguration?.type === 'grid' && generateGrid()}
                {/* ATTACHMENTS */}
                {props.configuration?.objectConfiguration?.type === 'attachment' && <Documents getUploadedFiles={props.configuration?.objectConfiguration?.data.onSubmit}
                    uploadFileUrl={props.configuration?.objectConfiguration?.attach.onSubmit}
                />}
                {/* SEARCH-GRID*/}
                {props.configuration?.objectConfiguration?.type === 'search-grid' && <SearchDynamic tableName={props.tableName} configuration={props.configuration.objectConfiguration} />}
                {/* PARENT-CHILD-GRID */}
                {props.configuration?.objectConfiguration?.type === "multigrid" && <ParentChildGrids generateOuterBtns={generateOuterBtns} outerBtnArray={props.configuration.objectConfiguration.outerBtnArray} grids={props.configuration?.objectConfiguration?.grids} />}
                {/* DOUBLE-GRID */}
                {props.configuration?.objectConfiguration?.type === 'double-grid' && <DoubleGrid farmObjId={props.objectId} tableName={props.tableName} configuration={props.configuration.objectConfiguration} />}
                {showModal && (
                    <Modal className={"farm-registry-modal"} show={showModal} onHide={() => closeFormModal()}>
                        <Modal.Header className={"farm-registry-modal-header"} closeButton>
                            <Modal.Title>{props.configuration.label}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className={"farm-registry-modal-body"}>
                            {generateForm(true, false)}
                        </Modal.Body>
                        <Modal.Footer className={"farm-registry-modal-footer"} />
                    </Modal>
                )}
            </div>
        </>
    )
}
const mapStateToProps = (state) => ({
    svSession: state.security.svSession,
    selectedGridRows: state.selectedGridRows.selectedGridRows,
});

CustomButtons.contextTypes = {
    intl: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(CustomButtons);