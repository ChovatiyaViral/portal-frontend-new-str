import { ArrowLeftOutlined } from "@ant-design/icons";
import ErrorBoundary from "../../../../UIComponents/ErrorBoundary";
import { openNotificationWithIcon } from "../../../../UIComponents/Toast/notification";
import { getCustomerDetails } from "../../../../../store/Leads/leads.actions";
import { Button, Collapse, Divider, Spin } from "antd";
import { get } from "lodash";
import React from "react";
import { connect, useDispatch } from "react-redux";
import { isMobileOrTab } from "../../../../../constants";
import { capitalizeAllLetter, getScreenSize } from "../../../../../helpers/utility";
import { setCurrentView } from "../../../../../store/Auth/auth.actions";
import CustomerActiveOrderListing from "./activeOrders";
import CustomerDocuments from "./documents";
import CustomerPastOrderListing from "./pastOrders";
import CustomerSummary from "./summary";
import CustomerTrackingDetails from "./trackingDetails";

const { Panel } = Collapse;

/**
 * Renders Customer Details Component
 */
const CustomerDetails = (props) => {
  const [expectedData, setExpectedData] = React.useState([]);
  const [expectedMetaInfoData, setExpectedMetaInfoData] = React.useState([]);
  const dispatch = useDispatch();

  const { match, history } = props;

  React.useEffect(() => {
    dispatch(setCurrentView(`Customer Details - # ${get(match, "params.id")}`));
  }, []);

  const updateState = (data) => {
    setExpectedData(data);
  };

  const fetchCustomerDetails = async () => {
    let customerDetailsResp = await props.getCustomerDetails(get(match, "params.id"));

    if (get(customerDetailsResp, "error", false)) {
      openNotificationWithIcon("error", "Customer Details", `${get(customerDetailsResp, "error.message", "Something Went Wrong")} `);
    }

    if (get(customerDetailsResp, "response.status")) {
      dispatch(setCurrentView(getTitle(get(customerDetailsResp, "response.data", {}))));
      updateState(get(customerDetailsResp, "response.data", []));
      setExpectedMetaInfoData(get(customerDetailsResp, "response.meta.column_info", []));
    } else {
      openNotificationWithIcon("error", "Customer Details", `${get(customerDetailsResp, "response.message", "Something Went Wrong")} `);
    }
  };

  const getTitle = (data) => {
    return (
      <div className="details__card_title">
        <p className="details__summary__card_content__title"> Customer Details - # {get(data, "customer_id")} </p>
        <p className="details__summary__card_content__value">
          Contact Name - {capitalizeAllLetter(get(data, "contact_name", "NA").replace(/_/g, " "))} | Email - {get(data, "email", "NA")}
        </p>
      </div>
    );
  };

  React.useEffect(() => {
    fetchCustomerDetails();
  }, []);

  return (
    <>
      <Button
        className="float-right"
        style={{
          position: "relative",
          zIndex: 9,
        }}
        type="link"
        onClick={() => history.goBack()}
        icon={<ArrowLeftOutlined />}
      >
        {getScreenSize() > isMobileOrTab && "Back to details view"}
      </Button>
      <div className="customer_details_list">
        <ErrorBoundary>
          <Spin spinning={get(props, "loading", false)}>
            <div className="pt-0">
              <Collapse defaultActiveKey={["1", "2", "3", "4", "5"]} ghost expandIconPosition="end">
                <Panel
                  header={
                    <Divider orientation="left" plain>
                      <b>CUSTOMER SUMMARY</b>
                    </Divider>
                  }
                  key="1"
                >
                  <CustomerSummary {...expectedData} />
                </Panel>
                <Panel
                  header={
                    <Divider orientation="left" plain>
                      <b>TRACKING DETAILS</b>
                    </Divider>
                  }
                  key="2"
                >
                  <CustomerTrackingDetails {...expectedData} refetchDetails={() => fetchCustomerDetails()} />
                </Panel>
                <Panel
                  header={
                    <Divider orientation="left" plain>
                      <b>DOCUMENTS</b>
                    </Divider>
                  }
                  key="3"
                >
                  <CustomerDocuments {...expectedData} />
                </Panel>
                <Panel
                  header={
                    <Divider orientation="left" plain>
                      <b>ACTIVE ORDERS</b>
                    </Divider>
                  }
                  key="4"
                >
                  <CustomerActiveOrderListing id={get(match, "params.id")} />
                </Panel>
                <Panel
                  header={
                    <Divider orientation="left" plain>
                      <b>PAST ORDERS</b>
                    </Divider>
                  }
                  key="5"
                >
                  <CustomerPastOrderListing id={get(match, "params.id")} />
                </Panel>
              </Collapse>
            </div>
          </Spin>
        </ErrorBoundary>
      </div>
    </>
  );
};

export default connect(
  (state) => ({
    loading: get(state, "leads.loading", false),
    error: get(state, "leads.error", false),
  }),
  { getCustomerDetails }
)(CustomerDetails);
