import { ArrowRightOutlined, CloseCircleOutlined, SaveOutlined } from "@ant-design/icons";
import { Button, Col, Divider, Progress, Row, Spin } from "antd";
import axios from "axios";
import { cloneDeep, debounce, find, get, isArray } from "lodash";
import moment from "moment";
import React from "react";
import { useDispatch } from "react-redux";
import { defaultTaxonomyMasterDataListName, MasterDataKeyPair } from "../../../../../constants";
import SVGIcon from "../../../../../constants/svgIndex";
import { getRequestHeader } from "../../../../../helpers/service";
import { capitalizeAllLetter, getKeyValuePair } from "../../../../../helpers/utility";
import { defaultRequestOptions } from "../../../../../settings";
import { setCurrentView } from "../../../../../store/Auth/auth.actions";
import { getTaxonomyData } from "../../../../../store/Taxonomy/taxonomy.actions";
import { CustomDatePicker } from "../../../../UIComponents/DatePicker";
import ErrorBoundary from "../../../../UIComponents/ErrorBoundary";
import { CustomInputNumber as InputNumberChange, CustomInputText as InputTextChange } from "../../../../UIComponents/Input/customInput";
import { SingleSelect as Select } from "../../../../UIComponents/Select/singleSelect";
import { openNotificationWithIcon } from "../../../../UIComponents/Toast/notification";
import { regaugingCaskDetailsDefault } from "../../constants";

const dateFormat = "DD-MM-YYYY";

const RegaugingCaskDetailsUiForm = (props) => {
  const dispatch = useDispatch();
  const { history } = props;
  const [loading, setIsLoading] = React.useState(false);
  const [dropDownValues, setDropDownValues] = React.useState({});

  const [regaugeDetailsDataset, setRegaugingCaskDetailsDataset] = React.useState(regaugingCaskDetailsDefault);
  const [caskSearchValueListing, setCaskSearchValueListing] = React.useState(null);

  const [progress, setProgress] = React.useState(0);
  const [caskSearchValue, setCaskSearchValue] = React.useState("");
  const [warehouseListing, setWarehouseListing] = React.useState([]);

  React.useEffect(() => {
    let newData = { ...regaugeDetailsDataset };
    const currentDate = moment().format(dateFormat);
    newData["scheduled_at"] = currentDate;
    setRegaugingCaskDetailsDataset(newData);
  }, []);

  const handleChange = React.useCallback((key, value, deepKey) => {
    let newValue = { ...regaugeDetailsDataset };

    const newWareHouseObj = find(warehouseListing, function (o) {
      return get(o, "warehouse_keeper_name") === value;
    });

    if (deepKey) {
      newValue[key][deepKey] = value;
    } else {
      newValue[key] = value;
    }

    if (newWareHouseObj) {
      newValue["warehouse_name"] = get(newWareHouseObj, "warehouse_name", "");
    }

    setRegaugingCaskDetailsDataset(newValue);
  });

  React.useEffect(() => {
    dispatch(setCurrentView("Add Regauging"));
  }, []);

  const invokeDebounced = debounce((query) => {
    getCaskDetailsList(query);
  }, 1000);

  const handleFinalSubmit = async (link) => {
    let newData = { ...regaugeDetailsDataset };

    if (caskSearchValue) {
      newData["cask_number"] = caskSearchValue;
    }

    if (isArray(caskSearchValueListing) && caskSearchValueListing.length === 0 && get(newData, "cask_type")) {
      newData["cask_type_code"] = get(newData, "cask_type");
      delete newData["cask_type"];
    }

    const rest = await axios({
      method: "POST",
      data: newData,
      url: `${process.env.REACT_APP_API_ENDPOINT}/api/v1/cask_regauge/create_job`,
      headers: { ...getRequestHeader() },
    }).catch((err) => {
      setIsLoading(false);
      openNotificationWithIcon("error", `${get(err, "response.data.message", "Something Went Wrong")} `);
    });

    if (get(rest, "data.status")) {
      openNotificationWithIcon("success", get(rest, "data.message", "Regauging Added successfully"));
      setIsLoading(false);

      if (link.includes("/regauging/complete")) {
        history.push(`${link}/${get(rest, "data.regauging_id")}`);
      } else {
        history.push(link);
      }
    }

    if (!get(rest, "data.status")) {
      openNotificationWithIcon("error", get(rest, "data.message", "Something Went Wrong"));
      setIsLoading(false);
    }
  };

  const getCaskDetailsList = async (query) => {
    const rest = await axios({
      method: "POST",
      data: {
        page: "all",
        searchable_columns: [
          {
            field_name: "cask_number",
            data_type: "varchar",
            field_value_array: [query],
          },
        ],
      },
      url: `${process.env.REACT_APP_API_ENDPOINT}/api/v1/cask`,
      headers: { ...getRequestHeader() },
      onUploadProgress: (event) => {
        const percent = Math.round((event.loaded * 100) / event.total);
        setProgress(percent);
        if (percent === 100) {
          setTimeout(() => setProgress(0), 1000);
        }
      },
    }).catch((err) => {
      openNotificationWithIcon("error", `${get(err, "response.data.message", "Something Went Wrong")} `);
    });

    if (get(rest, "data.status")) {
      let newData = { ...regaugeDetailsDataset };
      const currentDate = moment().format(dateFormat);

      if (get(rest, "data.data", []).length > 0) {
        const tempData = get(rest, "data.data", [])[0];
        tempData["scheduled_at"] = currentDate;
        newData = tempData;
      } else {
        newData = { ...regaugingCaskDetailsDefault };
        newData["scheduled_at"] = currentDate;
      }
      setRegaugingCaskDetailsDataset(newData);
      setCaskSearchValueListing(get(rest, "data.data", []));
    }

    if (!get(rest, "data.status", true)) {
      openNotificationWithIcon("error", `${get(rest, "response.data.message", "Something Went Wrong")} `);
    }
  };

  React.useEffect(() => {
    if (get(props, "type") === "view") {
      const newObj = { ...get(props, "regaugeDataset.cask_details"), ...get(props, "regaugeDataset.warehouse_details") };
      setRegaugingCaskDetailsDataset(newObj);
      setCaskSearchValue(get(props, "regaugeDataset.cask_number"));
      setCaskSearchValueListing([get(props, "regaugeDataset")]);
    }
  }, [props]);

  const fetchTaxonomyData = async (masterKey = defaultTaxonomyMasterDataListName, sort_key = "", sort_order = "ASC", otherKey = "") => {
    let requestOptions = cloneDeep(defaultRequestOptions);
    requestOptions[MasterDataKeyPair.MasterDataKey] = masterKey;
    requestOptions["orderby_field"] = sort_key;
    requestOptions["orderby_value"] = sort_order;

    if (masterKey === "cask_type") {
      requestOptions["status_filter"] = "all";
    }

    const taxonomyData = await dispatch(getTaxonomyData(requestOptions));

    if (get(taxonomyData, "error", false)) {
      openNotificationWithIcon("error", `${capitalizeAllLetter(masterKey.replace(/_/g, " "))}`, `${get(taxonomyData, "error.message", "Something Went Wrong")} `);
    }

    let newValues = { ...dropDownValues };
    newValues[masterKey] = getKeyValuePair(get(taxonomyData, "response.data", []), sort_key, false, otherKey);
    setDropDownValues(newValues);
  };

  const getHelperText = () => {
    if (isArray(caskSearchValueListing)) {
      if (caskSearchValueListing.length === 0) {
        return (
          <span style={{ color: "#faad14" }} className="float-left w-100 mt-2">
            Cask not found
          </span>
        );
      } else {
        return (
          <span style={{ color: "#52c41a" }} className="float-left w-100 mt-2">
            Cask is available
          </span>
        );
      }
    } else {
      return null;
    }
  };

  const getDisabledStatus = (key, value) => {
    if (get(props, "type", "edit") === "edit") {
      if (isArray(caskSearchValueListing) && caskSearchValueListing.length > 0) {
        let tempObj = caskSearchValueListing[0];
        if (get(tempObj, key)) {
          return true;
        } else {
          return false;
        }
      }
    }
    if (get(props, "type", "edit") === "view") {
      return true;
    }
    return false;
  };

  const getValidateStatusColor = () => {
    if (isArray(caskSearchValueListing)) {
      if (caskSearchValueListing.length > 0) {
        return "success";
      }
      if (caskSearchValueListing.length === 0) {
        return "warning";
      }
    }
    return "";
  };

  return (
    <div className="portal_styling__2 table-responsive-padding">
      <ErrorBoundary>
        <Spin spinning={loading}>
          {get(props, "type", "edit") === "edit" && (
            <div className="summary__additional_details common_card_section">
              <div className="d-flex align-items-center mb-2">
                <img src={SVGIcon.ReGuagingIcon} alt="Cask Number" className="mr-2" style={{ width: "24px", height: "24px" }} />
                <span style={{ fontWeight: 700, fontSize: 16 }}>Regauging Details</span>
              </div>
              <div className="additional_details_content">
                <Row gutter={[16, 12]}>
                  <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 6 }}>
                    <CustomDatePicker
                      handleChange={(type, val) => handleChange("scheduled_at", val)}
                      type="scheduled_at"
                      format="DD-MM-YYYY"
                      required
                      value={get(regaugeDetailsDataset, "scheduled_at", "")}
                      enableOnlyFutureDate={true}
                      placeholder="Schedule At (DD-MM-YYYY)"
                      className="mt-0 mb-0 w-100"
                      label="Schedule At (DD-MM-YYYY)"
                    />
                  </Col>
                </Row>
              </div>
            </div>
          )}
          <div className="summary__additional_details common_card_section">
            <div className="d-flex align-items-center mb-2">
              <img src={SVGIcon.CaskContentsIcon} alt="Cask Number" className="mr-2" style={{ width: "24px", height: "24px" }} />
              <span style={{ fontWeight: 700, fontSize: 16 }}>Cask Details</span>
            </div>
            <div className="additional_details_content">
              <Row gutter={[16, 12]}>
                <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 6 }}>
                  {get(props, "type", "edit") === "edit" ? (
                    <>
                      <InputTextChange
                        type="cask_number"
                        value={caskSearchValue}
                        required
                        handleChange={(type, val) => {
                          setCaskSearchValue(val);
                          handleChange("cask_number", val);
                          if (val.length >= 2) {
                            invokeDebounced(val);
                          }
                        }}
                        validateStatus={getValidateStatusColor()}
                        helpText={getHelperText()}
                        label="Cask Number"
                        className="mt-0 mb-0 w-100"
                        placeholder="Enter cask number here"
                      />
                      {progress > 0 ? <Progress size="small" className="mb-2" percent={progress} /> : null}
                    </>
                  ) : (
                    <InputTextChange
                      type="cask_number"
                      value={get(regaugeDetailsDataset, "cask_number", "")}
                      handleChange={(type, val) => handleChange("cask_number", val)}
                      label="Cask Number"
                      required
                      disabled={isArray(caskSearchValueListing) && caskSearchValueListing.length > 0}
                      className="mt-0 mb-0 w-100"
                      placeholder="Enter cask number here"
                    />
                  )}
                </Col>
                <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 6 }}>
                  <InputTextChange
                    type="passport_number"
                    value={get(regaugeDetailsDataset, "passport_number", "")}
                    handleChange={(type, val) => handleChange("passport_number", val)}
                    label="Passport Number"
                    required
                    disabled={getDisabledStatus("passport_number")}
                    className="mt-0 mb-0 w-100"
                    placeholder="Enter passport number here"
                  />
                </Col>
                <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 6 }}>
                  <Select
                    handleChange={(key, value) => handleChange(key, value)}
                    value={get(regaugeDetailsDataset, "cask_type", "")}
                    type="cask_type"
                    required
                    disabled={getDisabledStatus("cask_type")}
                    label="Cask Type"
                    onDropdownVisibleChange={() => {
                      if (get(dropDownValues, "cask_type", []).length === 0) {
                        fetchTaxonomyData("cask_type", "cask_type_code", "ASC", "cask_type_desc");
                      }
                    }}
                    placeHolder="Select"
                    options={get(dropDownValues, "cask_type", [])}
                    className="mt-0 mb-0"
                  />
                </Col>
              </Row>
            </div>
          </div>

          <div className="summary__additional_details common_card_section">
            <div className="d-flex align-items-center mb-2">
              <img src={SVGIcon.CaskContentsIcon} alt="Cask Number" className="mr-2" style={{ width: "24px", height: "24px" }} />
              <span style={{ fontWeight: 700, fontSize: 16 }}>Cask Contents</span>
            </div>
            <div className="additional_details_content">
              <Row gutter={[16, 12]}>
                <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 6 }}>
                  <Select
                    handleChange={(key, value) => handleChange(key, value)}
                    type="distillery"
                    required
                    disabled={getDisabledStatus("distillery")}
                    label="Distillery"
                    value={get(regaugeDetailsDataset, "distillery", "")}
                    onDropdownVisibleChange={() => {
                      if (get(dropDownValues, "product_distillery", []).length === 0) {
                        fetchTaxonomyData("product_distillery", "distillery_name", "ASC");
                      }
                    }}
                    placeHolder="Select"
                    options={get(dropDownValues, "product_distillery", [])}
                    className="mt-0 mb-0"
                  />
                </Col>

                <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 6 }}>
                  <Select
                    handleChange={(key, value) => handleChange(key, value)}
                    value={get(regaugeDetailsDataset, "brand", "")}
                    type="brand"
                    disabled={getDisabledStatus("brand")}
                    label="Brand Name"
                    onDropdownVisibleChange={() => {
                      if (get(dropDownValues, "brand", []).length === 0) {
                        fetchTaxonomyData("brand", "brand_name", "ASC");
                      }
                    }}
                    placeHolder="Select"
                    options={get(dropDownValues, "brand", [])}
                    className="mt-0 mb-0"
                  />
                </Col>
                <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 6 }}>
                  <InputTextChange
                    type="whisky_type"
                    required
                    value={get(regaugeDetailsDataset, "whisky_type", "")}
                    handleChange={(type, val) => handleChange("whisky_type", val)}
                    label="Whisky Type"
                    disabled={getDisabledStatus("whisky_type")}
                    className="mt-0 mb-0 w-100"
                    placeholder="Enter whisky type here"
                  />
                </Col>
              </Row>
              <Divider />
              <Row gutter={[16, 12]}>
                <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 6 }}>
                  <CustomDatePicker
                    handleChange={(type, val) => handleChange("ays", val)}
                    type="ays"
                    format="DD-MM-YYYY"
                    required
                    disabled={getDisabledStatus("ays")}
                    value={get(regaugeDetailsDataset, "ays", "")}
                    placeholder="AYS (DD-MM-YYYY)"
                    className="mt-0 mb-0 w-100"
                    label="AYS (DD-MM-YYYY)"
                  />
                </Col>
                <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 6 }}>
                  <InputNumberChange
                    value={get(regaugeDetailsDataset, "last_known_ola", "")}
                    handleChange={(type, val) => handleChange("last_known_ola", val)}
                    disabled={getDisabledStatus("last_known_ola")}
                    type="last_known_ola"
                    className="mt-0 mb-0 w-100"
                    label="Last Known OLA"
                  />
                </Col>
                <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 6 }}>
                  <InputNumberChange
                    value={get(regaugeDetailsDataset, "last_known_rla", "")}
                    handleChange={(type, val) => handleChange("last_known_rla", val)}
                    disabled={getDisabledStatus("last_known_rla")}
                    type="last_known_rla"
                    required
                    className="mt-0 mb-0 w-100"
                    label="Last Known RLA"
                  />
                </Col>
                <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 6 }}>
                  <InputNumberChange
                    value={get(regaugeDetailsDataset, "last_known_strength", "")}
                    handleChange={(type, val) => handleChange("last_known_strength", val)}
                    disabled={getDisabledStatus("last_known_strength")}
                    type="last_known_strength"
                    required
                    className="mt-0 mb-0 w-100"
                    label="Last Known Strength (%)"
                  />
                </Col>
              </Row>
            </div>
          </div>
        </Spin>
        {get(props, "type", "edit") === "edit" && (
          <div className="float-right pb-3">
            <Button
              type="primary"
              className="ml-3 float-right"
              onClick={() => {
                setIsLoading(true);
                handleFinalSubmit("/regauging/complete");
              }}
              icon={<ArrowRightOutlined />}
            >
              Complete Regauging
            </Button>
            <Button
              type="primary"
              className="ml-3 float-right"
              onClick={() => {
                setIsLoading(true);
                handleFinalSubmit("/regauging");
              }}
              icon={<SaveOutlined />}
            >
              Save Job
            </Button>
            <Button type="secondary" icon={<CloseCircleOutlined />} ghost className="float-right" onClick={() => history.push("/regauging")}>
              Cancel
            </Button>
          </div>
        )}
      </ErrorBoundary>
    </div>
  );
};

export default RegaugingCaskDetailsUiForm;
