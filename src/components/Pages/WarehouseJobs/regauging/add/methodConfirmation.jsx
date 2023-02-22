import { Modal, Radio } from "antd";
import { get } from "lodash";
import React from "react";
import { isMobileOrTab } from "../../../../../constants";
import { getScreenSize } from "../../../../../helpers/utility";

export const ConfirmRegaugeMethod = (props) => {
  const [value, setValue] = React.useState("wt_msr");

  const handleOk = () => {
    props.handleSubmit(value);
  };

  const onStatusChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <Modal title={get(props, "title", "")} open={get(props, "isModalVisible", false)} onOk={handleOk} centered width={500} maskClosable={false} onCancel={() => props.handleCancel()}>
      <Radio.Group onChange={onStatusChange} value={value} className={getScreenSize() > isMobileOrTab ? "d-flex" : ""}>
        <Radio value="wt_msr">Weight & Measurements</Radio>
        <Radio value="ullage" className="pl-sm-3">
          Ullage
        </Radio>
      </Radio.Group>
    </Modal>
  );
};
