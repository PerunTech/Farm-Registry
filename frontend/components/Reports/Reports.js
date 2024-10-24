import {
    React,
    connect,
    PropTypes,
    axios,
    Loading
} from "perun-core";
import { labelsManager } from '../utils_tools/LabelsExport';
import { iconManager } from "../utils_tools/svgHolder";
const { useState, useEffect, useReducer } = React;

const Reports = (props, context) => {
    const [showSubReports, setShowSub] = useState(false)
    const [configuration, setConfig] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        getConfiguration()
    }, [])

    const getConfiguration = () => {
        setLoading(true)
        let url = window.server + `/custom-menu/get-configuration/sid/${props.svSession}/component-name/reports-menu/object-id/0/object-type/FARM`
        axios.get(url).then(res => {
            setLoading(false)
            setConfig(res.data)
        }).catch(err => {
            console.error(err)
            setLoading(false)
        })
    }


    const generateCustomButtons = () => {
        if (configuration && Array.isArray(configuration.data) && configuration.data?.length > 0) {
            return configuration.data.map(el => (
                <>
                    {el.data && <div className={`sidemenu-sub-item-active reports-active-menu`}>
                        {el.data.map(sub => {
                            return < button
                                className={`sidemenu-btn_sub`}
                                onClick={() => printReport(sub)}
                            >
                                <span className={'sidemenu-dynamic-comp-icon-holder'}>{iconManager.getIcon(sub.ID.replace(/\d/g, '').replace(/_$/, ''))}</span><p>{sub.label}</p>
                            </button>
                        })}
                    </div >}
                </>
            ));
        } else {
            return <><p className={'no-reports'}>   {labelsManager.importLabel(
                "no-reports",
                context,
                "farm_registry"
            )}</p></>;
        }
    }

    const printReport = (sub) => {
        let url = window.server + sub.onSubmit;
        window.open(url, '_blank');
    }

    return (
        <>
            {loading && <Loading />}
            <button
                className={`sidemenu-btn_sub initial-farm-registry-btns`}
                onClick={() => {
                    setShowSub(!showSubReports)
                }}
            >
                <span className={'reports-svg-holder'}>{iconManager.getIcon("PRINT_FARM")}</span>
                {labelsManager.importLabel(
                    "reports",
                    context,
                    "farm_registry"
                )}
            </button>
            {showSubReports && generateCustomButtons()}
        </>
    );
};

const mapStateToProps = (state) => ({
    svSession: state.security.svSession,
});
Reports.contextTypes = {
    intl: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(Reports);
