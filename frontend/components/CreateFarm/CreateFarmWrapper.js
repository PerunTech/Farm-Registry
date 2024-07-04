import {
    React,
    connect,
    elements,
    ComponentManager,
    PropTypes,
    createHashHistory
} from "perun-core";
import SearchComponent from '../SearchComp/SearchComponent'
import style from "../style/registration.module.css";
import { labelsManager } from '../utils_tools/LabelsExport';
const { useState, useEffect, useReducer } = React;
const { ReactBootstrap } = elements;
const { Modal } = ReactBootstrap;
let hashHistory = createHashHistory();
let gridId;
let inputholder = "";
const CreateFarmWrapper = (props, context) => {
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
        objid.push(row[`PERSON.OBJECT_ID`], row[`PERSON.NAME`],)
        const formData = ComponentManager.getStateForComponent(
            formid,
            "formTableData"
        );
        if (formData) {
            const secondInput = document.getElementById(secondInputId)
            formData["PERSON_OBJECT_ID"] = objid[0];
            formData["FULL_NAME"] = objid[1];
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
                <Modal className={style["farm-registry-modal"]} show={show} onHide={() => { setShow(false) }}>


                    <Modal.Header className={style["farm-registry-modal-header"]} closeButton>
                        <Modal.Title>{labelsManager.importLabel(
                            "search_person",
                            context,
                            "farm_registry"
                        )}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className={style["farm-registry-modal-body"]}>
                        <SearchComponent person={true} onRowClick={handleRowClick} />
                        <p className={style['redirect-to-pr-initial']}>{labelsManager.importLabel('register-person', context, 'farm_registry')}<span className={style['redirect-person']} onClick={() => {
                            hashHistory.push('/main/persons-registry')
                        }}>{labelsManager.importLabel('redirect-person', context, 'farm_registry')}</span></p>
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
CreateFarmWrapper.contextTypes = {
    intl: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(CreateFarmWrapper);
