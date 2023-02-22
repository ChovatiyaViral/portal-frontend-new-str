import { ArrowLeftOutlined } from "@ant-design/icons";
import ErrorBoundary from "../../../UIComponents/ErrorBoundary";
import { openNotificationWithIcon } from "../../../UIComponents/Toast/notification";
import { getSalesOrderDetails } from "../../../../store/SalesOrder/sale.actions";
import { Button, Collapse, Divider, Spin } from "antd";
import { get } from "lodash";
import React from "react";
import { connect, useDispatch } from "react-redux";
import { capitalizeAllLetter } from "../../../../helpers/utility";
import { setCurrentView } from "../../../../store/Auth/auth.actions";
import OrderDocuments from "./documents";
import "./index.scss";
import OrderListDetails from "./orderDetails";
import OrderSummary from "./orderSummary";
import OrderTrackingDetails from "./trackingDetails";

const { Panel } = Collapse;

const text = "Content Coming Soon";

/**
 * Renders Order Details Component
 */
const OrderDetails = (props) => {
  const dispatch = useDispatch();

  const [expectedData, setExpectedData] = React.useState([]);
  const [expectedMetaInfoData, setExpectedMetaInfoData] = React.useState([]);
  const { match, history } = props;

  React.useEffect(() => {
    dispatch(setCurrentView(`Order Details - # ${get(match, "params.id")}`));
  }, []);

  const updateState = (data) => {
    setExpectedData(data);
  };

  const fetchSalesOrderDetails = async () => {
    let salesOrderDetailsResp = await props.getSalesOrderDetails(get(match, "params.id"));

    if (get(salesOrderDetailsResp, "error", false)) {
      openNotificationWithIcon("error", "Sales Order Details", `${get(salesOrderDetailsResp, "error.message", "Something Went Wrong")} `);
    }

    if (get(salesOrderDetailsResp, "response.status")) {
      dispatch(setCurrentView(getTitle(get(salesOrderDetailsResp, "response.data", {}))));
      updateState(get(salesOrderDetailsResp, "response.data", []));
      setExpectedMetaInfoData(get(salesOrderDetailsResp, "response.meta", []));
    } else {
      openNotificationWithIcon("error", "Sales Order Details", `${get(salesOrderDetailsResp, "response.message", "Something Went Wrong")} `);
    }
  };

  const refetchSalesOrderData = () => {
    fetchSalesOrderDetails();
  };

  const getTitle = (data) => {
    return (
      <div className="details__card_title">
        <p className="details__summary__card_content__title"> Order Details - # {get(data, "sales_order_id")} </p>
        <p className="details__summary__card_content__value">
          Order Type - {capitalizeAllLetter(get(data, "sales_order_type", "NA").replace(/_/g, " "))} | Customer Name - {get(data, "customer_name", "NA")}
        </p>
      </div>
    );
  };

  React.useEffect(() => {
    fetchSalesOrderDetails();
  }, []);

  return (
    <>
      <div className="float-right mr-3">
        <Button type="link" onClick={() => history.goBack()} icon={<ArrowLeftOutlined />}>
          Back to details view
        </Button>
      </div>
      <div className="order_details_list float-left w-100">
        <ErrorBoundary>
          <Spin spinning={get(props, "loading", false)}>
            <Collapse defaultActiveKey={["1", "2", "3", "4"]} ghost expandIconPosition="end" className="details_page_collapse">
              <Panel
                header={
                  <Divider orientation="left" plain>
                    <b>ORDER SUMMARY</b>
                  </Divider>
                }
                key="1"
              >
                <OrderSummary {...expectedData} metaColumnInfo={expectedMetaInfoData} refetchSalesOrderData={refetchSalesOrderData} />
              </Panel>
              <Panel
                header={
                  <Divider orientation="left" plain>
                    <b>TRACKING DETAILS</b>
                  </Divider>
                }
                key="2"
              >
                <OrderTrackingDetails metaColumnInfo={expectedMetaInfoData} history={history} {...expectedData} refetchSalesOrderData={refetchSalesOrderData} />
              </Panel>
              <Panel
                header={
                  <Divider orientation="left" plain>
                    <b>DOCUMENTS</b>
                  </Divider>
                }
                key="3"
              >
                <OrderDocuments {...expectedData} metaColumnInfo={expectedMetaInfoData} history={history} refetchSalesOrderData={refetchSalesOrderData} />
              </Panel>
              <Panel
                header={
                  <Divider orientation="left" plain>
                    <b>ORDER DETAILS</b>
                  </Divider>
                }
                key="4"
              >
                <OrderListDetails history={history} {...expectedData} refetchSalesOrderData={refetchSalesOrderData} metaColumnInfo={expectedMetaInfoData} />
              </Panel>
            </Collapse>
          </Spin>
        </ErrorBoundary>
      </div>
    </>
  );
};

export default connect(
  (state) => ({
    loading: state.salesOrder.isOrderDetailsLoading,
    error: state.salesOrder.failure,
  }),
  { getSalesOrderDetails }
)(OrderDetails);
