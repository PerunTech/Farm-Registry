import {
    React,
    connect,
    elements,
    ComponentManager,
    PropTypes,
} from "perun-core";
import { labelsManager } from '../utils_tools/LabelsExport';
import WrapperSearch from '../utils_tools/WrapperSearch'

const { useState, useEffect } = React;
const { ReactBootstrap } = elements;

const PrescriptionvetWrapper = (props, context) => {
    const [show, setShow] = useState(false);
    const [tableName, setTableName] = useState(false);
    const [searchWs, setSearchWs] = useState(undefined);
    const [dataWs, setDataWs] = useState(undefined);
    const [rowClick, setRowClick] = useState(undefined);

    useEffect(() => {
        handleInputs(['root_pr_vet_FULL_NAME', 'root_pr_vet_DIPLOMA_NO'], handleVet);
        handleInputs(['root_pr_owner_OWNER_FULL_NAME', 'root_pr_owner_HOLDING_NO'], handleHolding);
        handleInputs(['root_pr_rp_TRADE_NAME', 'root_pr_rp_PHARMACEUTICAL_FORM'], handleVmp);
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

    const handleHolding = () => {
        triggerSearch({
            table: 'HOLDING',
            searchWs: `WsAims/getHoldingsByCriteria/${props.svSession}`,
            dataWs: false,
            onRowClick: handleHoldingClick
        });
    };

    const handleVmp = () => {
        triggerSearch({
            table: 'VMP',
            searchWs: `WsVmp/vmp/getByCriteria/${props.svSession}/VMP`,
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
            formData['FARM_MEMBER_OBJECT_ID'] = row['FARM_MEMBERS.OBJECT_ID'];
            formData["pr_vet"] = formData["pr_vet"] || {};
            formData["pr_vet"]['FULL_NAME'] = row['FARM_MEMBERS.FULL_NAME'];
            formData["pr_vet"]['DIPLOMA_NO'] = row['FARM_MEMBERS.DIPLOMA_NUMBER'] || 0;

            ComponentManager.setStateForComponent(formid, "formTableData", formData);
            props.formInstance.setState({ formTableData: formData });
            props.formInstance.onInputChange(formData);
        }
    };

    const handleHoldingClick = (row) => {
        const { formid } = props;
        const formData = ComponentManager.getStateForComponent(formid, "formTableData");

        if (formData) {
            formData['HOLDING_OBJECT_ID'] = row['HOLDING.OBJECT_ID'];
            formData["pr_owner"] = formData["pr_owner"] || {};
            formData["pr_owner"]['OWNER_FULL_NAME'] = row['HOLDING.NAME'];
            formData["pr_owner"]['HOLDING_NO'] = row['HOLDING.PIC'] || 0;

            ComponentManager.setStateForComponent(formid, "formTableData", formData);
            props.formInstance.setState({ formTableData: formData });
            props.formInstance.onInputChange(formData);
        }
    };

    const handleVmpClick = (row) => {
        const { formid } = props;
        const formData = ComponentManager.getStateForComponent(formid, "formTableData");

        if (formData) {
            formData['VMP_OBJECT_ID'] = row['VMP.OBJECT_ID'];
            formData["pr_rp"] = formData["pr_rp"] || {};
            formData["pr_rp"]['TRADE_NAME'] = row['VMP.PRODUCT_NAME'];
            formData["pr_rp"]['PHARMACEUTICAL_FORM'] = row['VMP.PHARMACEUTICAL_FORM'] || 0;

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
                el.placeholder = labelsManager.importLabel("click_to_choose", context, "farm_registry");
                el.style.background = '#b9cfba';
                el.style.color = '#ffffff';
            }
        });
    };

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
        </>
    );
};

const mapStateToProps = (state) => ({
    svSession: state.security.svSession,
});

PrescriptionvetWrapper.contextTypes = {
    intl: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(PrescriptionvetWrapper);
