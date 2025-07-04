import {
    React,
    connect,
    ComponentManager,
    PropTypes,
    GenericForm, utils
} from "perun-core";
const { labelsManager } = utils
import WrapperSearch from '../utils_tools/WrapperSearch'

const { useState, useEffect } = React;

const PrescriptionmedicineWrapper = (props, context) => {
    const [show, setShow] = useState(false);
    const [tableName, setTableName] = useState(false);
    const [searchWs, setSearchWs] = useState(undefined);
    const [dataWs, setDataWs] = useState(undefined);
    const [rowClick, setRowClick] = useState(undefined);
    const [precsId, setPrecsId] = useState(undefined)
    const [render, setRender] = useState(false)

    useEffect(() => {
        handleInputs(['root_PRESCRIPTION_MED_NUMBER'], handleInput);
    }, []);

    useEffect(() => {
        if (props.formInstance.state.formDataLoaded) {
            getPrecsId()
        }
    }, [props.formInstance.state.formDataLoaded])



    const triggerSearch = ({ table, searchWs, dataWs, onRowClick }) => {
        setTableName(table);
        setSearchWs(searchWs);
        setDataWs(dataWs);
        setRowClick(() => onRowClick);
        setShow(true);
    };

    const handleInput = () => {
        triggerSearch({
            table: 'PRESCRIPTION_VET',
            searchWs: false,
            dataWs: `ReactElements/getTableData/${props.svSession}/PRESCRIPTION_VET/0`,
            onRowClick: handleRowClick
        });
    };



    const handleRowClick = (row) => {
        const { formid } = props;
        const formData = ComponentManager.getStateForComponent(formid, "formTableData");
        setPrecsId(row['PRESCRIPTION_VET.OBJECT_ID'])
        if (formData) {
            formData['PRESCRIPTION_MED_NUMBER'] = row['PRESCRIPTION_VET.PRESCRIPTION_NUMBER'];
            formData['PRESCRIPTION_OBJECT_ID'] = row['PRESCRIPTION_VET.OBJECT_ID'];

            ComponentManager.setStateForComponent(formid, "formTableData", formData);
            props.formInstance.setState({ formTableData: formData });
            props.formInstance.onInputChange(formData);
            setRender(true)
        }
    };


    const handleShow = () => {
        setShow(!show);
    };

    const handleInputs = (fields, action) => {


        fields.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.style.cursor = "pointer";
                el.onclick = action;
                el.placeholder = labelsManager("click_to_choose", context, "farm_registry");
                el.style.background = '#b9cfba';
                el.style.color = '#ffffff';
            }
        });
    };
    const getPrecsId = () => {
        const { formid } = props;
        const formData = ComponentManager.getStateForComponent(formid, "formTableData");
        if (formData && formData['PRESCRIPTION_OBJECT_ID']) {
            setPrecsId(formData['PRESCRIPTION_OBJECT_ID'])
            setRender(true)
        }

    }

    return (
        <>
            {props.children}
            {show &&
                <WrapperSearch
                    tableName={tableName}
                    searchWs={searchWs}
                    dataWs={dataWs}
                    handleShow={handleShow}
                    rowClick={rowClick}
                />}
            {render && <GenericForm
                className={`form-test custom-farm-registry-form aims-forms`}
                params='FORM_DATA'
                key={`PRESCRIPTION_VET_FORM_${precsId}`}
                id={`PRESCRIPTION_VET_FORM_${precsId}`}
                method={`/ReactElements/getTableJSONSchema/${props.svSession}/PRESCRIPTION_VET`}
                uiSchemaConfigMethod={`/ReactElements/getTableUISchema/${props.svSession}/PRESCRIPTION_VET`}
                tableFormDataMethod={`/ReactElements/getTableFormData/${props.svSession}/${precsId}/PRESCRIPTION_VET`}
                hideBtns={'all'}
                disabled
            />}
        </>
    );
};

const mapStateToProps = (state) => ({
    svSession: state.security.svSession,
});

PrescriptionmedicineWrapper.contextTypes = {
    intl: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(PrescriptionmedicineWrapper);
