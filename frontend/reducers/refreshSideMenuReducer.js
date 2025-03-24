export default function refreshSideMenu(state = { refreshSide: false }, action) {
    switch (action.type) {
        case "REFRESH_SIDEMENU":
            return { ...state, refreshSide: action.payload }
        default: return state
    }
}
