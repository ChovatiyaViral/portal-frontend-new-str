import axios from "axios";
import { get } from "lodash";
import React from "react";
import { connect } from "react-redux";
import { ActionOptions, SearchType, TableColumnsList } from "../../../constants";
import { getRequestHeader } from "../../../helpers/service";
import { defaultRequestOptions } from "../../../settings";
import { deleteCasedGoodDetails, getCasedGoods, getDeletedCasedGoods, getPricingParameters, updatePriceCasedGoods, updateQuatityCasedGoods } from "../../../store/CasedGoods/casedGoods.actions";
import SearchWithExportUI from "../../CommonComponents/SearchWithExport";
import ErrorBoundary from "../../UIComponents/ErrorBoundary";
import CustomTable from "../../UIComponents/Table/responsiveTable";
import { openNotificationWithIcon } from "../../UIComponents/Toast/notification";
import { CommentsUI } from "./archiveCases/commentsUI";
import EditInventory from "./editCases/editInventory";
import "./index.scss";
import { getDynamicDataWrapper } from "./utility/getData";

/**
 * Renders Cased Goods component
 */
const CasedGoods = (props) => {
  const [expectedData, setExpectedData] = React.useState([]);
  const [expectedMetaData, setExpectedMetaData] = React.useState([]);
  const [selectedAction, setSelectedAction] = React.useState(ActionOptions.Quantity);
  const [expectedClonedData, setExpectedClonedData] = React.useState([]);
  const [isClient, setClientSearchStatus] = React.useState(SearchType.isServer);
  const [isEditable, setIsEditable] = React.useState(false);
  const [isArchiveCommentsModalVisible, setIsArchiveCommentsModalVisible] = React.useState(false);
  const [selectedRecord, setSelectedRecord] = React.useState({});
  const [clearSearchString, setClearSearchString] = React.useState(false);

  const updateState = (data) => {
    setExpectedData(getDynamicDataWrapper(data));
    if (expectedClonedData.length === 0) {
      setExpectedClonedData(getDynamicDataWrapper(data));
    }
  };

  const fetchCasedGoods = async (requestOptions) => {
    let searchable_columns = [{ field_name: "deleted", field_value: "no" }];
    searchable_columns = [...get(requestOptions, "searchable_columns", []), ...searchable_columns];
    const inventoryResponse = await props.getCasedGoods({ ...requestOptions, searchable_columns });
    if (get(inventoryResponse, "error", false)) {
      openNotificationWithIcon("error", "Inventory", `${get(inventoryResponse, "error.message", "Something Went Wrong")} `);
    }

    if (get(inventoryResponse, "response.status")) {
      setExpectedMetaData(get(inventoryResponse, "response.meta"));
      updateState(get(inventoryResponse, "response.data"));
    }
  };

  const editCasedGoods = async (requestOptions) => {
    if (selectedAction === ActionOptions.Quantity) {
      const rest = await axios({
        method: "POST",
        data: {
          cased_goods_id: get(selectedRecord, "id"),
          ...requestOptions,
        },
        url: `${process.env.REACT_APP_API_ENDPOINT}/api/inventory/updateQuantityWithRotationNumbers`,
        headers: { ...getRequestHeader() },
      }).catch((err) => {
        openNotificationWithIcon("error", "Rotation Number", `${get(err, "response.data.message", "Something Went Wrong")} `);
      });

      if (get(rest, "data.status")) {
        openNotificationWithIcon("success", "Rotation Number", get(rest, "data.message", "Rotation Number updated successfully"));
        fetchCasedGoods(defaultRequestOptions);
        handleClose();
      } else {
        openNotificationWithIcon("error", "Rotation Number", get(rest, "data.message", "Something Went Wrong"));
      }
    }

    if (selectedAction === ActionOptions.Price) {
      let editedInventoryResponse = await props.updatePriceCasedGoods(requestOptions);
      if (get(editedInventoryResponse, "response.status")) {
        openNotificationWithIcon("success", "Inventory", `${get(editedInventoryResponse, "response.message", "Updated Successfully")} `);
        handleClose();
        fetchCasedGoods(defaultRequestOptions);
      }

      if (!get(editedInventoryResponse, "error.status", true)) {
        openNotificationWithIcon("error", "Inventory", `${get(editedInventoryResponse, "error.message", "Something Went Wrong")} `);
      }
    }
  };

  React.useEffect(() => {
    fetchCasedGoods(defaultRequestOptions);
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
    const requestOptions = { id: get(record, "id"), delete_or_undelete: "delete", reason: get(record, "archivedComments") };
    const deleteInventory = await props.deleteCasedGoodDetails(requestOptions);
    const searchable_columns = [{ field_name: "deleted", field_value: "yes" }];

    if (get(deleteInventory, "response.status")) {
      setIsArchiveCommentsModalVisible(false);
      openNotificationWithIcon("success", "Inventory", `${get(deleteInventory, "response.message", "Archived Successfully")} `);
      await props.getDeletedCasedGoods({ ...defaultRequestOptions, searchable_columns });
      fetchCasedGoods(defaultRequestOptions);
    }

    // if (!get(deleteInventory, "response.status")) {
    //   openNotificationWithIcon("info", "Inventory", `${get(deleteInventory, "response.message", "Something Went Wrong")} `);
    // }

    if (get(deleteInventory, "error", false)) {
      openNotificationWithIcon("error", "Inventory", `${get(deleteInventory, "error.message", "Something Went Wrong")} `);
    }
  };

  const EditInventoryList = async (inventoryObj) => {
    const evaluatedInventoryObj = { ...inventoryObj };
    editCasedGoods(evaluatedInventoryObj);
  };

  const handleClose = () => {
    setIsArchiveCommentsModalVisible(false);
    setIsEditable(false);
  };

  const handleInventoryEdit = (record, type) => {
    setSelectedAction(type);
    setSelectedRecord(record);

    if (type === ActionOptions.Quantity || type === ActionOptions.Price) {
      setIsEditable(true);
    }

    if (type === ActionOptions.Delete) {
      setIsArchiveCommentsModalVisible(true);
    }
  };

  const handleInventorySubmit = (inventoryObj, isChanged) => {
    if (isChanged) {
      EditInventoryList(inventoryObj);
    } else {
      openNotificationWithIcon("info", "Inventory", "Everything is upto date");
      handleClose();
    }
  };

  return (
    <>
      {isEditable && (
        <EditInventory
          {...props}
          isOpen={isEditable}
          record={selectedRecord}
          actionType={selectedAction}
          clonedCaseRecord={get(selectedRecord, "cases", "")}
          handleClose={() => {
            setSelectedAction(ActionOptions.Quantity);
            handleClose();
          }}
          handleSubmit={(inventoryObj, isChanged) => handleInventorySubmit(inventoryObj, isChanged)}
        />
      )}
      {isArchiveCommentsModalVisible && (
        <CommentsUI
          isModalVisible={isArchiveCommentsModalVisible}
          title="Reason to Archive ?"
          label="Reason"
          loading={get(props, "loading", false)}
          handleCancel={() => {
            setSelectedAction(ActionOptions.RotationNumber);
            handleClose();
          }}
          handleSubmit={(comments) => deleteInventory({ ...selectedRecord, archivedComments: comments })}
        />
      )}

      <div className="bg-white table-responsive-padding">
        <ErrorBoundary>
          <SearchWithExportUI
            clearSearchString={clearSearchString}
            handleSearch={handleSearch}
            columnType={TableColumnsList.Inventory}
            fetchDetails={(payload) => fetchCasedGoods(payload)}
            isSyncEnabled={true}
            handleSync={() => fetchCasedGoods(defaultRequestOptions)}
            expectedClonedData={expectedClonedData}
            expectedMetaData={expectedMetaData}
            expectedData={expectedData}
          />
          <CustomTable
            data={expectedData}
            meta={expectedMetaData}
            clonedData={expectedClonedData}
            columnType={TableColumnsList.Inventory}
            isLoading={props.loading}
            isCleared={isCleared}
            size="small"
            selectedAction={selectedAction}
            isExportAvailable={false}
            isGlobalFilterEnabled={false}
            onFilter={(payload) => fetchCasedGoods({ ...defaultRequestOptions, searchable_columns: payload })}
            onReset={() => fetchCasedGoods(defaultRequestOptions)}
            handleEdit={(record, type) => handleInventoryEdit(record, type)}
          />
        </ErrorBoundary>
      </div>
    </>
  );
};

export default connect(
  (state) => ({
    loading: state.casedGoods.loading,
    pricingParametersLoading: state.casedGoods.pricingParametersLoading,
    casedGoodsError: state.casedGoods.error,
    casedGoods: state.casedGoods.casedGoods,
  }),
  {
    getDeletedCasedGoods,
    deleteCasedGoodDetails,
    getPricingParameters,
    getCasedGoods,
    updatePriceCasedGoods,
    updateQuatityCasedGoods,
  }
)(CasedGoods);
