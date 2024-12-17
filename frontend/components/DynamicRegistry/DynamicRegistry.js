import { React, PropTypes, connect } from 'perun-core'
import SideMenu from './SideMenu'
import { updateIdScreen } from '../utils_tools/UtilFunctions'
const { useState, useEffect } = React

const DynamicRegistry = (props, context) => {
    const [dynamicComponent, setDynamicComponent] = useState(undefined)
    useEffect(() => {
        updateIdScreen(context)
    }, [])
    const setDynamicComponentFunction = (comp) => {
        setDynamicComponent(comp)
    }
    return (
        <div className="animals-registry-main-container">
            <SideMenu
                objectId={props?.match?.params?.objectId}
                tableName={props?.match?.params?.tableName}
                setDynamicComponentFunction={setDynamicComponentFunction}
            />
            <div className="animals-registry-dynamic-content-container">
                {dynamicComponent}
            </div>
        </div>
    )
}

const mapStateToProps = (state) => ({
    svSession: state.security.svSession,
});

DynamicRegistry.contextTypes = {
    intl: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(DynamicRegistry);
