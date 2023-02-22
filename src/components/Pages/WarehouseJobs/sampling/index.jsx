import { EyeOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Modal, Tabs, Tooltip } from "antd";
import { get } from "lodash";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { isMobileOrTab } from "../../../../constants";
import { getScreenSize } from "../../../../helpers/utility";
import { setCurrentTab } from "../../../../store/App/app.actions";
import { setCurrentView } from "../../../../store/Auth/auth.actions";
import ErrorBoundary from "../../../UIComponents/ErrorBoundary";

import CancelledSampleDataList from "./cancelled";
import CompletedSampleDataList from "./completed";
import "./index.scss";
import PendingSampleDataList from "./pending";

const { TabPane } = Tabs;

const headerTitle = {
  Pending: "Pending Sampling List",
  Completed: "Completed Sampling List",
  Cancelled: "Cancelled Sampling List",
};

const SamplingData = (props) => {
  const dispatch = useDispatch();

  const { history } = props;

  const currentTabDetails = useSelector((state) => {
    return get(state, "app.currentTab", null);
  });

  React.useEffect(() => {
    dispatch(setCurrentView(headerTitle[get(currentTabDetails, "Sampling.tab", "Pending")]));
  }, [currentTabDetails]);

  const handleTabChange = (tab, e) => {
    const tempObj = {
      Sampling: {
        tab: tab,
      },
    };
    dispatch(setCurrentTab({ ...currentTabDetails, ...tempObj }));
    dispatch(setCurrentView(headerTitle[tab]));
  };

  const getItems = () => {
    return [
      {
        key: "Pending",
        label: "Pending",
        children: <PendingSampleDataList {...props} />,
      },
      {
        key: "Completed",
        label: "Completed",
        children: <CompletedSampleDataList />,
      },
      {
        key: "Cancelled",
        label: "Cancelled",
        children: <CancelledSampleDataList />,
      },
    ];
  };

  const info = () => {
    Modal.info({
      title: "",
      width: 400,
      icon: <></>,
      content: (
        <Tooltip title="Click to download/print colour chart" placement="right">
          <a href="https://images.dtstage.com/cask_mgmt_images/color_chart1.pdf" target="_blank">
            <img src="https://images.dtstage.com/cask_mgmt_images/color_chart.jpg" width={"100%"} />
          </a>
        </Tooltip>
      ),
      onOk() {},
    });
  };

  return (
    <div className="bg-white border-radius-12 p-4 table-responsive-padding position-relative">
      <ErrorBoundary>
        <div className={`add_new__btn ${getScreenSize() > isMobileOrTab ? "position-absolute" : ""}`} style={{ right: "3%", zIndex: 9 }}>
          <Button type="primary" icon={<PlusOutlined />} className="mt-0" onClick={() => history.push("/sampling/add-new")}>
            Add New
          </Button>
          <Button type="primary" icon={<EyeOutlined />} className="mt-0 mr-3" onClick={info}>
            Colour Chart
          </Button>
        </div>
        <div>
          <Tabs defaultActiveKey={get(currentTabDetails, "Sampling.tab")} activeKey={get(currentTabDetails, "Sampling.tab")} className="m-0" onTabClick={handleTabChange} items={getItems()} />
        </div>
      </ErrorBoundary>
    </div>
  );
};

export default SamplingData;
