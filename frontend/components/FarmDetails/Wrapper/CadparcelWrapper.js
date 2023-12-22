import {
    React,
    connect,
    elements,
    ComponentManager,
    PropTypes,
    axios,
    GridManager
} from "perun-core";
import style from "../../style/registration.module.css";
import { labelsManager } from '../../utils_tools/LabelsExport';
const { useState, useEffect } = React;
const { ReactBootstrap } = elements;
const { alertUser } = elements;

const CadparcelWrapper = (props, context) => {

    const [firstInputId, _setFirst] = useState("root_CODCADASTRAL")


    useEffect(() => {
        const { formid } = props

        ComponentManager.setStateForComponent(formid, "addSaveFunction", addSaveFunction);
        props.formInstance.setState({ addSaveFunction: addSaveFunction })


        handleInputs();
    }, []);

    const addSaveFunction = () => {
        let url = `${window.server}/ReactElements/createTableRecordFormData/${props.svSession}/CAD_PARCEL/${props.farmObjId}`
        const { formid } = props
        const formData = ComponentManager.getStateForComponent(
            formid,
            "formTableData"
        );
        if (formData['AREA']) {
            axios({
                method: "post",
                data: formData,
                url,
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
            }).then(res => {
                alertUser(true, res.data.type?.toLowerCase(), res.data.title, res.data.message, () => {
                    ComponentManager.setStateForComponent(formid, null, { saveExecuted: false })
                    GridManager.reloadGridData(`CAD_PARCEL${props.farmObjId}`)
                    const closeModalFunc = ComponentManager.getStateForComponent(
                        formid,
                        "closeModalFunc"
                    );
                    closeModalFunc()
                });
            }).catch(err => {
                console.error(err)
                const title = err.response?.data?.title || err
                const msg = err.response?.data?.message || ''
                alertUser(true, "error", title, msg);
            });
        } else {
            alertUser(true, 'info', labelsManager.importLabel("invalid_cad_parcel", context, "farm_registry"), '', () => { ComponentManager.setStateForComponent(formid, null, { saveExecuted: false }) })
        }

    }

    const handleInputs = () => {
        const firstInput = document.getElementById(firstInputId);
        if (firstInput) {
            firstInput.addEventListener("focusout", handleTest);
        }
    };
    const handleTest = () => {
        const { formid } = props
        const formData = ComponentManager.getStateForComponent(
            formid,
            "formTableData"
        );
        console.log(formData);
        const cadastralCode = formData['CODCADASTRAL']
        let url = window.server + `/mdfr/getCadParcelData/${props.svSession}/${cadastralCode}`
        axios.get(url).then(res => {
            if (res.data) {
                if (Object.keys(res.data).length > 0) {
                    formData['AREA'] = res.data.area
                    formData['NATIONAL_CODE'] = res.data.block
                    formData['MUNICIPALITY_NAME'] = res.data.region
                    ComponentManager.setStateForComponent(formid, "formTableData", formData);
                    props.formInstance.setState({ formTableData: formData })
                }
            }
        }).catch(err => {
            console.error(err)
            const title = err.response?.data?.title || err
            const msg = err.response?.data?.message || ''
            alertUser(true, "error", title, msg);
        });
    }
    return (
        <>
            {props.children}
        </>
    );
};

const mapStateToProps = (state) => ({
    svSession: state.security.svSession,
    farmObjId: state['farm_registry.mapData']?.farmData?.objectId,
});
CadparcelWrapper.contextTypes = {
    intl: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(CadparcelWrapper);
