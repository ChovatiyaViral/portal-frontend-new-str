import { Tabs } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { setCurrentView } from "../../../../../store/Auth/auth.actions";
import ActiveCaskMasterList from "./activeCasks";
import ArchivedCaskMasterList from "./archivedCasks";

const CaskManagement = (props) => {
  const dispatch = useDispatch();
  const [currentTab, setCurrentTab] = React.useState("1");

  React.useEffect(() => {
    dispatch(setCurrentView("All Casks"));
  }, []);

  const handleTabChange = (tab, e) => {
    setCurrentTab(tab);
  };

  const getItems = () => {
    return [
      {
        key: "1",
        label: "Active",
        children: <ActiveCaskMasterList />,
      },
      {
        key: "2",
        label: "Archived",
        children: <ArchivedCaskMasterList />,
      },
    ];
  };

  return (
    <div className="table-responsive-padding p-4 bg-white border-radius-12">
      <Tabs defaultActiveKey="1" activeKey={currentTab} onTabClick={handleTabChange} items={getItems()} />
    </div>
  );
};

export default CaskManagement;
