import { React, PropTypes, connect, utils } from "perun-core";
import * as atlas from 'perun-atlas';
import { AtlasMap, PointPicker } from 'perun-atlas';
const { labelsManager } = utils
const { useState } = React;

/**
 * Its stylesheet is `atlas-panel.css`, a deployment asset served from
 * aims-assets rather than bundled here.
 *
 * The map layer, as ordinary imports. See MapPanel for why the namespace is
 * imported next to the components: perun-atlas is a UMD external, so a named
 * binding is a property read on a value captured at evaluation and testing one
 * throws when it is absent, while the namespace is simply `undefined`. A crash
 * here would take the holding form with it, so it is worth the extra import.
 */

// The zoom this screen has always opened at, kept as an override because it is
// tighter than the deployment's default: a coordinate is picked on a yard, not
// chosen from a view of the whole country.
const PICK_ZOOM = 10

const GpsMapSelect = (props, context) => {
    // Clicked position in decimal degrees, null until the user picks one
    const [selected, setSelected] = useState(null)
    // EPSG code the database stores geometry in (sys.gis.default_srid), as
    // perun-atlas resolved it for this map. Falls back to the schema default.
    const [dataSrid, setDataSrid] = useState(atlas?.config?.SCHEMA?.dataSrid?.default)

    const getLabel = (key) => labelsManager(key, context, 'farm_registry')

    const toDMS = (deg) => {
        const d = String(Math.floor(deg)).padStart(2, '0');
        const m = String(Math.floor((deg - d) * 60)).padStart(2, '0');
        const s = String(Math.round((deg - d - m / 60) * 3600)).padStart(2, '0');
        return `${d}°${m}'${s}''`;
    }

    const confirmSelection = () => {
        if (!selected) return
        props.handleMapClick(
            toDMS(Math.abs(selected.lat)),
            toDMS(Math.abs(selected.lng)),
            { lat: selected.lat, lng: selected.lng, srid: dataSrid }
        )
    }

    if (!atlas) {
        return (
            <div className={'farm-registry-map-unavailable'}>{getLabel('map_layer_unavailable')}</div>
        )
    }

    return (
        <>
            <div className={'gps-select-bar'}>
                {selected ? (
                    <div className={'gps-select-coords'}>
                        <span>
                            <b>{labelsManager('gps_north', context, 'farm_registry')}</b>
                            {toDMS(Math.abs(selected.lat))}
                        </span>
                        <span>
                            <b>{labelsManager('gps_east', context, 'farm_registry')}</b>
                            {toDMS(Math.abs(selected.lng))}
                        </span>
                    </div>
                ) : (
                    <span className={'gps-select-hint'}>
                        {labelsManager('click_map_to_select', context, 'farm_registry')}
                    </span>
                )}
                <button
                    type={'button'}
                    className={'gps-select-confirm'}
                    disabled={!selected}
                    onClick={confirmSelection}
                >
                    {labelsManager('confirm_selected_coords', context, 'farm_registry')}
                </button>
            </div>
            {/* The container is what gives the map its height (75vh, from the
                deployment's farm-registry stylesheet); AtlasMap fills it. */}
            <div className={'holding-map-container'}>
                <AtlasMap session={props.session} overrides={{ zoom: PICK_ZOOM }} layerSwitcher
                    onReady={({ config }) => config?.dataSrid && setDataSrid(config.dataSrid)}>
                    <PointPicker value={selected} onChange={setSelected} />
                </AtlasMap>
            </div>
        </>
    );
};

GpsMapSelect.contextTypes = {
    intl: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    session: state.security.svSession,
})

export default connect(mapStateToProps)(GpsMapSelect)
