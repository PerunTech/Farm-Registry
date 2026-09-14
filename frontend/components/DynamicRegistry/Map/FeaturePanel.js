import { React } from 'perun-core'
import { AtlasMap, DateRange, FeatureSet, data } from 'perun-atlas'
const { useMemo, useState } = React

/**
 * A geometry set, with a date window over it.
 *
 * Deliberately knows nothing about what it is drawing. It fetches a service
 * path, draws whatever descriptors it is handed, and frames the result with a
 * title, a count, a date range and a footer. Everything with a domain in it --
 * what the features are called, which record the screen is about, which field
 * names it, what colour marks it -- arrives as a prop, so the next screen that
 * needs a map of something else needs no change here.
 *
 * Its stylesheet is not here: `atlas-panel.css` is a deployment asset, served
 * from aims-assets and listed in that repository's stylesheets.js, so the look
 * of every map screen can change without a bundle release. A deployment that
 * does not serve it draws this unstyled.
 *
 * Nothing in this file may name a table, a service, a field or a descriptor.
 * That is the whole point of it, and it is the property that lets this move into
 * perun-atlas unchanged when a second bundle wants it.
 *
 * @param {string} session      - Session the service is called with.
 * @param {string} servicePath  - Path with {token} placeholders.
 * @param {Object} context      - Extra values those placeholders resolve against.
 * @param {Object} descriptors  - Descriptor name to how it is drawn. Caller-owned.
 * @param {Object} [subject]    - The record the screen is about: { id, descriptor }.
 *                                Its descriptor is drawn instead of the
 *                                producer's, so the record stands out among the
 *                                features it arrived with.
 * @param {Array}  [presets]    - Quick ranges, [{ months, label }], longest last.
 * @param {Object} [labels]     - Every other piece of copy on the panel. Any key
 *                                left out falls back to neutral English, so an
 *                                unregistered label code is never shown.
 * @param {Object} [tokens]     - CSS custom properties for the panel's root:
 *                                '--ap-accent' and friends. This is how a screen
 *                                described entirely in configuration carries its
 *                                colours, with no stylesheet of its own.
 */

/** ISO yyyy-mm-dd, which is both what <input type="date"> speaks and what LocalDate.parse expects. */
const iso = (date) => date.toISOString().slice(0, 10)

const monthsAgo = (months) => {
  const date = new Date()
  date.setMonth(date.getMonth() - months)
  return iso(date)
}

const rangeOf = (months) => ({ from: monthsAgo(months), to: iso(new Date()) })

export const FeaturePanel = ({
  session,
  servicePath,
  context,
  descriptors,
  subject,
  presets = [],
  defaultMonths,
  labels = {},
  tokens,
  title,
  className = '',
  onClose
}) => {
  const initial = defaultMonths ?? presets[presets.length - 1]?.months ?? 12
  const [preset, setPreset] = useState(initial)
  const [range, setRange] = useState(() => rangeOf(initial))
  const [set, setSet] = useState(null)
  const [labelled, setLabelled] = useState(true)

  const bindings = useMemo(() => ({
    ...(context || {}),
    from: range.from,
    to: range.to
  }), [context, range.from, range.to])

  /**
   * The record on screen, drawn as itself.
   *
   * A service returns the record and whatever it relates to as one kind of
   * thing, because to the service that is what they are. Which of them the user
   * came from is the screen's knowledge, not the service's, so it is applied
   * here: the feature whose identity is the record's gets the caller's
   * descriptor, every other one keeps the one it arrived with.
   */
  const isSubject = (feature) => {
    if (subject?.id === null || subject?.id === undefined) return false
    const { id } = data.identityOf(feature)
    if (id === null || id === undefined) return false
    // Compared as text: an identity is a name, and the two sides reach here from
    // different places -- one decoded from the wire, one out of a configuration
    // -- so one of them being a number is not a difference.
    return String(id) === String(subject.id)
  }

  const descriptorFor = (feature) => (subject?.descriptor && isSubject(feature) ? subject.descriptor : null)

  const applyPreset = (months) => {
    setPreset(months)
    setRange(rangeOf(months))
    setSet(null)
  }

  const onRangeChange = (next) => {
    setPreset(null)
    setRange(next)
    setSet(null)
  }

  const empty = set !== null && (set.features?.length ?? 0) === 0

  /** Offering the longest range is only an offer while the range is shorter than it. */
  const longest = presets[presets.length - 1]

  return (
    <div
      className={`atlas-panel ${className}${labelled ? '' : ' atlas-panel--nolabels'}`.trim()}
      style={tokens}
    >
      <header className='atlas-panel__header'>
        <div className='atlas-panel__title'>{title}</div>
        {onClose && (
          <button
            type='button'
            className='atlas-panel__close'
            aria-label={labels.close ?? 'Close'}
            onClick={onClose}
          >
            ×
          </button>
        )}
      </header>

      <div className='atlas-panel__toolbar'>
        <DateRange
          from={range.from}
          to={range.to}
          onChange={onRangeChange}
          labels={{ from: labels.from, to: labels.to, invalidRange: labels.invalidRange }}
        />

        {presets.length > 0 && (
          <div className='atlas-panel__segmented'>
            {presets.map(({ months, label }) => (
              <button
                key={months}
                type='button'
                aria-pressed={preset === months}
                onClick={() => applyPreset(months)}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        <button
          type='button'
          className='atlas-panel__switch'
          aria-pressed={labelled}
          onClick={() => setLabelled(!labelled)}
        >
          <span className='atlas-panel__track'>
            <span className='atlas-panel__knob' />
          </span>
          {labels.labels ?? 'Labels'}
        </button>
      </div>

      <div className='atlas-panel__mapwrap'>
        <div className='atlas-panel__map'>
          <AtlasMap session={session}>
            <FeatureSet
              servicePath={servicePath}
              context={bindings}
              descriptors={descriptors}
              descriptorFor={descriptorFor}
              onLoad={(collection) => setSet(collection ?? { features: [] })}
              onError={() => setSet({ features: [] })}
            />
          </AtlasMap>
        </div>

        {empty && (
          <div className='atlas-panel__empty'>
            <div className='atlas-panel__emptycard'>
              <div className='atlas-panel__emptytitle'>{labels.empty ?? 'Nothing in this range'}</div>
              {labels.emptyHint && <div className='atlas-panel__emptybody'>{labels.emptyHint}</div>}
              {longest && preset !== longest.months && (
                <button
                  type='button'
                  className='atlas-panel__btn atlas-panel__btn--primary'
                  onClick={() => applyPreset(longest.months)}
                >
                  {[labels.widen ?? 'Try', longest.label].filter(Boolean).join(' ')}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <div className='atlas-panel__footer'>
        <div className='atlas-panel__summary'>{`${range.from} → ${range.to}`}</div>
        <div className='atlas-panel__actions'>
          <button
            type='button'
            className='atlas-panel__btn atlas-panel__btn--ghost'
            onClick={() => applyPreset(initial)}
          >
            {labels.reset ?? 'Reset range'}
          </button>
          {onClose && (
            <button
              type='button'
              className='atlas-panel__btn atlas-panel__btn--dark'
              onClick={onClose}
            >
              {labels.close ?? 'Close'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default FeaturePanel
