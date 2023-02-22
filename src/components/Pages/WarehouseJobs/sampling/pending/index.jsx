import { message } from "antd";
import axios from "axios";
import { get } from "lodash";
import React from "react";
import { TableColumnsList } from "../../../../../constants";
import CommonService from "../../../../../helpers/request/Common";
import { getRequestHeader, requestPath } from "../../../../../helpers/service";
import { defaultRequestOptions } from "../../../../../settings";
import SearchWithExportUI from "../../../../CommonComponents/SearchWithExport";
import CustomFilters from "../../../../UIComponents/CustomFilters";
import ErrorBoundary from "../../../../UIComponents/ErrorBoundary";
import CustomTable from "../../../../UIComponents/Table/responsiveTable";
import { openNotificationWithIcon } from "../../../../UIComponents/Toast/notification";
import { CancelUI } from "./cancelUI";
import { RescheduleUI } from "./rescheduleUI";

/**
 * Renders Pending Sampling Data component
 */
const PendingSampleDataList = (props) => {
  const [expectedData, setExpectedData] = React.useState([]);
  const [expectedMetaData, setExpectedMetaData] = React.useState([]);
  const [expectedClonedData, setExpectedClonedData] = React.useState([]);
  const [clearSearchString, setClearSearchString] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [cancelUIloading, setCancelUIloading] = React.useState(false);
  const [rescheduleUIloading, setRescheduleUIloading] = React.useState(false);
  const [isCancelModalVisible, setIsCancelModalVisible] = React.useState(false);
  const [isRescheduleModalVisible, setIsRescheduleModalVisible] = React.useState(false);
  const [selectedRecord, setSelectedRecord] = React.useState({});

  const [openFilter, setOpenFilter] = React.useState(false);
  const [filterValuesList, setFilterValuesList] = React.useState([]);

  const { history } = props;

  const handleToggleFilter = (value) => {
    setOpenFilter(value);
  };

  const updatePendingList = (data) => {
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

  const fetchPendingList = async (requestOptions) => {
    await CommonService.getDataSource(requestPath.wareHouseJobsManagement.sampling.getPendingList, requestOptions).then((data) => {
      if (get(data, "data.status")) {
        setIsLoading(false);
        updatePendingList(get(data, "data.data", []));
        setExpectedMetaData(get(data, "data.meta", []));
      }

      if (!get(data, "data.status", true)) {
        setIsLoading(false);
        openNotificationWithIcon("error", "Pending Regauge List", `${get(data, "data.message", "Something Went Wrong")} `);
      }
    });
  };

  const init = () => {
    fetchPendingList({ page: "all" });
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

  const handleEditAction = (record, type) => {
    setSelectedRecord(record);
    if (type === "cancel") {
      setIsCancelModalVisible(true);
    }
    if (type === "reschedule") {
      setIsRescheduleModalVisible(true);
    }
    if (type === "complete") {
      if (get(record, "cask_sample_id")) {
        history.push(`sampling/complete/${get(record, "cask_sample_id")}`);
      } else {
        message.info("Cask Sampling ID not found");
      }
    }
  };

  const handleCancelUISubmit = async (comments) => {
    const rest = await axios({
      method: "POST",
      data: {
        sampling_id: get(selectedRecord, "cask_sample_id"),
        comments: comments,
      },
      url: `${process.env.REACT_APP_API_ENDPOINT}/api/v1/cask_sample/cancel_job`,
      headers: { ...getRequestHeader() },
    }).catch((err) => {
      setCancelUIloading(false);
      openNotificationWithIcon("error", `${get(err, "response.data.message", "Something Went Wrong")} `);
    });

    if (get(rest, "data.status")) {
      openNotificationWithIcon("success", get(rest, "data.message", "Updated successfully"));
      setCancelUIloading(false);
      setIsCancelModalVisible(false);
      fetchPendingList(defaultRequestOptions);
    }

    if (!get(rest, "data.status")) {
      setCancelUIloading(false);
      openNotificationWithIcon("failure", get(rest, "data.message", "Something Went Wrong"));
    }
  };

  const handleRescheduleUISubmit = async (data) => {
    const rest = await axios({
      method: "POST",
      data: {
        sampling_id: get(selectedRecord, "cask_sample_id"),
        scheduled_at: get(data, "follow_up_date"),
        comments: get(data, "comments"),
      },
      url: `${process.env.REACT_APP_API_ENDPOINT}/api/v1/cask_sample/reschedule_job`,
      headers: { ...getRequestHeader() },
    }).catch((err) => {
      setRescheduleUIloading(false);
      openNotificationWithIcon("error", `${get(err, "response.data.message", "Something Went Wrong")} `);
    });

    if (get(rest, "data.status")) {
      openNotificationWithIcon("success", get(rest, "data.message", "Updated successfully"));
      setRescheduleUIloading(false);
      setIsRescheduleModalVisible(false);
      fetchPendingList(defaultRequestOptions);
    }

    if (!get(rest, "data.status")) {
      setRescheduleUIloading(false);
      openNotificationWithIcon("failure", get(rest, "data.message", "Something Went Wrong"));
    }
  };

  return (
    <>
      <div className="table-responsive-padding pt-3 bg-white task_data_list">
        <ErrorBoundary>
          {isCancelModalVisible && (
            <CancelUI
              isModalVisible={isCancelModalVisible}
              placeholder="Why you want to cancel the job?"
              title={`Reason for Cancellation - #${get(selectedRecord, "job_id")}`}
              record={selectedRecord}
              loading={cancelUIloading}
              handleCancel={() => setIsCancelModalVisible(false)}
              handleSubmit={(comments) => {
                setCancelUIloading(true);
                handleCancelUISubmit(comments);
              }}
            />
          )}
          {isRescheduleModalVisible && (
            <RescheduleUI
              isModalVisible={isRescheduleModalVisible}
              record={selectedRecord}
              title={`Reason for Rescheduling - #${get(selectedRecord, "job_id")}`}
              loading={rescheduleUIloading}
              handleCancel={() => setIsRescheduleModalVisible(false)}
              handleSubmit={(date) => {
                setRescheduleUIloading(true);
                handleRescheduleUISubmit(date);
              }}
            />
          )}
          <SearchWithExportUI
            clearSearchString={clearSearchString}
            handleSearch={handleSearch}
            columnType={TableColumnsList.PendingSamplingData}
            fetchDetails={(payload) => fetchPendingList(payload)}
            isSyncEnabled={true}
            handleSync={() => {
              setIsLoading(true);
              fetchPendingList(defaultRequestOptions);
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
                fetchPendingList({ ...defaultRequestOptions, searchable_columns: filterObj });
              }}
              onReset={() => {
                setOpenFilter(false);
                setFilterValuesList([]);
                setIsLoading(true);
                fetchPendingList(defaultRequestOptions);
              }}
              handleToggleFilter={handleToggleFilter}
            />
          )}

          <div className="task_management__crr_listing_view">
            <CustomTable
              data={expectedData}
              pagination={false}
              meta={expectedMetaData}
              isGlobalFilterEnabled={false}
              clonedData={expectedClonedData}
              size="small"
              columnType={TableColumnsList.PendingSamplingData}
              isLoading={isLoading}
              isCleared={isCleared}
              isExportAvailable={false}
              onFilter={(payload) => fetchPendingList({ ...defaultRequestOptions, searchable_columns: payload })}
              onReset={() => fetchPendingList(defaultRequestOptions)}
              handleEdit={(record, type) => handleEditAction(record, type)}
            />
          </div>
        </ErrorBoundary>
      </div>
    </>
  );
};

export default PendingSampleDataList;
