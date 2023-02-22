import { PlusOutlined } from "@ant-design/icons";
import { Button, Tabs } from "antd";
import { get } from "lodash";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { isMobileOrTab } from "../../../../constants";
import { getScreenSize } from "../../../../helpers/utility";
import { setCurrentTab } from "../../../../store/App/app.actions";
import { setCurrentView } from "../../../../store/Auth/auth.actions";
import ErrorBoundary from "../../../UIComponents/ErrorBoundary";
import RegaugingCancelledDataList from "./cancelled";
import RegaugingCompletedDataList from "./completed";
import "./index.scss";
import RegaugingPendingDataList from "./pending";

const headerTitle = {
  Pending: "Pending Regauging List",
  Completed: "Completed Regauging List",
  Cancelled: "Cancelled Regauging List",
};

const Regauging = (props) => {
  const dispatch = useDispatch();

  const currentTabDetails = useSelector((state) => {
    return get(state, "app.currentTab", null);
  });

  const handleTabChange = (tab, e) => {
    const tempObj = {
      Regauging: {
        tab: tab,
      },
    };
    dispatch(setCurrentTab({ ...currentTabDetails, ...tempObj }));
    dispatch(setCurrentView(headerTitle[tab]));
  };

  React.useEffect(() => {
    dispatch(setCurrentView(headerTitle[get(currentTabDetails, "Regauging.tab", "Pending")]));
  }, [currentTabDetails]);

  const getItems = () => {
    return [
      {
        key: "Pending",
        label: "Pending",
        children: <RegaugingPendingDataList {...props} />,
      },
      {
        key: "Completed",
        label: "Completed",
        children: <RegaugingCompletedDataList />,
      },
      {
        key: "Cancelled",
        label: "Cancelled",
        children: <RegaugingCancelledDataList />,
      },
    ];
  };

  return (
    <div className="bg-white border-radius-12 p-4 table-responsive-padding w-100  position-relative">
      <ErrorBoundary>
        <div className={`add_new__btn ${getScreenSize() > isMobileOrTab ? "position-absolute" : ""}`} style={{ right: "3%", zIndex: 9 }}>
          <Link to="/regauging/add-new">
            <Button type="primary" icon={<PlusOutlined />} className="mt-0">
              Add New
            </Button>
          </Link>
        </div>
        <div>
          <Tabs defaultActiveKey={get(currentTabDetails, "Regauging.tab")} activeKey={get(currentTabDetails, "Regauging.tab")} className="m-0" onTabClick={handleTabChange} items={getItems()} />
        </div>
      </ErrorBoundary>
    </div>
  );
};

export default Regauging;
