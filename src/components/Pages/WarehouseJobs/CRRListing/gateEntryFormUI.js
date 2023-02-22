import { SaveOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Button, Col, Progress, Radio, Row, Spin } from "antd";
import axios from "axios";
import { cloneDeep, debounce, find, get, isArray } from "lodash";
import React from "react";
import { useDispatch } from "react-redux";
import { defaultTaxonomyMasterDataListName, isMobileOrTab, MasterDataKeyPair } from "../../../../constants";
import SVGIcon from "../../../../constants/svgIndex";
import { getRequestHeader } from "../../../../helpers/service";
import { capitalizeAllLetter, getKeyValuePair, getScreenSize } from "../../../../helpers/utility";
import { defaultRequestOptions } from "../../../../settings";
import { setCurrentView } from "../../../../store/Auth/auth.actions";
import { getTaxonomyData } from "../../../../store/Taxonomy/taxonomy.actions";
import { CustomDatePicker } from "../../../UIComponents/DatePicker";
import ErrorBoundary from "../../../UIComponents/ErrorBoundary";
import { CustomInputNumber as InputNumberChange, CustomInputText as InputTextChange } from "../../../UIComponents/Input/customInput";
import { SingleSelect as Select } from "../../../UIComponents/Select/singleSelect";
import { openNotificationWithIcon } from "../../../UIComponents/Toast/notification";
import UploadDocument from "../../../UIComponents/Upload";
import { gateEntryRegaugingDefaultValues, regaugingDataSetDefault } from "../constants";
import RegaugingManualUiForm from "../regauging/add/manualMethod";
import RegaugingUllageUiForm from "../regauging/add/ullageMethod";
import { getGateEntryRegaugingRequestPayload } from "../regauging/helper";
import "../regauging/index.scss";

const CRRCaskDetailsUiForm = (props) => {
  const dispatch = useDispatch();
  const { history } = props;
  const [loading, setIsLoading] = React.useState(false);
  const [dropDownValues, setDropDownValues] = React.useState({});

  const [regaugeDetailsDataset, setRegaugingCaskDetailsDataset] = React.useState(gateEntryRegaugingDefaultValues);
  const [caskSearchValueListing, setCaskSearchValueListing] = React.useState(null);

  const [progress, setProgress] = React.useState(0);
  const [caskSearchValue, setCaskSearchValue] = React.useState("");
  const [warehouseListing, setWarehouseListing] = React.useState([]);
  const [dtListing, setDTLocationListing] = React.useState([]);

  const [isMethodOpted, setIsMethodOpted] = React.useState(false);
  const [methodSelected, setMethodSelected] = React.useState("");
  const [regaugeDataset, setRegaugeDataset] = React.useState(null);

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

  const handleMethodDataChange = React.useCallback((data) => {
    if (get(data, "strength") && get(data, "incoming_weight") && get(data, "specific_gravity")) {
      setIsLoading(true);
      getAssessmentParameters(data);
    }

    if (get(data, "dry_dip") && get(data, "wet_dip") && get(data, "abv") && get(data, "temperature") && get(data, "fill_date")) {
      setIsLoading(true);
      getUllageMethodAssessmentParameters(data);
    }
    setRegaugeDataset(data);
  }, []);

  const getAssessmentParameters = async (data) => {
    console.log(regaugeDetailsDataset);

    const rest = await axios({
      method: "POST",
      data: {
        measured_strength: get(data, "strength"),
        measured_incoming_weight: get(data, "incoming_weight"),
        measured_specific_gravity: get(data, "specific_gravity"),
        consignor_doc_rla: get(regaugeDetailsDataset, "consignor_doc_rla"),
        cask_type_code: get(regaugeDetailsDataset, "cask_type"),
      },
      url: `${process.env.REACT_APP_API_ENDPOINT}/api/v1/cask_regauge/wt_msr_calc_data`,
      headers: { ...getRequestHeader() },
    }).catch((err) => {
      setIsLoading(false);
      openNotificationWithIcon("error", "Assessment Parameters", `${get(err, "response.data.message", "Something Went Wrong")} `);
    });

    if (get(rest, "data.status")) {
      const tempObj = { ...data, ...get(rest, "data.data") };
      setRegaugeDataset(tempObj);
      setIsLoading(false);
    }

    if (!get(rest, "data.status", true)) {
      setIsLoading(false);
      openNotificationWithIcon("error", "Assessment Parameters", `${get(rest, "data.message", "Something Went Wrong")} `);
    }
  };

  const getUllageMethodAssessmentParameters = async (data) => {
    const rest = await axios({
      method: "POST",
      data: {
        cask_strength: get(regaugeDetailsDataset, "consignor_doc_strength"),
        cask_rla: get(regaugeDetailsDataset, "consignor_doc_rla"),
        measured_dry_dip: get(data, "dry_dip"),
        measured_wet_dip: get(data, "wet_dip"),
        measured_strength: get(data, "abv"),
        measured_temperature: get(data, "temperature"),
        fill_date: get(data, "fill_date"),
      },
      url: `${process.env.REACT_APP_API_ENDPOINT}/api/v1/cask_regauge/ullage_calc_data`,
      headers: { ...getRequestHeader() },
    }).catch((err) => {
      setIsLoading(false);
      openNotificationWithIcon("error", "Assessment Parameters", `${get(err, "response.data.message", "Something Went Wrong")} `);
    });

    if (get(rest, "data.status")) {
      const tempObj = { ...data, ...get(rest, "data.data") };
      setRegaugeDataset(tempObj);
      setIsLoading(false);
    }

    if (!get(rest, "data.status", true)) {
      setIsLoading(false);
      openNotificationWithIcon("error", "Assessment Parameters", `${get(rest, "data.message", "Something Went Wrong")} `);
    }
  };

  React.useEffect(() => {
    dispatch(setCurrentView("Add Gate Entry"));
  }, []);

  const invokeDebounced = debounce((query) => {
    getCaskDetailsList(query);
  }, 1000);

  const handleFinalSubmit = async (link) => {
    let newData = { ...regaugeDetailsDataset };

    if (caskSearchValue) {
      newData["cask_number"] = caskSearchValue;
    }

    // eslint-disable-next-line no-console
    console.log(getGateEntryRegaugingRequestPayload(newData, regaugeDataset, methodSelected));
  };

  const getCaskDetailsList = async (query) => {
    const rest = await axios({
      method: "POST",
      data: {
        page: "all",
        not_approved: true,
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

      if (get(rest, "data.data", []).length > 0) {
        const tempData = get(rest, "data.data", [])[0];
        newData = tempData;
      } else {
        newData = { ...gateEntryRegaugingDefaultValues };
      }
      setRegaugingCaskDetailsDataset(newData);
      setCaskSearchValueListing(get(rest, "data.data", []));
    }

    if (!get(rest, "data.status", true)) {
      openNotificationWithIcon("error", `${get(rest, "response.data.message", "Something Went Wrong")} `);
    }
  };

  const fetchTaxonomyData = async (masterKey = defaultTaxonomyMasterDataListName, sort_key = "", sort_order = "ASC", otherKey = "") => {
    let requestOptions = cloneDeep(defaultRequestOptions);
    requestOptions[MasterDataKeyPair.MasterDataKey] = masterKey;
    requestOptions["orderby_field"] = sort_key;
    requestOptions["orderby_value"] = sort_order;

    if (masterKey === "cask_type") {
      requestOptions["status_filter"] = "all";
    }

    const taxonomyData = dispatch(getTaxonomyData(requestOptions));

    if (get(taxonomyData, "error", false)) {
      openNotificationWithIcon("error", `${capitalizeAllLetter(masterKey.replace(/_/g, " "))}`, `${get(taxonomyData, "error.message", "Something Went Wrong")} `);
    }

    let newValues = { ...dropDownValues };
    newValues[masterKey] = getKeyValuePair(get(taxonomyData, "response.data", []), sort_key, false, otherKey);
    setDropDownValues(newValues);
  };

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
    if (get(props, "type") === "view") {
      return true;
    }
    return false;
  };

  React.useEffect(() => {
    getDTLocationList();
  }, []);

  return (
    <div className="portal_styling__2 table-responsive-padding">
      <ErrorBoundary>
        <Spin spinning={loading}>
          <div className="summary__additional_details common_card_section">
            <div className="d-flex align-items-center details_title">
              <img src={SVGIcon.CaskContentsIcon} alt="Cask Number" style={{ width: "24px", height: "24px" }} />
              <span>Cask Details</span>
            </div>
            <div className="additional_details_content">
              <Row gutter={[16, 12]}>
                <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 6 }}>
                  <>
                    <InputTextChange
                      type="cask_number"
                      value={caskSearchValue}
                      handleChange={(type, val) => {
                        setCaskSearchValue(val);
                        handleChange("cask_number", val);
                        if (val.length >= 2) {
                          invokeDebounced(val);
                        }
                      }}
                      helpText={getHelperText()}
                      label="Cask Number"
                      className="mt-0 mb-0 w-100"
                      placeholder="Enter cask number here"
                    />
                    {progress > 0 ? <Progress size="small" className="mb-2" percent={progress} /> : null}
                  </>
                </Col>
                <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 6 }}>
                  <InputTextChange
                    type="passport_number"
                    value={get(regaugeDetailsDataset, "passport_number", "")}
                    handleChange={(type, val) => handleChange("passport_number", val)}
                    label="Passport Number"
                    disabled={getDisabledStatus("passport_number")}
                    className="mt-0 mb-0 w-100"
                    placeholder="Enter passport number here"
                  />
                </Col>
                <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 6 }}>
                  <CustomDatePicker
                    handleChange={(type, val) => handleChange("ays", val)}
                    type="ays"
                    disabled={getDisabledStatus("ays")}
                    value={get(regaugeDetailsDataset, "ays", "")}
                    placeholder="AYS (YYYY-MM-DD)"
                    className="mt-0 mb-0 w-100"
                    label="AYS (YYYY-MM-DD)"
                  />
                </Col>
              </Row>
            </div>
          </div>

          <div className="summary__additional_details common_card_section">
            <div className="d-flex align-items-center details_title">
              <img src={SVGIcon.WareHouseCaskIcon} alt="Cask Number" style={{ width: "24px", height: "24px" }} />
              <span>Warehouse Details</span>
            </div>
            <div className="additional_details_content">
              <Row gutter={[16, 12]}>
                <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 6 }}>
                  <Select
                    handleChange={(key, value) => handleChange(key, value)}
                    type="dt_location"
                    value={get(regaugeDetailsDataset, "dt_location", "")}
                    label="Location"
                    placeHolder="Select"
                    disabled={getDisabledStatus("dt_location")}
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
                    value={get(regaugeDetailsDataset, "warehouse_keeper_name", "")}
                    label="Keeper Name"
                    placeHolder="Select"
                    disabled={getDisabledStatus("warehouse_keeper_name")}
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
                    value={get(regaugeDetailsDataset, "warehouse_name", "")}
                    handleChange={(type, val) => handleChange("warehouse_name", val)}
                    label="Name"
                    disabled
                    className="mt-0 mb-0 w-100"
                    placeholder="Enter Warehouse Name"
                  />
                </Col>
                <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 6 }}>
                  <InputTextChange
                    type="delivered_by"
                    value={get(regaugeDetailsDataset, "delivered_by", "")}
                    handleChange={(type, val) => handleChange("delivered_by", val)}
                    label="Delivered By"
                    disabled={getDisabledStatus("delivered_by")}
                    className="mt-0 mb-0 w-100"
                    placeholder="Enter delivered by here"
                  />
                </Col>
              </Row>
            </div>
          </div>

          <div className="summary__additional_details common_card_section">
            <div className="d-flex align-items-center details_title">
              <img src={SVGIcon.CaskContentsIcon} alt="Cask Number" style={{ width: "24px", height: "24px" }} />
              <span>Cask Contents</span>
            </div>
            <div className="additional_details_content">
              <Row gutter={[16, 12]}>
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
                  <Select
                    handleChange={(key, value) => handleChange(key, value)}
                    type="distillery"
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
                    value={get(regaugeDetailsDataset, "cask_type", "")}
                    type="cask_type"
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
                <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 6 }}>
                  <InputTextChange
                    type="whisky_type"
                    value={get(regaugeDetailsDataset, "whisky_type", "")}
                    handleChange={(type, val) => handleChange("whisky_type", val)}
                    label="Whisky Type"
                    disabled={getDisabledStatus("whisky_type")}
                    className="mt-0 mb-0 w-100"
                    placeholder="Enter whisky type here"
                  />
                </Col>
                <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 6 }}>
                  <InputNumberChange
                    value={get(regaugeDetailsDataset, "consignor_doc_ola", "")}
                    handleChange={(type, val) => handleChange("consignor_doc_ola", val)}
                    disabled={getDisabledStatus("consignor_doc_ola")}
                    type="consignor_doc_ola"
                    className="mt-0 mb-0 w-100"
                    label="Consignor Doc OLA"
                  />
                </Col>
                <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 6 }}>
                  <InputNumberChange
                    value={get(regaugeDetailsDataset, "consignor_doc_rla", "")}
                    handleChange={(type, val) => handleChange("consignor_doc_rla", val)}
                    disabled={getDisabledStatus("consignor_doc_rla")}
                    type="consignor_doc_rla"
                    className="mt-0 mb-0 w-100"
                    label="Consignor Doc RLA"
                  />
                </Col>
                <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 6 }}>
                  <InputNumberChange
                    value={get(regaugeDetailsDataset, "consignor_doc_strength", "")}
                    handleChange={(type, val) => handleChange("consignor_doc_strength", val)}
                    disabled={getDisabledStatus("consignor_doc_strength")}
                    type="consignor_doc_strength"
                    className="mt-0 mb-0 w-100"
                    label="Consignor Doc Strength"
                  />
                </Col>
              </Row>
            </div>
          </div>
          <div className="summary__additional_details common_card_section">
            <div className="d-flex align-items-center details_title">
              <img src={SVGIcon.ReGuagingIcon} alt="Cask Number" style={{ width: "24px", height: "24px" }} />
              <span>Choose Regauge Method</span>
            </div>
            <Radio.Group
              onChange={(e) => {
                setIsMethodOpted(false);
                setMethodSelected(e.target.value);
                if (e.target.value === "ullage_gateentry") {
                  setRegaugeDataset(cloneDeep(get(regaugingDataSetDefault, "ullage")));
                } else {
                  setRegaugeDataset(cloneDeep(get(regaugingDataSetDefault, "manual")));
                }
              }}
              value={methodSelected}
              className={getScreenSize() > isMobileOrTab ? "d-flex" : ""}
            >
              <Radio value="wt_msr_gateentry">Weight & Measurements</Radio>
              <Radio value="ullage_gateentry" className="pl-sm-3">
                Ullage
              </Radio>
            </Radio.Group>
          </div>
          {methodSelected === "wt_msr_gateentry" && <RegaugingManualUiForm regaugeDataset={regaugeDataset} setRegaugeDataset={(data) => handleMethodDataChange(data)} isLoading={loading} />}
          {methodSelected === "ullage_gateentry" && <RegaugingUllageUiForm regaugeDataset={regaugeDataset} setRegaugeDataset={(data) => handleMethodDataChange(data)} isLoading={loading} />}
          {methodSelected && (
            <UploadDocument
              handleChange={(val) => {
                let tempObj = { ...regaugeDataset };
                tempObj["all_files"] = get(val, "files", []);
                tempObj["notes"] = get(val, "notes", "");
                setRegaugeDataset(tempObj);
              }}
            />
          )}
        </Spin>
        {get(props, "type", "edit") === "edit" && (
          <div className="float-right mt-4 footer_cta complete_sampling_footer">
            <Button type="primary" className="ml-3 float-right" icon={<SaveOutlined />} onClick={() => handleFinalSubmit()}>
              Save to CRR
            </Button>
            <Button type="secondary" ghost className="float-right" icon={<CloseCircleOutlined />} onClick={() => history.push("/regauging")}>
              Cancel
            </Button>
          </div>
        )}
      </ErrorBoundary>
    </div>
  );
};

export default CRRCaskDetailsUiForm;
