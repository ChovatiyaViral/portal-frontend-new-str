import { Button, Modal, Radio } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import React from "react";

const RegaugingConfirmationModal = (props) => {
  const [value, setValue] = React.useState("reservation");
  const onStatusChange = (e) => {
    setValue(e.target.value);
  };
  return (
    <>
      <Modal
        title="Select Regauging"
        open={props.showModal}
        onOk={props.toggleModal}
        onCancel={props.toggleModal}
        closable={false}
        centered
        width={500}
        maskClosable={false}
        keyboard={false}
        footer={[
          <Button key="OK" type="primary" onClick={props.toggleModal} icon={<CheckOutlined />}>
            SUBMIT
          </Button>,
        ]}
      >
        <>
          <Radio.Group onChange={onStatusChange} value={value} className="d-flex">
            <Radio value="reservation">Regauging</Radio>
            <Radio value="sales_order" className="pl-sm-3">
              Regauging
            </Radio>
            {/* <Radio value="consignment" className="pl-sm-3">
              Consignment
            </Radio> */}
          </Radio.Group>
          {/* <div className="mt-3">{getText()}</div> */}
        </>
      </Modal>
    </>
  );
};

export default RegaugingConfirmationModal;
