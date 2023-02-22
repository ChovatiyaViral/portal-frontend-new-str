import { get, has } from "lodash";
import React from "react";
import CommonService from "../../../helpers/request/Common";
import { defaultRequestOptions } from "../../../settings";
import CustomFilters from "../../UIComponents/CustomFilters";
import ErrorBoundary from "../../UIComponents/ErrorBoundary";
import CustomTable from "../../UIComponents/Table/responsiveTable";
import { openNotificationWithIcon } from "../../UIComponents/Toast/notification";
import SearchWithExportUI from "../SearchWithExport";

/**
 * Renders List View component
 */
const ListView = (props) => {
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

  const updateList = (data) => {
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

  const fetchList = async (requestOptions) => {
    await CommonService.getDataSource(get(props, "API_URL"), requestOptions).then((data) => {
      if (get(data, "data.status")) {
        setIsLoading(false);
        updateList(get(data, "data.data", []));
        setExpectedMetaData(get(data, "data.meta", []));
      }

      if (!get(data, "data.status", true)) {
        setIsLoading(false);
        openNotificationWithIcon("error", "List", `${get(data, "data.message", "Something Went Wrong")} `);
      }
    });
  };

  const init = () => {
    fetchList({ page: "all" });
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

  const handleEditAction = (record, type, custom) => {
    if (has(props, "handleEditAction")) {
      props.handleEditAction(record, type, custom);
    }
  };

  return (
    <>
      <div className="table-responsive-padding pt-3 bg-white task_data_list">
        <ErrorBoundary>
          <SearchWithExportUI
            clearSearchString={clearSearchString}
            handleSearch={handleSearch}
            columnType={get(props, "columnType")}
            fetchDetails={(payload) => fetchList(payload)}
            isSyncEnabled={true}
            handleSync={() => {
              setIsLoading(true);
              fetchList(defaultRequestOptions);
            }}
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
                fetchList({ ...defaultRequestOptions, searchable_columns: filterObj });
              }}
              onReset={() => {
                setOpenFilter(false);
                setFilterValuesList([]);
                setIsLoading(true);
                fetchList(defaultRequestOptions);
              }}
              handleToggleFilter={handleToggleFilter}
            />
          )}

          <div className="mt-2">
            <CustomTable
              data={expectedData}
              pagination={false}
              meta={expectedMetaData}
              isGlobalFilterEnabled={false}
              clonedData={expectedClonedData}
              columnType={get(props, "columnType")}
              isLoading={isLoading}
              isCleared={isCleared}
              isExportAvailable={false}
              onFilter={(payload) => fetchList({ ...defaultRequestOptions, searchable_columns: payload })}
              onReset={() => fetchList(defaultRequestOptions)}
              handleEdit={(record, type) => handleEditAction(record, type)}
            />
          </div>
        </ErrorBoundary>
      </div>
    </>
  );
};

export default ListView;
