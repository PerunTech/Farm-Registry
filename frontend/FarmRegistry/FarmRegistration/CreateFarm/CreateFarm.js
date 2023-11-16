import {
    React,
    connect,
    elements,
    ComponentManager,
    PropTypes,
    axios,
    Loading,
    GenericForm,
} from "perun-core";
import { labelsManager } from "../../utils_tools/LabelsExport";
const { useState, useEffect } = React;
const { alertUser } = elements;

import CreateFarmWrapper from "./CreateFarmWrapper";
const tableName = "FARM";
const CreateFarm = (props, context) => {
    const [showForm, setShow] = useState(true)
    const [loading, setLoading] = useState(false)
    //handle infinite loading

    //create new team
    const saveFarm = (e) => {
        setShow(false)
        setLoading(true)
        const { svSession } = props;
        let url = window.server + "/WsRegistration/saveFarm/" + svSession;
        axios({
            method: "post",
            data: e.formData,
            url,
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        })
            .then((res) => {
                if (res.data) {
                    const resType = res.data.type.toLowerCase()
                    const title = res.data.title || ''
                    const ficLine = res.data.data.FIC ? `\n${labelsManager.importLabel("holding_code", context, "farm_registry")} ${res.data.data.FIC}` : '';
                    const msg = `${res.data.message}${ficLine}`;
                    alertUser(true, resType, title, msg)
                    ComponentManager.setStateForComponent(`${tableName}_FORM`, null, {
                        saveExecuted: false,
                    });
                    setShow(true)
                    setLoading(false)
                }
            })
            .catch(err => {
                console.error(err)
                const title = err.response?.data?.title || err
                const msg = err.response?.data?.message || ''
                alertUser(true, "error", title, msg);
                ComponentManager.setStateForComponent(`${tableName}_FORM`, null, {
                    saveExecuted: false,
                });
                setLoading(false)
                setShow(true)
            });
    };
    //create new team form
    const generateCreateFarmForm = () => {
        const { svSession } = props;
        return <GenericForm
            params={"READ_URL"}
            key={`${tableName}_FORM`}
            id={`${tableName}_FORM`}
            method={`/ReactElements/getTableJSONSchema/${svSession}/${tableName}`}
            uiSchemaConfigMethod={`/ReactElements/getTableUISchema/${svSession}/${tableName}`}
            tableFormDataMethod={`/ReactElements/getTableFormData/${svSession}/0/${tableName}`}
            addSaveFunction={(e) => saveFarm(e)}
            hideBtns={'closeAndDelete'}
            inputWrapper={CreateFarmWrapper}
            className={'farm-registry-forms form-test'}
        />
    };
    return (
        <>
            {loading && <Loading />}
            <div id="CreateFarmGrid">
                {showForm && generateCreateFarmForm()}
            </div>
        </>
    );
};

const mapStateToProps = (state) => ({
    svSession: state.security.svSession,
    farmObjId: state['farm_registry.mapData']?.farmData?.objectId
});

CreateFarm.contextTypes = {
    intl: PropTypes.object.isRequired,
};
export default connect(mapStateToProps)(CreateFarm);
