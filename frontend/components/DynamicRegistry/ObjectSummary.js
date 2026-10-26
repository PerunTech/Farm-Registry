import { React, connect, PropTypes, Loading, axios, elements, createHashHistory, redux, ReactDOM, utils } from "perun-core";
const { labelsManager } = utils
const { useEffect, useState } = React;
const { alertUserResponse, alertUserV2, Icon } = elements;
const { store } = redux
const hashHistory = createHashHistory();
// Summary layout: how many meta fields sit on the status line (the rest are listed below it),
// and whether the title or the first meta value is the copyable identifier
const INLINE_META_COUNT = 2
const COPY_TITLE = false
const ObjectSummary = (props, context) => {
    const [loading, setLoading] = useState(false);
    const [menuData, setMenuData] = useState([]);
    const [actions, setActions] = useState([])
    const [importUrl, setImportUrl] = useState(undefined)
    useEffect(() => {
        props?.configuration.map(el => {
            if (el.ID.toUpperCase().includes('SUMMARY')) {
                getObjectSummary(el.url);
            }
        })
    }, []);

    useEffect(() => {
        if (props.refreshSummary) {
            props?.configuration.map(el => {
                if (el.ID.toUpperCase().includes('SUMMARY')) {
                    getObjectSummary(el.url);
                    store.dispatch({ type: 'SAVE', payload: { key: 'refreshSummary', value: false } })
                    store.dispatch({ type: 'SAVE', payload: { key: 'refreshSideMenu', value: true } })
                }
            })
        }
    }, [props.refreshSummary]);

    const getObjectSummary = (url) => {
        setLoading(true);
        axios.get(`${window.server}/${url}`)
            .then(res => {
                setLoading(false);
                if (res?.data) {
                    const resType = res.data?.type?.toLowerCase();
                    if (resType === 'error') {
                        alertUserResponse({ response: res.data });
                    } else {
                        setMenuData(res.data?.data?.SHORT || []);
                        setActions(res.data?.data?.ACTIONS || [])
                        setImportUrl(res.data?.data?.IMPORT?.[0]['import'] || undefined)
                    }
                }
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
                alertUserResponse({ response: err });
            });
    };
    const backButtonFunction = () => {
        if (props?.businessLogicReducer?.['farm-registry-route']) {
            hashHistory.push(props?.businessLogicReducer?.['farm-registry-route'])
            store.dispatch({ type: 'SAVE', payload: { key: 'farm-registry-route', value: '' } })
        } else {
            hashHistory.push('/main/farm-registry')
        }
    }

    const [statusField, titleField, ...metaFields] = menuData.filter(({ value }) => value !== undefined && value !== null && String(value).trim() !== '')
    const inlineFields = metaFields.slice(0, INLINE_META_COUNT)
    const extraFields = metaFields.slice(INLINE_META_COUNT)
    const [copied, setCopied] = useState(false)

    const copyValue = (value) => {
        const text = String(value)
        const onCopied = () => {
            setCopied(true)
            setTimeout(() => setCopied(false), 1500)
        }
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(onCopied)
            return
        }
        // The Clipboard API only exists on https / localhost, so plain-http deployments copy via a hidden textarea
        const textarea = document.createElement('textarea')
        textarea.value = text
        textarea.setAttribute('readonly', '')
        textarea.style.position = 'fixed'
        textarea.style.opacity = '0'
        document.body.appendChild(textarea)
        textarea.select()
        const succeeded = document.execCommand('copy')
        document.body.removeChild(textarea)
        if (succeeded) onCopied()
    }

    const generateMenuData = () => {
        return (
            <>
            <div className='farm-registry-summary-flat-meta'>
                {statusField && <span className='farm-registry-summary-flat-status' data-status={statusField.value} title={statusField.label}>{statusField.value}</span>}
                {inlineFields.map(({ label, value }, i) => (
                    <React.Fragment key={label}>
                        {(statusField || i > 0) && <span className='farm-registry-summary-flat-sep' aria-hidden='true'>·</span>}
                        {i === 0 && !COPY_TITLE
                            ? <button
                                className='farm-registry-summary-flat-meta-item'
                                title={`${label}: ${value}`}
                                aria-label={`${label}: ${value}`}
                                onClick={() => copyValue(value)}
                            >
                                <span>{value}</span>
                                <Icon name={copied ? 'IconCheck' : 'IconCopy'} />
                            </button>
                            : <span className='farm-registry-summary-flat-meta-item' title={`${label}: ${value}`}>{value}</span>}
                    </React.Fragment>
                ))}
            </div>
            {extraFields.length > 0 && (
                <div className='farm-registry-object-summary-rows-container'>
                    {extraFields.map(({ label, value }) => (
                        <div className='farm-registry-object-summary-row' key={label}>
                            <p>{label}</p>
                            <p title={value}>{value}</p>
                        </div>
                    ))}
                </div>
            )}
            </>
        )
    }

    const updateData = () => {
        const onConfirm = () => {
            setLoading(true)
            const url = `${window.server}${importUrl}`
            axios.get(url).then(res => {
                setLoading(false)
                if (res?.data) {
                    alertUserResponse({ response: res.data })
                }
            }).catch(err => {
                setLoading(false)
                console.error(err)
                alertUserResponse({ response: err })
            });
        }
        alertUserV2({
            type: 'info',
            title: labelsManager('confirm_update_action', context, 'farm_registry'),
            message: labelsManager('confirm_update_action_msg', context, 'farm_registry'),
            confirmButtonText: labelsManager('yes', context, 'farm_registry'),
            onConfirm,
            showCancel: true,
            cancelButtonText: labelsManager('no', context, 'farm_registry')
        })
    }

    const generateSummaryActions = () => {
        return actions?.map((el, i) => (
            <button
                key={`${props.tableName}_${props.objectId}_ACTION_${i + 1}`}
                className="farm-registry-object-summary-show-more farm-registry-object-summary-btn-action"
                onClick={() => summaryAction(el.onSubmit)}
            >
                {el.label}
            </button>
        ))
    }

    const generateCheckList = (data) => {
        const customElement = document.createElement('div');
        ReactDOM.render(
            <div className='farm-registry-alert'>
                <div className='farm-registry-alert-title'><p>{labelsManager('alert-title', context, 'farm_registry')}</p></div>
                <div className='farm-registry-alert-fields'>
                    {data['FIELDS'].map((el, index) => (
                        <div className='farm-registry-alert-field' key={index}>
                            <>                         <div className='farm-registry-alert-field-icon'>{!el.value ? <Icon name="IconX" /> : <Icon name="IconCheck" />}</div>
                                <p>{el.label}</p></>
                        </div>
                    ))}
                </div>
            </div>,
            customElement
        );
        alertUserV2({
            html: customElement,
            allowOutsideClick: true,
        });
        store.dispatch({ type: 'SAVE', payload: { key: 'refreshSummary', value: true } })
        store.dispatch({ type: 'SAVE', payload: { key: 'refreshSideMenu', value: true } })
    }

    const summaryAction = (url) => {
        setLoading(true);

        axios.get(`${window.server + url}`)
            .then(res => {
                setLoading(false);
                if (res?.data?.data) {
                    const data = JSON.parse(res.data.data);
                    data?.['FIELDS'] ? generateCheckList(data) : () => { }
                } else {
                    alertUserResponse({ response: res })
                    store.dispatch({ type: 'SAVE', payload: { key: 'refreshSummary', value: true } })
                    store.dispatch({ type: 'SAVE', payload: { key: 'refreshSideMenu', value: true } })
                }

            })
            .catch(err => {
                setLoading(false);
                alertUserResponse({ response: err });
            });
    };


    return (
        <>
            {loading && <Loading />}
            <div className="farm-registry-summary-flat">
                <div className="farm-registry-summary-flat-top">
                    <button
                        className='farm-registry-summary-flat-icon-btn farm-registry-summary-flat-back'
                        title={labelsManager('back', context, 'farm_registry')}
                        aria-label={labelsManager('back', context, 'farm_registry')}
                        onClick={() => backButtonFunction()}
                    >
                        <Icon name='IconChevronLeft' />
                    </button>
                    {statusField && <span className='farm-registry-summary-flat-dot' data-status={statusField.value} title={`${statusField.label}: ${statusField.value}`} />}
                    {COPY_TITLE && titleField
                        ? <button
                            className='farm-registry-summary-flat-title'
                            title={`${titleField.label}: ${titleField.value}`}
                            aria-label={`${titleField.label}: ${titleField.value}`}
                            onClick={() => copyValue(titleField.value)}
                        >
                            <span>{titleField.value}</span>
                            <Icon name={copied ? 'IconCheck' : 'IconCopy'} />
                        </button>
                        : <span className='farm-registry-summary-flat-title' title={titleField?.value}>{titleField?.value}</span>}
                    <button
                        title={labelsManager(props.toggledMenu ? 'expand' : 'collapse', context, 'general')}
                        aria-label={labelsManager(props.toggledMenu ? 'expand' : 'collapse', context, 'general')}
                        className='farm-registry-summary-flat-icon-btn aims-registry-collapse'
                        onClick={() => props.toggleSideMenu()}
                    >
                        <Icon name='IconChevronsLeft' />
                    </button>
                </div>
                {menuData.length > 0 && (
                    <>
                        {generateMenuData()}
                        <div className='farm-registry-summary-flat-actions'>
                            {importUrl && <button className={`update-farm-btn`} onClick={() => updateData()}><span className={`update-farm-btn-container`}>{labelsManager("update_data_btn", context, 'farm_registry')} <span className={`update-farm-btn-icon`}>{<Icon name="IconReload" />}</span></span></button>}
                            {actions && generateSummaryActions()}
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

const mapStateToProps = (state) => ({
    svSession: state.security.svSession,
    businessLogicReducer: state.businessLogicReducer,
    refreshSummary: state.businessLogicReducer?.refreshSummary
});

ObjectSummary.contextTypes = {
    intl: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(ObjectSummary);
