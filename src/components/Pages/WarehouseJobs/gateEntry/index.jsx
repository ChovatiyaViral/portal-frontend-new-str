import { CheckOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Button, Col, Radio, Row, Spin } from "antd";
import axios from "axios";
import { cloneDeep, debounce, find, get } from "lodash";
import moment from "moment";
import React from "react";
import { useDispatch } from "react-redux";
import { defaultTaxonomyMasterDataListName, isMobileOrTab, MasterDataKeyPair } from "../../../../constants";
import SVGIcon from "../../../../constants/svgIndex";
import CommonService from "../../../../helpers/request/Common";
import { getRequestHeader, requestPath } from "../../../../helpers/service";
import { capitalizeAllLetter, getKeyValuePair, getScreenSize } from "../../../../helpers/utility";
import { defaultRequestOptions } from "../../../../settings";
import { setCurrentView } from "../../../../store/Auth/auth.actions";
import { getTaxonomyData } from "../../../../store/Taxonomy/taxonomy.actions";
import UploadDocument from "../../../CommonComponents/Upload";
import { CustomDatePicker } from "../../../UIComponents/DatePicker";
import ErrorBoundary from "../../../UIComponents/ErrorBoundary";
import { CustomInputNumber as InputNumberChange, CustomInputText as InputTextChange } from "../../../UIComponents/Input/customInput";
import { SingleSelect as Select } from "../../../UIComponents/Select/singleSelect";
import { openNotificationWithIcon } from "../../../UIComponents/Toast/notification";
import { gateEntryCaskDefaultValues, regaugingDataSetDefault, validationCheckGateEntryCaskCommonArray, validationCheckGateEntryRegaugeCommonArray } from "../constants";
import RegaugingManualUiForm from "../regauging/add/manualMethod";
import RegaugingUllageUiForm from "../regauging/add/ullageMethod";
import { getGateEntryRegaugingRequestPayload } from "../regauging/helper";
import "../regauging/index.scss";

const CRRCaskDetailsUiForm = (props) => {
  const dispatch = useDispatch();
  const { history } = props;
  const [loading, setIsLoading] = React.useState(false);
  const [dropDownValues, setDropDownValues] = React.useState({});
  const [caskSearchValue, setCaskSearchValue] = React.useState("");
  const [gateEntryCaskDetails, setGateEntryCaskDetailsDataset] = React.useState(gateEntryCaskDefaultValues);

  const [warehouseListing, setWarehouseListing] = React.useState([]);
  const [dtListing, setDTLocationListing] = React.useState([]);

  const [methodSelected, setMethodSelected] = React.useState("");
  const [regaugeDataset, setRegaugeDataset] = React.useState(null);
  const [error, setError] = React.useState({ text: "", status: "" });

  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = React.useState(true);

  const handleChange = React.useCallback((key, value, deepKey) => {
    let newValue = { ...gateEntryCaskDetails };
    const newWareHouseObj = find(warehouseListing, function (o) {
      return get(o, "warehouse_keeper_name") === value;
    });

    if (key === "dt_location" && value) {
      setError({ status: "", text: "" });
      if (caskSearchValue) {
        verifyCaskNumber();
      }
    }

    if (deepKey) {
      newValue[key][deepKey] = value;
    } else {
      newValue[key] = value;
    }

    if (newWareHouseObj) {
      newValue["warehouse_name"] = get(newWareHouseObj, "warehouse_name", "");
    }

    setGateEntryCaskDetailsDataset(newValue);
  });

  const getCalcData = async (url, payload) => {
    try {
      const data = await CommonService.getDataSource(url, payload);
      if (get(data, "data.status")) {
        setIsLoading(false);
        return get(data, "data.data");
      }

      if (!get(data, "data.status", true)) {
        setIsLoading(false);
        openNotificationWithIcon("error", "Assessment Parameters", `${get(data, "data.message", "Something Went Wrong")} `);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  const getAssessmentParameters = async (data) => {
    let requestPayload = {
      measured_strength: get(data, "strength"),
      measured_incoming_weight: get(data, "incoming_weight"),
      measured_specific_gravity: get(data, "specific_gravity"),
      last_known_rla: get(gateEntryCaskDetails, "last_known_rla"),
      cask_type_code: get(gateEntryCaskDetails, "cask_type"),
    };
    const rest = await getCalcData(requestPath.wareHouseJobsManagement.regauging.wtMsrCalculation, requestPayload);
    return rest;
  };

  const getUllageMethodAssessmentParameters = async (data) => {
    let requestPayload = {
      cask_strength: get(gateEntryCaskDetails, "last_known_strength"),
      cask_rla: get(gateEntryCaskDetails, "last_known_rla"),
      measured_dry_dip: get(data, "dry_dip"),
      measured_wet_dip: get(data, "wet_dip"),
      measured_strength: get(data, "strength"),
      measured_temperature: get(data, "temperature"),
      fill_date: get(data, "fill_date"),
    };

    const rest = await getCalcData(requestPath.wareHouseJobsManagement.regauging.ullageCalculation, requestPayload);
    return rest;
  };

  const handleMethodDataChange = React.useCallback((data) => {
    let tempObj = { ...data };
    setRegaugeDataset(tempObj);
  });

  const handleAssessmentParameters = React.useCallback(async () => {
    let tempObj = { ...regaugeDataset };

    if (get(tempObj, "strength") && (get(tempObj, "incoming_weight") || get(tempObj, "weight")) && get(tempObj, "specific_gravity")) {
      setIsLoading(true);
      const compObj = await getAssessmentParameters(tempObj);
      tempObj = { ...tempObj, ...compObj };
    }

    if (get(tempObj, "dry_dip") && get(tempObj, "wet_dip") && get(tempObj, "strength") && get(tempObj, "temperature") && get(tempObj, "fill_date")) {
      setIsLoading(true);
      const compObj = await getUllageMethodAssessmentParameters(tempObj);
      tempObj = { ...tempObj, ...compObj };
    }

    setRegaugeDataset(tempObj);
  });

  React.useEffect(() => {
    dispatch(setCurrentView("Add Gate Entry"));
  }, []);

  const handleFinalSubmit = async () => {
    let newData = { ...gateEntryCaskDetails };
    if (caskSearchValue) {
      newData["cask_number"] = caskSearchValue;
    }

    if (get(newData, "cask_type")) {
      newData["cask_type_code"] = get(newData, "cask_type");
      delete newData["cask_type"];
    }

    const requestPayload = getGateEntryRegaugingRequestPayload(gateEntryCaskDetails, regaugeDataset, methodSelected);
    await CommonService.getDataSource(requestPath.wareHouseJobsManagement.gateEntry.addToCRR, requestPayload).then((data) => {
      if (get(data, "data.status")) {
        openNotificationWithIcon("success", "Add To CRR Job", `${get(data, "data.message", "Completed Regauging Job")} `);
        history.push("/gate-entry/crr-listing");
        setIsLoading(false);
      }

      if (!get(data, "data.status", true)) {
        setIsLoading(false);
        openNotificationWithIcon("error", "Add To CRR Job", `${get(data, "data.message", "Something Went Wrong")} `);
      }
    });
  };

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

  const invokeDebounced = debounce((query) => {
    verifyCaskNumber(query);
  }, 2000);

  const verifyCaskNumber = async (query) => {
    if (get(gateEntryCaskDetails, "dt_location")) {
      const requestPayload = {
        cask_number: query,
        dt_location: get(gateEntryCaskDetails, "dt_location"),
      };

      await CommonService.getDataSource(requestPath.wareHouseJobsManagement.gateEntry.validateCask, requestPayload, false).then((data) => {
        if (get(data, "data.status")) {
          setError({ status: "", text: "" });
          setIsSubmitButtonDisabled(false);
          setIsLoading(false);
        }

        if (!get(data, "data.status", true)) {
          setError({ status: "error", text: get(data, "data.message") });
          setIsLoading(false);
        }
      });
    } else {
      setError({ status: "error", text: "Please select DT Location" });
    }
  };

  const validationCheck = () => {
    const commonCheck = validationCheckGateEntryCaskCommonArray.filter((v) => !gateEntryCaskDetails[v]);
    const regaugeValidation = methodSelected ? validationCheckGateEntryRegaugeCommonArray[methodSelected].filter((v) => !regaugeDataset[v]) : [];
    if (!commonCheck.length && !regaugeValidation.length) {
      setIsSubmitButtonDisabled(false);
    } else {
      setIsSubmitButtonDisabled(true);
    }
  };

  React.useEffect(() => {
    validationCheck();
  }, [gateEntryCaskDetails, regaugeDataset]);

  const getWareHouseDetailsList = async () => {
    const rest = await axios({
      method: "POST",
      data: {
        page: "all",
      },
      url: `${process.env.REACT_APP_API_ENDPOINT}/api/v1/warehouse`,
      headers: { ...getRequestHeader() },
    }).catch((err) => {
      openNotificationWithIcon("error", `${get(err, "response.data.message", "Something Went Wrong")} `);
    });

    if (get(rest, "data.status")) {
      setWarehouseListing(get(rest, "data.data", []));
      let newValues = { ...dropDownValues };
      newValues["warehouse_keeper_name"] = getKeyValuePair(get(rest, "data.data", []), "warehouse_keeper_name", false);
      setDropDownValues(newValues);
    }

    if (!get(rest, "data.status", true)) {
      openNotificationWithIcon("error", `${get(rest, "response.data.message", "Something Went Wrong")} `);
    }
  };

  const getDTLocationList = async () => {
    const rest = await axios({
      method: "POST",
      data: {
        page: "all",
      },
      url: `${process.env.REACT_APP_API_ENDPOINT}/api/v1/dt_location`,
      headers: { ...getRequestHeader() },
    }).catch((err) => {
      openNotificationWithIcon("error", `${get(err, "response.data.message", "Something Went Wrong")} `);
    });

    if (get(rest, "data.status")) {
      setDTLocationListing(get(rest, "data.data", []));
      let newValues = { ...dropDownValues };
      newValues["dt_location"] = getKeyValuePair(get(rest, "data.data", []), "location_name", false);
      setDropDownValues(newValues);
    }

    if (!get(rest, "data.status", true)) {
      openNotificationWithIcon("error", `${get(rest, "data.message", "Something Went Wrong")} `);
    }
  };

  React.useEffect(() => {
    getDTLocationList();
  }, []);

  console.log(regaugeDataset);

  return (
    <ErrorBoundary>
      <Spin spinning={loading}>
        <div className="summary__additional_details common_card_section">
          <div className="d-flex align-items-center mb-2">
            <img src={SVGIcon.WareHouseCaskIcon} alt="Cask Number" className="pr-2" style={{ width: "24px", height: "24px" }} />
            <span>Warehouse Details</span>
          </div>
          <div className="additional_details_content">
            <Row gutter={[16, 12]}>
              <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 6 }}>
                <Select
                  handleChange={(key, value) => handleChange(key, value)}
                  type="dt_location"
                  value={get(gateEntryCaskDetails, "dt_location", "")}
                  label="Location"
                  required
                  placeHolder="Select"
                  onDropdownVisibleChange={() => {
                    if (get(dropDownValues, "dt_location", []).length === 0) {
                      getDTLocationList();
                    }
                  }}
                  options={get(dropDownValues, "dt_location", [])}
                  className="mt-0 mb-0"
                />
              </Col>
              <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 6 }}>
                <Select
                  handleChange={(key, value) => handleChange(key, value)}
                  type="warehouse_keeper_name"
                  value={get(gateEntryCaskDetails, "warehouse_keeper_name", "")}
                  label="Keeper Name"
                  required
                  placeHolder="Select"
                  onDropdownVisibleChange={() => {
                    if (get(dropDownValues, "warehouse_keeper_name", []).length === 0) {
                      getWareHouseDetailsList();
                    }
                  }}
                  options={get(dropDownValues, "warehouse_keeper_name", [])}
                  className="mt-0 mb-0"
                />
              </Col>
              <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 6 }}>
                <InputTextChange
                  type="warehouse_name"
                  value={get(gateEntryCaskDetails, "warehouse_name", "")}
                  handleChange={(type, val) => handleChange("warehouse_name", val)}
                  label="Name"
                  disabled
                  required
                  className="mt-0 mb-0 w-100"
                  placeholder="Enter Warehouse Name"
                />
              </Col>
              <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 6 }}>
                <InputTextChange
                  type="delivered_by_name"
                  value={get(gateEntryCaskDetails, "delivered_by_name", "")}
                  handleChange={(type, val) => handleChange("delivered_by_name", val)}
                  label="Delivered By"
                  required
                  className="mt-0 mb-0 w-100"
                  placeholder="Enter delivered by here"
                />
              </Col>
            </Row>
          </div>
        </div>

        <div className="summary__additional_details common_card_section">
          <div className="d-flex align-items-center mb-2">
            <img src={SVGIcon.CaskContentsIcon} alt="Cask Number" className="pr-2" style={{ width: "24px", height: "24px" }} />
            <span>Cask Details</span>
          </div>
          <div className="additional_details_content">
            <Row gutter={[16, 12]}>
              <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 6 }}>
                <>
                  <InputTextChange
                    type="cask_number"
                    value={caskSearchValue}
                    required
                    status={get(error, "status")}
                    validateStatus={get(error, "status")}
                    helpText={get(error, "text")}
                    handleChange={(type, val) => {
                      setCaskSearchValue(val);
                      handleChange("cask_number", val);
                      if (val.length >= 2) {
                        invokeDebounced(val);
                      }
                    }}
                    label="Cask Number"
                    className="mt-0 mb-0 w-100"
                    placeholder="Enter cask number here"
                  />
                </>
              </Col>
              <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 6 }}>
                <InputTextChange
                  type="passport_number"
                  value={get(gateEntryCaskDetails, "passport_number", "")}
                  handleChange={(type, val) => handleChange("passport_number", val)}
                  label="Passport Number"
                  required
                  className="mt-0 mb-0 w-100"
                  placeholder="Enter passport number here"
                />
              </Col>
              <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 6 }}>
                <CustomDatePicker
                  handleChange={(type, val) => handleChange("ays", val)}
                  type="ays"
                  format="DD-MM-YYYY"
                  required
                  value={get(gateEntryCaskDetails, "ays", "")}
                  placeholder="AYS (DD-MM-YYYY)"
                  className="mt-0 mb-0 w-100"
                  label="AYS (DD-MM-YYYY)"
                />
              </Col>
            </Row>
          </div>
        </div>

        <div className="summary__additional_details common_card_section">
          <div className="d-flex align-items-center mb-2">
            <img src={SVGIcon.CaskContentsIcon} alt="Cask Number" className="pr-2" style={{ width: "24px", height: "24px" }} />
            <span>Cask Contents</span>
          </div>
          <div className="additional_details_content">
            <Row gutter={[16, 12]}>
              {/* <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 6 }}>
                <Select
                  handleChange={(key, value) => handleChange(key, value)}
                  value={get(gateEntryCaskDetails, "brand", "")}
                  type="brand"
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
              </Col> */}
              <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 6 }}>
                <Select
                  handleChange={(key, value) => handleChange(key, value)}
                  type="distillery"
                  label="Distillery"
                  required
                  value={get(gateEntryCaskDetails, "distillery", "")}
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
                  value={get(gateEntryCaskDetails, "cask_type", "")}
                  type="cask_type"
                  label="Cask Type"
                  required
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
              <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 6 }}>
                <InputTextChange
                  type="whisky_type"
                  required
                  value={get(gateEntryCaskDetails, "whisky_type", "")}
                  handleChange={(type, val) => handleChange("whisky_type", val)}
                  label="Whisky Type"
                  className="mt-0 mb-0 w-100"
                  placeholder="Enter whisky type here"
                />
              </Col>
              <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 6 }}>
                <InputNumberChange
                  value={get(gateEntryCaskDetails, "last_known_ola", "")}
                  handleChange={(type, val) => handleChange("last_known_ola", val)}
                  type="last_known_ola"
                  required
                  className="mt-0 mb-0 w-100"
                  label="Last Known OLA"
                />
              </Col>
              <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 6 }}>
                <InputNumberChange
                  value={get(gateEntryCaskDetails, "last_known_rla", "")}
                  handleChange={(type, val) => handleChange("last_known_rla", val)}
                  type="last_known_rla"
                  required
                  className="mt-0 mb-0 w-100"
                  label="Last Known RLA"
                />
              </Col>
              <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 6 }}>
                <InputNumberChange
                  value={get(gateEntryCaskDetails, "last_known_strength", "")}
                  handleChange={(type, val) => handleChange("last_known_strength", val)}
                  type="last_known_strength"
                  required
                  className="mt-0 mb-0 w-100"
                  label="Last Known Strength (%)"
                />
              </Col>
            </Row>
          </div>
        </div>
        <div className="summary__additional_details common_card_section">
          <div className="d-flex align-items-center mb-2">
            <img src={SVGIcon.ReGuagingIcon} alt="Cask Number" className="pr-2" style={{ width: "24px", height: "24px" }} />
            <span>Choose Regauge Method</span>
          </div>
          <Radio.Group
            onChange={(e) => {
              handleChange("regauge_method", e.target.value);
              setMethodSelected(e.target.value);
              if (e.target.value === "ullage") {
                let tempObj = cloneDeep(get(regaugingDataSetDefault, "ullage"));
                tempObj["fill_date"] = moment().format("DD-MM-YYYY");
                setRegaugeDataset(tempObj);
              } else {
                setRegaugeDataset(cloneDeep(get(regaugingDataSetDefault, "manual")));
              }
            }}
            value={methodSelected}
            className={getScreenSize() > isMobileOrTab ? "d-flex" : ""}
          >
            <Radio value="wt_msr">Weight & Measurements</Radio>
            <Radio value="ullage" className="pl-sm-3">
              Ullage
            </Radio>
          </Radio.Group>
        </div>

        {methodSelected === "wt_msr" && (
          <RegaugingManualUiForm
            regaugeDataset={regaugeDataset}
            setRegaugeDataset={(data) => handleMethodDataChange(data)}
            handleAssessmentParameters={handleAssessmentParameters}
            isLoading={loading}
          />
        )}
        {methodSelected === "ullage" && (
          <RegaugingUllageUiForm
            regaugeDataset={regaugeDataset}
            handleAssessmentParameters={handleAssessmentParameters}
            setRegaugeDataset={(data) => handleMethodDataChange(data)}
            isLoading={loading}
          />
        )}
        {methodSelected && (
          <>
            <UploadDocument
              handleChange={(val) => {
                let tempObj = { ...regaugeDataset };
                tempObj["all_files"] = get(val, "files", []);
                tempObj["notes"] = get(val, "notes", "");
                setRegaugeDataset(tempObj);
              }}
            />
            <div className="float-right pb-3">
              <Button type="primary" className="ml-3 float-right" icon={<CheckOutlined />} onClick={() => handleFinalSubmit()} disabled={isSubmitButtonDisabled}>
                Submit
              </Button>
              <Button type="secondary" ghost className="float-right" icon={<CloseCircleOutlined />} onClick={() => history.push("/regauging")}>
                Cancel
              </Button>
            </div>
          </>
        )}
      </Spin>
    </ErrorBoundary>
  );
};

export default CRRCaskDetailsUiForm;
