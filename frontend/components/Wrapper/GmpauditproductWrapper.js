import {
    React,
    connect,
    ComponentManager,
    PropTypes, utils
} from "perun-core";
const { labelsManager } = utils
import WrapperSearch from '../utils_tools/WrapperSearch'
const { useState, useEffect } = React;
const GmpauditproductWrapper = (props, context) => {
    const [show, setShow] = useState(false);
    const [tableName, setTableName] = useState(false);
    const [searchWs, setSearchWs] = useState(undefined);
    const [dataWs, setDataWs] = useState(undefined);
    const [rowClick, setRowClick] = useState(undefined);

    useEffect(() => {
        handleInputs(['root_LICENSE_NUMBER', 'root_PRODUCT_NAME'], handleVmp);
    }, []);

    const triggerSearch = ({ table, searchWs, dataWs, onRowClick }) => {
        setTableName(table);
        setSearchWs(searchWs);
        setDataWs(dataWs);
        setRowClick(() => onRowClick);
        setShow(true);
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


    const handleVmpClick = (row) => {
        const { formid } = props;
        const formData = ComponentManager.getStateForComponent(formid, "formTableData");

        if (formData) {
            formData['VMP_OBJECT_ID'] = row['VMP.OBJECT_ID'];
            formData['PRODUCT_NAME'] = row['VMP.PRODUCT_NAME'];
            formData['LICENSE_NUMBER'] = row['VMP.PRODUCT_NUMBER'];
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

GmpauditproductWrapper.contextTypes = {
    intl: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(GmpauditproductWrapper);
