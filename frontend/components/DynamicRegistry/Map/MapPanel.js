import { React, PropTypes, utils } from 'perun-core'
import * as atlas from 'perun-atlas'
import { ConfiguredMap } from 'perun-atlas'
const { labelsManager } = utils

/**
 * A `type: "map"` button, drawn.
 *
 * The map screen itself is perun-atlas's: it reads the button's
 * objectConfiguration, resolves the label codes, finds the session and draws the
 * panel. What is left here is the one thing that cannot live in that package --
 * whether that package arrived.
 *
 * perun-atlas is a UMD external: this bundle captures `window['perun-atlas']`
 * once, as it evaluates, and a named binding is a property read on that captured
 * value -- so testing a component throws in exactly the case worth testing for.
 * The namespace binding is that value, and is plainly `undefined` when it was
 * absent. Checking what was captured rather than what is on `window` also covers
 * the case `window` cannot: perun-atlas evaluating *after* this bundle leaves the
 * global set and every binding here undefined for the life of the page.
 */
const MapPanel = (props, context) => {
  /**
   * A label code, resolved, or nothing.
   *
   * `labelsManager` answers a missing key with the key's own message id, which
   * on screen reads as `perun.farm_registry.map_layer_unavailable` in the middle
   * of a sentence. Undefined instead, so the neutral wording below shows until
   * the label is registered.
   *
   * Nothing in this depends on perun-atlas: the resolver is perun-core's and the
   * context is the shell's, so the label is available in exactly the case this
   * component exists to report.
   */
  const getLabel = (code) => {
    if (!code) return undefined
    const value = labelsManager(code, context, 'farm_registry')
    return !value || value === `perun.farm_registry.${code}` ? undefined : value
  }

  if (!atlas) {
    return (
      <div className='farm-registry-map-unavailable'>
        {getLabel('map_layer_unavailable') ?? 'The map layer is not installed on this server.'}
      </div>
    )
  }

  return <ConfiguredMap {...props} labelDomain='farm_registry' />
}

MapPanel.contextTypes = {
  intl: PropTypes.object.isRequired,
}

export default MapPanel
