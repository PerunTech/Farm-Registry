import {
    React,
    connect,
    elements,
    ComponentManager,
    PropTypes,
    axios,
    GridManager, utils
} from "perun-core";
const { labelsManager } = utils
const { useState, useEffect } = React;
const { alertUserResponse, alertUserV2 } = elements;

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
                data: encodeURIComponent(formData),
                url,
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
            }).then(res => {
                if (res?.data) {
                    alertUserResponse({
                        response: res.data,
                        onConfirm: () => {
                            ComponentManager.setStateForComponent(formid, null, { saveExecuted: false })
                            GridManager.reloadGridData(`CAD_PARCEL${props.farmObjId}`)
                            ComponentManager.setStateForComponent(`CAD_PARCEL${props.farmObjId}`, null, { rowClicked: undefined })
                            const closeModalFunc = ComponentManager.getStateForComponent(formid, "closeModalFunc");
                            const resetClickedRowObjectId = ComponentManager.getStateForComponent(formid, 'resetClickedRowObjectId')
                            closeModalFunc()
                            resetClickedRowObjectId()
                        }
                    })
                }
            }).catch(err => {
                console.error(err)
                alertUserResponse({
                    response: err,
                    onConfirm: () => ComponentManager.setStateForComponent(formid, null, { saveExecuted: false })
                })
            });
        } else {
            alertUserV2({
                type: 'info',
                title: labelsManager("invalid_cad_parcel", context, "farm_registry"),
                message: labelsManager("invalid_cad_parcel_msg", context, "farm_registry"),
                onConfirm: () => ComponentManager.setStateForComponent(formid, null, { saveExecuted: false })
            })
        }
    }

    const handleInputs = () => {
        const firstInput = document.getElementById(firstInputId);
        if (firstInput) {
            firstInput.addEventListener("focusout", getCadParcelData);
        }
    };
    const getCadParcelData = () => {
        const { formid } = props
        const formData = ComponentManager.getStateForComponent(
            formid,
            "formTableData"
        );
        const cadastralCode = formData['CODCADASTRAL']
        let url = window.server + `/farm-registry/getCadParcelData/${props.svSession}/${cadastralCode}`
        axios.get(url).then(res => {
            if (res.data) {
                if (Object.keys(res.data).length > 0) {
                    formData['AREA'] = res.data.area
                    formData['NATIONAL_CODE_NAME'] = res.data.block || undefined
                    formData['MUNICIPALITY_NAME'] = res.data.region || undefined
                    ComponentManager.setStateForComponent(formid, "formTableData", formData);
                    props.formInstance.setState({ formTableData: formData })

                } else {
                    formData['AREA'] = undefined
                    formData['NATIONAL_CODE_NAME'] = undefined
                    formData['MUNICIPALITY_NAME'] = undefined
                    ComponentManager.setStateForComponent(formid, "formTableData", formData);
                    props.formInstance.setState({ formTableData: formData })
                }
            }
        }).catch(err => {
            console.error(err)
            alertUserResponse({ response: err })
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
