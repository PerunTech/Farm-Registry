import { React, PropTypes, connect, utils, GridManager } from 'perun-core'
import SideMenu from './SideMenu'
const { updateIdScreen } = utils
const { useState, useEffect } = React

const DynamicRegistry = (props, context) => {
    const [dynamicComponent, setDynamicComponent] = useState(undefined)
    const [toggledMenu, setToggledMenu] = useState(false)
    useEffect(() => {
        updateIdScreen('farm_registry', context)
    }, [])
    const setDynamicComponentFunction = (comp) => {
        setDynamicComponent(comp)
    }
    useEffect(() => {
        const name = props.match.params.component;
        const table = name.startsWith("SUB-") ? name.slice(4) : name;
        const id = props.match.params.objectId;
        GridManager.reloadGridData(`${table}${id}`);
    }, [toggledMenu]);
    const toggleSideMenu = (toggleOn) => {
        if (toggleOn) {
            setToggledMenu(false);
        } else {
            setToggledMenu(!toggledMenu);
        }
    };
    return (
        <div className="farm-registry-main-container">
            <SideMenu
                toggleSideMenu={toggleSideMenu}
                toggledMenu={toggledMenu}
                objectId={props?.match?.params?.objectId}
                tableName={props?.match?.params?.tableName}
                setDynamicComponentFunction={setDynamicComponentFunction}
                routeParams={props.match.params}
            />
            <div className={`farm-registry-content ${toggledMenu && 'aims-registry-content-toggled'}`}>
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
