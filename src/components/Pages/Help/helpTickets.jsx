import { get } from "lodash";
import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { TableColumnsList } from "../../../constants";
import { getDataWrapper } from "../../../helpers/utility";
import { defaultRequestOptions } from "../../../settings";
import { setCurrentView } from "../../../store/Auth/auth.actions";
import { getHelpDetails } from "../../../store/Help/help.actions";
import ErrorBoundary from "../../UIComponents/ErrorBoundary";
// import Heading from "../../UIComponents/Heading";
import SearchWithExportUI from "../../CommonComponents/SearchWithExport";
import { info } from "../../UIComponents/Modal/informationModal";
import CustomTable from "../../UIComponents/Table/responsiveTable";
import "./style.scss";

const HelpTicket = (props) => {
  const dispatch = useDispatch();

  const [expectedData, setExpectedData] = useState([]);
  const [expectedMetaData, setExpectedMetaData] = React.useState([]);
  const [expectedClonedData, setExpectedClonedData] = useState([]);
  const [clearSearchString, setClearSearchString] = useState(false);

  React.useEffect(() => {
    dispatch(setCurrentView("Help Tickets"));
  }, []);

  const getHelpList = async () => {
    const helpList = await props.getHelpDetails(defaultRequestOptions);
    updateState(get(helpList, "response.data"));
    setExpectedMetaData(get(helpList, "response.meta"));
  };

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

  const handleSearch = (searchedData) => {
    if (get(searchedData, "isClient", true)) {
      setExpectedData(get(searchedData, "filteredData", []));
    }
  };

  useEffect(() => {
    if (get(props, "helpListData", []).length === 0) {
      getHelpList();
    } else {
      setExpectedMetaData(get(props, "helpListData.meta"));
      updateState(get(props, "helpListData.data", []));
    }
  }, []);

  const getCaseDetailsContent = (requestData) => {
    return (
      <div className="issue_image">
        <div className="issue_image_container">
          <img src={requestData.image_url} alt="" />
        </div>
        <div className="description">
          <label>Description</label>
          <p>{requestData.comments}</p>
        </div>
      </div>
    );
  };

  const handleViewDetail = async (record) => {
    info({
      title: "Issue Image",
      message: getCaseDetailsContent(record),
      width: 800,
    });
  };

  return (
    <>
      {/* <Heading text="Help Tickets" variant="h4" /> */}
      <div className="bg-white p-4">
        <ErrorBoundary>
          <SearchWithExportUI
            clearSearchString={clearSearchString}
            handleSearch={handleSearch}
            isSyncEnabled={true}
            handleSync={() => getHelpList()}
            columnType={TableColumnsList.HelpTicket}
            fetchDetails={(payload) => getHelpList(payload)}
            expectedClonedData={expectedClonedData}
            expectedMetaData={expectedMetaData}
            expectedData={expectedData}
          />
          <div>
            <CustomTable
              data={expectedData}
              meta={expectedMetaData}
              clonedData={expectedClonedData}
              columnType={TableColumnsList.HelpTicket}
              isLoading={get(props, "loading", false)}
              isCleared={isCleared}
              isExportAvailable={false}
              isGlobalFilterEnabled={false}
              handleEdit={(record) => handleViewDetail(record)}
            />
          </div>
        </ErrorBoundary>
      </div>
    </>
  );
};

export default connect(
  (state) => ({
    loading: get(state, "help.loading", false),
    error: get(state, "help.failure", false),
    helpListData: get(state, "help.helpList", []),
  }),
  { getHelpDetails }
)(HelpTicket);
