import { React, PropTypes, connect, utils } from 'perun-core'
import * as atlas from 'perun-atlas'
import { AtlasMap, DateRange, FeatureSet, data } from 'perun-atlas'
import { MOVEMENT_DESCRIPTORS, MOVEMENT_HOLDING_CURRENT } from './movementDescriptors'
const { labelsManager } = utils
const { useMemo, useState } = React

/**
 * The map layer, as ordinary imports now that a jar declaring perun-atlas in
 * dependencies() ships beside this module.
 *
 * The namespace comes in alongside the components because it is the only safe
 * way to ask whether the layer arrived. perun-atlas is a UMD external: this
 * bundle captures `window['perun-atlas']` once, as it evaluates, and a named
 * binding is a property read on that captured value -- so testing `AtlasMap`
 * throws in exactly the case worth testing for. The namespace binding is that
 * value, and is plainly `undefined` when it was absent.
 *
 * Checking what was captured rather than what is on `window` also covers the
 * case `window` cannot: perun-atlas evaluating *after* this bundle leaves the
 * global set and every binding here undefined for the life of the page.
 *
 * Note that webpack cannot verify these names. An external's exports are
 * unknown to it, and a fabricated one compiles without so much as a warning --
 * measured, not assumed. What this buys is readable imports, not checking.
 */

/** ISO yyyy-mm-dd, which is both what <input type="date"> speaks and what LocalDate.parse expects. */
const iso = (date) => date.toISOString().slice(0, 10)

const monthsAgo = (months) => {
  const date = new Date()
  date.setMonth(date.getMonth() - months)
  return iso(date)
}

/**
 * Movements for the record on screen.
 *
 * The places and the transfers between them arrive as one geobuf set; perun-atlas
 * decodes and draws it. This component's job is the date window and turning the
 * button configuration into a service path — it imports no map engine, and should
 * not need to.
 *
 * The service path and any record-specific values come from the button's
 * objectConfiguration, so the same component serves every movements endpoint:
 *
 *   service: '/WsAims/getMovements/.../{session}/{objectId}/{from}/{to}'
 *   context: { ... }      // extra placeholders, resolved server-side per record
 *
 * `session`, `objectId` and the two dates are filled in here; everything else
 * comes from `context`.
 */
const MovementsMap = (props, context) => {
  const { objConfig, objectId, session } = props
  const [range, setRange] = useState(() => ({ from: monthsAgo(12), to: iso(new Date()) }))
  const [found, setFound] = useState(null)

  const getLabel = (key) => labelsManager(key, context, 'farm_registry')

  const bindings = useMemo(() => ({
    session,
    objectId,
    ...(objConfig?.context || {}),
    from: range.from,
    to: range.to
  }), [session, objectId, objConfig, range.from, range.to])

  if (!atlas) {
    return (
      <div className='farm-registry-movements-unavailable'>{getLabel('map_layer_unavailable')}</div>
    )
  }

  const service = objConfig?.service

  /**
   * The record on screen, drawn as itself.
   *
   * The service returns the holding and its trading partners as one kind of
   * place, because to the service that is what they are. Which of them the user
   * came from is this component's knowledge, not the service's, so it is applied
   * here: the feature whose identity is the record's gets its own descriptor,
   * every other one keeps the one it arrived with.
   */
  const descriptorFor = (feature) => {
    const { id } = data.identityOf(feature)
    if (id === null || objectId === null || objectId === undefined) return null
    // Compared as text: an identity is a name, and the two sides reach here from
    // different places -- one decoded from the wire, one out of a button's
    // configuration -- so one of them being a number is not a difference.
    return String(id) === String(objectId) ? MOVEMENT_HOLDING_CURRENT : null
  }

  if (!service) {
    return (
      <div className='farm-registry-movements-unavailable'>{getLabel('movements_service_missing')}</div>
    )
  }

  return (
    <div className='farm-registry-movements'>
      <DateRange
        from={range.from}
        to={range.to}
        onChange={setRange}
        labels={{
          from: getLabel('movements_from'),
          to: getLabel('movements_to'),
          invalidRange: getLabel('movements_invalid_range')
        }}
      />
      <div className='farm-registry-movements-map'>
        <AtlasMap session={session}>
          <FeatureSet
            servicePath={service}
            context={bindings}
            descriptors={MOVEMENT_DESCRIPTORS}
            descriptorFor={descriptorFor}
            onLoad={(collection) => setFound(collection?.features?.length ?? 0)}
            onError={() => setFound(0)}
          />
        </AtlasMap>
      </div>
      {found === 0 && (
        <p className='farm-registry-movements-empty'>{getLabel('movements_none_in_range')}</p>
      )}
    </div>
  )
}

MovementsMap.contextTypes = {
  intl: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  session: state.security.svSession
})

export default connect(mapStateToProps)(MovementsMap)
