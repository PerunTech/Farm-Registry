import { React, connect, axios, PropTypes, Loading, createHashHistory, elements, ExportableGrid, GridManager, ComponentManager, GenericForm, redux } from 'perun-core'
import style from "../style/registration.module.css"
import { getDynamicKey } from '../../utils'
import { labelsManager } from '../utils_tools/LabelsExport';
import Documents from './Documents';
import FarmmembersWrapper from './FarmmembersWrapper';
import Address from './Address/Address'
import ParentChildGrids from './ParentChildGrids';
const { ReactBootstrap, alertUser } = elements;
const { Modal } = ReactBootstrap;
const { useState, useEffect } = React
const { store, updateSelectedRows } = redux;
let hashHistory = createHashHistory();
let systemFields = {}
const CustomButtons = (props, context) => {
    const [loading, _setLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [dynamicFormId, setDynamicFormId] = useState(getDynamicKey())
    const [clickedRowObjectId, setClickedRowObjectId] = useState(0)
    const [wrapperName, setWrapper] = useState(undefined)
    const [wrappers, _setWrappers] = useState([{ Farmmembers: FarmmembersWrapper }])
    const [flagFormChild, setFlagFormChild] = useState(undefined)
    const [clickedRowChild, setRowChild] = useState(0)
    const [clickedRowParent, setRowParent] = useState(undefined)

    useEffect(() => {
        setWrapper(props.tableName.replace(/(\w)(\w*)/g,
            function (g0, g1, g2) { return g1.toUpperCase() + g2.toLowerCase(); }).replace(/_/g, ''))
        return () => {
            ComponentManager.cleanComponentReducerState(props.tableName + props.farmObjId);
            systemFields = {}
            store.dispatch({ type: 'UPDATE_SELECTED_GRID_ROWS', payload: [[], props.tableName + props.farmObjId] })
            ComponentManager.setStateForComponent(props.tableName + props.farmObjId, 'selectedIndexes', [])
        }
    }, [])

    const buildCustomBtnArr = (btnArray, multiSelect) => {
        const div = <div className={style[`custom-btn-holder-${props.tableName.toLowerCase()}`]}>
            {btnArray.map(el => (
                <button id={el['ID']} className={`${style[`${props.tableName.toLowerCase()}-btn`]}`} onClick={() => customBtnAction(el, multiSelect)}>
                    {el['label']}
                </button>
            ))}
        </div>
        return div
    }
    const customBtnAction = (el, multiSelect) => {
        const saveUrl = `${window.server}${el?.['onSave']}`
        if (multiSelect && el['type'] === 'POST') {
            if (props.selectedGridRows.length > 0) {
                const data = JSON.stringify(props.selectedGridRows)
                axios({
                    method: "post",
                    data,
                    url: saveUrl,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                }).then(res => {
                    if (res.data) {
                        alertUser(true, res.data.type.toLowerCase(), res.data.title, res.data.message, () => reloadGrid(props.tableName + props.farmObjId, multiSelect));

                    }
                }).catch(err => {
                    console.error(err)
                    const title = err.response?.data?.title || err
                    const msg = err.response?.data?.message || ''
                    alertUser(true, "error", title, msg);
                });
            } else {
                alertUser(true, 'info', labelsManager.importLabel('select_parcel', context, 'farm_registry'));
            }

        }
        if (el['type'] === 'link') {
            let href = el['route']
            hashHistory.push(href)
        }
    }

    const generateGrid = () => {
        const configWs = props.configuration.objectConfiguration.configuration.onSubmit
        const dataWs = props.configuration.objectConfiguration.data.onSubmit
        const multiSelect = props.configuration.objectConfiguration.multiSelect || false
        const btnArray = props.configuration.objectConfiguration.additionalBtns

        const grid = <div className={`${multiSelect ? style['custom-grid-container'] : style['dynamic-grid']}`}>
            {btnArray && buildCustomBtnArr(btnArray, multiSelect)}

            <ExportableGrid
                gridType={"READ_URL"}
                key={props.tableName + props.farmObjId}
                id={props.tableName + props.farmObjId}
                configTableName={configWs}
                dataTableName={dataWs}
                heightRatio={0.7}
                onRowClickFunct={handleRowClick}
                refreshData={() => reloadGrid(props.tableName + props.farmObjId, multiSelect)}
                toggleCustomButton={true}
                customButton={() => setShowModal(true)}
                customButtonLabel={labelsManager.importLabel('add', context, 'farm_registry')}
                enableMultiSelect={multiSelect}
                onSelectChangeFunct={customRowSelection}
            />

        </div>
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
        }
    }

    const repalceFunc = (wsPath, id, obj) => {
        if (wsPath.indexOf(`{${id}.OBJECT_ID}`) >= 0) {
            wsPath = wsPath.replace(`{${id}.OBJECT_ID}`, obj)
            return wsPath
        } else {
            return wsPath
        }
    }

    const generateForm = (isModal, resetTheId, formFromChild) => {
        let customClass = `${props.tableName.toLowerCase()}-farm-registry-form` || 'customClass'
        let className = 'form-test custom-farm-registry-form ' + customClass
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
            setDynamicFormId(getDynamicKey())
        }
        // Get the WS paths from the configuration object
        let jsonSchemaConfig = props.configuration.objectConfiguration?.configuration?.onSubmit
        let uiSchemaConfig = props.configuration.objectConfiguration?.uischema?.onSubmit
        let formDataWs = props.configuration.objectConfiguration?.data?.onSubmit
        let onSubmitWs = props.configuration.objectConfiguration?.save?.onSave
        // If we're rendering a modal, the configuration services are a bit nested
        if (isModal && !flagFormChild) {
            // #revise_me
            // We need to find a smarter way to get the WS paths, instead of duplicating the nested properties all over again
            jsonSchemaConfig = props.configuration.objectConfiguration?.form?.configuration?.onSubmit
            uiSchemaConfig = props.configuration.objectConfiguration?.form?.uischema?.onSubmit
            formDataWs = props.configuration.objectConfiguration?.form?.data?.onSubmit
            // If the form data WS contains something like {TABLE_NAME.OBJECT_ID} find it and replace it with the clicked object's ID
            formDataWs = repalceFunc(formDataWs, props.tableName, clickedRowObjectId)
            onSubmitWs = props.configuration.objectConfiguration?.form?.save?.onSave
            className = 'custom-farm-registry-modal-form ' + customClass
        }
        if (formFromChild) {
            const { grids } = props.configuration.objectConfiguration
            jsonSchemaConfig = grids[1].objectConfiguration.form?.configuration?.onSubmit
            uiSchemaConfig = grids[1].objectConfiguration.form?.uischema?.onSubmit
            formDataWs = grids[1].objectConfiguration.form?.data?.onSubmit
            onSubmitWs = grids[1].objectConfiguration.form?.save?.onSave

            formDataWs = repalceFunc(formDataWs, grids[0].ID, clickedRowParent)
            formDataWs = repalceFunc(formDataWs, grids[1].ID, clickedRowChild)
            onSubmitWs = repalceFunc(onSubmitWs, grids[0].ID, clickedRowParent)
            onSubmitWs = repalceFunc(onSubmitWs, grids[1].ID, clickedRowChild)

        }
        return (
            <GenericForm
                className={className}
                params={'READ_URL'}
                key={dynamicFormId}
                id={dynamicFormId}
                method={jsonSchemaConfig}
                uiSchemaConfigMethod={uiSchemaConfig}
                tableFormDataMethod={formDataWs}
                addSaveFunction={(e) => saveForm(e, onSubmitWs, isModal)}
                addDeleteFunction={deleteFunc}
                hideBtns={clickedRowObjectId === 0 ? 'closeAndDelete' : 'close'}
                inputWrapper={inputWrapper}
            />
        )
    }

    const handleRowClick = (_id, _rowIdx, row) => {
        setClickedRowObjectId(row[`${props.tableName}.OBJECT_ID`] || 0)
        setShowModal(true)
    }

    const closeFormModal = () => {
        setShowModal(false)
        setClickedRowObjectId(0)
        ComponentManager.setStateForComponent(props.tableName + props.farmObjId, null, { rowClicked: undefined })
    }

    const resetFormDeleteState = () => {
        ComponentManager.setStateForComponent(dynamicFormId, null, { deleteExecuted: false })
    }

    const resetFormSaveState = () => {
        ComponentManager.setStateForComponent(dynamicFormId, null, { saveExecuted: false })
    }

    const saveForm = (e, wsPath, isModal) => {
        let formData = e.formData
        // Check if every value in the form data object is nullish
        const isEmpty = Object.values(formData).every(v => v === null || v === undefined)
        // Filter out every nullish value from the form data object
        const nonNullishFormData = Object.fromEntries(Object.entries(formData).filter(([_, v]) => v !== null && v !== undefined))
        // Check if the filtered form data object has only four keys and they are only system fields
        const onlyHasSystemFields = Object.keys(nonNullishFormData).length === 4 && Object.keys(nonNullishFormData).every(k => k === 'OBJECT_ID' || k === 'OBJECT_TYPE' || k === 'PKID' || k === 'PARENT_ID')
        if (isEmpty || onlyHasSystemFields) {
            const label = labelsManager.importLabel('enter_some_values', context, 'farm_registry')
            alertUser(true, 'info', label, '', () => resetFormSaveState())
        } else {
            if (!isModal) {
                formData = { ...formData, ...systemFields }
            }
            const url = `${window.server}${wsPath}`
            axios({
                method: "post",
                data: formData,
                url,
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
            }).then(res => {
                const createdRecord = res.data.data
                const resType = res.data.type
                const title = res.data.title || ''
                const msg = res.data.message || ''
                if (resType?.toLowerCase() === 'error') {
                    alertUser(true, 'error', title, msg, () => resetFormSaveState());
                } else {
                    alertUser(true, resType?.toLowerCase(), title, msg, () => resetFormSaveState());
                    if (isModal) {
                        GridManager.reloadGridData(props.tableName + props.farmObjId)
                        closeFormModal()
                    } else {
                        props.getConfiguration(props.farmObjId)
                        systemFields = {
                            OBJECT_ID: createdRecord.object_id,
                            OBJECT_TYPE: createdRecord.object_type,
                            PARENT_ID: createdRecord.parent_id,
                            PKID: createdRecord.pkid
                        }
                    }
                }
            }).catch(err => {
                console.error(err)
                const title = err.response?.data?.title || err
                const msg = err.response?.data?.message || ''
                alertUser(true, "error", title, msg, () => resetFormSaveState());
            });
        }
    };

    const deleteFunc = (_id, _action, _session, formData) => {
        const { svSession } = props;
        let url = window.server + `/ReactElements/deleteObject/${svSession}`;
        axios({
            method: "post",
            data: formData[4]["PARAM_VALUE"],
            url: url,
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }).then((res) => {
            const resType = res.data.type
            const title = res.data.title || ''
            const msg = res.data.message || ''
            if (resType?.toLowerCase() === "success") {
                alertUser(true, "success", title, msg);
                closeFormModal()
                GridManager.reloadGridData(props.tableName + props.farmObjId);
            } else {
                alertUser(true, resType?.toLowerCase() || 'info', title, msg, () => resetFormDeleteState())
            }
        }).catch(err => {
            console.error(err)
            const title = err.response?.data?.title || err
            const msg = err.response?.data?.message || ''
            alertUser(true, "error", title, msg, () => resetFormDeleteState());
        });
    };

    return (
        <>
            {loading && <Loading />}
            <div className={`${style['custom-menu-holder']} ${style[`custom-menu-${props.tableName.toLowerCase()}-container`]}`}>
                {props.configuration?.objectConfiguration?.type === 'form' && generateForm()}
                {props.configuration?.objectConfiguration?.type === 'grid' && generateGrid()}
                {props.configuration?.objectConfiguration?.type === 'attachment' && <Documents getUploadedFiles={props.configuration?.objectConfiguration?.data.onSubmit}
                    uploadFileUrl={props.configuration?.objectConfiguration?.attach.onSubmit}
                />}
                {props.configuration?.objectConfiguration?.type === 'address' && <Address personObjId={props.personObjId} defaultCountry={props.defaultCountry} />}
                {props.configuration?.objectConfiguration?.type === "multigrid" && <ParentChildGrids buildCustomBtnArr={buildCustomBtnArr} setRowChild={setRowChild} setRowParent={setRowParent} grids={props.configuration?.objectConfiguration?.grids} addFormFunc={() => {
                    setShowModal(true)
                    setFlagFormChild(true)
                }} />}
                {showModal && (
                    <Modal className={style["farm-registry-modal"]} show={showModal} onHide={() => closeFormModal()}>
                        <Modal.Header className={style["farm-registry-modal-header"]} closeButton>
                            <Modal.Title>{props.configuration.label}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className={style["farm-registry-modal-body"]}>
                            {generateForm(true, false, flagFormChild)}
                        </Modal.Body>
                        <Modal.Footer className={style["farm-registry-modal-footer"]} />
                    </Modal>
                )}
            </div>
        </>
    )
}

const mapStateToProps = (state) => ({
    farmObjId: state['farm_registry.mapData']?.farmData?.objectId,
    svSession: state.security.svSession,
    selectedGridRows: state.selectedGridRows.selectedGridRows,
});

CustomButtons.contextTypes = {
    intl: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(CustomButtons);
