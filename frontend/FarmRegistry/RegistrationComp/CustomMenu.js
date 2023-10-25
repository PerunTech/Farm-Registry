import {
    React,
    connect,
    axios,
    PropTypes,
    Loading,
    elements,
    ExportableGrid,
    GridManager,
    ComponentManager,
    GenericForm
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
    const [loading, setLoading] = useState(false)
    const [show, setShow] = useState(false)
    const [dynamicId, setDynamicId] = useState(undefined)

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
            customButton={() => setShow(true)}
        />
        return grid
    }

    const generateForm = (dynamicId) => {
        const { svSession } = props
        return <GenericForm
            params={'READ_URL'}
            key={'WORKING_ON_FARM_17669' + '_FORM'}
            id={'WORKING_ON_FARM_17669' + '_FORM'}
            method={`/ReactElements/getTableJSONSchema/${svSession}/WORK_ON_FARM`}
            uiSchemaConfigMethod={`/ReactElements/getTableUISchema/${svSession}/WORK_ON_FARM`}
            tableFormDataMethod={`/ReactElements/getTableFormData/${svSession}/${dynamicId}/WORK_ON_FARM`}
            addSaveFunction={(e) => saveForm(e)}
            customSave={true}
            customSaveButtonName={'Save'}
            addDeleteFunction={deleteFunc}
            hideBtns={dynamicId === 0 ? 'closeAndDelete' : 'close'}
        >
        </GenericForm>
    }

    const handleRowClick = (_id, _rowIdx, row) => {
        console.log('ROW: ', row);
        console.log('ID: ', _id);
        console.log('ROW ID: ', _rowIdx);
        console.log('DYNAMIC ID: ', dynamicId);
        setDynamicId(row['WORK_ON_FARM.OBJECT_ID'] || 0)
        setShow(true)
    }

    const saveForm = (e) => {
        let restUrl =
            window.server + `/ReactElements/createTableRecordFormData/${props.svSession}/WORK_ON_FARM/17669`
        axios({
            method: "post",
            data: e.formData,
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

    const deleteFunc = (_id, _action, _session, formData) => {
        const { svSession } = props;
        let url = window.server + `/ReactElements/deleteObject/${svSession}`;
        axios({
            method: "post",
            data: formData[4]["PARAM_VALUE"],
            url: url,
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        })
            .then((res) => {
                if (res.data.type === "SUCCESS") {
                    alertUser(true, "success", res.data.title, res.data.message);
                    setShow(false);
                    ComponentManager.setStateForComponent('WORK_ON_FARM', null, {
                        saveExecuted: false,
                    });
                    GridManager.reloadGridData("WORK_ON_FARM" + props.farmObjId);
                }
            })
            .catch(err => {
                console.error(err)
                const title = err.response?.data?.title || err
                const msg = err.response?.data?.message || ''
                alertUser(true, "error", title, msg);

            });
    };

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
                        {generateForm(dynamicId)}
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
