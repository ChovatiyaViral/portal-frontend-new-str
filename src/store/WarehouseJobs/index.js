import { parseError } from "../utils";

export const initialState = {
  loading: true,
  error: false,
  action: false,
  currentWareHouseLocation: null,
  regaugingFinalPayload: null,
};

// eslint-disable-next-line complexity
export default (state = initialState, action = {}) => {
  switch (action.type) {
    case "UPDATE_CURRENT_WAREHOUSE_REQUEST":
      return {
        ...state,
        loading: true,
        error: false,
        action: false,
      };
    case "UPDATE_CURRENT_WAREHOUSE_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.error.action === undefined ? parseError(action.error) : `Error: ${action.error.error}`,
        action: action.error.action !== undefined ? action.error.action : false,
      };
    case "UPDATE_CURRENT_WAREHOUSE_SUCCESS":
      return {
        ...state,
        currentWareHouseLocation: action.response,
      };
    case "UPDATE_REGAUGING_FINAL_PAYLOAD_SUCCESS":
      return {
        ...state,
        regaugingFinalPayload: action.response,
      };
    default:
      return state;
  }
};
