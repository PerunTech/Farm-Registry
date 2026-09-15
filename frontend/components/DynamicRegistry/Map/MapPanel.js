import { React, PropTypes, connect, utils } from 'perun-core'
import * as atlas from 'perun-atlas'
import FeaturePanel from './FeaturePanel'
const { labelsManager } = utils
const { useMemo } = React

/**
 * A `type: "map"` button, drawn.
 *
 * There is no component per map in this registry and there should not be: a map
 * button is a service path, a set of descriptors and some words, and all three
 * are configuration. This turns the button's objectConfiguration into the
 * panel's props and does nothing else, so a registry that grows a second map
 * grows a menu row rather than a file.
 *
 * The shape it reads, all of it optional but `service`:
 *
 *   service       '/WsSomething/get/{session}/{objectId}/{from}/{to}'
 *   context       extra placeholder values, resolved server-side per record
 *   descriptors   descriptor name to how it is drawn -- including `marker.style`
 *                 and `label.style`, which is how a look reaches the screen
 *                 without a stylesheet to name
 *   subject       { descriptor } drawn for the record the screen is about; its
 *                 id is the record's own
 *   presets       [{ months, label }], longest last; `label` is a label code
 *   defaultMonths which of them is selected when the panel opens
 *   labels        the rest of the copy, as label codes
 *   tokens        CSS custom properties: { "--ap-accent": "#6a1b9a", ... }
 *
 * The perun-atlas namespace is imported alongside the panel because it is the
 * only safe way to ask whether the layer arrived. perun-atlas is a UMD external:
 * this bundle captures `window['perun-atlas']` once, as it evaluates, and a
 * named binding is a property read on that captured value -- so testing a
 * component throws in exactly the case worth testing for. The namespace binding
 * is that value, and is plainly `undefined` when it was absent. Checking what
 * was captured rather than what is on `window` also covers the case `window`
 * cannot: perun-atlas evaluating *after* this bundle leaves the global set and
 * every binding here undefined for the life of the page.
 */
const MapPanel = (props, context) => {
  const { objConfig, objectId, session, title, onClose } = props

  /**
   * A label code, resolved, or nothing.
   *
   * `labelsManager` answers a missing key with the key's own message id, which
   * on screen reads as `perun.farm_registry.movements_places` in the middle of a
   * sentence. Undefined instead, so the panel's own neutral wording shows until
   * the label is registered.
   */
  const getLabel = (code) => {
    if (!code) return undefined
    const value = labelsManager(code, context, 'farm_registry')
    return !value || value === `perun.farm_registry.${code}` ? undefined : value
  }

  const bindings = useMemo(() => ({
    session,
    objectId,
    ...(objConfig?.context || {})
  }), [session, objectId, objConfig])

  const presets = useMemo(
    () => (objConfig?.presets || []).map(({ months, label }) => ({ months, label: getLabel(label) ?? `${months}` })),
    // getLabel closes over the intl context, which changes with the locale and
    // is not a value this can depend on; the configuration is what varies.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [objConfig]
  )

  if (!atlas) {
    return (
      <div className='farm-registry-map-unavailable'>
        {getLabel('map_layer_unavailable') ?? 'The map layer is not installed on this server.'}
      </div>
    )
  }

  const service = objConfig?.service

  if (!service) {
    return (
      <div className='farm-registry-map-unavailable'>
        {getLabel('map_service_missing') ?? 'This button has no map service configured.'}
      </div>
    )
  }

  const labels = objConfig?.labels || {}

  return (
    <FeaturePanel
      session={session}
      servicePath={service}
      context={bindings}
      descriptors={objConfig?.descriptors || {}}
      // Descriptors are handed over as configured, so their popup label codes
      // are resolved where every other code on this panel is.
      labelResolver={getLabel}
      subject={objConfig?.subject ? { ...objConfig.subject, id: objectId } : undefined}
      title={title}
      presets={presets}
      defaultMonths={objConfig?.defaultMonths}
      tokens={objConfig?.tokens}
      labels={{
        from: getLabel(labels.from),
        to: getLabel(labels.to),
        invalidRange: getLabel(labels.invalidRange),
        labels: getLabel(labels.labels),
        empty: getLabel(labels.empty),
        emptyHint: getLabel(labels.emptyHint),
        widen: getLabel(labels.widen),
        reset: getLabel(labels.reset),
        close: getLabel(labels.close)
      }}
      onClose={onClose}
    />
  )
}

MapPanel.contextTypes = {
  intl: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  session: state.security.svSession
})

export default connect(mapStateToProps)(MapPanel)
