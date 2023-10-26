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
            ComponentManager.cleanComponentReducerState(props.tableName + props.farmObjId);
        }
    }, [])

    const [loading, _setLoading] = useState(false)
    const [show, setShow] = useState(false)
    const [dynamicId, setDynamicId] = useState(0)

    const generateGrid = () => {
        let grid = <ExportableGrid
            gridType={"READ_URL"}
            key={props.tableName + props.farmObjId}
            id={props.tableName + props.farmObjId}
            configTableName={
                `/ReactElements/getTableFieldList/${props.svSession}/${props.tableName}`
            }
            dataTableName={
                `/ReactElements/getObjectsByParentId/${props.svSession}/${props.farmObjId}/${props.tableName}/0`
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
            key={props.tableName + '_FORM'}
            id={props.tableName + '_FORM'}
            method={`/ReactElements/getTableJSONSchema/${svSession}/${props.tableName}`}
            uiSchemaConfigMethod={`/ReactElements/getTableUISchema/${svSession}/${props.tableName}`}
            tableFormDataMethod={`/ReactElements/getTableFormData/${svSession}/${dynamicId}/${props.tableName}`}
            addSaveFunction={(e) => saveForm(e)}
            addDeleteFunction={deleteFunc}
            hideBtns={dynamicId === 0 ? 'closeAndDelete' : 'close'}
        >
        </GenericForm>
    }

    const handleRowClick = (_id, _rowIdx, row) => {
        console.log(props.type);
        setDynamicId(row[`${props.tableName}.OBJECT_ID`] || 0)
        setShow(true)
    }

    const saveForm = (e) => {
        let restUrl =
            window.server + `/ReactElements/createTableRecordFormData/${props.svSession}/${props.tableName}/17669`
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
                    res.data.message, () => { GridManager.reloadGridData(props.tableName + props.farmObjId) }
                );
            })
            .catch(err => {
                console.error(err)
                alertUser(true, 'error', err)
            });
        setShow(false)
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
                    GridManager.reloadGridData(props.tableName + props.farmObjId);
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
                {props.type === 'grid' ? generateGrid() : generateForm()}
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
