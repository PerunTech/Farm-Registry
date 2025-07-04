import { React, PropTypes, connect, utils } from 'perun-core'
import SideMenu from './SideMenu'
const { updateIdScreen } = utils
const { useState, useEffect } = React

const DynamicRegistry = (props, context) => {
    const [dynamicComponent, setDynamicComponent] = useState(undefined)
    useEffect(() => {
        updateIdScreen('farm_registry', context)
    }, [])
    const setDynamicComponentFunction = (comp) => {
        setDynamicComponent(comp)
    }
    return (
        <div className="farm-registry-main-container">
            <SideMenu
                objectId={props?.match?.params?.objectId}
                tableName={props?.match?.params?.tableName}
                setDynamicComponentFunction={setDynamicComponentFunction}
                routeParams={props.match.params}
            />
            <div className="farm-registry-content">
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
