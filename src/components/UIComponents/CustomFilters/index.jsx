import { CloseOutlined, InfoCircleOutlined, ClearOutlined, EyeOutlined } from "@ant-design/icons";
import { Badge, Button, Checkbox, Col, Row, Tabs } from "antd";
import { cloneDeep, compact, find, get, isArray, map, uniqBy } from "lodash";
import React from "react";
import { capitalizeAllLetter } from "../../../helpers/utility";
import { CustomDatePicker } from "../../UIComponents/DatePicker";
import { SearchInput } from "../../UIComponents/Search";
import { getFilterOptions } from "../../UIComponents/Table/getMetaColumnData";
import { getFilterableData } from "../../UIComponents/Table/helper";

import "./index.scss";

const { TabPane } = Tabs;

const CustomFilters = (props) => {
  const [currentTab, setCurrentTab] = React.useState(null);
  const [selectedOptions, setSelectedOptions] = React.useState({});
  const [filterColumns, setFilterColumns] = React.useState([]);
  const [filterData, setFilterData] = React.useState([]);

  React.useEffect(() => {
    updateStateValues();
  }, [props]);

  const onChange = (checkedValues) => {
    let newObj = { ...selectedOptions };
    newObj[currentTab] = checkedValues;
    setSelectedOptions(newObj);
  };

  const getColumnsList = () => {
    let list = [...get(props, "dataSource.filterInfo", [])];
    // list.pop();
    setFilterColumns(list);
  };

  const updateAvailableOptions = (tab) => {
    let newObj = { ...selectedOptions };
    if (isArray(get(props, "currentFilters", []))) {
      if (get(props, "currentFilters", []).length === 0) {
        const checkedValueArr = find(get(props, "currentFilters", []), function (o) {
          return get(o, "filter_key_name") === tab;
        });
        newObj[tab] = get(checkedValueArr, "field_value_array", []);
      } else {
        get(props, "currentFilters", []).map((li) => {
          return (newObj[li.filter_key_name] = get(li, "field_value_array", []));
        });
      }
    }
    setSelectedOptions(newObj);
  };

  const updateStateValues = () => {
    const firstIndexKey = get(props, "dataSource.filterInfo[0]", []);
    setCurrentTab(firstIndexKey);
    updateAvailableOptions(firstIndexKey);
    getColumnsList();
    const filters = getFilterOptions(get(props, "dataSource.columnClonedData", []), firstIndexKey);
    setFilterData(filters);
  };

  React.useEffect(() => {
    const filters = getFilterOptions(get(props, "dataSource.columnClonedData", []), currentTab);
    setFilterData(filters);
    // updateAvailableOptions(currentTab);
  }, [currentTab]);

  const onTabChange = (tab) => {
    setCurrentTab(tab);
  };

  const handleSubmit = () => {
    let filterListAvailable = cloneDeep(selectedOptions);
    const initialClonedArr = cloneDeep(get(props, "dataSource.columnInfo", []));
    const filterColumnInfoList = uniqBy(initialClonedArr, function (e) {
      return e.key_name;
    });

    map(filterColumnInfoList, function (o, index) {
      if (get(filterListAvailable, get(o, "key_name"), "")) {
        filterListAvailable[get(o, "key_name")] = {
          filter_data: compact(filterListAvailable[get(o, "key_name")]),
          filter_key: get(o, "filter_key"),
          filter_key_name: get(o, "key_name"),
          filter_data_type: get(o, "data_type"),
        };
      }
    });

    filterListAvailable = { ...get(props, "currentFilters", {}), ...filterListAvailable };
    props.onFilterSubmit(getFilterableData(filterListAvailable));
  };

  const handleSearch = (searchedData) => {
    setFilterData(get(searchedData, "filteredData"));
  };

  const getTitle = (key_name) => {
    const keyValue = getValueBasedOnKey(key_name);

    if (keyValue) {
      return get(keyValue, "display_name");
    }

    return capitalizeAllLetter(key_name.replace(/_/g, " "));
  };

  const getDataType = (key_name) => {
    const keyValue = getValueBasedOnKey(key_name);
    if (keyValue) {
      return get(keyValue, "data_type");
    }
    return "varchar";
  };

  const getValueBasedOnKey = (key_name) => {
    return find(get(props, "dataSource.columnInfo", []), function (o) {
      return get(o, "key_name") === key_name;
    });
  };

  const onDateTimeChange = (type, date) => {
    let newObj = { ...selectedOptions };
    newObj[currentTab] = [...get(newObj, currentTab, [])];
    if (type === "start_date") {
      newObj[currentTab][0] = date;
    }
    if (type === "end_date") {
      newObj[currentTab][1] = date;
    }
    setSelectedOptions(newObj);
  };

  const getDateValue = (list) => {
    if (get(selectedOptions, list, []).length > 0) {
      return get(selectedOptions, list, []);
    }
    return get(props, `currentFilters.${currentTab}.filter_data`, []);
  };

  const closeFilter = (val) => {
    props.onReset(val);
  };

  const getItems = () => {
    return filterColumns.map((list, index) => {
      const filters = getFilterOptions(get(props, "dataSource.columnClonedData", []), list);
      const dateTimeType = getDataType(list) === "date" || getDataType(list) === "datetime";
      const dateCurrentValue = dateTimeType && getDateValue(list);
      const defaultValues = [...get(selectedOptions, list, [])];
      const dotValue = compact(defaultValues).length;

      return {
        key: list,
        label: <Badge dot={dotValue} offset={[10, 0]} size="small">
          {getTitle(list)}
        </Badge>,
        children:
          (
            <>
              <div style={{ overflow: "auto", height: "50vh" }}>
                {dateTimeType ? (
                  <>
                    <p>
                      <InfoCircleOutlined /> Choose Start & End Date
                    </p>
                    <Row>
                      <Col xs={{ span: 24 }} sm={{ span: 24 }}>
                        <CustomDatePicker
                          handleChange={onDateTimeChange}
                          value={dateCurrentValue[0]}
                          type="start_date"
                          enableFutureDate={true}
                          placeholder="Start Date (YYYY-MM-DD)"
                          className="mt-0 mb-0 w-100"
                          label="Start Date (YYYY-MM-DD)"
                        />
                      </Col>
                      <Col xs={{ span: 24 }} sm={{ span: 24 }}>
                        <CustomDatePicker
                          handleChange={onDateTimeChange}
                          value={dateCurrentValue[1]}
                          type="end_date"
                          enableFutureDate={true}
                          placeholder="End Date (YYYY-MM-DD)"
                          className="mt-0 mb-0 w-100"
                          label="End Date (YYYY-MM-DD)"
                        />
                      </Col>
                    </Row>
                  </>
                ) : (
                  <Checkbox.Group value={defaultValues} style={{ width: "100%", marginTop: 20 }} onChange={onChange}>
                    <Row>
                      {filterData.map((filter, index) => {
                        return (
                          <Col span={24} key={get(filter, "value")}>
                            <Checkbox value={get(filter, "value")}>{get(filter, "label")}</Checkbox>
                          </Col>
                        );
                      })}
                    </Row>
                  </Checkbox.Group>
                )}
              </div>
            </>

          )
      };
    });
  };

  return (
    <div className={`custom_filter_sidebar ${get(props, "open") ? "open" : "close"}`}>
      <div className="filter_main_section">
        <div className="filter_header_section">
          <h1>Filters</h1>
          <CloseOutlined onClick={() => closeFilter(false)} />
        </div>
        <SearchInput data={getFilterOptions(get(props, "dataSource.columnClonedData", []), currentTab)} handleSearch={handleSearch} clearSearchString={false} />
        <div className="tab_panel_section">
          <Tabs defaultActiveKey="0" tabPosition="left" activeKey={currentTab} onChange={onTabChange} items={getItems()} />
        </div>
      </div>
      <div className="filter_footer_section">
        <Button type="secondary" onClick={() => closeFilter(true)} icon={<ClearOutlined />}>
          Clear filter
        </Button>
        <Button type="primary" onClick={handleSubmit} icon={<EyeOutlined />}>
          Show {get(props, "currentFilters", []).length > 0 ? get(props, "currentFilters", []).length : ""} results
        </Button>
      </div>
    </div>
  );
};

export default CustomFilters;
