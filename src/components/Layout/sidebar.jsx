import { PlusOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import { find, get } from "lodash";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import SVGIcon from "../../constants/svgIndex";
import { AppRoutes, SidebarList } from "../../settings";
import "./index.scss";

/**
 * Renders Sidebar
 */
const Sidebar = (props) => {
  const { loggedInUser } = props;

  const getKeyValue = (key) => {
    return find(get(loggedInUser, "data.menu_items", []), function (o) {
      return get(o, "key") === key;
    });
  };

  function getItem(label, key, icon, children, type) {
    return {
      key,
      icon,
      children,
      label,
      type,
    };
  }

  const getSalesOrderModule = () => {
    let tempArr = [];
    if (getKeyValue("create_new_order")) {
      tempArr.push(
        getItem(
          <Link to={`/${AppRoutes.NewSalesOrder}`} className="text-decoration-none">
            {get(getKeyValue("create_new_order"), "display_name")}
          </Link>,
          get(getKeyValue("create_new_order"), "key"),
          <PlusOutlined />
        )
      );
    }
    if (getKeyValue("track_your_order")) {
      tempArr.push(
        getItem(
          <Link to={`/${AppRoutes.TrackOrder}`} className="text-decoration-none">
            {get(getKeyValue("track_your_order"), "display_name")}
          </Link>,
          get(getKeyValue("track_your_order"), "key")
        )
      );
    }
    if (getKeyValue("manage_orders")) {
      tempArr.push(
        getItem(
          <Link to={`/${AppRoutes.ManageOrders}`} className="text-decoration-none">
            {get(getKeyValue("manage_orders"), "display_name")}
          </Link>,
          get(getKeyValue("manage_orders"), "key")
        )
      );
    }
    if (getKeyValue("completed_orders")) {
      tempArr.push(
        getItem(
          <Link to={`/${AppRoutes.CompletedOrders}`} className="text-decoration-none">
            {get(getKeyValue("completed_orders"), "display_name")}
          </Link>,
          get(getKeyValue("completed_orders"), "key")
        )
      );
    }
    if (getKeyValue("cancelled_orders")) {
      tempArr.push(
        getItem(
          <Link to={`/${AppRoutes.CancelledOrders}`} className="text-decoration-none">
            {get(getKeyValue("cancelled_orders"), "display_name")}
          </Link>,
          get(getKeyValue("cancelled_orders"), "key")
        )
      );
    }
    if (getKeyValue("mis_reports")) {
      tempArr.push(
        getItem(
          <Link to={`/${AppRoutes.MisReports}`} className="text-decoration-none">
            {get(getKeyValue("mis_reports"), "display_name")}
          </Link>,
          get(getKeyValue("mis_reports"), "key")
        )
      );
    }

    return tempArr;
  };

  const getLeadModule = () => {
    let tempArr = [];
    if (getKeyValue("active_leads")) {
      tempArr.push(
        getItem(
          <Link to={`/${AppRoutes.ActiveLeads}`} className="text-decoration-none">
            {get(getKeyValue("active_leads"), "display_name")}
          </Link>,
          get(getKeyValue("active_leads"), "key")
        )
      );
    }
    if (getKeyValue("completed_leads")) {
      tempArr.push(
        getItem(
          <Link to={`/${AppRoutes.CompletedLeads}`} className="text-decoration-none">
            {get(getKeyValue("completed_leads"), "display_name")}
          </Link>,
          get(getKeyValue("completed_leads"), "key")
        )
      );
    }
    if (getKeyValue("customer_list")) {
      tempArr.push(
        getItem(
          <Link to={`/${AppRoutes.CustomerList}`} className="text-decoration-none">
            {get(getKeyValue("customer_list"), "display_name")}
          </Link>,
          get(getKeyValue("customer_list"), "key")
        )
      );
    }
    return tempArr;
  };

  const getMasterListModule = () => {
    let tempArr = [];
    if (getKeyValue("casks")) {
      tempArr.push(
        getItem(
          <Link to={`/${AppRoutes.CaskMasterListing}`} className="text-decoration-none">
            {get(getKeyValue("casks"), "display_name")}
          </Link>,
          get(getKeyValue("casks"), "key")
        )
      );
    }
    if (getKeyValue("passports")) {
      tempArr.push(
        getItem(
          <Link to={`/${AppRoutes.PassportMasterListing}`} className="text-decoration-none">
            {get(getKeyValue("passports"), "display_name")}
          </Link>,
          get(getKeyValue("passports"), "key")
        )
      );
    }
    return tempArr;
  };

  const getWarehouseJobsModule = () => {
    let tempArr = [];
    if (getKeyValue("add_new_task")) {
      tempArr.push(
        getItem(
          <Link to={`/${AppRoutes.AddNewTask}`} className="text-decoration-none">
            {get(getKeyValue("add_new_task"), "display_name")}
          </Link>,
          get(getKeyValue("add_new_task"), "key"),
          <PlusOutlined />
        )
      );
    }
    if (getKeyValue("crr_listing")) {
      tempArr.push(
        getItem(
          <Link to={`/${AppRoutes.CRRListing}`} className="text-decoration-none">
            {get(getKeyValue("crr_listing"), "display_name")}
          </Link>,
          get(getKeyValue("crr_listing"), "key")
        )
      );
    }
    if (getKeyValue("gate_entry")) {
      tempArr.push(
        getItem(
          <Link to={`/${AppRoutes.GateEntry}`} className="text-decoration-none">
            {get(getKeyValue("gate_entry"), "display_name")}
          </Link>,
          get(getKeyValue("gate_entry"), "key")
        )
      );
    }
    if (getKeyValue("regauging")) {
      tempArr.push(
        getItem(
          <Link to={`/${AppRoutes.Regauging}`} className="text-decoration-none">
            {get(getKeyValue("regauging"), "display_name")}
          </Link>,
          get(getKeyValue("regauging"), "key")
        )
      );
    }
    if (getKeyValue("sampling")) {
      tempArr.push(
        getItem(
          <Link to={`/${AppRoutes.SamplingData}`} className="text-decoration-none">
            {get(getKeyValue("sampling"), "display_name")}
          </Link>,
          get(getKeyValue("sampling"), "key")
        )
      );
    }
    return tempArr;
  };

  const getStoreLocatorModule = () => {
    let tempArr = [];
    if (getKeyValue("add_new_store")) {
      tempArr.push(
        getItem(
          <Link to={`/${AppRoutes.AddNewStore}`} className="text-decoration-none">
            {get(getKeyValue("add_new_store"), "display_name")}
          </Link>,
          get(getKeyValue("add_new_store"), "key"),
          <PlusOutlined />
        )
      );
    }
    if (getKeyValue("view_stores")) {
      tempArr.push(
        getItem(
          <Link to={`/${AppRoutes.ViewStores}`} className="text-decoration-none">
            {get(getKeyValue("view_stores"), "display_name")}
          </Link>,
          get(getKeyValue("view_stores"), "key")
        )
      );
    }
    if (getKeyValue("view_stores_category")) {
      tempArr.push(
        getItem(
          <Link to={`/${AppRoutes.ViewStoreCategory}`} className="text-decoration-none">
            {get(getKeyValue("view_stores_category"), "display_name")}
          </Link>,
          get(getKeyValue("view_stores_category"), "key")
        )
      );
    }
    if (getKeyValue("view_product_filter")) {
      tempArr.push(
        getItem(
          <Link to={`/${AppRoutes.ViewProductFilter}`} className="text-decoration-none">
            {get(getKeyValue("view_product_filter"), "display_name")}
          </Link>,
          get(getKeyValue("view_product_filter"), "key")
        )
      );
    }
    return tempArr;
  };

  const checkItem = (key) => {
    switch (key) {
      case AppRoutes.Dashboard:
        return getItem(
          <Link to={`/${AppRoutes.Dashboard}`} className="text-decoration-none">
            {SidebarList.Dashboard}
          </Link>,
          AppRoutes.Dashboard,
          <img src={SVGIcon.DashboardIcon} />
        );
      case "taxonomy":
        return getItem(
          <Link to={`/${AppRoutes.Taxonomy}`} className="text-decoration-none">
            {get(getKeyValue("taxonomy"), "display_name")}
          </Link>,
          get(getKeyValue("taxonomy"), "key"),
          <img src={SVGIcon.TaxonomyIcon} />
        );
      case "user_management":
        return getItem(
          <Link to={`/${AppRoutes.Users}`} className="text-decoration-none">
            {get(getKeyValue("user_management"), "display_name")}
          </Link>,
          get(getKeyValue("user_management"), "key"),
          <img src={SVGIcon.UsersIcon} />
        );
      case "cased_goods":
        return getItem(
          <Link to={`/${AppRoutes.CasedGoods}`} className="text-decoration-none">
            {get(getKeyValue("cased_goods"), "display_name")}
          </Link>,
          get(getKeyValue("cased_goods"), "key"),
          <img src={SVGIcon.CasedGoodsIcon} />
        );
      case "sales_orders":
        return getItem(get(getKeyValue("sales_orders"), "display_name"), get(getKeyValue("sales_orders"), "key"), <img src={SVGIcon.SalesOrderIcon} />, getSalesOrderModule());
      case "customer_data":
        return getItem(get(getKeyValue("customer_data"), "display_name"), get(getKeyValue("customer_data"), "key"), <img src={SVGIcon.CustomerDataIcon} />, getLeadModule());
      case "master_lists":
        return getItem(get(getKeyValue("master_lists"), "display_name"), get(getKeyValue("master_lists"), "key"), <img src={SVGIcon.CaskMasterListIcon} />, getMasterListModule());
      case "cask_jobs":
        return getItem(get(getKeyValue("cask_jobs"), "display_name"), get(getKeyValue("cask_jobs"), "key"), <img src={SVGIcon.WareHouseIcon} />, getWarehouseJobsModule());
      case "store_locator":
        return getItem(get(getKeyValue("store_locator"), "display_name"), get(getKeyValue("store_locator"), "key"), <img src={SVGIcon.StoreLocatarIcon} />, getStoreLocatorModule());
      case "help_tickets":
        return getItem(
          <Link to={`/${AppRoutes.HelpTickets}`} className="text-decoration-none">
            {get(getKeyValue("help_tickets"), "display_name")}
          </Link>,
          get(getKeyValue("help_tickets"), "key"),
          <img src={SVGIcon.HelpIcon} />
        );
      default:
        break;
    }
  };

  const items = get(loggedInUser, "data.menu_items", []).map((li) => {
    return checkItem(get(li, "key"));
  });

  return (
    <>
      <Menu mode="vertical" theme="dark" inlineIndent={20} className="sidebar__menu" items={items} />
    </>
  );
};

export default withRouter(Sidebar);
