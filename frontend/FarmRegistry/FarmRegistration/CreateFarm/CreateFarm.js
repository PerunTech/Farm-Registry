import {
    React,
    connect,
    elements,
    GenericGrid,
    ComponentManager,
    PropTypes,
    axios,
    GridManager,
    GenericForm,
} from "perun-core";
const { useState, useEffect } = React;
const { alertUser } = elements;

import CreateFarmWrapper from "./CreateFarmWrapper";
const tableName = "FARM";
const CreateFarm = (props) => {

    //handle infinite loading

    //create new team
    const saveFarm = (e) => {

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
                    const msg = res.data.message || ''
                    alertUser(true, resType, title, msg)
                    ComponentManager.setStateForComponent(`${tableName}_FORM`, null, {
                        saveExecuted: false,
                    });
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
            <div id="CreateFarmGrid">
                {generateCreateFarmForm()}
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
