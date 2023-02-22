import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import axios from "axios";
import { get } from "lodash";
import React from "react";
import { connect, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { TableColumnsList } from "../../../../constants";
import { getRequestHeader } from "../../../../helpers/service";
import { defaultRequestOptions } from "../../../../settings";
import { setCurrentView } from "../../../../store/Auth/auth.actions";
import SearchWithExportUI from "../../../CommonComponents/SearchWithExport";
import ErrorBoundary from "../../../UIComponents/ErrorBoundary";
import CustomTable from "../../../UIComponents/Table/responsiveTable";
import { openNotificationWithIcon } from "../../../UIComponents/Toast/notification";
import "./index.scss";

/**
 * Renders CRR Listing component
 */
const CRRListing = (props) => {
  const [expectedData, setExpectedData] = React.useState([]);
  const [expectedMetaData, setExpectedMetaData] = React.useState([]);
  const [expectedClonedData, setExpectedClonedData] = React.useState([]);
  const [clearSearchString, setClearSearchString] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  const dispatch = useDispatch();

  const { history } = props;

  React.useEffect(() => {
    dispatch(setCurrentView("CRR Listing"));
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

  const fetchCRRList = async () => {
    const rest = await axios({
      method: "POST",
      data: {
        page: "all",
      },
      url: `${process.env.REACT_APP_API_ENDPOINT}/api/v1/crr`,
      headers: { ...getRequestHeader() },
    }).catch((err) => {
      setLoading(false);
      openNotificationWithIcon("error", `${get(err, "response.data.message", "Something Went Wrong")} `);
    });

    if (get(rest, "data.status")) {
      setLoading(false);
      updateCallInList(get(rest, "data.data", []));
      setExpectedMetaData(get(rest, "data.meta", []));
    }

    if (!get(rest, "data.status", true)) {
      setLoading(false);
      openNotificationWithIcon("error", `${get(rest, "data.message", "Something Went Wrong")} `);
    }
  };

  const init = () => {
    fetchCRRList();
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
      <div className="p-4 table-responsive-padding bg-white">
        <ErrorBoundary>
          <div className="add_new__btn">
            <Link to="/gate-entry/add-new">
              <Button type="primary" icon={<PlusOutlined />} className="mb-3">
                Add New
              </Button>
            </Link>
          </div>

          <SearchWithExportUI
            clearSearchString={clearSearchString}
            handleSearch={handleSearch}
            columnType={TableColumnsList.CRRList}
            fetchDetails={(payload) => fetchCRRList(payload)}
            isSyncEnabled={true}
            handleSync={() => {
              setLoading(true);
              fetchCRRList(defaultRequestOptions);
            }}
            expectedClonedData={expectedClonedData}
            expectedMetaData={expectedMetaData}
            expectedData={expectedData}
          />

          <div className="task_management__crr_listing_view">
            <CustomTable
              data={expectedData}
              pagination={false}
              size="small"
              meta={expectedMetaData}
              isGlobalFilterEnabled={false}
              clonedData={expectedClonedData}
              columnType={TableColumnsList.CRRList}
              isLoading={loading}
              isCleared={isCleared}
              isExportAvailable={false}
              onFilter={(payload) => fetchCRRList({ ...defaultRequestOptions, searchable_columns: payload })}
              onReset={() => fetchCRRList(defaultRequestOptions)}
              handleEdit={(record, type) => handleEditAction(record, type)}
            />
          </div>
        </ErrorBoundary>
      </div>
    </>
  );
};

export default connect(
  (state) => ({
    crrListLoading: get(state, "tasks.loading", false),
  }),
  {}
)(CRRListing);
