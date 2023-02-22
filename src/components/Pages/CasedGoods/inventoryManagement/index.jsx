import { PlusOutlined } from "@ant-design/icons";
import { Button, Tabs } from "antd";
import { find, get } from "lodash";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { setCurrentView } from "../../../../store/Auth/auth.actions";
import DeletedCasedGoods from "../archiveCases/deletedCasedGoods";
import CasesChangeLog from "../changeLog/changeLog";
import CasedGoods from "../index";
import "../index.scss";

const { TabPane } = Tabs;

const headerTitle = {
  "Live Inventory": "View Live Inventory",
  "Archived Inventory": "View Archived Inventory",
  "Inventory Change Log": "Inventory Change Log",
};

const CasedGoodsManagement = () => {
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(setCurrentView(headerTitle["Live Inventory"]));
  }, []);

  const handleTabChange = (tab, e) => {
    dispatch(setCurrentView(headerTitle[e.target.innerText]));
  };

  const loggedInUser = useSelector((state) => {
    return get(state, "auth.loggedInUserDetails", null);
  });

  const getKeyValue = (key) => {
    return find(get(loggedInUser, "data.menu_items", []), function (o) {
      return get(o, "key") === key;
    });
  };

  const getItems = () => {
    let tempArr = [];
    if (getKeyValue("live_inventory")) {
      tempArr.push({
        key: get(getKeyValue("live_inventory"), "key"),
        label: get(getKeyValue("live_inventory"), "display_name"),
        children: <CasedGoods />,
      });
    }
    if (getKeyValue("inventory_change_log")) {
      tempArr.push({
        key: get(getKeyValue("inventory_change_log"), "key"),
        label: get(getKeyValue("inventory_change_log"), "display_name"),
        children: <CasesChangeLog />,
      });
    }
    if (getKeyValue("archived_inventory")) {
      tempArr.push({
        key: get(getKeyValue("archived_inventory"), "key"),
        label: get(getKeyValue("archived_inventory"), "display_name"),
        children: <DeletedCasedGoods />,
      });
    }
    return tempArr;
  };

  return (
    <div className="bg-white border-radius-12">
      <div className="add_new__btn mr-sm-4">
        <Link to="/add-new-cases">
          <Button type="primary" icon={<PlusOutlined />}>
            Add New Case
          </Button>
        </Link>
      </div>
      <Tabs defaultActiveKey="1" onTabClick={handleTabChange} className="m-0 pl-sm-4" items={getItems()} />
    </div>
  );
};

export default CasedGoodsManagement;
