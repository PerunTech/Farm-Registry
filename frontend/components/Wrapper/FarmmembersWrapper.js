import {
    React,
    connect,
    elements,
    ComponentManager,
    PropTypes,
} from "perun-core";
import SearchComponent from '../SearchComp/SearchComponent';
import { labelsManager } from '../utils_tools/LabelsExport';
const { useState, useEffect, useReducer } = React;
const { ReactBootstrap } = elements;
const { Modal } = ReactBootstrap;

let gridId;
let inputholder = "";
const FarmmembersWrapper = (props, context) => {
    const [show, setShow] = useState(false);
    const initialState = {
        firstInputId: "root_ID_NO",
        secondInputId: "root_FULL_NAME"
    };
    const reducer = (current, next) => ({ ...current, ...next });
    const [state, setState] = useReducer(reducer, initialState);
    const {
        firstInputId,
        secondInputId
    } = state;

    useEffect(() => {
        handleInputs();
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
            firstInput.placeholder = labelsManager.importLabel(
                "click_to_choose",
                context,
                "farm_registry"
            )
            firstInput.style.background = '#b9cfba';
        }
        if (secondInput) {
            secondInput.style.cursor = "pointer";
            secondInput.onclick = handleShow;
            secondInput.placeholder = labelsManager.importLabel(
                "click_to_choose",
                context,
                "farm_registry"
            )
            secondInput.style.background = '#b9cfba';
        }
    };
    const handleShow = (e) => {
        inputholder = e.target.id;
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

    return (
        <>
            {props.children}
            {show && (
                <Modal className={"farm-registry-modal"} show={show} onHide={() => { setShow(false) }}>


                    <Modal.Header className={"farm-registry-modal-header"} closeButton>
                        <Modal.Title>{labelsManager.importLabel(
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
