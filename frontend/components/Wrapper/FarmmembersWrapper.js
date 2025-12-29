import {
    React,
    connect,
    elements,
    ComponentManager,
    PropTypes, utils, Loading, axios
} from "perun-core";
import SearchComponent from '../SearchComp/SearchComponent';
const { labelsManager } = utils
const { useState, useEffect, useReducer } = React;
const { ReactBootstrap, alertUserResponse, Icon } = elements;
const { Modal } = ReactBootstrap;

let gridId;
let _inputholder = "";
const FarmmembersWrapper = (props, context) => {
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [printBtn, setPrintBtn] = useState(false)
    const initialState = {
        firstInputId: "root_ID_NO",
        secondInputId: "root_FULL_NAME"
    };
    const reducer = (current, next) => ({ ...current, ...next });
    const [state, _setState] = useReducer(reducer, initialState);
    const {
        firstInputId,
        secondInputId
    } = state;

    useEffect(() => {
        handleInputs();
        hanldePrints()
    }, []);

    useEffect(() => {
        return () => {
            ComponentManager.cleanComponentReducerState(gridId);
        };
    }, []);

    const handleInputs = () => {
        const firstInput = document.getElementById(firstInputId);
        const secondInput = document.getElementById(secondInputId)
        if (firstInput) {
            firstInput.style.cursor = "pointer";
            firstInput.onclick = handleShow;
            firstInput.placeholder = labelsManager(
                "click_to_choose",
                context,
                "farm_registry"
            )
            firstInput.style.background = '#b9cfba';
        }
        if (secondInput) {
            secondInput.style.cursor = "pointer";
            secondInput.onclick = handleShow;
            secondInput.placeholder = labelsManager(
                "click_to_choose",
                context,
                "farm_registry"
            )
            secondInput.style.background = '#b9cfba';
        }
    };
    const handleShow = (e) => {
        _inputholder = e.target.id;
        setShow(!show);
    };

    const handleRowClick = (_id, _rowIdx, row) => {
        const { formid } = props;
        let objid = []
        objid.push(row[`PERSON.OBJECT_ID`], row[`PERSON.NAME`], row['PERSON.ID_NO'])
        const formData = ComponentManager.getStateForComponent(
            formid,
            "formTableData"
        );
        if (formData) {
            const firstInput = document.getElementById(firstInputId);
            const secondInput = document.getElementById(secondInputId)
            // form
            formData["PERSON_OBJECT_ID"] = objid[0];
            formData["FULL_NAME"] = objid[1];
            formData["ID_NO"] = objid[2];
            // html
            firstInput.value = formData["ID_NO"]
            secondInput.value = formData["FULL_NAME"]

            //  skip the form validation bug
            ComponentManager.setStateForComponent(formid, "noValidate", true);
            props.formInstance.setState({ noValidate: true })

            ComponentManager.setStateForComponent(formid, "formTableData", formData);
            props.formInstance.setState({ formTableData: formData });
            setShow(false);
        }
    };

    const hanldePrints = () => {
        const { formid } = props;
        const formTableData = ComponentManager.getStateForComponent(
            formid,
            "formTableData"
        );
        const isEmpty = Object?.keys(formTableData || {})?.length === 0;
        if (isEmpty) {
            setPrintBtn(!isEmpty)
        } else {
            setLoading(true)
            const url = `${window.server}/farm-registry/availableAssociatedPersonPrint/${props.svSession}/${formTableData?.['OBJECT_ID'] || 0}`
            axios.get(url).then(res => {
                setLoading(false)
                if (res?.data) {
                    setPrintBtn(res?.data?.data?.availablePrint)
                }
            }).catch(err => {
                setLoading(false)
                console.error(err)
                alertUserResponse({ response: err })
            });
        }
    }

    const downloadPDF = () => {
        const { formid } = props;
        const formTableData = ComponentManager.getStateForComponent(
            formid,
            "formTableData"
        );
        let url = window.server + `/farm-registry/generate/report/session-id/${props.svSession}/object-id/${formTableData?.['OBJECT_ID'] || 0}/report-name/associated_person_certificate/file-type/PDF/param/en_US`;
        window.open(url, '_blank');
    }
    return (
        <>
            {loading && <Loading />}
            {printBtn && <div className='perun-menu-buttons-container'>
                <button className='btn-success btn_save_form download-menu-btn' onClick={downloadPDF}>
                    {labelsManager("download_pro_cert", context, "farm_registry")}
                    <span className='download-span'>{<Icon name="IconPrinter" />}</span>
                </button>
            </div>}
            {props.children}
            {show && (
                <Modal className={"farm-registry-modal"} show={show} onHide={() => { setShow(false) }}>


                    <Modal.Header className={"farm-registry-modal-header"} closeButton>
                        <Modal.Title>{labelsManager(
                            "search_person",
                            context,
                            "farm_registry"
                        )}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className={"farm-registry-modal-body"}>
                        <SearchComponent person={true} onRowClick={handleRowClick} />
                    </Modal.Body>
                    <Modal.Footer className={"farm-registry-modal-footer"}></Modal.Footer>
                </Modal>
            )}
        </>
    );
};

const mapStateToProps = (state) => ({
    svSession: state.security.svSession,
});
FarmmembersWrapper.contextTypes = {
    intl: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(FarmmembersWrapper);
