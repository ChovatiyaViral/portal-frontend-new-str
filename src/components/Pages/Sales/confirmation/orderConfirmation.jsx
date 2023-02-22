import { CloseCircleOutlined, ShopOutlined } from "@ant-design/icons";
import { Button, Modal, Spin } from "antd";
import { get } from "lodash";
import React from "react";

const OrderConfirmation = (props) => {
  return (
    <Spin spinning={get(props, "orderPlacementLoader")}>
      <Modal
        title="Order Confirmation"
        open={props.isOpen}
        centered
        footer={[
          <Button key="OK" type="secondary" icon={<CloseCircleOutlined />} onClick={() => props.handleOrderConfirmationModal()}>
            Cancel
          </Button>,
          <Button key="OK" type="primary" icon={<ShopOutlined />} loading={get(props, "orderPlacementLoader")} onClick={() => props.handleConfirmationSubmit()}>
            Place Order
          </Button>,
        ]}
      >
        <>
          <span className="mb-2">
            Are you sure you want to submit the order ?<br /> Please review before placing the order.
          </span>
        </>
      </Modal>
    </Spin>
  );
};

export default OrderConfirmation;
