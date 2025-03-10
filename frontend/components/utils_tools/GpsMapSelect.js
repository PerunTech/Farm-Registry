import { React, redux, PropTypes, elements } from 'perun-core';
const { alertUserV2 } = elements
const { useEffect } = React;
const { store } = redux;
import { ui, core } from '../Map/Spatial';
const { Map } = core;
import { id, center, zoomLevel, layerList } from '../Map/config';
import { labelsManager } from '../utils_tools/LabelsExport';

const GpsMapSelect = (props, context) => {

    useEffect(() => {
        Map.setView(center, zoomLevel);
        Map.on('click', handleMapClick);
        return () => {
            Map.off('click', handleMapClick)
        };
    }, [])

    const handleMapClick = (e) => {
        const lat = Number(e.latlng.lat.toFixed(4));
        const lng = Number(e.latlng.lng.toFixed(4));

        alertUserV2({
            type: 'info',
            title: `${labelsManager.importLabel('confirm_selected_coords', context, 'farm_registry')}`,
            message: `${labelsManager.importLabel('gps_north', context, 'farm_registry')} ${toDMS(Math.abs(lat))}\n,${labelsManager.importLabel('gps_east', context, 'farm_registry')} ${toDMS(Math.abs(lng))}`,
            onConfirm: () => props.handleMapClick(toDMS(Math.abs(lat)), toDMS(Math.abs(lng))),
            showCancel: true,
            cancelButtonText: `${labelsManager.importLabel('cancel', context, 'farm_registry')}`
        })
    };

    function toDMS(deg) {
        const d = String(Math.floor(deg)).padStart(2, '0');
        const m = String(Math.floor((deg - d) * 60)).padStart(2, '0');
        const s = String(Math.round((deg - d - m / 60) * 3600)).padStart(2, '0');
        return `${d}°${m}'${s}''`;
    }

    return (
        <div className={'holding-map-container'}>
            {ui.init(store.getState().security.svSession)
                .addRasterLayers(layerList[0], layerList[1], { collapsed: true })
                .render(id, true)}

        </div>
    );
};

GpsMapSelect.contextTypes = {
    intl: PropTypes.object.isRequired
};


export default GpsMapSelect;