import axios from "axios";
import { cloneDeep, get } from "lodash";
import React from "react";
import { useDispatch } from "react-redux";
import { TableColumnsList } from "../../../../../constants";
import { exportToCSV } from "../../../../../helpers/exportToCSV";
import { getRequestHeader } from "../../../../../helpers/service";
import { defaultRequestOptions } from "../../../../../settings";
import { setCurrentView } from "../../../../../store/Auth/auth.actions";
import SearchWithExportUI from "../../../../CommonComponents/SearchWithExport";
import CustomFilters from "../../../../UIComponents/CustomFilters";
import ErrorBoundary from "../../../../UIComponents/ErrorBoundary";
import { warning } from "../../../../UIComponents/Message";
import CustomTable from "../../../../UIComponents/Table/responsiveTable";
import { openNotificationWithIcon } from "../../../../UIComponents/Toast/notification";

/**
 * Renders Passport Master Listing component
 */
const PassportMasterList = (props) => {
  const [expectedData, setExpectedData] = React.useState([]);
  const [expectedMetaData, setExpectedMetaData] = React.useState([]);
  const [expectedClonedData, setExpectedClonedData] = React.useState([]);
  const [clearSearchString, setClearSearchString] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  const [openFilter, setOpenFilter] = React.useState(false);
  const [filterValuesList, setFilterValuesList] = React.useState([]);

  const dispatch = useDispatch();

  const { history } = props;

  const handleToggleFilter = (value) => {
    setOpenFilter(value);
  };

  React.useEffect(() => {
    dispatch(setCurrentView("All Passports"));
  }, []);

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

  const fetchPassportMasterList = async (requestOptions) => {
    const rest = await axios({
      method: "POST",
      data: requestOptions,
      url: `${process.env.REACT_APP_API_ENDPOINT}/api/v1/passport/master`,
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
    fetchPassportMasterList({
      page: "all",
    });
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

  const handleCSVDownload = () => {
    if (expectedData.length > 0) {
      let exportData = [];
      let dataToBeExported = cloneDeep(get(expectedMetaData, "column_info"));
      dataToBeExported.pop();
      exportData = expectedData.map((list) => {
        let tempObj = {};
        dataToBeExported.map((listColumn) => {
          let keyName = get(listColumn, "key_name");
          let displayName = get(listColumn, "display_name");
          return (tempObj[displayName] = list[keyName]);
        });
        return tempObj;
      });
      exportToCSV(exportData, TableColumnsList.PassportMasterList);
    } else {
      warning("No data available");
    }
  };

  React.useEffect(() => {
    init();
  }, []);

  return (
    <div className="p-4 table-responsive-padding bg-white border-radius-12">
      <ErrorBoundary>
        <SearchWithExportUI
          clearSearchString={clearSearchString}
          handleSearch={handleSearch}
          isSyncEnabled={true}
          handleSync={() => {
            setIsLoading(true);
            fetchPassportMasterList(defaultRequestOptions);
          }}
          columnType={TableColumnsList.PassportMasterList}
          fetchDetails={(payload) => fetchPassportMasterList(payload)}
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
              fetchPassportMasterList({ ...defaultRequestOptions, searchable_columns: filterObj });
            }}
            onReset={() => {
              setOpenFilter(false);
              setIsLoading(true);
              setFilterValuesList([]);
              fetchPassportMasterList(defaultRequestOptions);
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
            columnType={TableColumnsList.PassportMasterList}
            isLoading={get(props, "loading", false)}
            isCleared={isCleared}
            isExportAvailable={false}
            onFilter={(payload) => fetchPassportMasterList({ ...defaultRequestOptions, searchable_columns: payload })}
            onReset={() => fetchPassportMasterList(defaultRequestOptions)}
            handleEdit={(record, type) => handleEditAction(record, type)}
          />
        </div>
      </ErrorBoundary>
    </div>
  );
};

export default PassportMasterList;
