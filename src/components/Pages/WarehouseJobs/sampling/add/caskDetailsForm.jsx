import { ArrowRightOutlined, CloseCircleOutlined, SaveOutlined } from "@ant-design/icons";
import { Button, Col, Progress, Row, Spin } from "antd";
import axios from "axios";
import { cloneDeep, debounce, get, isArray } from "lodash";
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
import { CustomInputText as InputTextChange } from "../../../../UIComponents/Input/customInput";
import { SingleSelect as Select } from "../../../../UIComponents/Select/singleSelect";
import { openNotificationWithIcon } from "../../../../UIComponents/Toast/notification";
import { samplingCaskDetailsDataDefaultValue } from "../../constants";

const dateFormat = "DD-MM-YYYY";

const SamplingCaskDetailsUiForm = (props) => {
  const dispatch = useDispatch();
  const { history } = props;
  const [loading, setIsLoading] = React.useState(false);
  const [dropDownValues, setDropDownValues] = React.useState({});
  const [samplingCaskDetailsDataset, setSamplingCaskDetailsDataset] = React.useState(samplingCaskDetailsDataDefaultValue);
  const [caskSearchValueListing, setCaskSearchValueListing] = React.useState(null);
  const [progress, setProgress] = React.useState(0);
  const [caskSearchValue, setCaskSearchValue] = React.useState("");

  React.useEffect(() => {
    let newData = { ...samplingCaskDetailsDataset };
    const currentDate = moment().format(dateFormat);
    newData["scheduled_at"] = currentDate;
    setSamplingCaskDetailsDataset(newData);
  }, []);

  const handleChange = React.useCallback((key, value, deepKey) => {
    let newValue = { ...samplingCaskDetailsDataset };
    if (deepKey) {
      newValue[key][deepKey] = value;
    } else {
      newValue[key] = value;
    }
    setSamplingCaskDetailsDataset(newValue);
  });

  React.useEffect(() => {
    dispatch(setCurrentView("Add Sampling"));
  }, []);

  const invokeDebounced = debounce((query) => {
    getCaskDetailsList(query);
  }, 1000);

  const handleFinalSubmit = async (link) => {
    let newData = { ...samplingCaskDetailsDataset };
    if (caskSearchValue) {
      newData["cask_number"] = caskSearchValue;
    }

    if (isArray(caskSearchValueListing) && caskSearchValueListing.length > 0 && get(newData, "cask_type")) {
      newData["cask_type_code"] = get(caskSearchValueListing, "[0].cask_type_code");
      delete newData["cask_type"];
    }

    if (get(newData, "cask_type") && isArray(caskSearchValueListing) && caskSearchValueListing.length === 0) {
      newData["cask_type_code"] = get(newData, "cask_type");
      delete newData["cask_type"];
    }

    const rest = await axios({
      method: "POST",
      data: newData,
      url: `${process.env.REACT_APP_API_ENDPOINT}/api/v1/cask_sample/create_job`,
      headers: { ...getRequestHeader() },
    }).catch((err) => {
      setIsLoading(false);
      openNotificationWithIcon("error", `${get(err, "response.data.message", "Something Went Wrong")} `);
    });

    if (get(rest, "data.status")) {
      openNotificationWithIcon("success", get(rest, "data.message", "Sampling Data Added successfully"));
      setIsLoading(false);
      if (link.includes("/sampling/complete")) {
        history.push(`${link}/${get(rest, "data.cask_sample_id")}`);
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
      let newData = { ...samplingCaskDetailsDataset };
      if (get(rest, "data.data", []).length > 0) {
        const tempData = get(rest, "data.data", [])[0];
        newData["cask_number"] = get(tempData, "cask_number");
        newData["passport_number"] = get(tempData, "passport_number");
        newData["cask_type"] = get(tempData, "cask_type");
        newData["ays"] = get(tempData, "ays");
        newData["distillery"] = get(tempData, "distillery");
      } else {
        newData["passport_number"] = "";
        newData["cask_type"] = "";
        newData["ays"] = "";
        newData["distillery"] = "";
      }
      setSamplingCaskDetailsDataset(newData);
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
          <div className="summary__additional_details common_card_section mt-4">
            <div className="d-flex align-items-center mb-2">
              <img src={SVGIcon.SamplingTitleIcon} alt="Cask Number" className="mr-2" style={{ width: "24px", height: "24px" }} />
              <span style={{ fontWeight: 700, fontSize: 16 }}>Sampling Details</span>
            </div>
            <div className="additional_details_content">
              <Row gutter={[16, 12]}>
                {/* <Col md={{ span: 6 }}>
                  <InputTextChange
                    type="sampling_id"
                    value={get(samplingCaskDetailsDataset, "sampling_id", "")}
                    disabled
                    label="Sampling ID"
                    className="mt-0 mb-0 w-100"
                    placeholder="Enter sampling id here"
                  />
                </Col>
                */}
                <Col xs={{ span: 24 }} md={{ span: 6 }}>
                  <CustomDatePicker
                    handleChange={(type, val) => handleChange("scheduled_at", val)}
                    type="scheduled_at"
                    format="DD-MM-YYYY"
                    required
                    value={get(samplingCaskDetailsDataset, "scheduled_at", "")}
                    enableOnlyFutureDate={true}
                    placeholder="Schedule At (DD-MM-YYYY)"
                    className="mt-0 mb-0 w-100"
                    label="Schedule At (DD-MM-YYYY)"
                  />
                </Col>
              </Row>
            </div>
          </div>
          <div className="summary__additional_details common_card_section">
            <div className="d-flex align-items-center mb-2">
              <img src={SVGIcon.CaskContentsIcon} alt="Cask Number" className="mr-2" style={{ width: "24px", height: "24px" }} />
              <span style={{ fontWeight: 700, fontSize: 16 }}>Cask Details</span>
            </div>
            <div className="additional_details_content">
              <Row gutter={[16, 12]}>
                <Col xs={{ span: 24 }} md={{ span: 6 }}>
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
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 6 }}>
                  <InputTextChange
                    type="passport_number"
                    required
                    value={get(samplingCaskDetailsDataset, "passport_number", "")}
                    handleChange={(type, val) => handleChange("passport_number", val)}
                    label="Passport Number"
                    disabled={isArray(caskSearchValueListing) && caskSearchValueListing.length > 0}
                    className="mt-0 mb-0 w-100"
                    placeholder="Enter passport number here"
                  />
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 6 }}>
                  <Select
                    handleChange={(key, value) => handleChange(key, value)}
                    value={get(samplingCaskDetailsDataset, "cask_type", "")}
                    type="cask_type"
                    disabled={isArray(caskSearchValueListing) && caskSearchValueListing.length > 0}
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
              </Row>
              <Row gutter={[16, 12]} className="mt-3">
                <Col xs={{ span: 24 }} md={{ span: 6 }}>
                  <Select
                    handleChange={(key, value) => handleChange(key, value)}
                    type="distillery"
                    disabled={isArray(caskSearchValueListing) && caskSearchValueListing.length > 0}
                    label="Distillery"
                    required
                    value={get(samplingCaskDetailsDataset, "distillery", "")}
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
                <Col xs={{ span: 24 }} md={{ span: 6 }}>
                  <CustomDatePicker
                    handleChange={(type, val) => handleChange("ays", val)}
                    type="ays"
                    format="DD-MM-YYYY"
                    disabled={isArray(caskSearchValueListing) && caskSearchValueListing.length > 0}
                    value={get(samplingCaskDetailsDataset, "ays", "")}
                    placeholder="AYS (DD-MM-YYYY)"
                    className="mt-0 mb-0 w-100"
                    label="AYS (DD-MM-YYYY)"
                  />
                </Col>
              </Row>
            </div>
          </div>
        </Spin>
        <div className="float-right pb-2">
          <Button
            type="primary"
            className="ml-3 float-right"
            onClick={() => {
              setIsLoading(true);
              handleFinalSubmit("/sampling/complete");
            }}
            icon={<ArrowRightOutlined />}
          >
            Complete Sampling
          </Button>
          <Button
            type="primary"
            className="ml-3 float-right"
            onClick={() => {
              setIsLoading(true);

              handleFinalSubmit("/sampling");
            }}
            icon={<SaveOutlined />}
          >
            Save Job
          </Button>
          <Button type="secondary" ghost className="float-right" icon={<CloseCircleOutlined />} onClick={() => history.push("/sampling")}>
            Cancel
          </Button>
        </div>
      </ErrorBoundary>
    </div>
  );
};

export default SamplingCaskDetailsUiForm;
