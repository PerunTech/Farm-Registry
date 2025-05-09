import {
    React,
    connect,
    elements,
    ComponentManager,
    PropTypes,
    createHashHistory,
    GenericForm, axios
} from "perun-core";
import SearchComponent from '../SearchComp/SearchComponent'
import { labelsManager } from '../utils_tools/LabelsExport';
import GpsMapSelect from '../utils_tools/GpsMapSelect';
const { useState, useEffect } = React;
const { ReactBootstrap } = elements;
const { Modal } = ReactBootstrap;
let hashHistory = createHashHistory();
let gridId;
let _inputholder = "";
const HoldingWrapper = (props, context) => {
    const [show, setShow] = useState(false);
    const [showPerson, setPerson] = useState(false)
    const [showMap, setMap] = useState(false)
    const [isAddForm, setisAddForm] = useState(undefined)
    const [personId, setPersonId] = useState(undefined)
    useEffect(() => {
        handlePersonInputs();
        handleMapInputs()
        const isAddForm = ComponentManager.getStateForComponent(
            props.formid,
            "isAddForm"
        );
        setisAddForm(isAddForm)

    }, []);
    useEffect(() => {
        return () => {
            cleanInput()
            ComponentManager.cleanComponentReducerState(gridId);
        };
    }, []);
    const cleanInput = () => {
        const inputs = document.querySelectorAll("#root_holding\\.info_NAME")
        if (inputs.length > 1) {
            inputs[0].style.cursor = "";
            inputs[0].onclick = null;
            inputs[0].placeholder = "";
            inputs[0].style.background = "";

        }
    }
    const handlePersonInputs = () => {
        const inputs = document.querySelectorAll("#root_holding\\.info_NAME")
        let firstInput = inputs[1] ? inputs[1] : inputs[0]
        if (firstInput) {
            firstInput.style.cursor = "pointer";
            firstInput.onclick = handleShowPerson;
            firstInput.placeholder = labelsManager.importLabel(
                "click_to_choose",
                context,
                "farm_registry"
            )
            firstInput.style.background = '#b9cfba';
        }
    };
    const handleMapInputs = () => {
        const mapInputN = document.getElementById('root_holding.location.info_GPS_NORTH')
        const mapInputE = document.getElementById('root_holding.location.info_GPS_EAST')

        if (mapInputE) {
            mapInputE.style.cursor = "pointer";
            mapInputE.onclick = handleShowMap;
            mapInputE.placeholder = labelsManager.importLabel(
                "click_to_choose",
                context,
                "farm_registry"
            )
            mapInputE.style.background = '#33628775';
            mapInputE.style.color = '#ffffff';
        }
        if (mapInputN) {
            mapInputN.style.cursor = "pointer";
            mapInputN.onclick = handleShowMap;
            mapInputN.placeholder = labelsManager.importLabel(
                "click_to_choose",
                context,
                "farm_registry"
            )
            mapInputN.style.background = '#33628775';
            mapInputN.style.color = '#ffffff';
        }
    }


    const handleShowPerson = (e) => {
        _inputholder = e.target.id;
        setShow(!show);
        setPerson(true)
    };

    const handleShowMap = () => {
        setShow(true)
        setMap(true)
    }

    const handleRowClick = (_id, _rowIdx, row) => {
        setPersonId(undefined)
        const { formid } = props;
        let objid = []
        objid.push(row[`PERSON.OBJECT_ID`], row[`PERSON.NAME`],)
        const formData = ComponentManager.getStateForComponent(
            formid,
            "formTableData"
        );
        if (formData) {
            const inputs = document.querySelectorAll("#root_holding\\.info_NAME")
            let firstInput = inputs[1] ? inputs[1] : inputs[0]
            formData["PERSON_OBJECT_ID"] = objid[0];
            setPersonId(objid[0])
            if (!formData["holding.info"]) {
                formData["holding.info"] = {}
            }
            formData["holding.info"]["NAME"] = objid[1];
            firstInput.value = formData["holding.info"]['NAME']

            //  skip the form validation bug
            ComponentManager.setStateForComponent(formid, "noValidate", true);
            props.formInstance.setState({ noValidate: true })

            ComponentManager.setStateForComponent(formid, "formTableData", formData);
            props.formInstance.setState({ formTableData: formData });
            props.formInstance.onInputChange(formData)
            setShow(false);
            setPerson(false)
        }
    };

    const handleMapClick = (lat, lng) => {
        const mapInputN = document.getElementById('root_holding.location.info_GPS_NORTH')
        const mapInputE = document.getElementById('root_holding.location.info_GPS_EAST')

        const formData = ComponentManager.getStateForComponent(
            props.formid,
            "formTableData"
        );
        if (formData) {
            if (!formData["holding.location.info"]) {
                formData["holding.location.info"] = {}
            }
            formData["holding.location.info"]['GPS_NORTH'] = lat
            mapInputN.value = lat
            formData["holding.location.info"]['GPS_EAST'] = lng
            mapInputE.value = lng
        }
        ComponentManager.setStateForComponent(props.formid, "formTableData", formData);
        props.formInstance.setState({ formTableData: formData });
        props.formInstance.onInputChange(formData)
        setShow(false)
        setMap(false)
    }

    const saveMultipleForms = async (addressData) => {
        const saveHoldingFunc = ComponentManager.getStateForComponent(
            props.formid,
            "addSaveFunction"
        );

        const formData = ComponentManager.getStateForComponent(
            props.formid,
            "formTableData"
        );

        const resultId = await saveHoldingFunc(formData);
        if (resultId) {
            saveAddress(addressData, resultId);
        }
    };

    const saveAddress = (addressData, resultId) => {
        if (addressData) {
            addressData['IS_DEFAULT'] = 1
        }
        const url = `/ReactElements/createTableRecordFormData/${props.svSession}/ADDRESS/${resultId}`
        const contentType = 'application/x-www-form-urlencoded'
        const reqConfig = { method: 'post', url: `${window.server}${url}`, data: encodeURIComponent(JSON.stringify(addressData)), headers: { 'Content-Type': contentType } }

        axios(reqConfig).then(res => {
            if (res?.data) {
            }
        }).catch(err => {
            console.error(err)
        })

    }


    return (
        <>
            {props.children}
            {props.children && (handlePersonInputs(), handleMapInputs())}
            {isAddForm && personId && <GenericForm
                className={`form-test custom-farm-registry-form aims-forms holding-address`}
                params={'READ_URL'}
                key={`ADDRESS_${personId}`}
                id={`ADDRESS_${personId}`}
                method={`/ReactElements/getTableJSONSchema/${props.svSession}/ADDRESS`}
                uiSchemaConfigMethod={`/ReactElements/getTableUISchema/${props.svSession}/ADDRESS`}
                tableFormDataMethod={`/farm-registry/getPersonAddressFormData/${props.svSession}/${personId}`}
                addSaveFunction={(e) => saveMultipleForms(e.formData)}
                customSaveButtonName={labelsManager.importLabel('save', context, 'farm_registry')}
                hideBtns={'closeAndDelete'}
                customSave={true}
            />}
            {show && (
                <Modal className={"farm-registry-modal"} show={show} onHide={() => { setShow(false), setPerson(false), setMap(false) }}>
                    <Modal.Header className={"farm-registry-modal-header"} closeButton>
                    </Modal.Header>
                    <Modal.Body className={"farm-registry-modal-body"}>
                        {showPerson && <>
                            <SearchComponent person={true} onRowClick={handleRowClick} />
                            <p className={'redirect-to-pr-initial'}>{labelsManager.importLabel('register-person', context, 'farm_registry')}<span className={'redirect-person'} onClick={() => {
                                hashHistory.push('/main/persons-registry')
                            }}>{labelsManager.importLabel('redirect-person', context, 'farm_registry')}</span></p></>}
                        {showMap && <GpsMapSelect handleMapClick={handleMapClick} />}
                    </Modal.Body >
                    <Modal.Footer className={"farm-registry-modal-footer"}></Modal.Footer>
                </Modal >
            )}
        </>
    );
};

const mapStateToProps = (state) => ({
    svSession: state.security.svSession,
});
HoldingWrapper.contextTypes = {
    intl: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(HoldingWrapper);
