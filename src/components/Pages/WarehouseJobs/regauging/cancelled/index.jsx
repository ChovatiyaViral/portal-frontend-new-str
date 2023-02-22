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
 * Renders Cancelled Sampling Data component
 */
const RegaugingCancelledDataList = (props) => {
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

  const updateRegaugeList = (data) => {
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

  const fetchRegaugeList = async (requestOptions) => {
    const rest = await axios({
      method: "POST",
      data: requestOptions,
      url: `${process.env.REACT_APP_API_ENDPOINT}/api/v1/cask_regauge/cancelled`,
      headers: { ...getRequestHeader() },
    }).catch((err) => {
      setIsLoading(false);
      openNotificationWithIcon("error", `${get(err, "response.data.message", "Something Went Wrong")} `);
    });

    if (get(rest, "data.status")) {
      setIsLoading(false);
      updateRegaugeList(get(rest, "data.data", []));
      setExpectedMetaData(get(rest, "data.meta", []));
    }

    if (!get(rest, "data.status", true)) {
      setIsLoading(false);
      openNotificationWithIcon("error", `${get(rest, "response.data.message", "Something Went Wrong")} `);
    }
  };

  const init = () => {
    fetchRegaugeList(defaultRequestOptions);
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
      <div className="table-responsive-padding pt-3 bg-white task_data_list">
        <ErrorBoundary>
          <SearchWithExportUI
            clearSearchString={clearSearchString}
            handleSearch={handleSearch}
            columnType={TableColumnsList.RegaugeList}
            isSyncEnabled={true}
            handleSync={() => {
              setIsLoading(true);
              fetchRegaugeList(defaultRequestOptions);
            }}
            fetchDetails={(payload) => fetchRegaugeList(payload)}
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
                fetchRegaugeList({ ...defaultRequestOptions, searchable_columns: filterObj });
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

          <CustomTable
            data={expectedData}
            tableLayout="fixed"
            pagination={false}
            meta={expectedMetaData}
            isGlobalFilterEnabled={false}
            clonedData={expectedClonedData}
            columnType={TableColumnsList.RegaugeList}
            isLoading={isLoading}
            isCleared={isCleared}
            isExportAvailable={false}
            onFilter={(payload) => fetchRegaugeList({ ...defaultRequestOptions, searchable_columns: payload })}
            onReset={() => fetchRegaugeList(defaultRequestOptions)}
            handleEdit={(record, type) => handleEditAction(record, type)}
          />
        </ErrorBoundary>
      </div>
    </>
  );
};

export default RegaugingCancelledDataList;
