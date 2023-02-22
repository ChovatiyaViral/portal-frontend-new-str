import { Col, Radio, Row, Spin } from "antd";
import axios from "axios";
import { cloneDeep, get } from "lodash";
import React from "react";
import { useDispatch } from "react-redux";
import { MasterDataKeyPair } from "../../../../../constants";
import SVGIcon from "../../../../../constants/svgIndex";
import { topFunction } from "../../../../../helpers/common";
import { getRequestHeader } from "../../../../../helpers/service";
import { capitalizeAllLetter, getKeyValuePair } from "../../../../../helpers/utility";
import { defaultRequestOptions } from "../../../../../settings";
import { getTaxonomyData } from "../../../../../store/Taxonomy/taxonomy.actions";
import { CustomDatePicker } from "../../../../UIComponents/DatePicker";
import ErrorBoundary from "../../../../UIComponents/ErrorBoundary";
import { SingleSelect as Select } from "../../../../UIComponents/Select/singleSelect";
import { openNotificationWithIcon } from "../../../../UIComponents/Toast/notification";
import ComparisonDetails from "../details/comparisonDetails";

const SamplingUiReview = (props) => {
  const dispatch = useDispatch();

  const [value, setValue] = React.useState("");
  const [customerList, setCustomerList] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [expectedData, setExpectedData] = React.useState([]);
  const [dropDownValues, setDropDownValues] = React.useState({});

  const onChange = (e) => {
    let newValue = { ...get(props, "samplingDataset") };
    setValue(e.target.value);
    newValue["recommended_action"] = e.target.value;
    props.setSamplingDataset(newValue);
  };

  const handleChange = React.useCallback((key, value) => {
    let newValue = { ...get(props, "samplingDataset") };

    switch (key) {
      case "customer_id":
        const selectedCustomer = customerList.find((item) => item.name === value);
        newValue[key] = get(selectedCustomer, "id");
        props.setSamplingDataset(newValue);
        break;
      case "bottling_date":
        newValue[key] = value;
        props.setSamplingDataset(newValue);
        break;
      case "next_sampling_date":
        newValue[key] = value;
        props.setSamplingDataset(newValue);
        break;
      case "fill_type":
        newValue[key] = value;
        props.setSamplingDataset(newValue);
        break;
      case "target_brand":
        newValue[key] = value;
        props.setSamplingDataset(newValue);
        break;
      case "rerack_cask_type":
        newValue[key] = value;
        props.setSamplingDataset(newValue);
        break;
      default:
        break;
    }
  });

  const fetchCustomerList = async () => {
    const rest = await axios({
      method: "POST",
      data: {
        page: "all",
      },
      url: `${process.env.REACT_APP_API_ENDPOINT}/api/customer_list`,
      headers: { ...getRequestHeader() },
    }).catch((err) => {
      openNotificationWithIcon("error", `${get(err, "response.data.message", "Something Went Wrong")} `);
    });

    if (get(rest, "data.status")) {
      setCustomerList(get(rest, "data.data", []));
    }

    if (!get(rest, "data.status", true)) {
      openNotificationWithIcon("error", `${get(rest, "response.data.message", "Something Went Wrong")} `);
    }
  };

  const fetchCompletedList = async () => {
    const rest = await axios({
      method: "POST",
      data: {
        cask_number: get(props, "samplingDataset.cask_number", ""),
        last_sampling_id: get(props, "samplingDataset.sampling_id", ""),
      },
      url: `${process.env.REACT_APP_API_ENDPOINT}/api/v1/cask_sample/previous_samplings`,
      headers: { ...getRequestHeader() },
    }).catch((err) => {
      setIsLoading(false);
      openNotificationWithIcon("error", `${get(err, "response.data.message", "Something Went Wrong")} `);
    });

    if (get(rest, "data.status")) {
      setIsLoading(false);
      let newData = get(props, "samplingDataset", {});
      newData["all_files"] = get(props, "samplingDataset.additional_details.files", []);
      newData["notes"] = get(props, "samplingDataset.additional_details.notes", "");
      setExpectedData([newData, ...get(rest, "data.data", [])]);
    }

    if (!get(rest, "data.status", true)) {
      setIsLoading(false);
      openNotificationWithIcon("error", `${get(rest, "response.data.message", "Something Went Wrong")} `);
    }
  };

  const getCustomerValue = (value) => {
    const selectedCustomer = customerList.find((item) => item.id === value);
    return get(selectedCustomer, "name");
  };

  React.useEffect(() => {
    topFunction();
    fetchCompletedList();
  }, []);

  React.useEffect(() => {
    let newData = [...expectedData];
    newData[0] = get(props, "samplingDataset");
    setExpectedData(newData);
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

  return (
    <div className="portal_styling__2 table-responsive-padding">
      <ErrorBoundary>
        <div className="summary__additional_details common_card_section">
          <div className="d-flex align-items-center mb-2">
            <img src={SVGIcon.ReviewActionIcon} alt="Additional Details" className="mr-2" style={{ width: "24px", height: "24px" }} />
            <span style={{ fontWeight: 700, fontSize: 16 }}>Action</span>
          </div>
          <Radio.Group onChange={onChange} value={get(props, "samplingDataset.recommended_action")} className="d-flex mb-4 flex-wrap">
            <Radio value="Bottle">Bottle</Radio>
            <Radio value="Octivate">Octivate</Radio>
            <Radio value="Rerack">Rerack</Radio>
            <Radio value="Mature further">Mature further</Radio>
          </Radio.Group>

          <div className="bottle_action_section">
            <Row gutter={[16, 16]}>
              {get(props, "samplingDataset.recommended_action") === "Bottle" && (
                <>
                  <Col xs={{ span: 24 }} md={{ span: 10 }} lg={{ span: 7 }}>
                    <CustomDatePicker
                      value={get(props, "samplingDataset.bottling_date", "")}
                      type="bottling_date"
                      format="DD-MM-YYYY"
                      handleChange={(key, val) => handleChange(key, val)}
                      enableOnlyFutureDate={true}
                      placeholder="DD-MM-YYYY"
                      className="mt-0 mb-0 w-100"
                      label="Target Bottling date"
                    />
                  </Col>
                  <Col xs={{ span: 24 }} md={{ span: 10 }} lg={{ span: 7 }}>
                    <Select
                      type="customer_id"
                      label="Customer Name"
                      placeholder="Select Customer Name"
                      handleChange={(key, val) => handleChange(key, val)}
                      loading={false}
                      value={getCustomerValue(get(props, "samplingDataset.customer_id", ""))}
                      options={getKeyValuePair(customerList, "name")}
                      className="mt-0 mb-0"
                      onDropdownVisibleChange={async () => {
                        if (customerList.length === 0) {
                          const reqBody = {
                            page: "all",
                          };
                          await fetchCustomerList(reqBody);
                        }
                      }}
                    />
                  </Col>
                  <Col xs={{ span: 24 }} md={{ span: 10 }} lg={{ span: 7 }}>
                    <Select
                      type="target_brand"
                      label="Target Brand"
                      placeholder="Select Target Brand"
                      handleChange={(key, val) => handleChange(key, val)}
                      loading={false}
                      value={get(props, "samplingDataset.target_brand")}
                      options={get(dropDownValues, "brand", [])}
                      className="mt-0 mb-0"
                      onDropdownVisibleChange={() => {
                        if (get(dropDownValues, "brand", []).length === 0) {
                          fetchTaxonomyData("brand", "brand_name", "ASC");
                        }
                      }}
                    />
                  </Col>
                </>
              )}
              {get(props, "samplingDataset.recommended_action") === "Octivate" && (
                <Col xs={{ span: 24 }} md={{ span: 10 }} lg={{ span: 7 }}>
                  <Select
                    handleChange={(key, value) => handleChange(key, value)}
                    type="fill_type"
                    label="Fill Type"
                    value={get(props, "samplingDataset.fill_type")}
                    onDropdownVisibleChange={() => {
                      if (get(dropDownValues, "fill", []).length === 0) {
                        fetchTaxonomyData("fill", "fill_type", "ASC");
                      }
                    }}
                    placeHolder="Select"
                    options={get(dropDownValues, "fill", [])}
                    className="mt-0 mb-0"
                  />
                </Col>
              )}

              {get(props, "samplingDataset.recommended_action") === "Rerack" && (
                <>
                  <Col xs={{ span: 24 }} md={{ span: 10 }} lg={{ span: 7 }}>
                    <Select
                      handleChange={(key, value) => handleChange(key, value)}
                      type="fill_type"
                      label="Fill Type"
                      value={get(props, "samplingDataset.fill_type")}
                      onDropdownVisibleChange={() => {
                        if (get(dropDownValues, "fill", []).length === 0) {
                          fetchTaxonomyData("fill", "fill_type", "ASC");
                        }
                      }}
                      placeHolder="Select"
                      options={get(dropDownValues, "fill", [])}
                      className="mt-0 mb-0"
                    />
                  </Col>

                  <Col xs={{ span: 24 }} md={{ span: 10 }} lg={{ span: 7 }}>
                    <Select
                      handleChange={(key, value) => handleChange(key, value)}
                      type="rerack_cask_type"
                      label="Cask Type"
                      value={get(props, "samplingDataset.rerack_cask_type")}
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
                </>
              )}
              {get(props, "samplingDataset.recommended_action") === "Mature further" && (
                <Col xs={{ span: 24 }} md={{ span: 10 }} lg={{ span: 7 }}>
                  <CustomDatePicker
                    value={get(props, "samplingDataset.next_sampling_date", "")}
                    type="next_sampling_date"
                    handleChange={(key, val) => handleChange(key, val)}
                    enableOnlyFutureDate={true}
                    placeholder="YYYY-MM-DD"
                    className="mt-0 mb-0 w-100"
                    label="Next Sampling Date"
                  />
                </Col>
              )}
            </Row>
          </div>
        </div>
        <Spin spinning={expectedData.length === 0}>{expectedData.length > 0 && <ComparisonDetails samplingData={expectedData} />}</Spin>
      </ErrorBoundary>
    </div>
  );
};

export default SamplingUiReview;
