import { React, redux, PropTypes, Loading, axios, connect, elements, utils } from "perun-core";
const { labelsManager } = utils
const { alertUserResponse } = elements
const { useEffect, useState, useRef } = React;
const { store } = redux;
import { ui, core } from '../Map/Spatial';
const { Map, factory } = core;
import { id, center, zoomLevel } from '../Map/config';

// The pin dropped on the clicked location. Drawn as an inline svg inside a divIcon so it
// carries no image path - the default leaflet marker resolves its png through the spatial
// package css, which does not survive bundling.
// Rendered smaller than its viewBox, so the stroke and the inner dot scale down with it
const pinIcon = factory.divIcon({
    className: 'gps-pin',
    iconSize: [20, 28],
    // Anchor on the tip of the teardrop, so the point sits on the actual coordinate
    iconAnchor: [10, 28],
    html: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="28" viewBox="0 0 26 36">
             <path d="M13 0C5.82 0 0 5.82 0 13c0 9.75 13 23 13 23s13-13.25 13-23C26 5.82 20.18 0 13 0z"
                   fill="#4a6a85" stroke="#ffffff" stroke-width="1.75"/>
             <circle cx="13" cy="13" r="4" fill="#ffffff"/>
           </svg>`
})

const GpsMapSelect = (props, context) => {
    // Holds the rendered spatial root. Built once, because the builder methods below
    // (addRasterLayers) add a new control to the map every time they run.
    const [mapElement, setMapElement] = useState(null)
    // Clicked position in decimal degrees, null until the user picks one
    const [selected, setSelected] = useState(null)
    const pinRef = useRef(null)

    useEffect(() => {
        const layersToRemove = [];
        Map.eachLayer(function(layer) {
            layersToRemove.push(layer);
        });
        layersToRemove.forEach(layer => Map.removeLayer(layer));

        Map.on('click', handleMapClick);

        getGeoTypeLayers().then(({ basemap, overlays }) => {
            const firstGroup = Object.values(basemap)[0]
            const firstLayer = firstGroup && Object.values(firstGroup)[0]
            if (firstLayer) firstLayer.addTo(Map)
            Map.setView(center, zoomLevel);
            setMapElement(
                ui.init(store.getState().security.svSession)
                    .addRasterLayers(basemap, overlays, { collapsed: true })
                    .render(id, true)
            )
        })
        return () => {
            Map.off('click', handleMapClick)
            // The map is a singleton shared with the rest of the app, take the pin with us
            if (pinRef.current) {
                Map.removeLayer(pinRef.current)
                pinRef.current = null
            }
        };
    }, [])

    const getGeoTypeLayers = () => {
        const basemap = {}
        const overlays = {}
        const tableName = 'GEO_LAYER_TYPE'
        const url = `${window.server}/ReactElements/getTableData/${props.session}/${tableName}/0`
        return axios.get(url).then(res => {
            if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
                res.data.forEach(geoTypeLayer => {
                    const layerType = geoTypeLayer?.[`${tableName}.LAYER_TYPE`]
                    const layerProtocol = geoTypeLayer?.[`${tableName}.PROTOCOL`]
                    const version = geoTypeLayer?.[`${tableName}.VERSION`] || '1.1.1'
                    const format = geoTypeLayer?.[`${tableName}.FORMAT`] || 'image/png'
                    const layerUrl = geoTypeLayer?.[`${tableName}.URL`]
                    const layerGroup = geoTypeLayer?.[`${tableName}.LAYER_GROUP`] || 'Other'
                    const title = geoTypeLayer?.[`${tableName}.TITLE`]
                    const labelCode = geoTypeLayer?.[`${tableName}.LABEL_CODE`] || title
                    let tileLayer
                    if (layerProtocol?.toLowerCase() === 'wms') {
                        const tileLayerOptions = {
                            layers: title,
                            format,
                            transparent: true,
                            uppercase: true,
                            version,
                            // If the layer is an overlay, set the tiled property for it
                            ...layerType === '2' && { tiled: true },
                            // If the layer is an overlay, mark it as so
                            ...layerType === '2' && { isOverlay: true }
                        }
                        const geoService = layerUrl || server
                        tileLayer = factory.tileLayer.extendedWMS(geoService, tileLayerOptions)
                    } else if (layerProtocol?.toLowerCase() === 'tile') {
                        const geoService = layerUrl || server
                        tileLayer = factory.tileLayer(geoService)
                    }
                    // Set the basemap layers
                    if (layerType === '1') {
                        if (!basemap[layerGroup]) {
                            basemap[layerGroup] = {}
                        }
                        Reflect.set(basemap[layerGroup], labelCode, tileLayer)
                        // Set the overlays
                    } else if (layerType === '2') {
                        if (!overlays[layerGroup]) {
                            overlays[layerGroup] = {}
                        }
                        Reflect.set(overlays[layerGroup], labelCode, tileLayer)
                    }
                })
            }
            return { basemap, overlays }
        }).catch(err => {
            console.error(err)
            alertUserResponse({ response: err })
            return { basemap, overlays }
        })
    }

    const toDMS = (deg) => {
        const d = String(Math.floor(deg)).padStart(2, '0');
        const m = String(Math.floor((deg - d) * 60)).padStart(2, '0');
        const s = String(Math.round((deg - d - m / 60) * 3600)).padStart(2, '0');
        return `${d}°${m}'${s}''`;
    }

    // Drops the pin, or moves it if one is already on the map. Keeps the raw click
    // position - rounding to whole seconds first would visibly shift the pin.
    const dropPin = (latlng) => {
        if (pinRef.current) {
            pinRef.current.setLatLng(latlng)
        } else {
            pinRef.current = factory.marker(latlng, { icon: pinIcon, draggable: true }).addTo(Map)
            pinRef.current.on('drag', (e) => setSelected({ ...e.target.getLatLng() }))
        }
        setSelected({ lat: latlng.lat, lng: latlng.lng })
    }

    const handleMapClick = (e) => {
        dropPin(e.latlng)
    };

    const confirmSelection = () => {
        if (!selected) return
        props.handleMapClick(toDMS(Math.abs(selected.lat)), toDMS(Math.abs(selected.lng)))
    }

    if (!mapElement) return <Loading />

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
            <div className={'holding-map-container'}>
                {mapElement}
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
