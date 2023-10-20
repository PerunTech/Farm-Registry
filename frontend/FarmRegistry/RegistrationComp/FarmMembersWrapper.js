import {
    React,
    connect,
    elements,
    ComponentManager,
    PropTypes,
} from "perun-core";
import SearchComponent from '../SearchComp/SearchComponent';
import style from "../style/registration.module.css";
import { labelsManager } from '../utils_tools/LabelsExport';
const { useState, useEffect, useReducer } = React;
const { ReactBootstrap } = elements;
const { Modal } = ReactBootstrap;

let gridId;
let inputholder = "";
const FarmMembersWrapper = (props, context) => {
    const [show, setShow] = useState(false);
    const initialState = {
        firstInputId: "root_PERSON_OBJECT_ID",
    };
    const reducer = (current, next) => ({ ...current, ...next });
    const [state, setState] = useReducer(reducer, initialState);
    const {
        firstInputId,
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
        if (firstInput) {
            firstInput.style.cursor = "pointer";
            firstInput.onclick = handleShow;
            firstInput.placeholder = labelsManager.importLabel(
                "click_to_choose",
                context,
                "farm_registry"
            )
        }
    };
    const handleShow = (e) => {
        inputholder = e.target.id;
        setShow(!show);
    };

    const handleRowClick = (_id, _rowIdx, row) => {
        const { formid } = props;
        let objid = []
        objid.push(row[`PERSON.OBJECT_ID`], row[`PERSON.NAME`])
        const formData = ComponentManager.getStateForComponent(
            formid,
            "formTableData"
        );
        if (formData) {

            formData["PERSON_OBJECT_ID"] = objid[0];
            formData["FULL_NAME"] = objid[1];

            ComponentManager.setStateForComponent(formid, "formTableData", formData);
            props.formInstance.setState({ formTableData: formData });
            setShow(false);
        }
    };

    return (
        <>
            {props.children}
            {show && (
                <Modal className={style["farm-registry-modal"]} show={show} onHide={() => setShow(false)}>
                    <Modal.Header className={style["farm-registry-modal-header"]} closeButton>
                        <Modal.Title>{labelsManager.importLabel(
                            "search_person",
                            context,
                            "farm_registry"
                        )}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className={style["farm-registry-modal-body"]}>
                        <SearchComponent person={true} onRowClick={handleRowClick} />
                    </Modal.Body>
                    <Modal.Footer className={style["farm-registry-modal-footer"]}></Modal.Footer>
                </Modal>
            )}
        </>
    );
};

const mapStateToProps = (state) => ({
    svSession: state.security.svSession,
});
FarmMembersWrapper.contextTypes = {
    intl: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(FarmMembersWrapper);
