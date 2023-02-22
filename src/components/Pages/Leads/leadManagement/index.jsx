import { PlusOutlined } from "@ant-design/icons";
import { Button, Tabs } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { setCurrentView } from "../../../../store/Auth/auth.actions";
import CompletedLeads from "../completedLeads";
import CustomerListing from "../customerData";
import LeadsManagement from "../index";

import "./index.scss";

const { TabPane } = Tabs;

const headerTitle = {
  "Active Leads": "Manage Customer Leads",
  "Completed Leads": "Completed Leads",
  "Customer List": "Customer List",
};

const LeadManagement = (props) => {
  const dispatch = useDispatch();
  const [currentTab, setCurrentTab] = React.useState("1");
  const [addLead, setAddLeadStatus] = React.useState(false);
  const [addCustomer, setAddCustomerStatus] = React.useState(false);

  const handleTabChange = (tab, e) => {
    setCurrentTab(tab);
    dispatch(setCurrentView(headerTitle[e.target.innerText]));
  };

  const getItems = () => {
    return [
      {
        key: "1",
        label: "Active Leads",
        children: <LeadsManagement addStatus={addLead} handleAddStatus={(val) => setAddLeadStatus(val)} />
      },
      {
        key: "2",
        label: "Completed Leads",
        children: <CompletedLeads />
      },
      {
        key: "3",
        label: "Customer List",
        children: <CustomerListing addStatus={addCustomer} handleAddStatus={(val) => setAddCustomerStatus(val)} />
      }
    ];
  };

  return (
    <div className="lead_tabs">
      <div className="add_new_lead_btn">
        {currentTab === "1" && (
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setAddLeadStatus(!addLead)}>
            Add Lead
          </Button>
        )}
        {currentTab === "3" && (
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setAddCustomerStatus(!addCustomer)}>
            Add Customer
          </Button>
        )}
      </div>
      <Tabs defaultActiveKey="1" activeKey={currentTab} onTabClick={handleTabChange} items={getItems()} />
    </div>
  );
};

export default LeadManagement;
