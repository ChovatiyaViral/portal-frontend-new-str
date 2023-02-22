export const initialState = {
  loading: false,
  error: false,
  action: false,
  currentTab: null,
  appliedFilters: {},
};

// eslint-disable-next-line complexity
export default (state = initialState, action = {}) => {
  switch (action.type) {
    case "UPDATE_FILTERS":
      const filters = { ...state.appliedFilters, ...action.response };
      return {
        ...state,
        appliedFilters: filters,
      };
    case "SET_CURRENT_TAB":
      return {
        ...state,
        currentTab: action.response,
      };
    default:
      return state;
  }
};
