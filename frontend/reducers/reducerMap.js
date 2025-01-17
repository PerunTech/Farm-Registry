export default function mapDataReducer(state = { farmData: undefined, lpisback: { backFromLpis: false, tableName: undefined } }, action) {
  switch (action.type) {
    case "GET_FR_MAP_DATA":
      return { ...state, farmData: action.payload }
    case "RESET_FR_MAP_DATA":
      return { ...state, farmData: undefined }
    case "BACK_FROM_LPIS":
      return { ...state, lpisback: action.payload }
    default: return state
  }
}
