import { React, PropTypes, connect, utils, GridManager } from 'perun-core'
import SideMenu from './SideMenu'
import TopButtons from './TopButtons'
const { updateIdScreen } = utils
const { useState, useEffect } = React

const DynamicRegistry = (props, context) => {
    const [dynamicComponent, setDynamicComponent] = useState(undefined)
    const [topButtons, setTopButtons] = useState(undefined)
    const [toggledMenu, setToggledMenu] = useState(false)
    useEffect(() => {
        updateIdScreen('farm_registry', context)
    }, [])
    const setDynamicComponentFunction = (comp) => {
        setDynamicComponent(comp)
    }
    useEffect(() => {
        GridManager.reloadAllGrids();
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
                setTopButtons={setTopButtons}
                routeParams={props.match.params}
            />
            <div className={`farm-registry-content ${toggledMenu && 'aims-registry-content-toggled'}`}>
                {((topButtons && Array.isArray(topButtons) && topButtons.length > 0) || (props.additionalTopBtns && Array.isArray(props.additionalTopBtns) && props.additionalTopBtns.length > 0)) && (
                    <TopButtons
                        configuration={topButtons}
                        objectId={props?.match?.params?.objectId}
                        tableName={props?.match?.params?.tableName}
                        activeComponent={props?.match?.params?.component}
                        routeQuery={props?.location?.search}
                    />
                )}
                <div className='dynamic-component-container'>
                    {dynamicComponent}
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => ({
    svSession: state.security.svSession,
    additionalTopBtns: state.businessLogicReducer?.['farm-registry-module-additional-top-buttons'],
});

DynamicRegistry.contextTypes = {
    intl: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(DynamicRegistry);
