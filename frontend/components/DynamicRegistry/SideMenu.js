import { React, connect, PropTypes, Loading, axios, createHashHistory, elements, redux, Tooltip } from "perun-core";
const { useEffect, useState, useRef } = React
const { alertUserResponse, Icon } = elements
const { store } = redux;
import CustomButtons from "./CustomButtons";
import ObjectSummary from './ObjectSummary';

const SideMenu = (props) => {
    const sideMenuRef = useRef(null);
    let hashHistory = createHashHistory();
    const [activeElement, setActiveElement] = useState('');
    const [activeChild, setActiveChild] = useState('');
    const [activeParent, setActiveParent] = useState('');
    const [configuration, setConfiguration] = useState(null);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        getConfiguration();
    }, []);

    useEffect(() => {
        if (props?.refreshSideMenu) {
            getConfiguration();
            store.dispatch({ type: 'SAVE', payload: { key: 'refreshSideMenu', value: false } })
        }
    }, [props?.refreshSideMenu]);

    const getConfiguration = () => {
        props.setTopButtons(undefined)
        setLoading(true)
        let url = window.server + `/Menu/getMenu/${props.svSession}/${props.objectId}/${props.tableName}/-`
        axios.get(url).then(res => {
            setLoading(false)
            if (res?.data) {
                const buttonArray = []
                const topButtons = []
                const resType = res.data?.type?.toLowerCase()
                if (resType && resType === 'error') {
                    alertUserResponse({ response: res.data })
                } else {
                    if (res.data?.data?.buttonArray && Array.isArray(res.data.data.buttonArray)) {
                        const component = props.routeParams?.component
                        const isChild = component.includes('SUB-')
                        const tableName = component.replace(/^SUB-/, '')
                        let opened = false
                        res.data?.data?.buttonArray?.map(item => {
                            if (Array.isArray(item.data) && item.data.length === 0) {
                                return
                            }
                            if (item.position === 'top') {
                                topButtons.push(item)
                            } else {
                                buttonArray.push(item)
                                if (item.data && isChild) {
                                    item.data.map(child => {
                                        if (child?.ID?.includes(tableName)) {
                                            opened = true
                                            onButtonClick(child, true)
                                            setActive(item)
                                        }
                                    })
                                } else {
                                    if (item?.ID?.includes(tableName)) {
                                        opened = true
                                        onButtonClick(item)
                                    }
                                }
                            }
                        })
                        // Nothing in the route to open (e.g. entering from the search): a page is the item's main screen, so open it
                        if (!opened) {
                            const page = buttonArray.find(item => item?.objectConfiguration?.type === 'page')
                            if (page) onButtonClick(page)
                        }
                        setConfiguration(buttonArray)
                        props.setTopButtons(topButtons)
                    }
                }
            }
        }).catch(err => {
            console.error(err)
            setLoading(false)
            alertUserResponse({ response: err })
        })
    }
    const setActive = (el) => {
        if (el.ID === activeParent) {
            setActiveParent('');
            setLoading(false);
        } else {
            setActiveParent(el.ID);
            setTimeout(() => {
                const clickedButton = document.getElementById(el.ID);
                if (clickedButton) {
                    const sideMenu = sideMenuRef.current;
                    if (sideMenu) {
                        sideMenu.scrollBy({
                            top: 200,
                            behavior: 'smooth',
                        });
                    }
                }
            }, 100);
        }
    };
    const activeChildFunc = (el) => {
        if (!props.toggledMenu) {
            setActive(el)
        }
    }
    // Function to generate the buttons (you can keep the one you provided)
    const generateSideMenuButtons = () => {
        if (!configuration || !Array.isArray(configuration)) return <></>;
        return configuration.map(el => {
            if (!el.ID.toUpperCase().includes('SUMMARY')) {
                return (
                    <React.Fragment key={el.ID}>
                        <button
                            id={el.ID}
                            className={`sidemenu-btn_sub ${activeElement === el.ID && !el.data && 'sidemenu-active'}`}
                            onClick={() => (el.data ? activeChildFunc(el) : onButtonClick(el))}
                            data-tooltip-id={props.toggledMenu && el.data?.length ? "aims-tooltip" : "simple-tooltip"}
                            data-tooltip-content={props.toggledMenu && el.data?.length ? JSON.stringify(el.data) : JSON.stringify(el)}
                            data-tooltip-place="right"
                        >
                            <span className='sidemenu-btn-title'>
                                {el.iconName && el.iconName !== '%ICON_NAME%' && (
                                    <span className='sidemenu-dynamic-comp-icon-holder'>
                                        <Icon name={el.iconName} />
                                    </span>
                                )}
                                <p>{el.label}</p>
                            </span>
                            {el.data && (
                                <span className={`expand-arrow ${el.ID === activeParent && !props.toggledMenu ? "rotate-expand" : ""}`}>
                                    <Icon name='IconChevronDown' />
                                </span>
                            )}
                        </button>
                        {!props.toggledMenu && el.data && (
                            <div className={el.ID === activeParent ? 'sidemenu-sub-item-active' : 'sidemenu-sub-item-hidden'}>
                                {el.data.map(sub => (
                                    <button
                                        key={sub.ID}
                                        className={`sidemenu-btn_sub ${activeChild === sub.ID && 'sidemenu-active'}`}
                                        onClick={() =>
                                            sub.ID.includes('PRINT') ? printFunc(sub) : onButtonClick(sub, true)
                                        }
                                    >
                                        <span className="sidemenu-btn-title">
                                            <p>{sub.label}</p>
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </React.Fragment>
                );
            }
            return null;
        });
    };
    const onButtonClick = (element, childEl) => {
        store.dispatch({ type: 'SAVE', payload: { key: 'farm-registry-module-additional-top-buttons', value: undefined } })
        const id = element.ID;
        const splitID = id.replace(/_[^_]*\d+$/, '');
        if (childEl) {
            displayComponent('DYNAMIC', splitID, element, true);
            setActiveChild(id)
            setLoading(false)
            setActiveElement('')
        } else {
            displayComponent('DYNAMIC', splitID, element);
            setActiveElement(id)
            setLoading(false)
            setActiveChild('')
        }
    }
    const printFunc = (sub) => {
        let url = window.server + sub.onSubmit;
        window.open(url, '_blank');
    }
    const displayComponent = (component, tableName, configuration, child) => {
        let dynamicComponent;
        let href = `/main/registry/${props.tableName}/${props.objectId}/`
        switch (component) {
            case "DYNAMIC": {
                if (child) {
                    href = `/main/registry/${props.tableName}/${props.objectId}/SUB-${tableName}`
                }
                else href = `/main/registry/${props.tableName}/${props.objectId}/${tableName}`
                // When the menu loads, it selects the item the address already names. Pushing
                // the bare path then would drop the query after it, such as a link's `?map=`.
                if (window.location.hash.split('?')[0] !== `#${href}`) hashHistory.push(href)
                const customButtonsProps = {
                    key: tableName,
                    tableName,
                    objectId: props.objectId,
                    appObjId: props.objectId,
                    configuration,
                    getConfiguration: (objId) => getConfiguration(objId)
                }
                dynamicComponent = <CustomButtons {...customButtonsProps} />
                break;
            }
            default:
                break;
        }
        props.setDynamicComponentFunction(dynamicComponent)
    };

    return (
        <>
            {loading && <Loading />}
            <div className={`sidemenu-main-container farm-registry-sidemenu-main-container ${props.toggledMenu && 'toggled-sidemenu'}`} id="sidemenu-main-container">
                {configuration && <ObjectSummary toggleSideMenu={props.toggleSideMenu} toggledMenu={props.toggledMenu} configuration={configuration} tableName={props.tableName} objectId={props.objectId} />}
                <div
                    ref={sideMenuRef}
                    className='farm-registry-sidemenu-buttons-container'
                >
                    {generateSideMenuButtons()}
                </div>
            </div>
            {props.toggledMenu &&
                <Tooltip id="aims-tooltip" place="right" clickable className="aims-tooltip"
                    render={({ content }) => {
                        let submenu = [];
                        try {
                            submenu = JSON.parse(content || "[]");
                        } catch (_e) {
                            submenu = [];
                        }

                        if (!submenu.length) return null;
                        return (
                            <div className="tooltip-submenu-wrapper">
                                {submenu.map(sub => (
                                    <button key={sub.ID} className={`sidemenu-btn_sub ${activeChild === sub.ID && 'sidemenu-active'}`}
                                        onClick={() => sub.ID.includes('PRINT') ? printFunc(sub) : onButtonClick(sub, true)}>{sub.label} </button>
                                ))}
                            </div>
                        );
                    }}
                />}
            {props.toggledMenu && <Tooltip className="aims-tooltip" id="simple-tooltip" place="right" clickable
                render={({ content }) => {
                    if (!content) return null;
                    let el;
                    try {
                        el = JSON.parse(content);
                    } catch (_e) {
                        return null;
                    }
                    return (
                        <div className="tooltip-submenu-wrapper">
                            <button className="sidemenu-btn_sub" onClick={() => onButtonClick(el)} >
                                {el.label}</button>
                        </div>
                    );
                }}
            />}

        </>
    );
}
const mapStateToProps = (state) => ({
    svSession: state.security.svSession,
    refreshSideMenu: state.businessLogicReducer?.refreshSideMenu
});

SideMenu.contextTypes = {
    intl: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(SideMenu);