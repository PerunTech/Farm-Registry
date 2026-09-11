import './movements.css'

/**
 * How a movement set is drawn.
 *
 * These names are the descriptors the movements service stamps on each geometry,
 * and the label field is this registry's own. They live here rather than in
 * perun-atlas because that package is shared by every bundle that draws a map
 * and must not know what any of them are about — it takes a descriptor map as a
 * prop and draws whatever it is handed.
 *
 * Harvested from the legacy GIS module's descriptor block, with two changes.
 *
 * The legacy line was white with a dark `pulseColor`, because it was an AntPath —
 * an animated dash that reads as white-over-dark while it runs. spatial does not
 * bundle AntPath, and a static white line is invisible on every basemap in
 * GEO_LAYER_TYPE, so the accent colour becomes the line and direction is carried
 * by arrowheads instead.
 *
 * The holding marker was an extra-markers `home` glyph. spatial styles its
 * markers with `divIcon` and CSS, so this names a class and leaves the drawing to
 * the stylesheet beside it.
 */

export const MOVEMENT_ACCENT = '#00360e'

/**
 * The descriptor for the holding whose record is open.
 *
 * Not one of the service's own names -- the movements service stamps every place
 * in the set `MOVEMENT_HOLDING`, which is correct about the data and cannot know
 * which of them the user is looking at. `FeatureSet`'s `descriptorFor` supplies
 * that, and it resolves to this entry.
 */
export const MOVEMENT_HOLDING_CURRENT = 'MOVEMENT_HOLDING_CURRENT'

export const MOVEMENT_DESCRIPTORS = {
  MOVEMENT_HOLDING: {
    marker: { className: 'movement-holding-marker', size: 24 },
    label: {
      field: 'PIC',
      scale: { min: 12, max: 23 }
    }
  },

  [MOVEMENT_HOLDING_CURRENT]: {
    marker: { className: 'movement-holding-marker movement-holding-current', size: 32 },
    label: {
      field: 'PIC',
      className: 'movement-holding-current-label',
      // Wider than the others. The set is framed to fit every place in it, which
      // for a holding that trades across the country lands below the band where
      // the rest of the labels appear -- and this is the one label worth reading
      // at that zoom, because it says which dot the screen is about.
      scale: { min: 6, max: 23 }
    }
  },

  MOVEMENT_LINE: {
    style: {
      weight: 3,
      color: MOVEMENT_ACCENT,
      opacity: 1,
      fillOpacity: 0,
      lineCap: 'round',
      lineJoin: 'round'
    },
    arrow: { pixelSize: 12, repeat: 160 }
  }
}
