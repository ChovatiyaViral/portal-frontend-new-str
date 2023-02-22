import { PlusOutlined, FolderViewOutlined } from "@ant-design/icons";
import { Button, Result } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import "./index.scss";

const SuccessPage = (props) => {
  const getTitleText = () => {
    return {
      title: "Inventory Created Successfully",
      subTitle: "",
    };
  };

  return (
    <div style={{ minHeight: 400 }} className="bg-white p-4">
      <div className="float-right">
        <Button type="primary" onClick={() => props.setSubmitSuccess(false)} icon={<PlusOutlined />}>
          Add New Case
        </Button>
      </div>
      <Result
        status="success"
        title={getTitleText().title}
        subTitle={getTitleText().subTitle}
        extra={[
          <Link to="/cased-goods">
            <Button type="secondary" key="console" icon={<FolderViewOutlined />}>
              View Inventory
            </Button>
          </Link>,
        ]}
      />
    </div>
  );
};
export default SuccessPage;
