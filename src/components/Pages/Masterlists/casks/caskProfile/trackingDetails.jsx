import { Button, Col, List, Modal, Row, Spin, Steps, Tag } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { find, get, isEmpty } from "lodash";
import React from "react";
import CommonService from "../../../../../helpers/request/Common";
import { requestPath } from "../../../../../helpers/service";
import { capitalizeAllLetter } from "../../../../../helpers/utility";
import ErrorBoundary from "../../../../UIComponents/ErrorBoundary";
import { openNotificationWithIcon } from "../../../../UIComponents/Toast/notification";
import "./index.scss";

/**
 * Renders Cask tracking Details Component
 */
const CaskTrackingDetails = (props) => {
  const [expectedData, setExpectedData] = React.useState([]);
  const [loading, setIsLoading] = React.useState(true);

  const fetchTrackingDetails = async () => {
    await CommonService.getDetails(`${requestPath.masterListing.cask.eventLogs}/${get(props, "caskID")}`).then((data) => {
      if (get(data, "status")) {
        setIsLoading(false);
        setExpectedData(get(data, "data", []));
      }

      if (!get(data, "data.status", true)) {
        openNotificationWithIcon("error", "Tracking Details", `${get(data, "data.message", "Something Went Wrong")} `);
      }
    });
  };

  React.useEffect(() => {
    fetchTrackingDetails();
  }, []);

  const handleMoreCommentsView = (comments, value) => {
    Modal.info({
      title: value === "cancelled" ? "Reason for Cancellation" : "User Comments",
      centered: true,
      width: 750,
      content: (
        <div>
          <p>{comments}</p>
        </div>
      ),
      onOk() { },
    });
  };

  const handleRequestHeaderView = (requestHeader) => {
    Modal.info({
      title: "Customer Request Header",
      centered: true,
      width: 750,
      content: (
        <List
          size="small"
          style={{
            overflow: "scroll",
            maxHeight: "400px",
          }}
          bordered
          dataSource={Object.keys(requestHeader)}
          renderItem={(item) => (
            <List.Item>
              {item} : {get(requestHeader, item, "")}
            </List.Item>
          )}
        />
      ),
      onOk() { },
    });
  };

  const getStatusCode = (status, key_name = "fulfillment_status") => {
    const StatusObj = find(get(props, "metaColumnInfo.status_list", []), function (o) {
      return get(o, "key_name") === key_name;
    });
    return get(StatusObj, `status_color_map.${status}`);
  };

  const getStatusOptionsList = (key_name = "fulfillment_status") => {
    const StatusObj = find(get(props, "metaColumnInfo.status_list", []), function (o) {
      return get(o, "key_name") === key_name;
    });

    let returnArr = [];
    returnArr = Object.keys(get(StatusObj, "status_color_map", {})).map((data) => {
      return {
        label: capitalizeAllLetter(data.replace(/_/g, " ")),
        value: data,
      };
    });

    return returnArr ? returnArr : [];
  };

  const getItems = () => {
    return expectedData.map((details, index) => {
      const getColorCode = getStatusCode(get(details, "event_type") ? get(details, "event_type") : "new");
      const getText = capitalizeAllLetter((get(details, "event_type") ? get(details, "event_type") : "New").replace(/_/g, " "));

      return {
        title: (
          <>
            <span>{get(details, "description", "")}</span>
            <Tag color={getColorCode} className="ml-3">
              {getText}
            </Tag>
            {!isEmpty(get(details, "customer_request_header")) && (
              <Button type="link" size="small" icon={<EyeOutlined />} className="mt-2 mb-2" onClick={() => handleRequestHeaderView(get(details, "customer_request_header", ""), get(details, "new_value"))}>
                View Details
              </Button>
            )}
            {get(details, "user_comments") && (
              <>
                <div style={{ whiteSpace: "normal" }} className="pr-2">
                  {get(details, "user_comments", "").slice(0, 40)}
                </div>
                {get(details, "user_comments", "").length > 40 && (
                  <>
                    ...
                    <Button type="link" size="small" icon={<EyeOutlined />} className="mt-2 mb-2" onClick={() => handleMoreCommentsView(get(details, "user_comments", ""), get(details, "new_value"))}>
                      View More
                    </Button>
                  </>
                )}
              </>
            )}
          </>
        ),
        description: (
          <>
            <p className="m-0">By {get(details, "created_by", "")}</p>
            <p className="m-0">{get(details, "created_at", "")}</p>
          </>
        ),
      };
    });
  };

  return (
    <>
      <ErrorBoundary>
        <Spin spinning={loading}>
          <div className="bg-white p-4" style={{ borderRadius: 10 }}>
            <Row>
              <Col xs={{ span: 24 }} sm={{ span: 24 }}>
                <span className="order_details__tracking_details">
                  <Steps progressDot current={expectedData.length} direction="vertical" items={getItems()} />
                </span>
              </Col>
            </Row>
          </div>
        </Spin>
      </ErrorBoundary>
    </>
  );
};

export default CaskTrackingDetails;
