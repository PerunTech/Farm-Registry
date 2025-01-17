export default function refreshSummary(state = { refresh: false }, action) {
    switch (action.type) {
        case "REFRESH_SUMMARY":
            return { ...state, refresh: action.payload }
        default: return state
    }
}
