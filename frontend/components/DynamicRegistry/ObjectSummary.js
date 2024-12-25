import { React, connect, PropTypes, Loading, axios, elements, createHashHistory, redux } from "perun-core";
import { getMainLabel } from '../utils_tools/LabelsExport';
const { useEffect, useState } = React;
const { ReactBootstrap, alertUser } = elements;
const { Modal } = ReactBootstrap;
const { store } = redux
const hashHistory = createHashHistory();
const ObjectSummary = (props, context) => {
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const [menuData, setMenuData] = useState([]);
    const [modalData, setModalData] = useState([]);

    useEffect(() => {
        getObjectSummary();
    }, []);

    const getObjectSummary = () => {
        setLoading(true);
        const url = `${window.server}/WsAims/getObjectSummary/${props.svSession}/${props.tableName}/${props.objectId}`;
        axios.get(url)
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
                        {modalData.length > 0 && (
                            <button
                                className="farm-registry-object-summary-show-more"
                                onClick={() => setShow(true)}
                            >
                                {getMainLabel('show_more', context)}
                            </button>
                        )}
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
});

ObjectSummary.contextTypes = {
    intl: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(ObjectSummary);
