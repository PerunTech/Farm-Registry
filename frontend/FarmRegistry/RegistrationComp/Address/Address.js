import {
    React,
    connect,
    axios,
    PropTypes,
    Loading,
    Form,
    elements,
    GenericGrid,
    GridManager,
    ComponentManager
} from 'perun-core'
import style from "../../style/registration.module.css"
const { ReactBootstrap, alertUser } = elements;
const { Modal } = ReactBootstrap;
const { useState, useEffect } = React
import { labelsManager } from '../../utils_tools/LabelsExport';

const Address = (props, context) => {
    useEffect(() => {
        let url = window.server + `/WsConf/params/get/sys/DEFAULT_COUNTRY`
        axios.get(url).then(res => {
            if (res.VALUE) {
                setDefaultCountry(res.VALUE)
            }
        })
        return () => {
            ComponentManager.cleanComponentReducerState("ADDRESS_GRID" + props.farmObjId);
        }
    }, [])
    const [schema, setSchema] = useState({})
    const [uiSchema, setUiSchema] = useState({})
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState()
    const [permaSchema, setPermaSchema] = useState({})
    const [permaUi, setPermaUi] = useState({})
    const [show, setShow] = useState(false)
    const [flagForm, setFlagForm] = useState(false)
    const [deleteBtn, setDelete] = useState(false)

    const generateMainForm = (row) => {
        if (row) {
            setDelete(true)
        } else {
            setDelete(false)
        }
        const urlS = window.server + `/ReactElements/getTableJSONSchema/${props.svSession}/ADDRESS_MLD`
        const urlU = window.server + `/ReactElements/getTableUISchema/${props.svSession}/ADDRESS_MLD`
        setLoading(true)
        setFlagForm(false)
        axios.get(urlS).then(res => {
            setSchema(res.data)
            setPermaSchema(res.data)
            axios.get(urlU).then(res => {
                setUiSchema(res.data)
                setPermaUi(res.data)
                setFlagForm(true)
                setLoading(false)
                setShow(true)
            }).catch(err => {
                console.error(err)
                const title = err.response?.data?.title || err
                const msg = err.response?.data?.message || ''
                alertUser(true, "error", title, msg);

                setLoading(false)
            })
        }).catch(err => {
            console.error(err)
            const title = err.response?.data?.title || err
            const msg = err.response?.data?.message || ''
            alertUser(true, "error", title, msg);

            setLoading(false)
        })
        let id = row?.['ADDRESS_MLD.OBJECT_ID'] || 0

        const ulrD = window.server + `/ReactElements/getTableFormData/${props.svSession}/${id}/ADDRESS_MLD`
        axios.get(ulrD).then(res => {
            if (Object.keys(res.data).length > 0) {
                setFormData(res.data)
            } else {
                setFormData({ 'COUNTRY': defaultCountry })
            }
        }).catch(err => {
            console.error(err)
            const title = err.response?.data?.title || err
            const msg = err.response?.data?.message || ''
            alertUser(true, "error", title, msg);

            setLoading(false)
        })

    };

    const generateNewTest = (id, country) => {
        let tempUi = JSON.parse(JSON.stringify(permaUi))
        if (country === 'MDA') {
            tempUi.LOCALITY3 = { 'ui:widget': 'hidden' }
            tempUi.LOCALITY4 = { 'ui:widget': 'hidden' }
            tempUi.COUNTRY = { 'ui:readonly': 'true' }
            if (id) {
                tempUi.LOCALITY2 = {}

                if (formData['LOCALITY1'] !== id) {
                    setFlagForm(false)
                    let tempSchema = JSON.parse(JSON.stringify(permaSchema))
                    let tempEnum = []
                    let tempEnumNames = []
                    let innerId
                    let innerOpt
                    innerId = id.split('_') //array of two elements (string example: parentid_childid)
                    tempSchema.properties['LOCALITY2'].enum.map((option, i) => {
                        innerOpt = option.split('_')
                        if (innerId[1] === innerOpt[0]) {
                            tempEnum.push(option)
                            tempEnumNames.push(tempSchema.properties['LOCALITY2'].enumNames[i])
                        }
                    })
                    tempSchema.properties['LOCALITY2'].enum = tempEnum
                    tempSchema.properties['LOCALITY2'].enumNames = tempEnumNames
                    setSchema(tempSchema)

                    setFlagForm(true)
                }
            } else {
                tempUi.LOCALITY2 = { 'ui:widget': 'hidden' }
            }
        } else {
            tempUi.LOCALITY1 = { 'ui:widget': 'hidden' }
            tempUi.LOCALITY2 = { 'ui:widget': 'hidden' }
        }
        setUiSchema(tempUi)
    }

    const saveAddress = (e) => {
        let restUrl =
            window.server +
            "/ReactElements/createTableRecordFormData/" +
            props.svSession +
            "/ADDRESS_MLD/" +
            props.farmObjId
        let form_params = e.formData;
        if (form_params['COUNTRY'] === 'MDA') {
            form_params['LOCALITY3'] = undefined
            form_params['LOCALITY4'] = undefined
        } else {
            form_params['LOCALITY1'] = undefined
            form_params['LOCALITY2'] = undefined
        }
        axios({
            method: "post",
            data: form_params,
            url: restUrl,
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        })
            .then(res => {
                alertUser(
                    true,
                    res.data.type?.toLowerCase(),
                    res.data.title,
                    res.data.message, () => {
                        GridManager.reloadGridData("ADDRESS_GRID" + props.farmObjId)
                        setShow(false)
                    }
                );
            })
            .catch(err => {
                console.error(err)
                const title = err.response?.data?.title || err
                const msg = err.response?.data?.message || ''
                alertUser(true, "error", title, msg);

            });
    };

    const generateAddressGrid = () => {
        let grid = <GenericGrid
            gridType={"READ_URL"}
            key={"ADDRESS_GRID" + props.farmObjId}
            id={"ADDRESS_GRID" + props.farmObjId}
            configTableName={
                `/ReactElements/getTableFieldList/${props.svSession}/ADDRESS_MLD`
            }
            dataTableName={
                `/ReactElements/getObjectsByParentId/${props.svSession}/${props.farmObjId}/ADDRESS_MLD/100000`
            }
            heightRatio={0.7}
            onRowClickFunct={handleRowClick}
            refreshData={true}
            toggleCustomButton={true}
            customButton={() => generateMainForm()}
            customButtonLabel={labelsManager.importLabel(
                "add_address",
                context,
                "farm_registry"
            )}
        />
        return grid
    }
    const handleRowClick = (_id, _rowIdx, row) => {
        generateMainForm(row)
    }

    const deleteFunc = (formData) => {
        const { svSession } = props;
        let url = window.server + `/ReactElements/deleteObject/${svSession}`;
        axios({
            method: "post",
            data: formData,
            url: url,
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        })
            .then((res) => {
                if (res.data) {
                    alertUser(true, res.data.type.toLowerCase(), res.data.title, res.data.message, () => {
                        GridManager.reloadGridData('ADDRESS_GRID' + props.farmObjId)
                        setShow(false);
                    });

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
                {generateAddressGrid()}
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
                            onSubmit={(e) => saveAddress(e)}
                            className={`farm-registry-forms`}
                            formData={formData}
                            onChange={(e) => {
                                setFormData(e.formData)
                                generateNewTest(e.formData['LOCALITY1'], e.formData['COUNTRY'])
                            }}
                        >
                            <></>
                            <div className={style['farm-registry-btn-holder']} >
                                {deleteBtn && <button onClick={() => alertUser(true, 'warning', labelsManager.importLabel('delete_record_prompt_title', context, 'main'), labelsManager.importLabel('delete_record_prompt_message', context, 'main'), () => { deleteFunc(formData) }, () => { }, true, labelsManager.importLabel('yes', context, 'admin_console'), labelsManager.importLabel('no', context, 'admin_console'))
                                } className='btn-danger btn_delete_form' type='button'>{labelsManager.importLabel(
                                    "delete",
                                    context,
                                    "farm_registry"
                                )}</button>}
                                <button className='btn-success btn_save_form' type='submit'>{labelsManager.importLabel(
                                    "add_address",
                                    context,
                                    "farm_registry"
                                )}</button>
                            </div>
                        </Form>}
                    </Modal.Body>
                    <Modal.Footer className={style["farm-registry-modal-footer"]}></Modal.Footer>
                </Modal>}
            </div>

        </>
    )
}

const mapStateToProps = (state) => ({
    svSession: state.security.svSession,
    farmObjId: state['farm_registry.mapData']?.farmData?.objectId
});

Address.contextTypes = {
    intl: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(Address);
