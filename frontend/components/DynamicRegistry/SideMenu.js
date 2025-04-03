import { React, connect, PropTypes, Loading, axios, createHashHistory, elements, redux } from "perun-core";
const { useEffect, useState, useRef } = React
const { alertUserResponse } = elements
const { store } = redux;
import { iconManager } from "../utils_tools/svgHolder";
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
        if (props.refreshSideMenu) {
            getConfiguration();
            store.dispatch({ type: 'SAVE', payload: { key: 'refreshSideMenu', value: false } })
        }
    }, [props.refreshSideMenu]);


    const getConfiguration = () => {
        const menuName = `${props.tableName.toLowerCase()}-registry-menu`
        setLoading(true)
        let url = window.server + `/custom-menu/get-configuration/sid/${props.svSession}/component-name/${menuName}/object-id/${props.objectId}/object-type/${props.tableName}`
        axios.get(url).then(res => {
            setLoading(false)
            if (res?.data) {
                const resType = res.data?.type?.toLowerCase()
                if (resType && resType === 'error') {
                    alertUserResponse({ response: res.data })
                } else {
                    setConfiguration(res.data)
                    const component = props.routeParams?.component
                    const isChild = component.includes('SUB-')
                    const tableName = component.replace(/^SUB-/, '')
                    res.data?.data?.map(item => {
                        if (item.data && isChild) {
                            item.data.map(child => {
                                if (child?.ID?.includes(tableName)) {
                                    onButtonClick(child, true)
                                    setActive(item)
                                }
                            })
                        } else {
                            if (item?.ID?.includes(tableName)) {
                                onButtonClick(item)
                            }
                        }
                    })
                }
            }
        }).catch(err => {
            console.error(err)
            setLoading(false)
            alertUserResponse({ response: err.response?.data })
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

    // Function to generate the buttons (you can keep the one you provided)
    const generateSideMenuButtons = () => {
        if (configuration && Array.isArray(configuration.data)) {
            return configuration.data.map(el => {
                let modifiedID = el.ID.replace(/\d/g, '').replace(/_$/, '');
                if (!el.ID.toUpperCase().includes('SUMMARY')) {
                    return (
                        <>
                            <button
                                id={el.ID}
                                className={`sidemenu-btn_sub ${activeElement === el.ID && !el.data && 'sidemenu-active'}`}
                                onClick={() => (el.data ? setActive(el) : onButtonClick(el))}
                            >
                                <span className='sidemenu-btn-title'>
                                    {iconManager.getIcon(modifiedID) && (
                                        <span className={'sidemenu-dynamic-comp-icon-holder'}>
                                            {iconManager.getIcon(modifiedID)}
                                        </span>
                                    )}
                                    <p>{el.label}</p>
                                </span>
                                {el.data && (
                                    <span className={`expand-arrow ${el.ID === activeParent && 'rotate-expand'}`}>
                                        {iconManager.getIcon('EXPAND')}
                                    </span>
                                )}
                            </button>
                            {el.data && (
                                <div className={el.ID === activeParent ? 'sidemenu-sub-item-active' : 'sidemenu-sub-item-hidden'}>
                                    {el.data.map(sub => {
                                        modifiedID = sub.ID.replace(/\d/g, '').replace(/_$/, '');
                                        return (
                                            <button
                                                className={`sidemenu-btn_sub ${activeChild === sub.ID && 'sidemenu-active'}`}
                                                onClick={() => (sub.ID.includes('PRINT') ? printFunc(sub) : onButtonClick(sub, true))}
                                            >
                                                <span className="sidemenu-btn-title">
                                                    {iconManager.getIcon(modifiedID) && (
                                                        <span className={'sidemenu-dynamic-comp-icon-holder'}>
                                                            {iconManager.getIcon(modifiedID)}
                                                        </span>
                                                    )}
                                                    <p>{sub.label}</p>
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </>
                    );
                }
            });
        } else {
            return <></>;
        }
    };
    const onButtonClick = (element, childEl) => {
        const id = element.ID;
        const splitID = id.replace(/\d/g, '').replace(/_$/, '');
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
            case "DYNAMIC":
                if (child) {
                    href = `/main/registry/${props.tableName}/${props.objectId}/SUB-${tableName}`
                }
                else href = `/main/registry/${props.tableName}/${props.objectId}/${tableName}`
                hashHistory.push(href)
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
            default:
                break;
        }
        props.setDynamicComponentFunction(dynamicComponent)
    };
    return (
        <>
            {loading && <Loading />}
            <div className={`sidemenu-main-container farm-registry-sidemenu-main-container`} id="sidemenu-main-container">
                {configuration && <ObjectSummary configuration={configuration} tableName={props.tableName} objectId={props.objectId} />}
                <div
                    ref={sideMenuRef}
                    className='farm-registry-sidemenu-buttons-container'
                >
                    {generateSideMenuButtons()}
                </div>
            </div>
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