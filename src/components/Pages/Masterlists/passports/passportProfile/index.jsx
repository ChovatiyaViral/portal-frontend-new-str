import { LeftOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React from "react";
import PassportDetail from "./details";
import "./index.scss";

const PassportProfile = () => {
  return (
    <div className="passport_details">
      <Button type="primary" ghost icon={<LeftOutlined />} className="passport_back_btn">
        Back Passport list
      </Button>
      <PassportDetail />
    </div>
  );
};

export default PassportProfile;
