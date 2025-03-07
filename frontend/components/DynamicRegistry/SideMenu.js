import { React, connect, PropTypes, Loading, axios, createHashHistory, elements } from "perun-core";
const { useEffect, useState } = React
const { alertUserResponse } = elements
import { iconManager } from "../utils_tools/svgHolder";
import CustomButtons from "./CustomButtons";
import ObjectSummary from './ObjectSummary';

const SideMenu = (props) => {
    let hashHistory = createHashHistory();
    const [activeElement, setActiveElement] = useState('');
    const [activeChild, setActiveChild] = useState('');
    const [activeParent, setActiveParent] = useState('');
    const [configuration, setConfiguration] = useState(null);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        getConfiguration();
    }, []);
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
            setActiveParent('')
            setLoading(false)
        } else {
            setActiveParent(el.ID)
        }
    }
    const generateSideMenuButtons = () => {
        if (configuration && Array.isArray(configuration.data)) {
            return configuration.data.map(el => {
                let modifiedID = el.ID.replace(/\d/g, '').replace(/_$/, '');
                if (!el.ID.toUpperCase().includes('SUMMARY')) {
                    return (
                        <>
                            <button
                                className={`sidemenu-btn_sub ${activeElement === el.ID && !el.data && 'sidemenu-active'}`}
                                onClick={() => (el.data ? setActive(el) : onButtonClick(el))}
                            >
                                {iconManager.getIcon(modifiedID) && <span className={'sidemenu-dynamic-comp-icon-holder'}>{iconManager.getIcon(modifiedID)}</span>}<p>{el.label}</p>
                            </button>
                            {el.data && <div className={el.ID === activeParent ? 'sidemenu-sub-item-active' : 'sidemenu-sub-item-hidden'}>
                                {el.data.map(sub => {
                                    modifiedID = sub.ID.replace(/\d/g, '').replace(/_$/, '')
                                    return < button
                                        className={`sidemenu-btn_sub ${activeChild === sub.ID && 'sidemenu-active'}`
                                        }
                                        onClick={() => (sub.ID.includes('PRINT') ? printFunc(sub) : onButtonClick(sub, true))}
                                    >
                                        {iconManager.getIcon(modifiedID) && <span className={'sidemenu-dynamic-comp-icon-holder'}>{iconManager.getIcon(modifiedID)}</span>}<p>{sub.label}</p>
                                    </button>
                                })}
                            </div >}
                        </>
                    );
                }
            });
        } else {
            return <></>;
        }
    }
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
                <div className='farm-registry-sidemenu-buttons-container'>
                    {generateSideMenuButtons()}
                </div>
            </div>
        </>
    )
}
const mapStateToProps = (state) => ({
    svSession: state.security.svSession,
});

SideMenu.contextTypes = {
    intl: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(SideMenu);