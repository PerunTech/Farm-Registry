import {
    React,
    connect,
    elements,
    ComponentManager,
    PropTypes,
    createHashHistory
} from "perun-core";
import SearchComponent from '../SearchComp/SearchComponent'
import { labelsManager } from '../utils_tools/LabelsExport';
const { useState, useEffect, useReducer } = React;
const { ReactBootstrap } = elements;
const { Modal } = ReactBootstrap;
let hashHistory = createHashHistory();
let gridId;
let inputholder = "";
const HoldingWrapper = (props, context) => {
    const [show, setShow] = useState(false);
    const initialState = {
        firstInputId: "root_holding.info_NAME",
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
    const handleInputs = () => {
        const inputs = document.querySelectorAll("#root_holding\\.info_NAME")
        let firstInput = inputs[1] ? inputs[1] : inputs[0]
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
            const inputs = document.querySelectorAll("#root_holding\\.info_NAME")
            let firstInput = inputs[1] ? inputs[1] : inputs[0]
            formData["PERSON_OBJECT_ID"] = objid[0];
            formData["holding.info_NAME"] = objid[1];
            firstInput.value = formData["holding.info_NAME"]

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
            {props.children && handleInputs()}
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
                        <p className={'redirect-to-pr-initial'}>{labelsManager.importLabel('register-person', context, 'farm_registry')}<span className={'redirect-person'} onClick={() => {
                            hashHistory.push('/main/persons-registry')
                        }}>{labelsManager.importLabel('redirect-person', context, 'farm_registry')}</span></p>
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
