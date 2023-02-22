import { Col, Input, Radio, Row, Upload } from "antd";
import { cloneDeep, get } from "lodash";
import React from "react";
import { useDispatch } from "react-redux";
import { MasterDataKeyPair } from "../../../../../constants";
import SVGIcon from "../../../../../constants/svgIndex";
import { topFunction } from "../../../../../helpers/common";
import { getKeyValuePair } from "../../../../../helpers/utility";
import { defaultRequestOptions } from "../../../../../settings";
import { getTaxonomyData } from "../../../../../store/Taxonomy/taxonomy.actions";
import UploadDocument from "../../../../CommonComponents/Upload";
import ColorChart from "../../../../UIComponents/ColorPicker/customColorChart";
import { CustomDatePicker } from "../../../../UIComponents/DatePicker";
import ErrorBoundary from "../../../../UIComponents/ErrorBoundary";
import { CustomInputText as InputTextChange } from "../../../../UIComponents/Input/customInput";
import CustomRadarChart from "../../../../UIComponents/RadarChart/customRadar";
import { RangeSlider } from "../../../../UIComponents/RangeSlider";
import { SingleSelect as Select } from "../../../../UIComponents/Select/singleSelect";
import { openNotificationWithIcon } from "../../../../UIComponents/Toast/notification";
import Character from "./character";

const { TextArea } = Input;
const { Dragger } = Upload;

const finishSliderData = [0, 1, 2, 3, 4, 5];
const overallRatingSliderData = ["N", "A", "B", "C", "D", "E"];
const overallRatingSliderName = ["No Selection", "Best", "Good", "Okay", "Bad", "Worst"];
const finishSliderName = ["No Selection", "Short", "Mid", "Decent", "Moderate", "Long"];
const dominantData = ["Floral", "Fruit", "Rich", "Smoke", "Spice"];

const SamplingUiForm = (props) => {
  const dispatch = useDispatch();

  const [dropDownValues, setDropDownValues] = React.useState({});

  const onChangeCommonQuestions = ({ target: { value, name } }) => {
    handleChange(name, value);
  };

  const handleChange = React.useCallback((key, value, deepKey) => {
    let newValue = { ...get(props, "samplingDataset") };
    if (key === "color") {
      newValue["color"] = get(value, "name");
      newValue["color_code"] = get(value, "code");
    } else if (deepKey) {
      newValue[key][deepKey] = value;
    } else {
      newValue[key] = value;
    }
    props.setSamplingDataset(newValue);
  });

  const fetchTaxonomyData = async (masterKey = defaultTaxonomyMasterDataListName, sort_key = "", sort_order = "ASC") => {
    let requestOptions = cloneDeep(defaultRequestOptions);
    requestOptions[MasterDataKeyPair.MasterDataKey] = masterKey;
    requestOptions["orderby_field"] = sort_key;
    requestOptions["orderby_value"] = sort_order;

    const taxonomyData = await dispatch(getTaxonomyData(requestOptions));

    if (get(taxonomyData, "error", false)) {
      openNotificationWithIcon("error", `${capitalizeAllLetter(masterKey.replace(/_/g, " "))}`, `${get(taxonomyData, "error.message", "Something Went Wrong")} `);
    }

    let newValues = { ...dropDownValues };
    newValues[masterKey] = getKeyValuePair(get(taxonomyData, "response.data", []), sort_key, false);
    setDropDownValues(newValues);
  };

  React.useEffect(() => {
    topFunction();
  }, []);

  return (
    <>
      <div className="portal_styling__2 table-responsive-padding">
        <ErrorBoundary>
          <div className="summary__additional_details common_card_section">
            <div className="d-flex align-items-center mb-2">
              <img src={SVGIcon.CaskContentsIcon} alt="Cask Number" className="mr-2" style={{ width: "24px", height: "24px" }} />
              <span style={{ fontWeight: 700, fontSize: 16 }}>Cask Details</span>
            </div>
            <div className="additional_details_content">
              <Row gutter={[16, 12]}>
                <Col xs={{ span: 24 }} md={{ span: 6 }}>
                  <InputTextChange disabled label="Sampling ID" value={get(props, "samplingDataset.custom_cask_sample_id")} className="mt-0 mb-0 w-100" placeholder="Enter Sampling ID here" />
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 6 }}>
                  <InputTextChange
                    label="Cask Number"
                    type="cask_number"
                    disabled
                    required
                    handleChange={(key, value) => handleChange(key, value)}
                    value={get(props, "samplingDataset.cask_number")}
                    className="mt-0 mb-0 w-100"
                    placeholder="Enter Cask number here"
                  />
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 6 }}>
                  <Select
                    handleChange={(key, value) => handleChange(key, value)}
                    value={get(props, "samplingDataset.cask_type")}
                    type="cask_type"
                    label="Cask Type"
                    disabled
                    required
                    onDropdownVisibleChange={() => {
                      if (get(dropDownValues, "cask_type", []).length === 0) {
                        fetchTaxonomyData("cask_type", "cask_type_code", "ASC");
                      }
                    }}
                    placeHolder="Select"
                    options={get(dropDownValues, "cask_type", [])}
                    className="mt-0 mb-0"
                  />
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 6 }}>
                  <InputTextChange
                    label="Passport Number"
                    type="passport_number"
                    disabled
                    required
                    value={get(props, "samplingDataset.passport_number")}
                    handleChange={(key, value) => handleChange(key, value)}
                    className="mt-0 mb-0 w-100"
                    placeholder="Enter Passport number here"
                  />
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 6 }}>
                  <Select
                    handleChange={(key, value) => handleChange(key, value)}
                    type="distillery"
                    disabled
                    required
                    label="Distillery"
                    value={get(props, "samplingDataset.distillery")}
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
                    disabled
                    format="DD-MM-YYYY"
                    value={get(props, "samplingDataset.ays")}
                    placeholder="AYS (DD-MM-YYYY)"
                    className="mt-0 mb-0 w-100"
                    label="AYS (DD-MM-YYYY)"
                  />
                </Col>
              </Row>
            </div>
          </div>
          {/* color chart */}

          <div className="summary__additional_details common_card_section pb-0">
            <div className="d-flex align-items-center mb-2">
              <img src={SVGIcon.ColorChartIcon} alt="Color Chart" className="mr-2" style={{ width: "20px", height: "20px" }} />
              <span style={{ fontWeight: 700, fontSize: 16 }}>Color Chart</span>
            </div>
            <Row gutter={[16, 16]}>
              <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} xl={{ span: 16 }}>
                <ColorChart value={get(props, "samplingDataset.color")} onChange={(colorCode) => handleChange("color", colorCode)} />
              </Col>
              <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} xl={{ span: 8 }}>
                <div className="common_card_section comment">
                  <div className="d-flex align-items-center mb-2">
                    <img src={SVGIcon.FurtherCommentIcon} alt="Further comments" className="mr-2" style={{ width: "20px", height: "20px" }} />
                    <span>Further comments</span>
                  </div>
                  <TextArea
                    type="comments"
                    placeholder="Enter Comments"
                    rows={5}
                    value={get(props, "samplingDataset.color_comments", "")}
                    onChange={(e) => handleChange("color_comments", e.target.value)}
                  />
                </div>
              </Col>
            </Row>
          </div>
          {/* color chart */}

          {/* character */}
          <div className="summary__additional_details common_card_section">
            <div className="d-flex align-items-center mb-2">
              <img src={SVGIcon.CharacterIcon} alt="Character" className="mr-2" style={{ width: "20px", height: "20px" }} />
              <span style={{ fontWeight: 700, fontSize: 16 }}>Character</span>
            </div>
            <div className="scale d-flex align-items-center">
              <h2>Scale:</h2>
              <div className="parameters d-flex align-items-center">
                <span>0 - Not present</span>
                <span>1 - Light </span>
                <span>2 - Mild </span>
                <span>3 - Decent </span>
                <span>4 - Moderate</span>
                <span>5 - Heavy</span>
              </div>
            </div>
            <Row gutter={[38, 0]}>
              <Col xs={{ span: 24 }} md={{ span: 24 }} xl={{ span: 14 }}>
                <Character onChange={(detail) => handleChange("characters", get(detail, "value"), get(detail, "label"))} record={get(props, "samplingDataset.characters", {})} />
              </Col>
              <Col xs={{ span: 24 }} md={{ span: 24 }} xl={{ span: 10 }}>
                <div className="common_card_section comment">
                  <CustomRadarChart record={get(props, "samplingDataset.characters", {})} />
                  <div className="d-flex align-items-center mb-2">
                    <img src={SVGIcon.FurtherCommentIcon} alt="Further comments" className="mr-2" style={{ width: "20px", height: "20px" }} />
                    <span>Further comments</span>
                  </div>
                  <TextArea
                    type="comments"
                    placeholder="Enter Comments"
                    onChange={(e) => handleChange("characters", e.target.value, "comments")}
                    value={get(props, "samplingDataset.characters.comments", "")}
                    style={{ minHeight: "120px" }}
                  />
                </div>
              </Col>
            </Row>
          </div>

          {/* character
          <div className="summary__additional_details common_card_section">
            <div className="d-flex flex-wrap align-items-center mb-2">
              <img src={SVGIcon.DominantCharacterIcon} alt="Dominant Character Markers" className="mr-2" style={{ width: "20px", height: "20px" }} />
              <span style={{ fontWeight: 700, fontSize: 16 }}>Dominant Character Markers</span>
              <span style={{ fontWeight: 500, fontSize: 12, marginLeft: "10px" }}>(Choose any 3)</span>
            </div>
            <Row gutter={[24, 24]}>
              <Col xs={{ span: 24 }} xl={{ span: 14 }}>
                <div className="dominant_character_marker_section">
                  <div className="dominant_character_marker_box">
                    <div className="dominant_character_marker_header"></div>
                    <div className="dominant_character_marker_title">
                      <span className="title">Dominant</span>
                      <span className="title">Mild</span>
                      <span className="title">Weak</span>
                    </div>
                  </div>
                  {dominantData.map((item, index) => {
                    let itemValue = item?.toLowerCase();
                    return (
                      <div className="dominant_character_marker_options" key={index}>
                        <div className="dominant_character_marker_header">
                          <div className="check_marks">{get(props, `samplingDataset.dominant_character_markers.${itemValue}`) ? <CheckOutlined /> : null}</div>
                          <label className="dominant_character_marker_label">{item}</label>
                        </div>
                        <Radio.Group onChange={onChange4} name={item} value={get(props, `samplingDataset.dominant_character_markers.${itemValue}`)}>
                          <Radio value="dominant" />
                          <Radio value="mild" />
                          <Radio value="weak" />
                        </Radio.Group>
                      </div>
                    );
                  })}
                </div>
              </Col>
              <Col xs={{ span: 24 }} xl={{ span: 10 }}>
                <div className="common_card_section mb-0">
                  <div className="d-flex align-items-center mb-2">
                    <img src={SVGIcon.FurtherCommentIcon} alt="Further comments" className="mr-2" style={{ width: "20px", height: "20px" }} />
                    <span>Further comments</span>
                  </div>
                  <TextArea
                    type="comments"
                    placeholder="Enter Comments"
                    onChange={(e) => handleChange("dominant_character_markers_comments", e.target.value)}
                    value={get(props, "samplingDataset.dominant_character_markers_comments", "")}
                    style={{ minHeight: "120px" }}
                  />
                </div>
              </Col>
            </Row>
          </div>
        */}
          <Row gutter={[16, 0]}>
            <Col xs={{ span: 24 }} xl={{ span: 12 }}>
              <div className="summary__additional_details common_card_section">
                <div className="d-flex align-items-center mb-2">
                  <img src={SVGIcon.FinishIcon} alt="Finish" className="mr-2" style={{ width: "20px", height: "20px" }} />
                  <span style={{ fontWeight: 700, fontSize: 16 }}>Finish</span>
                </div>
                <Row gutter={[24, 0]}>
                  <Col span={24}>
                    <div className="range_slider_box">
                      <RangeSlider data={finishSliderData} defaultValue={get(props, "samplingDataset.finish")} stepName={finishSliderName} onChange={(v) => handleChange("finish", v)} />
                    </div>
                  </Col>
                  <Col span={24}>
                    <div className="comment mt-4">
                      <div className="d-flex align-items-center mb-2">
                        <img src={SVGIcon.FurtherCommentIcon} alt="Further comments" className="mr-2" style={{ width: "20px", height: "20px" }} />
                        <span>Further comments</span>
                      </div>
                      <TextArea
                        type="comments"
                        placeholder="Enter Comments"
                        onChange={(e) => handleChange("finish_comments", e.target.value)}
                        value={get(props, "samplingDataset.finish_comments", "")}
                        style={{ minHeight: "80px" }}
                      />
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>

            <Col xs={{ span: 24 }} xl={{ span: 12 }}>
              <div className="summary__additional_details common_card_section">
                <div className="d-flex align-items-center additional_details_title mb-2">
                  <span>Feinty,vegetative or off notes?</span>
                </div>
                <Row gutter={[24, 0]}>
                  <Col span={24}>
                    <Radio.Group onChange={onChangeCommonQuestions} name="fienty_vegetative" value={get(props, "samplingDataset.fienty_vegetative")} className="question_radio">
                      <Radio value="yes">Yes</Radio>
                      <Radio value="no">No</Radio>
                    </Radio.Group>
                  </Col>
                  <Col span={24}>
                    <div className="comment mt-4">
                      <div className="d-flex align-items-center mb-2">
                        <img src={SVGIcon.FurtherCommentIcon} alt="Further comments" className="mr-2" style={{ width: "20px", height: "20px" }} />
                        <span>Further comments</span>
                      </div>
                      <TextArea
                        type="comments"
                        placeholder="Enter Comments"
                        onChange={(e) => handleChange("fienty_vegetative_comments", e.target.value)}
                        value={get(props, "samplingDataset.fienty_vegetative_comments", "")}
                        style={{ minHeight: "155px" }}
                      />
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
            <Col xs={{ span: 24 }} xl={{ span: 12 }}>
              <div className="summary__additional_details common_card_section">
                <div className="d-flex align-items-center additional_details_title mb-2">
                  <span>Is the whisky profile younger than its age?</span>
                </div>
                <Row gutter={[24, 0]}>
                  <Col span={24}>
                    <Radio.Group onChange={onChangeCommonQuestions} name="whisky_profile_younger" value={get(props, "samplingDataset.whisky_profile_younger")} className="question_radio">
                      <Radio value="yes">Yes</Radio>
                      <Radio value="no">No</Radio>
                    </Radio.Group>
                  </Col>
                  <Col span={24}>
                    <div className="comment mt-4">
                      <div className="d-flex align-items-center mb-2">
                        <img src={SVGIcon.FurtherCommentIcon} alt="Further comments" className="mr-2" style={{ width: "20px", height: "20px" }} />
                        <span>Further comments</span>
                      </div>
                      <TextArea
                        type="comments"
                        placeholder="Enter Comments"
                        onChange={(e) => handleChange("whisky_profile_younger_comments", e.target.value)}
                        value={get(props, "samplingDataset.whisky_profile_younger_comments", "")}
                        style={{ minHeight: "120px" }}
                      />
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>

            <Col xs={{ span: 24 }} xl={{ span: 12 }}>
              <div className="summary__additional_details common_card_section">
                <div className="d-flex align-items-center additional_details_title mb-2">
                  <span>Is sample comparable to benchmark/best example?</span>
                </div>
                <Row gutter={[24, 0]}>
                  <Col span={24}>
                    <Radio.Group onChange={onChangeCommonQuestions} name="comparable_to_benchmark" value={get(props, "samplingDataset.comparable_to_benchmark")} className="question_radio">
                      <Radio value="yes">Yes</Radio>
                      <Radio value="no">No</Radio>
                    </Radio.Group>
                  </Col>
                  <Col span={24}>
                    <div className="comment mt-4">
                      <div className="d-flex align-items-center mb-2">
                        <img src={SVGIcon.FurtherCommentIcon} alt="Further comments" className="mr-2" style={{ width: "20px", height: "20px" }} />
                        <span>Further comments</span>
                      </div>
                      <TextArea
                        type="comments"
                        placeholder="Enter Comments"
                        onChange={(e) => handleChange("comparable_to_benchmark_comments", e.target.value)}
                        value={get(props, "samplingDataset.comparable_to_benchmark_comments", "")}
                        style={{ minHeight: "120px" }}
                      />
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>

            <Col span={24}>
              <div className="summary__additional_details common_card_section">
                <div className="d-flex align-items-center mb-2">
                  <img src={SVGIcon.FinishIcon} alt="Overall Rating" className="mr-2" style={{ width: "20px", height: "20px" }} />
                  <span style={{ fontWeight: 700, fontSize: 16 }}>Overall Rating</span>
                </div>
                <Row gutter={[24, 24]}>
                  <Col xs={{ span: 24 }} xl={{ span: 14 }}>
                    <div className="range_slider_box">
                      <RangeSlider
                        type="string"
                        data={overallRatingSliderData}
                        defaultValue={get(props, "samplingDataset.overall_rating")}
                        stepName={overallRatingSliderName}
                        onChange={(v) => handleChange("overall_rating", v)}
                      />
                    </div>
                  </Col>
                  <Col xs={{ span: 24 }} xl={{ span: 10 }}>
                    <div className="common_card_section mb-0">
                      <div className="d-flex align-items-center mb-2">
                        <img src={SVGIcon.FurtherCommentIcon} alt="Further comments" className="mr-2" style={{ width: "20px", height: "20px" }} />
                        <span>Further comments</span>
                      </div>
                      <TextArea
                        type="comments"
                        placeholder="Enter Comments"
                        onChange={(e) => handleChange("overall_rating_comments", e.target.value)}
                        value={get(props, "samplingDataset.overall_rating_comments", "")}
                        style={{ minHeight: "120px" }}
                      />
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
          <UploadDocument
            data={{
              files: get(props, "samplingDataset.additional_details.files", []),
              notes: get(props, "samplingDataset.additional_details.notes", ""),
            }}
            handleChange={(val) => {
              let tempObj = { ...get(props, "samplingDataset", {}) };
              tempObj["additional_details"]["files"] = get(val, "files", []);
              tempObj["additional_details"]["notes"] = get(val, "notes", "");
              props.setSamplingDataset(tempObj);
            }}
          />
        </ErrorBoundary>
      </div>
    </>
  );
};

export default SamplingUiForm;
