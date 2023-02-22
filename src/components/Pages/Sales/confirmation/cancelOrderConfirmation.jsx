import { CloseCircleOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { Button, Input, Modal, Spin, Typography } from "antd";
import { get } from "lodash";
import React from "react";
import "../index.scss";
const { Text } = Typography;
const { TextArea } = Input;

const CancelOrderConfirmation = (props) => {
  const shippedText = `Are you sure you want to mark this order as completed ? Please ensure the shipping details are updated and relevant
documents have been attached with this order before changing the status. The cased goods quantities will be adjusted per 
allocated amount`;

  const cancelText = "Are you sure you want to cancel this order? The allocated quantities will be reversed.";
  let isDisabled = get(props, "customDetails.fulfillment_status") === "cancelled" && get(props, "cancellationReason") ? false : true;
  if (get(props, "customDetails.fulfillment_status") !== "cancelled") {
    isDisabled = false;
  }
  return (
    <Spin spinning={get(props, "fulfillmentLoader")}>
      <Modal
        title={get(props, "customDetails.fulfillment_status") === "shipped" ? "Confirmation" : "Reason for Cancellation"}
        open={props.showModal}
        onOk={props.handleClose}
        onCancel={props.handleClose}
        footer={[
          <Button key="OK" type="secondary" icon={<CloseCircleOutlined />} onClick={() => props.handleClose()}>
            Cancel
          </Button>,
          <Button key="OK" type="primary" icon={<CheckCircleOutlined />} disabled={isDisabled} loading={get(props, "fulfillmentLoader")} onClick={() => props.handleReasonSubmit()}>
            OK
          </Button>,
        ]}
      >
        {get(props, "customDetails.fulfillment_status") === "shipped" ? (
          <>{shippedText}</>
        ) : (
          <>
            {cancelText}
            {/* {get(props, "customDetails.signer_email") && (
              <>
                <br />
                <Text type="secondary">{`Re-triggered Document email has been sent to ${get(props, "customDetails.signer_email", "")} 
                dated ${get(props, "customDetails.email_sent_at", "")}`}</Text>
              </>
            )} */}
            <TextArea
              className="mt-3 mb-0 w-100"
              onChange={(e) => {
                props.handleReason(e.target.value);
              }}
              placeholder="Why you want to Cancel the Order?"
            />
          </>
        )}
      </Modal>
    </Spin>
  );
};

export default CancelOrderConfirmation;
