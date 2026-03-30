import {
    React,
    connect,
    ComponentManager,
    PropTypes, utils,
    elements
} from "perun-core";
const { labelsManager } = utils
import WrapperSearch from '../utils_tools/WrapperSearch'
const { useState, useEffect } = React;
const { Icon } = elements
const VmpPrescriptionWrapper = (props, context) => {
    const [show, setShow] = useState(false);
    const [tableName, setTableName] = useState(false);
    const [searchWs, setSearchWs] = useState(undefined);
    const [dataWs, setDataWs] = useState(undefined);
    const [rowClick, setRowClick] = useState(undefined);
    const [objectId, setObjId] = useState(undefined)

    useEffect(() => {
        const { formid } = props;
        const formData = ComponentManager.getStateForComponent(formid, "formTableData");
        setObjId(formData['OBJECT_ID'])
        handleInputs(['root_prescription_group_vet_VET_FULL_NAME', 'root_prescription_group_vet_VET_REGISTRATION_NO'], handleVet);
        handleInputs(['root_prescription_group_vmp_MEDICINE_NAME'], handleVmp);
    }, []);

    const triggerSearch = ({ table, searchWs, dataWs, onRowClick }) => {
        setTableName(table);
        setSearchWs(searchWs);
        setDataWs(dataWs);
        setRowClick(() => onRowClick);
        setShow(true);
    };

    const handleVet = () => {
        const { formid } = props;
        const objId = ComponentManager.getStateForComponent(formid, "objId");
        triggerSearch({
            table: 'FARM_MEMBERS',
            searchWs: false,
            dataWs: `ReactElements/getObjectsByParentId/${props.svSession}/${objId}/FARM_MEMBERS/0`,
            onRowClick: handleVetClick
        });
    };

    const handleVmp = () => {
        triggerSearch({
            table: 'VMP_REGISTRATION',
            searchWs: `WsVmp/vmp/getByCriteria/${props.svSession}/VMP_REGISTRATION`,
            dataWs: false,
            onRowClick: handleVmpClick
        });
    };

    const handleShow = () => {
        setShow(!show);
    };

    const handleVetClick = (row) => {
        const { formid } = props;
        const formData = ComponentManager.getStateForComponent(formid, "formTableData");

        if (formData) {
            formData['VET_OBJECT_ID'] = row['FARM_MEMBERS.OBJECT_ID'];
            formData["prescription_group_vet"] = formData["prescription_group_vet"] || {};
            formData["prescription_group_vet"]['VET_FULL_NAME'] = row['FARM_MEMBERS.FULL_NAME'];
            formData["prescription_group_vet"]['VET_REGISTRATION_NO'] = row['FARM_MEMBERS.DIPLOMA_NUMBER'] || 0;

            ComponentManager.setStateForComponent(formid, "formTableData", formData);
            props.formInstance.setState({ formTableData: formData });
            props.formInstance.onInputChange(formData);
        }
    };

    const handleVmpClick = (row) => {
        const { formid } = props;
        const formData = ComponentManager.getStateForComponent(formid, "formTableData");
        const formDatat = ComponentManager.getStateForComponent(formid, "formData");
        console.log(formDatat);
        console.log(row);
        if (formData) {
            formData['VMP_OBJECT_ID'] = row['VMP_REGISTRATION.OBJECT_ID'];
            formData["prescription_group_vmp"] = formData["prescription_group_vmp"] || {};
            formData["prescription_group_vmp"]['MEDICINE_NAME'] = row['VMP_REGISTRATION.TRADE_NAME'];
            ComponentManager.setStateForComponent(formid, "formTableData", formData);
            props.formInstance.setState({ formTableData: formData });
            props.formInstance.onInputChange(formData);
        }
    };

    const handleInputs = (fields, action) => {
        fields.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.style.cursor = "pointer";
                el.onclick = action;
                el.placeholder = labelsManager("click_to_choose", context, "farm_registry");
                el.style.background = '#b9cfba';
                el.style.color = '#333';
            }
        });
    };

    const downloadPDF = () => {
        let url = window.server + `/farm-registry/generate/report/session-id/${props.svSession}/object-id/${objectId}/report-name/vmp_e-prescription/file-type/PDF/param/en_US`;
        window.open(url, '_blank');
    }

    return (
        <>

            {objectId && (
                <div className='perun-menu-buttons-container'>
                    <button className='btn-success btn_save_form download-menu-btn' onClick={downloadPDF}>
                        {labelsManager("download_prescription", context, "farm_registry")}
                        <span className='download-span'>{<Icon name="IconPrinter" />}</span>
                    </button>
                </div>
            )}
            {props.children}
            {show &&
                <WrapperSearch
                    tableName={tableName}
                    searchWs={searchWs}
                    dataWs={dataWs}
                    handleShow={handleShow}
                    rowClick={rowClick}
                />}
        </>
    );
};

const mapStateToProps = (state) => ({
    svSession: state.security.svSession,
});

VmpPrescriptionWrapper.contextTypes = {
    intl: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(VmpPrescriptionWrapper);
