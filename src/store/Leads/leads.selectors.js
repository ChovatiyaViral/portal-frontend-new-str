import { createSelector } from "reselect";

const leadsSelector = (state) => state.leads.activeLeads;

export const getActiveLeadsSelector = createSelector(leadsSelector, (leads) => {
  // eslint-disable-next-line no-console
  console.log(leads);
  return leads;
});
