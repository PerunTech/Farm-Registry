import { React, connect, PropTypes, ExportableGrid, ComponentManager, GenericForm, axios, GridManager, elements, Loading } from 'perun-core'
const { alertUser } = elements
const { useState, useEffect } = React
import { labelsManager } from './utils_tools/LabelsExport'
import style from "./style/registration.module.css"
const Summary = (props, context) => {
    const [stateId, _setId] = useState(props.farmObjId)
    const [summaryArray, setSummaryArray] = useState([])

    useEffect(() => {
        getFarmSummary(stateId)
    }, [])
    useEffect(() => {
        if (stateId !== props.farmObjId) {
            getFarmSummary(props.farmObjId)
        }
    }, [props.farmObjId])

    const getFarmSummary = (id) => {
        let url = `${window.server}/mdfr/get-farm-summary/sessionId/${props.svSession}/farm-object-id/${id}`
        axios.get(url).then(res => {
            setSummaryArray(res.data.data)
        })
    }
    const generateSummaryItems = (arr) => {
        return arr.map((el, i) => (
            <>
                {i > 2 && <div key={el['ID']} id={el['ID']} className={`${style['summary-item-container']}`}>
                    <p className={style['summary-item-label']}>{el['label']} : </p>
                    <p className={style['summary-item-value']}>{el['value.display']}</p>
                </div >}
            </>
        ))
    }
    const generateSummaryHeader = (arr) => {
        return arr.map((el, i) => (
            <>
                {i <= 2 && <div key={el['ID']} id={el['ID']} className={`${style['summary-header-item-container']}`}>
                    <p className={style['summary-item-label']}>{el['label']} : </p>
                    <p className={style['summary-item-value']}> {el['value.display']}</p>
                </div >}
            </>
        ))
    }
    return (
        <React.Fragment>
            <div className={`${style['farm-registry-summary-container']} ${props.farmWrapper && style['summary-container-wrapper']}`}>
                <div className={style['summary-title']}>
                    <h3>{labelsManager.importLabel('summary', context, "farm_registry")}</h3>
                </div>
                {(summaryArray && summaryArray?.length > 0) ? <><div className={style['summary-header-container']}>{generateSummaryHeader(summaryArray)}</div>{generateSummaryItems(summaryArray)}</> : <p>{labelsManager.importLabel('summary_no_data', context, "farm_registry")}</p>}
            </div>
        </React.Fragment>
    )
}

const mapStateToProps = (state) => ({
    svSession: state.security.svSession,
    farmObjId: state['farm_registry.mapData']?.farmData?.objectId,
});

Summary.contextTypes = {
    intl: PropTypes.object.isRequired,
};
export default connect(mapStateToProps)(Summary);