import { CheckOutlined, CopyOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { Badge, Button, Col, List, Modal, Row, Tooltip, Typography } from "antd";
import { get } from "lodash";
import React from "react";
import { useDispatch } from "react-redux";
import { isMobileOrTab } from "../../../../constants";
import { getScreenSize } from "../../../../helpers/utility";
import { getCustomerDetail } from "../../../../store/SalesOrder/sale.actions";
import { CustomInputTextArea as InputTextArea } from "../../../UIComponents/Input/customInput";
const { Paragraph, Title } = Typography;

const PreviousNotesModal = (props) => {
  const [customerDetails, setCustomerDetails] = React.useState([]);
  const [isSpecifiedConditionsCopied, setIsSpecifiedConditionsCopied] = React.useState(false);
  const [isNotesCopied, setIsNotesCopied] = React.useState(false);

  const dispatch = useDispatch();

  React.useEffect(() => {
    if (get(props, "data", []).length > 0) {
      const resp = {
        past_orders_summary: get(props, "data", []),
      };
      setCustomerDetails(resp);
    } else {
      fetchCustomerDetail();
    }
  }, []);

  const replaceWithBr = (str) => {
    return str.replace(/\n/g, "<br />");
  };

  const handleCopy = (type, value) => {
    if (type === "special_conditions") {
      setIsSpecifiedConditionsCopied(true);
      setIsNotesCopied(false);
    }

    if (type === "notes") {
      setIsNotesCopied(true);
      setIsSpecifiedConditionsCopied(false);
    }
    navigator.clipboard.writeText(value);
  };

  const fetchCustomerDetail = async () => {
    const customerDetailResp = await dispatch(getCustomerDetail(`${get(props, "customerInfo.customer_id", "")}?last_order_id=${get(props, "sales_order_id", "")}`, ""));
    setCustomerDetails(get(customerDetailResp, "response"));
  };

  return (
    <>
      <Modal
        title={`Past order notes for ${get(props, "customerInfo.customer_name", "")}`}
        centered
        width={900}
        maskClosable={false}
        onCancel={() => props.handleClose()}
        open={get(props, "isOpen", false)}
        className="past__orders__customer__history"
        footer={[
          <Button key="OK" icon={<CheckCircleOutlined />} type="primary" onClick={() => props.handleClose()}>
            Ok
          </Button>,
        ]}
      >
        {get(customerDetails, "past_orders_summary", []).length > 0 ? (
          <List
            itemLayout="vertical"
            size="large"
            pagination={{
              onChange: (page) => {
                // eslint-disable-next-line no-console
                console.log(page);
              },
              size: "small",
              pageSize: 1,
            }}
            className="past__order__summary"
            dataSource={get(customerDetails, "past_orders_summary", [])}
            renderItem={(item) => (
              <List.Item key={item.title} className={getScreenSize() < isMobileOrTab && "p-0"}>
                <div className="common_card_section">
                  <Row gutter={[16, 16]}>
                    <Col>
                      <span>
                        Order No:
                        <b className="ml-1">{get(item, "sales_order_id") ? get(item, "sales_order_id") : "NA"}</b>
                      </span>
                    </Col>
                    <Col>
                      <span>
                        No. Of Cases:
                        <b className="ml-1">{get(item, "total_order_items") ? get(item, "total_order_items") : 0}</b>
                      </span>
                    </Col>
                    <Col>
                      <span>
                        Order Value:
                        <b className="ml-1">£ {get(item, "total_order_value") ? get(item, "total_order_value") : 0}</b>
                      </span>
                    </Col>
                    <Col>
                      <span>
                        Brands: <b> {get(item, "brands") ? get(item, "brands") : "NA"}</b>
                      </span>
                    </Col>
                  </Row>
                  <hr
                    style={{
                      borderTop: "1px solid #bfbfbf",
                    }}
                  />
                  <Row gutter={[16, 16]}>
                    <Col xs={{ span: 24 }} sm={{ span: 12 }}>
                      <Badge.Ribbon
                        text={
                          <>
                            {!isSpecifiedConditionsCopied ? (
                              <Tooltip placement="topLeft" title="Copy special conditions to clipboard">
                                <CopyOutlined onClick={() => handleCopy("special_conditions", get(item, "special_conditions", ""))} />
                              </Tooltip>
                            ) : (
                              <Tooltip placement="topLeft" title="Copied">
                                <CheckOutlined />
                              </Tooltip>
                            )}
                          </>
                        }
                      >
                        <InputTextArea
                          className="mt-0 mb-0 w-100"
                          style={{
                            overflow: "hidden",
                          }}
                          disabled
                          autoSize={true}
                          type="special_conditions"
                          value={get(item, "special_conditions")}
                          label="Special Conditions"
                        />
                      </Badge.Ribbon>
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 12 }}>
                      <Badge.Ribbon
                        text={
                          <>
                            {!isNotesCopied ? (
                              <Tooltip placement="topLeft" title="Copy notes to clipboard">
                                <CopyOutlined onClick={() => handleCopy("notes", get(item, "notes", ""))} />
                              </Tooltip>
                            ) : (
                              <Tooltip placement="topLeft" title="Copied">
                                <CheckOutlined />
                              </Tooltip>
                            )}
                          </>
                        }
                      >
                        <InputTextArea
                          className="mt-0 mb-0 w-100"
                          style={{
                            overflow: "hidden",
                          }}
                          autoSize={true}
                          disabled
                          type="notes"
                          value={get(item, "notes")}
                          label="Notes"
                        />
                      </Badge.Ribbon>
                    </Col>
                  </Row>
                </div>
              </List.Item>
            )}
          />
        ) : (
          <p>No past orders found</p>
        )}
      </Modal>
    </>
  );
};

export default PreviousNotesModal;
