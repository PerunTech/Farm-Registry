import {
    React,
    connect,
    ComponentManager,
    PropTypes,
} from "perun-core";
import SaveFormAndAttachments from '../utils_tools/SaveFormAndAttachments';

const ControlDocumentsWrapper = (props) => {


    const handleSelected = () => {
        const { formid } = props;
        const formTableData = ComponentManager.getStateForComponent(formid, "formTableData");
        const objectId = formTableData?.['OBJECT_ID']
        return (
            <>
                <SaveFormAndAttachments formid={formid} tableName={'CONTROL_DOCUMENTS'} objId={objectId} />
            </>
        );
    }

    return (
        <>
            {props.children}
            {props.formInstance.state.formDataLoaded && handleSelected()}
        </>
    );
};

const mapStateToProps = (state) => ({
    svSession: state.security.svSession,
});
ControlDocumentsWrapper.contextTypes = {
    intl: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(ControlDocumentsWrapper);
