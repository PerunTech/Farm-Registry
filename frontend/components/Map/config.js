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
