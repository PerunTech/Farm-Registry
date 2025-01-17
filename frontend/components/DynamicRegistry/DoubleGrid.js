import { React, PropTypes, ExportableGrid, connect, redux, elements, axios, GenericForm, ComponentManager, GridManager, createHashHistory } from 'perun-core'
import { getMainLabel } from '../utils_tools/LabelsExport';
const { ReactBootstrap, alertUser } = elements;
const { store } = redux;
const { Modal } = ReactBootstrap;
const { useState, useEffect } = React

const DoubleGrid = (props, context) => {
    let hashHistory = createHashHistory();
    const [show, setShow] = useState(false)
    useEffect(() => {
        return () => {
            ComponentManager.cleanComponentReducerState(props.configuration.leftGrid.ID);
            ComponentManager.cleanComponentReducerState(props.configuration.rightGrid.ID);
        }
    }, []);

    const handleRowClick = (_id, _rowIdx, row, grid) => {
        if (grid.customRowClick) {
            switch (grid.customRowClick?.type) {
                case "route":
                    store.dispatch({ type: 'SAVE', payload: { "farm-registry": { "objectId": props.farmObjId, "route": hashHistory.location.pathname } } })
                    let route = grid.customRowClick?.route?.replace("{rowObjectId}", row[`${props.tableName}.OBJECT_ID`]);
                    hashHistory.push(route)
                    break;
                default:
                    break;
            }
        }
    }
    const generateGrid = (grid) => {
        const buttonsArray = []
        return (
            <ExportableGrid
                gridType={"READ_URL"}
                key={grid.ID}
                id={grid.ID}
                heightRatio={0.8}
                configTableName={grid.configuration.onSubmit}
                dataTableName={grid.data.onSubmit}
                onRowClickFunct={(id, rowIdx, row) => handleRowClick(id, rowIdx, row, grid)}
                className='animals-search-grid'
                buttonsArray={buttonsArray}
                toggleCustomButton={grid.additionalBtns ? true : false}
                customButton={() => { setShow(true) }}
                customButtonLabel={getMainLabel('add', context)}
            />
        )
    }
    const generateForm = () => {
        const addFormConfig = props.configuration?.addForm

        return (
            <GenericForm
                className={`form-test custom-farm-registry-form`}
                params={'FORM_DATA'}
                key={props.configuration.leftGrid.ID + '_FORM'}
                id={props.configuration.leftGrid.ID + '_FORM'}
                method={addFormConfig?.configuration?.onSubmit}
                uiSchemaConfigMethod={addFormConfig?.uischema?.onSubmit}
                tableFormDataMethod={addFormConfig?.data?.onSubmit}
                addSaveFunction={(e) => onSubmit(e)}
                customSaveButtonName={'save'}
                hideBtns={'closeAndDelete'}
            />
        )
    }
    const onSubmit = (e) => {
        const url = props.configuration?.addForm?.save?.onSave
        const reqConfig = { method: 'post', url: `${window.server}${url}`, data: encodeURIComponent(JSON.stringify(e.formData)) }
        axios(reqConfig).then(res => {
            if (res.data) {
                const resType = res?.data?.type?.toLowerCase() || 'info'
                const title = res?.data?.title || ''
                const msg = res?.data?.message || ''
                const onConfirm = () => {
                    if (resType === 'success') {
                        setShow(false)
                        GridManager.reloadGridData(props.configuration.leftGrid.ID)
                    } else {
                        ComponentManager.setStateForComponent(props.configuration.leftGrid.ID + '_FORM', null, { saveExecuted: false })
                    }
                }
                alertUser(true, resType, title, msg, onConfirm)
                if (props?.configuration?.refreshSummary) store.dispatch({ type: 'REFRESH_SUMMARY', payload: true })
            }
        }).catch(err => {
            console.error(err)
            const title = err.response?.data?.title || err
            const msg = err.response?.data?.message || ''
            alertUser(true, 'error', title, msg, () => ComponentManager.setStateForComponent(props.configuration.leftGrid.ID + '_FORM', null, { saveExecuted: false }))
        })
    }

    return (
        <>
            <div className='double-grid-container'>
                <div className='double-grid-grid'>
                    {generateGrid(props.configuration.leftGrid)}
                </div>
                <div className='double-grid-grid'>
                    {generateGrid(props.configuration.rightGrid)}
                </div>
            </div>
            {show && (
                <Modal className={"farm-registry-modal"} show={show} onHide={() => setShow(false)}>
                    <Modal.Header className={"farm-registry-modal-header"} closeButton>
                        <Modal.Title>{props.configuration.label}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className={"farm-registry-modal-body"}>
                        {generateForm()}
                    </Modal.Body>
                    <Modal.Footer className={"farm-registry-modal-footer"} />
                </Modal>
            )}
        </>
    )
}

const mapStateToProps = (state) => ({
    svSession: state.security.svSession,
})

DoubleGrid.contextTypes = {
    intl: PropTypes.object.isRequired,
}

export default connect(mapStateToProps)(DoubleGrid)
