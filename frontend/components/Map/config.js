import { config } from './Spatial'
// window.sysCenter is not set in every environment, so fall back the same way
// spatial does internally rather than handing setView an undefined center
const { SYS_CENTER } = config

export const id = 'holding-map'
export const center = SYS_CENTER
export const zoomLevel = 10
