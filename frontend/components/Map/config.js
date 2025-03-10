import { core } from './Spatial'
const { factory, Map } = core

export const id = 'holding-map'
export const center = window.sysCenter
export const zoomLevel = 10
export const layerList = [{
    'OpenStreetMap': {
        'Standard': factory.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(Map),
        'CyclOSM': factory.tileLayer('https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }),
        'Humanitarian': factory.tileLayer('https://tile-{s}.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        })
    }
}, {}]

export const MEASURE_CONFIG = {
    repeatable: false,
    tooltips: true,
    snapMiddle: false,
    allowSelfIntersection: true,
    templineStyle: {
        weight: 2.0,
        stroke: true,
        color: '#FFC400',
        fillColor: '#FFC400',
        opacity: 0.9,
        fillOpacity: 0.25,
        dashArray: [10, 10],
        showMeasurements: false
    },
    hintlineStyle: {
        weight: 2.0,
        stroke: true,
        color: '#FFC400',
        fillColor: '#FFC400',
        opacity: 0.9,
        fillOpacity: 0.25,
        dashArray: [10, 10],
    },
    cursorMarker: false,
    finishOn: null
};

export const MEASURE_AREA = {
    ...MEASURE_CONFIG,
    pathOptions: {
        weight: 2.0,
        stroke: true,
        color: '#FFC400',
        fillColor: '#FFC400',
        opacity: 0.9,
        fillOpacity: 0.25,
        dashArray: [10, 10]
    }
}
