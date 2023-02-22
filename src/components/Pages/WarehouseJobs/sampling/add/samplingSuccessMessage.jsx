import Icon, { EyeOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React from "react";
import { SamplingSuccessSvg } from "../../../../../constants/svgList";

const SamplingSuccessIcon = (props) => <Icon component={SamplingSuccessSvg} {...props} />;
const SamplingSuccessMessage = () => {
  return (
    <div className="sampling_success_message_section">
      <div className="sampling_success_message_content">
        <SamplingSuccessIcon />
        <h1>Success! Your sampling record is saved</h1>
        <p>Information has been added for Cask 4565575</p>
        <Button type="secondary" ghost icon={<EyeOutlined />}>
          View information
        </Button>
        <Button type="primary" ghost icon={<ArrowLeftOutlined />}>
          Back to home
        </Button>
      </div>
    </div>
  );
};

export default SamplingSuccessMessage;
