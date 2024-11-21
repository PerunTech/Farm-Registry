import { React, PropTypes, ExportableGrid, connect, elements, axios, GenericForm, ComponentManager, GridManager, createHashHistory } from 'perun-core'
import { labelsManager } from '../utils_tools/LabelsExport';
const { ReactBootstrap, alertUser } = elements;
const { Modal } = ReactBootstrap;
const { useState, useEffect } = React

const DoubleGrid = (props, context) => {
    let hashHistory = createHashHistory();
    const tableName = props.match?.params?.tableName?.toUpperCase() || ''
    const [show, setShow] = useState(false)
    const [gridIds, setGridIds] = useState([])
    useEffect(() => {
        setGridIds([props.configuration.leftGrid.ID, props.configuration.rightGrid.ID])
        return () => {
            if (gridIds.length > 0) {
                ComponentManager.cleanComponentReducerState(gridIds[0]);
                ComponentManager.cleanComponentReducerState(gridIds[1]);
            }
        }
    }, []);

    const handleRowClick = (_id, _rowIdx, row) => {
        if (props?.configuration?.objectConfiguration?.customRowClick) {
            switch (props.configuration.objectConfiguration?.customRowClick?.type) {
                case "route":
                    let route = props.configuration.objectConfiguration?.customRowClick?.route?.replace("{rowObjectId}", row[`${tableName}.OBJECT_ID`]);
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
                heightRatio={0.6}
                configTableName={grid.configuration.onSubmit}
                dataTableName={grid.data.onSubmit}
                onRowClickFunct={handleRowClick}
                className='animals-search-grid'
                buttonsArray={buttonsArray}
                toggleCustomButton={grid.additionalBtns ? true : false}
                customButton={() => { setShow(true), console.log('test'); }}
                customButtonLabel={labelsManager.importLabel('add', context, 'farm_registry')}
            />
        )
    }
    const generateForm = () => {
        const addFormConfig = props.configuration?.addForm

        return (
            <GenericForm
                className={`aims-forms`}
                params={'FORM_DATA'}
                key={`menjaj`}
                id={`menjaj`}
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
                        setShowModal(false)
                    } else {
                        ComponentManager.setStateForComponent('menjaj', null, { saveExecuted: false })
                    }
                }
                alertUser(true, resType, title, msg, onConfirm)
            }
        }).catch(err => {
            console.error(err)
            const title = err.response?.data?.title || err
            const msg = err.response?.data?.message || ''
            alertUser(true, 'error', title, msg, () => ComponentManager.setStateForComponent('menjaj', null, { saveExecuted: false }))
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
