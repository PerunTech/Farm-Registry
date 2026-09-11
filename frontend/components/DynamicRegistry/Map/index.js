/**
 * Everything on this screen that draws a map.
 *
 * Two components with nothing in common but the layer they are built on: a
 * movements map opened from a button, and a coordinate picker embedded in the
 * holding form. They live together because the map is the part worth finding in
 * one place -- the descriptors, the stylesheets and the perun-atlas import all
 * sit beside them rather than being scattered through the registry.
 *
 * The descriptors are deliberately not re-exported. They say how this screen's
 * geometry is drawn and are an argument to FeatureSet, not an interface for the
 * rest of the module.
 */
export { default as MovementsMap } from './MovementsMap'
export { default as GpsMapSelect } from './GpsMapSelect'
