import { React, axios, PropTypes } from 'perun-core'
import CustomButtons from './CustomButtons'
import ObjectStatistics from './ObjectStatistics'
const { useEffect, useState } = React

// A section's width as a percent of the row, e.g. 66. Defaults to the full row.
const sectionWidth = (width) => {
    const percent = parseFloat(width)
    return percent > 0 && percent <= 100 ? percent / 100 : 1
}

// Read-only label/value list (data.DETAILED) from the section's own service.
const SummaryList = ({ url }) => {
    const [rows, setRows] = useState([])
    useEffect(() => {
        if (!url) return
        axios.get(`${window.server}/${url.replace(/^\//, '')}`).then(res => setRows(res?.data?.data?.DETAILED || [])).catch(err => console.error(err))
    }, [url])
    return (
        <dl className="fr-details">
            {rows.map(({ label, value }) => (
                <React.Fragment key={label}>
                    <dt>{label}</dt>
                    <dd>{value ?? '—'}</dd>
                </React.Fragment>
            ))}
        </dl>
    )
}

// Audit entries ({ LABEL_TITLE, LABEL_TEXT }) from the section's own service, oldest first as returned.
const HistoryList = ({ url }) => {
    const [rows, setRows] = useState([])
    useEffect(() => {
        if (!url) return
        axios.get(`${window.server}/${url.replace(/^\//, '')}`).then(res => {
            const data = Array.isArray(res?.data) ? res.data : res?.data?.data
            setRows(Array.isArray(data) ? data : [])
        }).catch(err => console.error(err))
    }, [url])
    return (
        <ul className="fr-history">
            {rows.map((row, idx) => (
                <li key={idx}>
                    <div className="fr-history-title">{row.LABEL_TITLE}</div>
                    <div className="fr-history-text">{row.LABEL_TEXT}</div>
                </li>
            ))}
        </ul>
    )
}

const PageLayout = (props, context) => {
    // Titles and descriptions are label codes; a plain string falls through unchanged as its own default.
    const t = (code) => (code ? context.intl.formatMessage({ id: code, defaultMessage: code }) : code)
    const { header, sections } = props.configuration?.objectConfiguration || {}
    // Item counts a section reports about itself (an attachments section's files), shown in its header
    const [counts, setCounts] = useState({})
    const countLabel = (count) => count === 1
        ? `1 ${context.intl.formatMessage({ id: 'perun.farm_registry.attachments.count_one', defaultMessage: 'file' })}`
        : `${count} ${context.intl.formatMessage({ id: 'perun.farm_registry.attachments.count_other', defaultMessage: 'files' })}`

    return (
        <div className="fr-page">
            {header && (
                <div className="fr-page-header">
                    <div>
                        <h1 className="fr-page-title">{t(header.title)}</h1>
                        {header.description && <p className="fr-page-description">{t(header.description)}</p>}
                    </div>
                    {header.action && <button type="button" className="fr-btn fr-btn-primary">{t(header.action)}</button>}
                </div>
            )}
            <div className="fr-page-grid">
                {(sections || []).map(section => {
                    // The section ID names its grid, so it must be unique across pages; its table is
                    // section.tableName, or the ID itself when the two are the same
                    const configuration = section.objectConfiguration && { ID: `${section.ID}_${props.objectId}`, tableName: section.tableName || section.ID, objectConfiguration: section.objectConfiguration }
                    return (
                        <section key={section.ID} className="fr-page-section fr-col" style={{ '--fr-w': sectionWidth(section.width) }}>
                            {(section.title || section.badge || section.action) && (
                                <div className="fr-page-section-head">
                                    <div>
                                        {section.title && <h2 className="fr-page-section-title">{t(section.title)}</h2>}
                                        {section.description && <p className="fr-page-section-description">{t(section.description)}</p>}
                                    </div>
                                    {section.badge && <span className="fr-lock">{t(section.badge)}</span>}
                                    {counts[section.ID] !== undefined && <span className="fr-section-count">{countLabel(counts[section.ID])}</span>}
                                    {section.action && <button type="button" className="fr-btn fr-btn-primary">{t(section.action)}</button>}
                                </div>
                            )}
                            {section.type === 'summary' && <SummaryList url={section.url} />}
                            {section.type === 'history' && <HistoryList url={section.url} />}
                            {section.type === 'statistics' && <ObjectStatistics url={section.url} />}
                            {!['summary', 'history', 'statistics'].includes(section.type) && <CustomButtons
                                tableName={section.ID}
                                objectId={props.objectId}
                                appObjId={props.appObjId}
                                configuration={configuration}
                                getConfiguration={props.getConfiguration}
                                onSectionCount={(count) => setCounts(prev => (prev[section.ID] === count ? prev : { ...prev, [section.ID]: count }))}
                                inPage
                            />}
                        </section>
                    )
                })}
            </div>
        </div>
    )
}

PageLayout.contextTypes = {
    intl: PropTypes.object.isRequired,
}

export default PageLayout
