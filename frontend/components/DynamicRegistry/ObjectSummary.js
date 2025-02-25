import { React, connect, PropTypes, Loading, axios, elements, createHashHistory, redux } from "perun-core";
import { getMainLabel } from '../utils_tools/LabelsExport';
const { useEffect, useState } = React;
const { ReactBootstrap, alertUser, alertUserResponse } = elements;
const { Modal } = ReactBootstrap;
const { store } = redux
import { iconManager } from '../utils_tools/svgHolder';
const hashHistory = createHashHistory();
const ObjectSummary = (props, context) => {
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const [menuData, setMenuData] = useState([]);
    const [modalData, setModalData] = useState([]);
    const [actions, setActions] = useState([])
    const [importUrl, setImportUrl] = useState(undefined)
    useEffect(() => {
        props?.configuration?.data?.map(el => {
            if (el.ID.toUpperCase().includes('SUMMARY')) {
                getObjectSummary(el.url);
            }
        })
    }, []);

    useEffect(() => {
        if (props.refreshSummary) {
            props?.configuration?.data?.map(el => {
                if (el.ID.toUpperCase().includes('SUMMARY')) {
                    getObjectSummary(el.url);
                    store.dispatch({ type: 'REFRESH_SUMMARY', payload: false })
                }
            })
        }
    }, [props.refreshSummary]);

    const getObjectSummary = (url) => {

        setLoading(true);
        axios.get(`${window.server}/${url}`)
            .then(res => {
                setLoading(false);
                const resType = res.data?.type?.toLowerCase();
                if (resType === 'error') {
                    const title = res.data?.title || '';
                    const msg = res.data?.message || '';
                    alertUser(true, 'error', title, msg);
                } else {
                    setMenuData(res.data?.data?.DETAILED || []);
                    setModalData(res.data?.data?.SHORT || []);
                    setActions(res.data?.data?.ACTIONS || [])
                    setImportUrl(res.data?.data?.IMPORT?.[0]['import'] || undefined)
                }
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
                const title = err.response?.data?.title || err.message;
                const msg = err.response?.data?.message || '';
                alertUser(true, 'error', title, msg);
            });
    };
    const backButtonFunction = () => {
        if (props?.businessLogicReducer?.['farm-registry']?.['route']) {
            hashHistory.push(props?.businessLogicReducer?.['farm-registry']?.['route'])
            store.dispatch({ type: 'SAVE', payload: { "farm-registry": {} } })
        } else {
            hashHistory.push('/main/farm-registry')
        }
    }

    const generateMenuData = () => {
        return (
            <>
                {menuData.map(({ label, value }) => (
                    <div className="farm-registry-object-summary-row" key={label}>
                        <p>{label}</p>
                        <p>: {value}</p>
                    </div>
                ))}
            </>
        )
    }

    const generateModalData = () => (
        <div className="farm-registry-object-summary-modal">
            {modalData.map(({ label, value }) => (
                <div className="farm-registry-object-summary-row" key={label}>
                    <p>{label}</p>
                    <p>: {value}</p>
                </div>
            ))}
        </div>
    );
    const updateData = () => {
        alertUser(true, 'info', getMainLabel('confirm_update_action', context), getMainLabel('confirm_update_action_msg', context), () => {
            setLoading(true)
            const url = `${window.server}${importUrl}   `
            axios.get(url).then(res => {
                alertUser(true, res.data.type.toLowerCase(), res.data.title, res.data.message)
                setLoading(false)
            }).catch(err => {
                setLoading(false)
                console.error(err)
                const title = err.response?.data?.title || err
                const msg = err.response?.data?.message || ''
                alertUser(true, "error", title, msg);
            });
        }, () => { }, true, getMainLabel('yes', context), getMainLabel('no', context))
    }

    const generateSummaryActions = () => {
        return actions?.map(el => (
            < button className="farm-registry-object-summary-show-more" onClick={() => summaryAction(el.onSubmit)}> {el.label}</button >
        ))
    }

    const summaryAction = (url) => {
        setLoading(true)
        axios.get(`${window.server + url}`).then(res => {
            setLoading(false)
            alertUserResponse({ response: res })
            store.dispatch({ type: 'REFRESH_SUMMARY', payload: true })

        }).catch(err => {
            alertUserResponse({ response: err })
            setLoading(false)
        })
    }

    return (
        <>
            {loading && <Loading />}
            <div className="farm-registry-object-summary">
                <button className='farm-registry-summary-back-btn' onClick={() => backButtonFunction()}>
                    <i className='fas fa-chevron-left' />
                    <span className='back-btn-text'>{getMainLabel('back', context)}</span>
                </button>
                {menuData.length > 0 && (
                    <>
                        <div className='farm-registry-object-summary-rows-container'>
                            {generateMenuData()}
                        </div>
                        <div className='farm-registry-object-summary-btn-container'>
                            {modalData.length > 0 && (
                                <button
                                    className="farm-registry-object-summary-show-more"
                                    onClick={() => setShow(true)}
                                >
                                    {getMainLabel('show_more', context)}
                                </button>
                            )}
                            {importUrl && <button className={`update-farm-btn`} onClick={() => updateData()}><span className={`update-farm-btn-container`}>{getMainLabel("update_data_btn", context)} <span className={`update-farm-btn-icon`}>{iconManager.getIcon('reloadData')}</span></span></button>}
                            {actions && generateSummaryActions()}
                        </div>
                    </>
                )}
            </div>
            {show && (
                <Modal
                    className="farm-registry-modal farm-registry-modal-object-summary"
                    show={show}
                    onHide={() => setShow(false)}
                >
                    <Modal.Header className="farm-registry-modal-header" closeButton />
                    <Modal.Body className="farm-registry-modal-body">
                        {modalData.length > 0 && generateModalData()}
                    </Modal.Body>
                    <Modal.Footer className="farm-registry-modal-footer" />
                </Modal>
            )}
        </>
    );
};

const mapStateToProps = (state) => ({
    svSession: state.security.svSession,
    businessLogicReducer: state.businessLogicReducer,
    refreshSummary: state.refreshSummary.refresh
});

ObjectSummary.contextTypes = {
    intl: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(ObjectSummary);
