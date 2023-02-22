import { DownloadOutlined, InfoCircleOutlined, RedoOutlined } from "@ant-design/icons";
import ErrorBoundary from "../../UIComponents/ErrorBoundary";
import { SearchInput } from "../../UIComponents/Search";
import { defaultRequestOptions } from "../../../settings";
import { Badge, Button, Col, Row } from "antd";
import { cloneDeep, get } from "lodash";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { isMobileOrTab, staticTextInventory } from "../../../constants";
import SVGIcon from "../../../constants/svgIndex";
import { exportToCSV } from "../../../helpers/exportToCSV";
import { getScreenSize } from "../../../helpers/utility";
import { updatePortalFilters } from "../../../store/App/app.actions";
import CustomFilters from "../../UIComponents/CustomFilters";
import { warning } from "../../UIComponents/Message";
import "./index.scss";

/**
 * Renders Search with Export component
 */
const SearchWithExportUI = (props) => {
  const dispatch = useDispatch();
  const [openFilter, setOpenFilter] = React.useState(false);
  const [filterValuesList, setFilterValuesList] = React.useState([]);

  const currentFiltersState = useSelector((state) => {
    return get(state, `app.appliedFilters.${get(props, "columnType")}`, []);
  });

  const handleToggleFilter = (value) => {
    setOpenFilter(value);
  };

  const handleSearch = (searchedData) => {
    props.handleSearch(searchedData);
  };

  React.useEffect(() => {
    return () =>
      dispatch(
        updatePortalFilters({
          [get(props, "columnType")]: {},
        })
      );
  }, []);

  const getDataSource = () => {
    const dataSource = {
      filterInfo: get(props, "expectedMetaData.filter_fields", []),
      columnData: get(props, "expectedData"),
      columnInfo: get(props, "expectedMetaData.column_info", []),
      columnClonedData: get(props, "expectedClonedData"),
    };

    return dataSource;
  };

  const handleCSVDownload = () => {
    if (get(props, "expectedData", []).length > 0) {
      let exportData = [];
      let dataToBeExported = cloneDeep(get(props, "expectedMetaData.column_info"));
      dataToBeExported.pop();
      exportData = get(props, "expectedData", []).map((list) => {
        let tempObj = {};
        dataToBeExported.map((listColumn) => {
          let keyName = get(listColumn, "key_name");
          let displayName = get(listColumn, "display_name");
          return (tempObj[displayName] = list[keyName]);
        });
        return tempObj;
      });
      exportToCSV(exportData, get(props, "columnType"));
    } else {
      warning("No data available");
    }
  };

  return (
    <>
      <div className="bg-white table-responsive-padding">
        <ErrorBoundary>
          <div className="search_filter_position search_filter_card">
            <Row gutter={[16, 0]}>
              <Col xs={{ span: 24 }} sm={{ span: 13 }}>
                <SearchInput data={get(props, "expectedClonedData")} handleSearch={handleSearch} clearSearchString={get(props, "clearSearchString", false)} />
              </Col>
              <Col xs={{ span: 24 }} sm={{ span: 11 }}>
                <div className="portal_filter__export__btn d-flex align-items-center float-right">
                  {get(props, "isSyncEnabled", false) && (
                    <Button type="primary" onClick={() => props.handleSync()} className=" ml-auto" icon={<RedoOutlined />} ghost>
                      {getScreenSize() > isMobileOrTab && "Sync"}
                    </Button>
                  )}
                  {get(props, "enableFilter", true) && (
                    <Button
                      type="primary"
                      icon={<img src={SVGIcon.FilterIcon} />}
                      ghost={!currentFiltersState.length}
                      className={`${currentFiltersState.length > 0 ? "active" : "inactive"} ml-3`}
                      onClick={() => handleToggleFilter(!openFilter)}
                    >
                      {getScreenSize() > isMobileOrTab && <span className="ml-2">Filter</span>}
                      {currentFiltersState.length > 0 && <span className="applied__portal_filters text-white  pl-3"> {currentFiltersState.length} </span>}
                    </Button>
                  )}
                  {get(props, "enableExport", true) && (
                    <Button type="primary" onClick={() => handleCSVDownload()} className="ml-3" icon={<DownloadOutlined />} ghost>
                      {getScreenSize() > isMobileOrTab && "Export"}
                    </Button>
                  )}
                </div>
              </Col>
            </Row>
          </div>
          {get(props, "showPriceInfo", false) && (
            <label className="pl-sm-3 pt-2">
              <InfoCircleOutlined />
              <span className="pl-2" dangerouslySetInnerHTML={{ __html: staticTextInventory }} />
            </label>
          )}
          {openFilter && (
            <CustomFilters
              dataSource={getDataSource()}
              currentFilters={currentFiltersState}
              open={openFilter}
              onFilterSubmit={(filterObj) => {
                setOpenFilter(false);
                setFilterValuesList(filterObj);
                const filterObjReq = { ...defaultRequestOptions, searchable_columns: filterObj };
                dispatch(
                  updatePortalFilters({
                    [get(props, "columnType")]: filterObj,
                  })
                );
                props.fetchDetails(filterObjReq);
              }}
              onReset={(val) => {
                if (val) {
                  setFilterValuesList([]);
                  handleToggleFilter();
                  dispatch(
                    updatePortalFilters({
                      [get(props, "columnType")]: [],
                    })
                  );
                  props.fetchDetails(defaultRequestOptions);
                } else {
                  handleToggleFilter(val);
                }
              }}
            />
          )}
        </ErrorBoundary>
      </div>
    </>
  );
};

export default SearchWithExportUI;
