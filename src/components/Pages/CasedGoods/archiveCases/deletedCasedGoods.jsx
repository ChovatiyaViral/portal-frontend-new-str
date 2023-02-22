import { TableColumnsList } from "../../../../constants";
import { defaultRequestOptions } from "../../../../settings";
import { deleteCasedGoodDetails, getCasedGoods, getDeletedCasedGoods } from "../../../../store/CasedGoods/casedGoods.actions";
import ErrorBoundary from "../../../UIComponents/ErrorBoundary";
import CustomTable from "../../../UIComponents/Table/responsiveTable";
import { openNotificationWithIcon } from "../../../UIComponents/Toast/notification";
import { get } from "lodash";
import React from "react";
import { connect, useDispatch } from "react-redux";
import { setCurrentView } from "../../../../store/Auth/auth.actions";
import SearchWithExportUI from "../../../CommonComponents/SearchWithExport";
import "../index.scss";
import { getDynamicDataWrapper } from "../utility/getData";
import { CommentsUI } from "./commentsUI";

/**
 * Renders Cased Goods component
 */
const DeletedCasedGoods = (props) => {
  const dispatch = useDispatch();

  const [expectedData, setExpectedData] = React.useState([]);
  const [expectedMetaData, setExpectedMetaData] = React.useState([]);
  const [expectedClonedData, setExpectedClonedData] = React.useState([]);
  const [clearSearchString, setClearSearchString] = React.useState(false);
  const [selectedRecord, setSelectedRecord] = React.useState({});
  const [isArchiveCommentsModalVisible, setIsArchiveCommentsModalVisible] = React.useState(false);

  const updateState = (data) => {
    setExpectedData(getDynamicDataWrapper(data));
    if (expectedClonedData.length === 0) {
      setExpectedClonedData(getDynamicDataWrapper(data));
    }
  };

  React.useEffect(() => {
    dispatch(setCurrentView("View Archived Inventory"));
  }, []);

  const fetchAllCasedGoods = async () => {
    const searchable_columns = [{ field_name: "deleted", field_value: "no" }];
    const inventoryResponse = await props.getCasedGoods({ ...defaultRequestOptions, searchable_columns });

    if (get(inventoryResponse, "error", false)) {
      openNotificationWithIcon("error", "Inventory", `${get(inventoryResponse, "error.message", "Something Went Wrong")} `);
    }
  };

  const fetchCasedGoods = async (requestOptions) => {
    let searchable_columns = [{ field_name: "deleted", field_value: "yes" }];
    searchable_columns = [...get(requestOptions, "searchable_columns", []), ...searchable_columns];

    const inventoryResponse = await props.getDeletedCasedGoods({ ...requestOptions, searchable_columns });

    if (get(inventoryResponse, "error", false)) {
      openNotificationWithIcon("error", "Inventory", `${get(inventoryResponse, "error.message", "Something Went Wrong")} `);
    }

    if (get(inventoryResponse, "response.status")) {
      setExpectedMetaData(get(inventoryResponse, "response.meta"));
      updateState(get(inventoryResponse, "response.data"));
    }
  };

  React.useEffect(() => {
    if (get(props, "casedGoods", []).length === 0) {
      fetchCasedGoods(defaultRequestOptions);
    } else {
      setExpectedMetaData(get(props, "casedGoods.meta"));
      updateState(get(props, "casedGoods.data", []));
    }
  }, []);

  const isCleared = () => {
    setExpectedData(expectedClonedData);
    setClearSearchString(true);
  };

  const handleSearch = (searchedData) => {
    if (get(searchedData, "isClient", true)) {
      setExpectedData(get(searchedData, "filteredData", []));
    } else {
      let requestOptions = {
        ...defaultRequestOptions,
        field_value: get(searchedData, "searchString", ""),
      };
      fetchCasedGoods(requestOptions);
    }
  };

  const deleteInventory = async (record) => {
    const requestOptions = { id: get(record, "id"), delete_or_undelete: "undelete", reason: get(record, "archivedComments") };
    const deleteInventory = await props.deleteCasedGoodDetails(requestOptions);

    if (get(deleteInventory, "response.status")) {
      setIsArchiveCommentsModalVisible(false);
      openNotificationWithIcon("success", "Inventory", `${get(deleteInventory, "response.message", "Restored Successfully")} `);
      fetchCasedGoods(defaultRequestOptions);
      fetchAllCasedGoods();
    }

    // if (!get(deleteInventory, "response.status")) {
    //   openNotificationWithIcon("info", "Inventory", `${get(deleteInventory, "response.message", "Something Went Wrong")} `);
    // }

    if (get(deleteInventory, "error", false)) {
      openNotificationWithIcon("error", "Inventory", `${get(deleteInventory, "error.message", "Something Went Wrong")} `);
    }
  };

  const handleInventoryEdit = (record, type) => {
    setSelectedRecord(record);
    setIsArchiveCommentsModalVisible(true);
  };

  return (
    <>
      {/* <Heading text="View Archived Inventory" variant="h4" /> */}
      {isArchiveCommentsModalVisible && (
        <CommentsUI
          isModalVisible={isArchiveCommentsModalVisible}
          title="Reason to Restore ?"
          label="Reason"
          loading={get(props, "loading", false)}
          note="(Note: Please verify that quantity & prices are updated when restored)"
          handleCancel={() => setIsArchiveCommentsModalVisible(false)}
          handleSubmit={(comments) => deleteInventory({ ...selectedRecord, archivedComments: comments })}
        />
      )}
      <div className="bg-white table-responsive-padding">
        <ErrorBoundary>
          <SearchWithExportUI
            clearSearchString={clearSearchString}
            handleSearch={handleSearch}
            columnType={TableColumnsList.DeletedInventory}
            fetchDetails={(payload) => fetchCasedGoods(payload)}
            isSyncEnabled={true}
            handleSync={() => fetchCasedGoods(defaultRequestOptions)}
            expectedClonedData={expectedClonedData}
            expectedMetaData={expectedMetaData}
            expectedData={expectedData}
          />
          <>
            <CustomTable
              data={expectedData}
              clonedData={expectedClonedData}
              meta={expectedMetaData}
              columnType={TableColumnsList.DeletedInventory}
              isLoading={props.loading}
              isCleared={isCleared}
              isExportAvailable={false}
              isGlobalFilterEnabled={false}
              onFilter={(payload) => fetchCasedGoods({ ...defaultRequestOptions, searchable_columns: payload })}
              onReset={() => fetchCasedGoods(defaultRequestOptions)}
              handleEdit={(record, type) => handleInventoryEdit(record, type)}
            />
          </>
        </ErrorBoundary>
      </div>
    </>
  );
};

export default connect(
  (state) => ({
    loading: state.casedGoods.loading,
    casedGoodsError: state.casedGoods.error,
    casedGoods: state.casedGoods.deletedCasedGoods,
  }),
  { getDeletedCasedGoods, deleteCasedGoodDetails, getCasedGoods }
)(DeletedCasedGoods);
