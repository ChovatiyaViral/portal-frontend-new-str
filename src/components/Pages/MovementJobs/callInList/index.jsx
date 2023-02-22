import { Tabs } from "antd";
import { get, map } from "lodash";
import React from "react";
import { connect, useDispatch } from "react-redux";
import { TableColumnsList } from "../../../../constants";
import { defaultRequestOptions } from "../../../../settings";
import { setCurrentView } from "../../../../store/Auth/auth.actions";
import ErrorBoundary from "../../../UIComponents/ErrorBoundary";
import CustomTable from "../../../UIComponents/Table/responsiveTable";
import { openNotificationWithIcon } from "../../../UIComponents/Toast/notification";

const { TabPane } = Tabs;

/**
 * Renders Call In List component
 */
const CallInList = (props) => {
  const [expectedData, setExpectedData] = React.useState([]);
  const [expectedMetaData, setExpectedMetaData] = React.useState([]);
  const [expectedClonedData, setExpectedClonedData] = React.useState([]);
  const [clearSearchString, setClearSearchString] = React.useState(false);
  const [container, setContainer] = React.useState(null);
  const dispatch = useDispatch();

  const updateCallInList = (data) => {
    setExpectedData(data);
    if (expectedClonedData.length === 0) {
      setExpectedClonedData(data);
    }
  };

  const fetchCallInList = async (requestOptions) => {
    // let callInListResponse = await props.getCallInList(requestOptions);
    let callInListResponse = {};

    if (get(callInListResponse, "response.status")) {
      updateCallInList(get(callInListResponse, "response.data"));
      setExpectedMetaData(get(callInListResponse, "response.meta"));
    }

    if (!get(callInListResponse, "response.status")) {
      openNotificationWithIcon("info", "Call In List", `${get(callInListResponse, "response.message", "Something Went Wrong")} `);
    }

    if (get(callInListResponse, "error", false)) {
      openNotificationWithIcon("error", "Call In List", `${get(callInListResponse, "error.message", "Something Went Wrong")} `);
    }
  };

  const init = () => {
    fetchCallInList(defaultRequestOptions);
  };

  const isCleared = () => {
    setExpectedData(expectedClonedData);
    setClearSearchString(true);
  };

  const handleSearch = (searchedData) => {
    if (get(searchedData, "isClient", true)) {
      setExpectedData(get(searchedData, "filteredData", []));
    }
  };

  React.useEffect(() => {
    dispatch(setCurrentView("Call In List"));
  }, []);

  const handleAdd = () => {
    setAddCask(true);
  };

  const onTabChange = (key) => {
    // eslint-disable-next-line no-console
    console.log(key);
  };

  React.useEffect(() => {
    init();
  }, []);

  const tabsListing = [
    {
      displayName: "Unassigned",
      key: "unassigned",
    },
    {
      displayName: "Ongoing",
      key: "ongoing",
    },
    {
      displayName: "Completed",
      key: "completed",
    },
    {
      displayName: "Archived",
      key: "archived",
    },
  ];
  const getItems = () => {
    return map(tabsListing || [], (list, index) => ({
      key: get(list, "key"),
      label: get(list, "displayName"),
      children: (
        <CustomTable
          data={expectedData}
          style={{ top: 0, marginBottom: 0 }}
          meta={expectedMetaData}
          clonedData={expectedClonedData}
          columnType={TableColumnsList.CallInList}
          isLoading={get(props, "callInListLoading", false)}
          isGlobalFilterEnabled={true}
          onFilter={(payload) => fetchCallInList({ ...defaultRequestOptions, searchable_columns: payload })}
          onReset={() => fetchCallInList(defaultRequestOptions)}
          isCleared={() => isCleared()}
        />
      )
    }))
  }

  return (
    <>
      <div className="bg-white p-4 table-responsive-padding">
        <ErrorBoundary>
          <Tabs defaultActiveKey="1" onChange={onTabChange} ref={setContainer} items={getItems()} />
        </ErrorBoundary>
      </div>
    </>
  );
};

export default connect(
  (state) => ({
    callInListLoading: get(state, "casks.loading", false),
  }),
  {}
)(CallInList);
