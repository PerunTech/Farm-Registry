import { React, axios } from 'perun-core'
import CustomButtons from './CustomButtons'
import { replaceAll } from './localMenus'
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

const PageLayout = (props) => {
    const { header, sections, vars: lateVars } = props.configuration?.objectConfiguration || {}
    const [fetched, setFetched] = useState({})
    const vars = { ...(props.vars || {}), ...fetched }

    // Some values (e.g. the holding's responsible person) are only known from the object itself:
    // `vars` maps a placeholder to { ws, field }, read once and substituted into the sections.
    useEffect(() => {
        Object.entries(lateVars || {}).forEach(([name, def]) => {
            axios.get(`${window.server}${replaceAll(def.ws, props.vars || {})}`).then(res => {
                const payload = res?.data?.formData ?? res?.data?.data ?? res?.data
                const value = payload?.[def.field]
                if (value !== undefined && value !== null) setFetched(prev => ({ ...prev, [name]: value }))
            }).catch(err => console.error(err))
        })
    }, [])

    // A section can depend on values only some objects have (e.g. a holding without a
    // responsible person); skip it when one of them was never filled in.
    const visible = (sections || []).filter(s => !(s.requires || []).some(key => vars[key] === undefined || vars[key] === null))

    return (
        <div className="fr-page">
            {header && (
                <div className="fr-page-header">
                    <div>
                        <h1 className="fr-page-title">{header.title}</h1>
                        {header.description && <p className="fr-page-description">{header.description}</p>}
                    </div>
                    {header.action && <button type="button" className="fr-btn fr-btn-primary">{header.action}</button>}
                </div>
            )}
            <div className="fr-page-grid">
                {visible.map(section => {
                    // The section id is the table name; the item's ID is that plus the object id
                    const configuration = section.objectConfiguration && replaceAll({ ID: `${section.id}_%OBJECT_ID%`, tableName: section.id, objectConfiguration: section.objectConfiguration }, vars)
                    return (
                        <section key={section.ID || section.id} className="fr-page-section fr-col" style={{ '--fr-w': sectionWidth(section.width) }}>
                            {(section.title || section.badge || section.action) && (
                                <div className="fr-page-section-head">
                                    <div>
                                        {section.title && <h2 className="fr-page-section-title">{section.title}</h2>}
                                        {section.description && <p className="fr-page-section-description">{section.description}</p>}
                                    </div>
                                    {section.badge && <span className="fr-lock">{section.badge}</span>}
                                    {section.action && <button type="button" className="fr-btn fr-btn-primary">{section.action}</button>}
                                </div>
                            )}
                            {section.type === 'summary'
                                ? <SummaryList url={replaceAll(section.url, vars)} />
                                : <CustomButtons
                                    tableName={section.id}
                                    objectId={props.objectId}
                                    appObjId={props.appObjId}
                                    configuration={configuration}
                                    getConfiguration={props.getConfiguration}
                                />}
                        </section>
                    )
                })}
            </div>
        </div>
    )
}

export default PageLayout
