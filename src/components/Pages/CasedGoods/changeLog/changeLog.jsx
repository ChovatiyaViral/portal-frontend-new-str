import { CheckSquareOutlined, CloseSquareOutlined } from "@ant-design/icons";
import { TableColumnsList } from "../../../../constants";
import { defaultRequestOptions } from "../../../../settings";
import { getCasedGoodDetails, getChangeLog, getPriceChangeLog } from "../../../../store/CasedGoods/casedGoods.actions";
import ErrorBoundary from "../../../UIComponents/ErrorBoundary";
import { info } from "../../../UIComponents/Modal/informationModal";
import CustomTable from "../../../UIComponents/Table/responsiveTable";
import { openNotificationWithIcon } from "../../../UIComponents/Toast/notification";
import { Col, Row } from "antd";
import { get } from "lodash";
import React from "react";
import { connect, useDispatch } from "react-redux";
import { setCurrentView } from "../../../../store/Auth/auth.actions";
import SearchWithExportUI from "../../../CommonComponents/SearchWithExport";
import { getName, getValue } from "../utility/helper";

/**
 * Renders Cased Goods Change Log component
 */
const CasesChangeLog = (props) => {
  const dispatch = useDispatch();

  const [expectedData, setExpectedData] = React.useState([]);
  const [expectedMetaData, setExpectedMetaData] = React.useState([]);
  const [expectedClonedData, setExpectedClonedData] = React.useState([]);
  const [clearSearchString, setClearSearchString] = React.useState(false);

  React.useEffect(() => {
    dispatch(setCurrentView("Inventory Change Log"));
  }, []);

  const updateState = (data) => {
    setExpectedData(data);
    if (expectedClonedData.length === 0) {
      setExpectedClonedData(data);
    }
  };

  const isCleared = () => {
    setExpectedData(expectedClonedData);
    setClearSearchString(true);
  };

  const fetchLogs = async (requestOptions) => {
    let changeLogResponse = await props.getChangeLog(requestOptions);

    if (get(changeLogResponse, "error", false)) {
      openNotificationWithIcon("error", "Inventory Change Log", `${get(changeLogResponse, "error.message", "Something Went Wrong")} `);
    }

    if (get(changeLogResponse, "response.status")) {
      setExpectedMetaData(get(changeLogResponse, "response.meta"));
      updateState(get(changeLogResponse, "response.data", []));
    }
  };

  React.useEffect(() => {
    fetchLogs(defaultRequestOptions);
  }, []);

  const handleSearch = (searchedData) => {
    if (get(searchedData, "isClient", true)) {
      setExpectedData(get(searchedData, "filteredData", []));
    }
  };

  const getCaseDetailsContent = (requestData) => {
    const objLng = Object.keys(requestData).length;
    return (
      <div className="mt-3">
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col className="gutter-row" xs={{ span: 24 }} sm={{ span: 12 }}>
            <Row>
              {Object.keys(requestData).map(function (columnName, index) {
                if (index < objLng / 2) {
                  return (
                    <Col span={24} key={index}>
                      <label className="font-weight-bold pr-2">
                        {get(requestData, columnName) ? <CheckSquareOutlined style={{ color: "#52c41a" }} className="pr-1" /> : <CloseSquareOutlined style={{ color: "#ff4d4f" }} className="pr-1" />}
                        {getName(columnName)} :
                      </label>
                      {getValue(get(requestData, columnName))}
                    </Col>
                  );
                }
              })}
            </Row>
          </Col>
          <Col className="gutter-row" xs={{ span: 24 }} sm={{ span: 12 }}>
            <Row>
              {Object.keys(requestData).map(function (columnName, index) {
                if (index >= objLng / 2) {
                  return (
                    <Col span={24} key={index}>
                      <label className="font-weight-bold pr-2">
                        {get(requestData, columnName) ? <CheckSquareOutlined style={{ color: "#52c41a" }} className="pr-1" /> : <CloseSquareOutlined style={{ color: "#ff4d4f" }} className="pr-1" />}
                        {getName(columnName)} :
                      </label>
                      {getValue(get(requestData, columnName))}
                    </Col>
                  );
                }
              })}
            </Row>
          </Col>
        </Row>
      </div>
    );
  };

  const handleViewDetail = async (record) => {
    const caseGoodDetailData = await props.getCasedGoodDetails({
      cased_goods_id: record.cased_goods_id
    });
    const requestData = get(caseGoodDetailData, "response.data", []);
    info({
      title: "Cased Goods Details",
      message: getCaseDetailsContent(requestData),
      width: 1000,
    });
  };

  return (
    <>
      {/* <Heading text="Inventory Change Log" variant="h4" /> */}
      <div className="bg-white table-responsive-padding">
        <ErrorBoundary>
          <SearchWithExportUI
            clearSearchString={clearSearchString}
            handleSearch={handleSearch}
            showPriceInfo={true}
            columnType={TableColumnsList.ChangeLog}
            fetchDetails={(payload) => fetchLogs(payload)}
            isSyncEnabled={true}
            handleSync={() => fetchLogs(defaultRequestOptions)}
            expectedClonedData={expectedClonedData}
            expectedMetaData={expectedMetaData}
            expectedData={expectedData}
          />

          <>
            <CustomTable
              data={expectedData}
              clonedData={expectedClonedData}
              meta={expectedMetaData}
              columnType={TableColumnsList.ChangeLog}
              isLoading={get(props, "loading", false)}
              isCleared={isCleared}
              size="small"
              isExportAvailable={false}
              isGlobalFilterEnabled={false}
              onFilter={(payload) => fetchLogs({ ...defaultRequestOptions, searchable_columns: payload })}
              onReset={() => fetchLogs(defaultRequestOptions)}
              handleEdit={(record) => handleViewDetail(record)}
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
    error: state.casedGoods.failure,
  }),
  { getPriceChangeLog, getCasedGoodDetails, getChangeLog }
)(CasesChangeLog);
