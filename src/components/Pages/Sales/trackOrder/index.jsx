import ErrorBoundary from "../../../UIComponents/ErrorBoundary";
import CustomTable from "../../../UIComponents/Table/responsiveTable";
import { openNotificationWithIcon } from "../../../UIComponents/Toast/notification";
import { TableColumnsList } from "../../../../constants";
import { defaultRequestOptions } from "../../../../settings";
import { getCasedGoods } from "../../../../store/CasedGoods/casedGoods.actions";
import { cancelSalesOrdersRequest, getSalesOrdersRequest } from "../../../../store/SalesOrder/sale.actions";
import { get } from "lodash";
import React from "react";
import { connect, useDispatch } from "react-redux";
import { setCurrentView } from "../../../../store/Auth/auth.actions";
import SearchWithExportUI from "../../../CommonComponents/SearchWithExport";
import { CancelOrderUI } from "./cancelOrder";

/**
 * Renders Track Sales Order component
 */
const TrackOrder = (props) => {
  const dispatch = useDispatch();

  const [expectedData, setExpectedData] = React.useState([]);
  const [expectedMetaData, setExpectedMetaData] = React.useState([]);
  const [expectedClonedData, setExpectedClonedData] = React.useState([]);
  const [currentCancelRecord, setCurrentCancelRecord] = React.useState(null);
  const [clearSearchString, setClearSearchString] = React.useState(false);
  const [cancelOrderRequest, setCancelOrderRequest] = React.useState(false);

  React.useEffect(() => {
    dispatch(setCurrentView("Track Your Order"));
  }, []);

  const updateState = (data) => {
    setExpectedData(data);
    if (expectedClonedData.length === 0) {
      setExpectedClonedData(data);
    }
  };

  const isCleared = () => {
    setExpectedData(expectedClonedData);
    setClearSearchString(true);
  };

  const fetchCasedGoods = async () => {
    const searchable_columns = [{ field_name: "deleted", field_value: "no" }];
    const inventoryResponse = await props.getCasedGoods({ ...defaultRequestOptions, searchable_columns });
    if (get(inventoryResponse, "error", false)) {
      openNotificationWithIcon("error", "Inventory", `${get(inventoryResponse, "error.message", "Something Went Wrong")} `);
    }
  };

  const fetchSalesOrders = async (requestOptions) => {
    let salesOrderResp = await props.getSalesOrdersRequest({ ...requestOptions });

    if (get(salesOrderResp, "error", false)) {
      openNotificationWithIcon("error", "Track Order", `${get(salesOrderResp, "error.message", "Something Went Wrong")} `);
    }

    if (get(salesOrderResp, "response.status")) {
      setExpectedMetaData(get(salesOrderResp, "response.meta"));
      updateState(get(salesOrderResp, "response.data", []));
    }
  };

  React.useEffect(() => {
    fetchSalesOrders(defaultRequestOptions);
  }, []);

  const handleSearch = (searchedData) => {
    if (get(searchedData, "isClient", true)) {
      setExpectedData(get(searchedData, "filteredData", []));
    }
  };

  const handleEditAction = (record, type) => {
    if (type === "Cancel Order") {
      setCancelOrderRequest(true);
      setCurrentCancelRecord(record);
    }
  };

  const handleCancelOrderRequest = async (comments, sales_order_id) => {
    const requestPayload = {
      ...defaultRequestOptions,
      comments,
      sales_order_id,
      fulfillment_status: "cancelled",
    };

    let cancelSalesOrderResp = await props.cancelSalesOrdersRequest({ ...requestPayload });

    if (get(cancelSalesOrderResp, "error", false)) {
      openNotificationWithIcon("error", "Cancel Order", `${get(cancelSalesOrderResp, "error.message", "Something Went Wrong")} `);
    }

    if (get(cancelSalesOrderResp, "response.status")) {
      fetchSalesOrders(defaultRequestOptions);
      fetchCasedGoods();
      openNotificationWithIcon("success", "Cancel Order", `${get(cancelSalesOrderResp, "response.message", "Order Cancelled Successfully")} `);
      setCancelOrderRequest(false);
      setCurrentCancelRecord(null);
    }
  };

  return (
    <>
      {cancelOrderRequest && (
        <CancelOrderUI
          title="Cancel Order"
          handleCancel={() => setCancelOrderRequest(false)}
          handleSubmit={handleCancelOrderRequest}
          isModalVisible={cancelOrderRequest}
          loading={get(props, "loading", false)}
          record={currentCancelRecord}
        />
      )}
      {/* <Heading text="Track Your Order" variant="h4" /> */}
      <div className="border-radius-12 bg-white table-responsive-padding p-4">
        <ErrorBoundary>
          <SearchWithExportUI
            clearSearchString={clearSearchString}
            handleSearch={handleSearch}
            columnType={TableColumnsList.TrackOrder}
            isSyncEnabled={true}
            handleSync={() => fetchSalesOrders(defaultRequestOptions)}
            fetchDetails={(payload) => fetchSalesOrders(payload)}
            expectedClonedData={expectedClonedData}
            expectedMetaData={expectedMetaData}
            expectedData={expectedData}
          />
          <>
            <CustomTable
              data={expectedData}
              meta={expectedMetaData}
              isGlobalFilterEnabled={false}
              clonedData={expectedClonedData}
              columnType={TableColumnsList.TrackOrder}
              isLoading={get(props, "loading", false)}
              isCleared={isCleared}
              isExportAvailable={false}
              onFilter={(payload) => fetchSalesOrders({ ...defaultRequestOptions, searchable_columns: payload })}
              onReset={() => fetchSalesOrders(defaultRequestOptions)}
              handleEdit={(record, type) => handleEditAction(record, type)}
            />
          </>
        </ErrorBoundary>
      </div>
    </>
  );
};

export default connect(
  (state) => ({
    loading: get(state, "salesOrder.loading", false),
    error: get(state, "salesOrder.failure", false),
  }),
  { getCasedGoods, getSalesOrdersRequest, cancelSalesOrdersRequest }
)(TrackOrder);
