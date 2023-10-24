import {
    React,
    connect,
    axios,
    PropTypes,
    Loading,
    Form,
    elements,
    ExportableGrid,
    GridManager,
    ComponentManager
} from 'perun-core'
import style from "../style/registration.module.css"
import { labelsManager } from '../utils_tools/LabelsExport';
const { ReactBootstrap, alertUser } = elements;
const { Modal } = ReactBootstrap;
const { useState, useEffect } = React

const CustomButtons = (props, context) => {

    useEffect(() => {
        return () => {
            ComponentManager.cleanComponentReducerState("WORK_ON_FARM" + props.farmObjId);
        }
    }, [])
    const [schema, setSchema] = useState({})
    const [uiSchema, setUiSchema] = useState({})
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState()
    const [show, setShow] = useState(false)
    const [flagForm, setFlagForm] = useState(false)

    const generateForm = (row) => {
        const urlS = window.server + `/ReactElements/getTableJSONSchema/${props.svSession}/WORK_ON_FARM`
        const urlU = window.server + `/ReactElements/getTableUISchema/${props.svSession}/WORK_ON_FARM`
        setLoading(true)
        setFlagForm(false)
        axios.get(urlS).then(res => {
            setSchema(res.data)
            axios.get(urlU).then(res => {
                setUiSchema(res.data)
                setFlagForm(true)
                setLoading(false)
                setShow(true)
            }).catch(err => {
                console.error(err)
                setLoading(false)
            })
        }).catch(err => {
            console.error(err)
            setLoading(false)
        })

    };

    const saveForm = (e) => {
        console.log(e);
        let formData = e.formData
        let restUrl =
            window.server +
            "/ReactElements/createTableRecordFormData/" +
            props.svSession +
            "/WORK_ON_FARM/" +
            props.farmObjId
        axios({
            method: "post",
            data: formData,
            url: restUrl,
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        })
            .then(res => {
                console.log(res.data);
                alertUser(
                    true,
                    res.data.type?.toLowerCase(),
                    res.data.title,
                    res.data.message, () => { GridManager.reloadGridData("WORK_ON_FARM" + props.farmObjId) }
                );
            })
            .catch(err => {
                console.error(err)
                alertUser(true, 'error', err)
            });
    };

    const generateGrid = () => {
        let grid = <ExportableGrid
            gridType={"READ_URL"}
            key={"WORK_ON_FARM" + props.farmObjId}
            id={"WORK_ON_FARM" + props.farmObjId}
            configTableName={
                `/ReactElements/getTableFieldList/${props.svSession}/WORK_ON_FARM`
            }
            dataTableName={
                `/ReactElements/getObjectsByParentId/${props.svSession}/${props.farmObjId}/WORK_ON_FARM/0`
            }
            minHeight={700}
            onRowClickFunct={handleRowClick}
            refreshData={true}
            toggleCustomButton={true}
            customButton={() => generateForm()}
        />
        return grid
    }
    const handleRowClick = (_id, _rowIdx, row) => {
        generateForm(row)
    }

    return (
        <>{loading && <Loading />}
            <div>
                {generateGrid()}
                {show && <Modal className={style["farm-registry-modal"]} show={show} onHide={() => setShow(false)}>
                    <Modal.Header className={style["farm-registry-modal-header"]} closeButton>
                        <Modal.Title>{labelsManager.importLabel(
                            "add_address",
                            context,
                            "farm_registry"
                        )}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className={style["farm-registry-modal-body"]}>
                        {flagForm && <Form
                            schema={schema}
                            uiSchema={uiSchema}
                            onSubmit={(e) => saveForm(e)}
                            className={`farm-registry-forms`}
                            formData={formData}
                            onChange={(e) => {
                                setFormData(e.formData)
                            }}
                        >
                            <></>
                            <button className='btn-success btn_save_form' type='submit'>
                                Save
                                {/* {labelsManager.importLabel(
                                    "add_address",
                                    context,
                                    "farm_registry"
                                )} */}
                            </button>
                        </Form>}
                    </Modal.Body>
                    <Modal.Footer className={style["farm-registry-modal-footer"]}></Modal.Footer>
                </Modal>}
            </div>

        </>
    )
}

const mapStateToProps = (state) => ({
    farmObjId: state['farm_registry.mapData']?.farmData?.objectId,
    svSession: state.security.svSession,
});

CustomButtons.contextTypes = {
    intl: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(CustomButtons);
