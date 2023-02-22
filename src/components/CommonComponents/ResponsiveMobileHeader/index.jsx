import { ArrowLeftOutlined } from "@ant-design/icons";
import { get } from "lodash";
import React from "react";
import { useSelector } from "react-redux";
import { isMobileOrTab } from "../../../constants";
import { getScreenSize } from "../../../helpers/utility";
import "./index.scss";

const ResponsiveMobileHeader = (props) => {
  const currentView = useSelector((state) => {
    return get(state, "auth.currentView", null);
  });

  const items = [
    {
      key: "1",
      label: <span>gate Entry</span>,
    },
  ];

  return (
    <>
      {getScreenSize() < isMobileOrTab && currentView && (
        <div className="mobile__header">
          <ArrowLeftOutlined onClick={() => props.history.goBack()} />
          <h1>{props.title}</h1>
        </div>
      )}
    </>
  );
};

export default ResponsiveMobileHeader;
