export default function mapDataReducer (state = { farmData: undefined, }, action) {
  switch (action.type) {
    case "GET_FR_MAP_DATA":
      return { ...state, farmData: action.payload }
    case "RESET_FR_MAP_DATA":
      return { ...state, farmData: undefined }
    default: return state
  }
}
