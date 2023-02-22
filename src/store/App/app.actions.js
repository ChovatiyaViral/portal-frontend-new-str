export const updatePortalFilters = (data) => ({
  type: "UPDATE_FILTERS",
  response: data,
});

export const setCurrentTab = data => ({
  type: "SET_CURRENT_TAB",
  response: data
});