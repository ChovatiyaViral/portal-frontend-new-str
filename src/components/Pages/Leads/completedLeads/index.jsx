import ErrorBoundary from "../../../UIComponents/ErrorBoundary";
import CustomTable from "../../../UIComponents/Table/responsiveTable";
import { openNotificationWithIcon } from "../../../UIComponents/Toast/notification";
import { TableColumnsList } from "../../../../constants";
import { defaultRequestOptions } from "../../../../settings";
import { getCompletedLeads } from "../../../../store/Leads/leads.actions";
import { Modal } from "antd";
import { get } from "lodash";
import React from "react";
import { connect, useDispatch } from "react-redux";
import { setCurrentView } from "../../../../store/Auth/auth.actions";
import SearchWithExportUI from "../../../CommonComponents/SearchWithExport";
import { getDataWrapper } from "../getData";

/**
 * Renders Completed Leads component
 */
const CompletedLeads = (props) => {
  const dispatch = useDispatch();

  const [expectedData, setExpectedData] = React.useState([]);
  const [expectedMetaData, setExpectedMetaData] = React.useState([]);
  const [expectedClonedData, setExpectedClonedData] = React.useState([]);
  const [clearSearchString, setClearSearchString] = React.useState(false);

  React.useEffect(() => {
    dispatch(setCurrentView("Completed Leads"));
  }, []);

  const updateState = (data) => {
    setExpectedData(getDataWrapper(data));
    if (expectedClonedData.length === 0) {
      setExpectedClonedData(getDataWrapper(data));
    }
  };

  const isCleared = () => {
    setExpectedData(expectedClonedData);
    setClearSearchString(true);
  };

  const fetchCompletedLeads = async (requestOptions) => {
    let completedLeadsResp = await props.getCompletedLeads({ ...requestOptions });

    if (get(completedLeadsResp, "error", false)) {
      openNotificationWithIcon("error", "Completed Leads", `${get(completedLeadsResp, "error.message", "Something Went Wrong")} `);
    }

    if (get(completedLeadsResp, "response.status")) {
      setExpectedMetaData(get(completedLeadsResp, "response.meta"));
      updateState(get(completedLeadsResp, "response.data", []));
    }
  };

  React.useEffect(() => {
    fetchCompletedLeads(defaultRequestOptions);
  }, []);

  const handleSearch = (searchedData) => {
    if (get(searchedData, "isClient", true)) {
      setExpectedData(get(searchedData, "filteredData", []));
    }
  };

  const handleEditAction = (record, type, custom) => {
    if (get(custom, "status") === "message") {
      MessageInfo(get(record, "message"), get(record, "id"));
    }
  };

  const MessageInfo = (content = "", id = "") => {
    Modal.info({
      title: `Message - Lead #${id}`,
      centered: true,
      width: 600,
      content: (
        <div className="lead__message_info">
          <p>{content}</p>
        </div>
      ),
      onOk() {},
    });
  };

  return (
    <>
      {/* <Heading text="Completed Leads" variant="h4" /> */}
      <div className="bg-white p-4 table-responsive-padding">
        <ErrorBoundary>
          <SearchWithExportUI
            clearSearchString={clearSearchString}
            handleSearch={handleSearch}
            isSyncEnabled={true}
            handleSync={() => fetchCompletedLeads(defaultRequestOptions)}
            columnType={TableColumnsList.CustomerList}
            fetchDetails={(payload) => fetchCompletedLeads(payload)}
            expectedClonedData={expectedClonedData}
            expectedMetaData={expectedMetaData}
            expectedData={expectedData}
          />
          <div>
            <CustomTable
              data={expectedData}
              meta={expectedMetaData}
              clonedData={expectedClonedData}
              columnType={TableColumnsList.CompletedLeads}
              isLoading={get(props, "loading", false)}
              isCleared={isCleared}
              isGlobalFilterEnabled={false}
              isExportAvailable={false}
              onFilter={(payload) => fetchCompletedLeads({ ...defaultRequestOptions, searchable_columns: payload })}
              onReset={() => fetchCompletedLeads(defaultRequestOptions)}
              handleEdit={(record, type, custom) => handleEditAction(record, type, custom)}
            />
          </div>
        </ErrorBoundary>
      </div>
    </>
  );
};

export default connect(
  (state) => ({
    loading: get(state, "leads.loading", false),
    error: get(state, "leads.failure", false),
  }),
  { getCompletedLeads }
)(CompletedLeads);
