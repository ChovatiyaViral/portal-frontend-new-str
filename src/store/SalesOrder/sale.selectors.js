import { createSelector } from "reselect";

const salesOrderSelector = (state) => state.salesOrder.casedGoods;

export const salesOrdersSelector = createSelector(salesOrderSelector, (casedGoods) => {
  // eslint-disable-next-line no-console
  console.log(casedGoods);
  return casedGoods;
});
