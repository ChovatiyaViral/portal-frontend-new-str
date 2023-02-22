import { Tabs } from "antd";
import axios from "axios";
import { get } from "lodash";
import React from "react";
import { useDispatch } from "react-redux";
import { getRequestHeader } from "../../../../../helpers/service";
import { defaultRequestOptions } from "../../../../../settings";
import { setCurrentView } from "../../../../../store/Auth/auth.actions";
import ErrorBoundary from "../../../../UIComponents/ErrorBoundary";
import { openNotificationWithIcon } from "../../../../UIComponents/Toast/notification";
import CaskActionItems from "./actionItems";
import CaskDetails from "./caskDetails";
import "./index.scss";
import MaintenanceHistory from "./maintenanceHistory";
import MovementHistory from "./movementHistory";
import SpiritTransfer from "./spiritTransfer";
import CaskTrackingDetails from "./trackingDetails";

const { TabPane } = Tabs;

/**
 * Renders Cask Profile Component
 */
const CaskProfile = (props) => {
  const dispatch = useDispatch();
  const [currentTab, setCurrentTab] = React.useState("2");
  const [expectedData, setExpectedData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const handleTabChange = (tab, e) => {
    setCurrentTab(tab);
  };

  const fetchCaskDetails = async () => {
    const rest = await axios({
      method: "GET",
      url: `${process.env.REACT_APP_API_ENDPOINT}/api/v1/cask/details/${get(props, "match.params.id")}`,
      headers: { ...getRequestHeader() },
    }).catch((err) => {
      setIsLoading(false);
      openNotificationWithIcon("error", `${get(err, "response.data.message", "Something Went Wrong")} `);
    });

    if (get(rest, "data.status")) {
      setIsLoading(false);
      setExpectedData(get(rest, "data.data", []));
    }

    if (!get(rest, "data.status", true)) {
      setIsLoading(false);
      openNotificationWithIcon("error", `${get(rest, "data.message", "Something Went Wrong")} `);
    }
  };

  const init = () => {
    fetchCaskDetails(defaultRequestOptions);
  };

  React.useEffect(() => {
    dispatch(setCurrentView("Cask Profile"));
    // init();
  }, []);

  const getItems = () => {
    return [
      {
        key: "1",
        label: "Action Items",
        children: <CaskActionItems caskDetails={expectedData} refetchCaskDetailsData={() => init()} />,
        disabled: true,
      },
      {
        key: "2",
        label: "Cask Details",
        children: <CaskDetails caskID={get(props, "match.params.id")} />,
      },
      {
        key: "3",
        label: "Maintenance history",
        children: <MaintenanceHistory caskID={get(props, "match.params.id")} />,
      },
      {
        key: "4",
        label: "Spirit Transfer",
        children: <SpiritTransfer />,
        disabled: true,
      },
      {
        key: "5",
        label: "Movement history",
        children: <MovementHistory />,
        disabled: true,
      },
      {
        key: "6",
        label: "Cask tracking details",
        children: <CaskTrackingDetails caskID={get(props, "match.params.id")} />,
      },
    ];
  };

  return (
    <>
      <div className="table-responsive-padding">
        <ErrorBoundary>
          <Tabs defaultActiveKey="1" className="cask__profile__tabs" activeKey={currentTab} onTabClick={handleTabChange} items={getItems()} />
        </ErrorBoundary>
      </div>
    </>
  );
};

export default CaskProfile;
