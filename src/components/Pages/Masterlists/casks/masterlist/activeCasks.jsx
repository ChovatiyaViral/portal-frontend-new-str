import axios from "axios";
import { get } from "lodash";
import React from "react";
import { TableColumnsList } from "../../../../../constants";
import { getRequestHeader } from "../../../../../helpers/service";
import { defaultRequestOptions } from "../../../../../settings";
import SearchWithExportUI from "../../../../CommonComponents/SearchWithExport";
import CustomFilters from "../../../../UIComponents/CustomFilters";
import ErrorBoundary from "../../../../UIComponents/ErrorBoundary";
import CustomTable from "../../../../UIComponents/Table/responsiveTable";
import { openNotificationWithIcon } from "../../../../UIComponents/Toast/notification";

/**
 * Renders Cask Master Listing component
 */
const ActiveCaskMasterList = (props) => {
  const [expectedData, setExpectedData] = React.useState([]);
  const [expectedMetaData, setExpectedMetaData] = React.useState([]);
  const [expectedClonedData, setExpectedClonedData] = React.useState([]);
  const [clearSearchString, setClearSearchString] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  const [openFilter, setOpenFilter] = React.useState(false);
  const [filterValuesList, setFilterValuesList] = React.useState([]);

  const handleToggleFilter = (value) => {
    setOpenFilter(value);
  };

  const updateCallInList = (data) => {
    setExpectedData(data);
    if (expectedClonedData.length === 0) {
      setExpectedClonedData(data);
    }
  };

  const handleSearch = (searchedData) => {
    if (get(searchedData, "isClient", true)) {
      setExpectedData(get(searchedData, "filteredData", []));
    }
  };

  const fetchCaskMasterList = async (requestOptions) => {
    setIsLoading(true);
    const rest = await axios({
      method: "POST",
      data: requestOptions,
      url: `${process.env.REACT_APP_API_ENDPOINT}/api/v1/cask/master`,
      headers: { ...getRequestHeader() },
    }).catch((err) => {
      setIsLoading(false);
      openNotificationWithIcon("error", `${get(err, "response.data.message", "Something Went Wrong")} `);
    });

    if (get(rest, "data.status")) {
      setIsLoading(false);
      updateCallInList(get(rest, "data.data", []));
      setExpectedMetaData(get(rest, "data.meta", []));
    }

    if (!get(rest, "data.status", true)) {
      setIsLoading(false);
      openNotificationWithIcon("error", `${get(rest, "response.data.message", "Something Went Wrong")} `);
    }
  };

  const init = () => {
    fetchCaskMasterList(defaultRequestOptions);
  };

  const isCleared = () => {
    setExpectedData(expectedClonedData);
    setClearSearchString(true);
  };

  const getDataSource = () => {
    const dataSource = {
      filterInfo: get(expectedMetaData, "filter_fields", []),
      columnData: expectedData,
      columnInfo: get(expectedMetaData, "column_info", []),
      columnClonedData: expectedClonedData,
    };

    return dataSource;
  };

  React.useEffect(() => {
    init();
  }, []);

  return (
    <>
      <div className="table-responsive-padding pt-3 bg-white">
        <ErrorBoundary>
          <SearchWithExportUI
            clearSearchString={clearSearchString}
            handleSearch={handleSearch}
            isSyncEnabled={true}
            handleSync={() => {
              setIsLoading(true);
              fetchCaskMasterList(defaultRequestOptions);
            }}
            columnType={TableColumnsList.CRRList}
            fetchDetails={(payload) => fetchCaskMasterList(payload)}
            expectedClonedData={expectedClonedData}
            expectedMetaData={expectedMetaData}
            expectedData={expectedData}
          />
          {openFilter && (
            <CustomFilters
              dataSource={getDataSource()}
              currentFilters={filterValuesList}
              open={openFilter}
              onFilterSubmit={(filterObj) => {
                setOpenFilter(false);
                setIsLoading(true);
                setFilterValuesList(filterObj);
                fetchCaskMasterList({ ...defaultRequestOptions, searchable_columns: filterObj });
              }}
              onReset={() => {
                setOpenFilter(false);
                setFilterValuesList([]);
                setIsLoading(true);
                fetchCaskMasterList(defaultRequestOptions);
              }}
              handleToggleFilter={handleToggleFilter}
            />
          )}

          <div className="task_management__crr_listing_view">
            <CustomTable
              data={expectedData}
              tableLayout="fixed"
              pagination={false}
              meta={expectedMetaData}
              isGlobalFilterEnabled={false}
              clonedData={expectedClonedData}
              columnType={TableColumnsList.CaskMasterList}
              isLoading={isLoading}
              isCleared={isCleared}
              isExportAvailable={false}
              onFilter={(payload) => fetchCaskMasterList({ ...defaultRequestOptions, searchable_columns: payload })}
              onReset={() => fetchCaskMasterList(defaultRequestOptions)}
              handleEdit={(record, type) => handleEditAction(record, type)}
            />
          </div>
        </ErrorBoundary>
      </div>
    </>
  );
};

export default ActiveCaskMasterList;
