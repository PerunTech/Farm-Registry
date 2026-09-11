import { React, PropTypes, connect, utils } from "perun-core";
import './GpsMapSelect.css';
const { labelsManager } = utils
const { useState } = React;

/**
 * perun-atlas, read when the map is drawn rather than when this bundle loads.
 *
 * Same reasoning as the movements map: a static import binds through the UMD
 * wrapper as this bundle evaluates, and the shell decides when the sibling
 * plugin runs. Swap both for static imports once a jar declaring perun-atlas in
 * dependencies() is deployed everywhere.
 */
const atlas = () => (typeof window === 'undefined' ? null : window['perun-atlas'] || null)

// The zoom this screen has always opened at, kept as an override because it is
// tighter than the deployment's default: a coordinate is picked on a yard, not
// chosen from a view of the whole country.
const PICK_ZOOM = 10

const GpsMapSelect = (props, context) => {
    // Clicked position in decimal degrees, null until the user picks one
    const [selected, setSelected] = useState(null)

    const getLabel = (key) => labelsManager(key, context, 'farm_registry')

    const toDMS = (deg) => {
        const d = String(Math.floor(deg)).padStart(2, '0');
        const m = String(Math.floor((deg - d) * 60)).padStart(2, '0');
        const s = String(Math.round((deg - d - m / 60) * 3600)).padStart(2, '0');
        return `${d}°${m}'${s}''`;
    }

    const confirmSelection = () => {
        if (!selected) return
        props.handleMapClick(toDMS(Math.abs(selected.lat)), toDMS(Math.abs(selected.lng)))
    }

    const mapLayer = atlas()
    if (!mapLayer) {
        return (
            <div className={'farm-registry-map-unavailable'}>{getLabel('map_layer_unavailable')}</div>
        )
    }

    const { AtlasMap, PointPicker } = mapLayer

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
                <AtlasMap session={props.session} overrides={{ zoom: PICK_ZOOM }} layerSwitcher>
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
