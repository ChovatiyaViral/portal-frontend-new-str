import { Col, Input, Radio, Row } from "antd";
import axios from "axios";
import { cloneDeep, get } from "lodash";
import React from "react";
import { useDispatch } from "react-redux";
import SVGIcon from "../../../../../constants/svgIndex";
import { getRequestHeader } from "../../../../../helpers/service";
import { setCurrentView } from "../../../../../store/Auth/auth.actions";
import UploadDocument from "../../../../CommonComponents/Upload";
import CustomColorPicker from "../../../../UIComponents/ColorPicker";
import ErrorBoundary from "../../../../UIComponents/ErrorBoundary";
import CustomRadarChart from "../../../../UIComponents/RadarChart/customRadar";
import { RangeSlider } from "../../../../UIComponents/RangeSlider";
import CustomStepsProgress from "../../../../UIComponents/Steps/taskSteps";
import { openNotificationWithIcon } from "../../../../UIComponents/Toast/notification";
import { samplingDataDefaultValue } from "../../constants";
import SamplingCaskDetailsUiForm from "./caskDetailsForm";
import Character from "./character";

const { TextArea } = Input;
const finishSliderData = [0, 1, 2, 3, 4, 5];
const overallRatingSliderData = ["N", "A", "B", "C", "D", "E"];
const overallRatingSliderName = ["No Selection", "Best", "Good", "Okay", "Bad", "Worst"];
const finishSliderName = ["No Selection", "Short", "Mid", "Decent", "Moderate", "Long"];
const dominantData = ["Floral", "Fruit", "Rich", "Smoke", "Spice"];

const MobileSamplingForm = (props) => {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [samplingDataset, setSamplingDataset] = React.useState(cloneDeep(samplingDataDefaultValue));
  const [step, setStep] = React.useState(1);
  const [disableNextButton, setDisableNextButton] = React.useState(true);
  const [disableSubmitButton, setDisableSubmitButton] = React.useState(true);
  const [loading, setIsLoading] = React.useState(true);
  const dispatch = useDispatch();

  const { match, history } = props;

  const fetchSamplingDetails = async () => {
    const rest = await axios({
      method: "GET",
      url: `${process.env.REACT_APP_API_ENDPOINT}/api/v1/cask_sample/details/${get(match, "params.id")}`,
      headers: { ...getRequestHeader() },
    }).catch((err) => {
      setIsLoading(false);
      openNotificationWithIcon("error", `${get(err, "response.data.message", "Something Went Wrong")} `);
    });

    if (get(rest, "data.status")) {
      setIsLoading(false);
      let newData = { ...samplingDataset };
      newData["ays"] = get(rest, "data.data.ays", "");
      newData["cask_number"] = get(rest, "data.data.cask_number", "");
      newData["distillery"] = get(rest, "data.data.distillery", "");
      newData["passport_number"] = get(rest, "data.data.passport_number", "");
      newData["cask_type"] = get(rest, "data.data.cask_type", "");
      newData["scheduled_at"] = get(rest, "data.data.scheduled_at", "");
      newData["sampling_id"] = get(rest, "data.data.cask_sample_id", "");
      newData["custom_cask_sample_id"] = get(rest, "data.data.custom_cask_sample_id", "");
      setSamplingDataset(newData);
    }

    if (!get(rest, "data.status", true)) {
      setIsLoading(false);
      openNotificationWithIcon("error", `${get(rest, "data.message", "Something Went Wrong")} `);
    }
  };

  React.useEffect(() => {
    dispatch(setCurrentView("Add New Sampling"));
    fetchSamplingDetails();
  }, []);

  console.log(samplingDataset);

  let samplingSteps = [
    {
      title: "Cask Number",
      content: <SamplingCaskDetailsUiForm />,
      icon: <img src={SVGIcon.SampleCaskIcon} />,
    },
    {
      title: "Color Chart",
      content: (
        <div className="summary__additional_details pb-0">
          <Row gutter={[16, 16]}>
            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} xl={{ span: 16 }}>
              <CustomColorPicker type="custom" mobileType="mobile_custom" />
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
                  rows={2}
                  // value={get(props, "samplingDataset.color_comments", "")}
                  // onChange={(e) => handleChange("color_comments", e.target.value)}
                />
              </div>
            </Col>
          </Row>
        </div>
      ),
      icon: <img src={SVGIcon.ColorChartIcon} />,
    },
    {
      title: "Dominant Character",
      content: (
        <div className="summary__additional_details">
          <div className="common_card_section m-3">
            <CustomRadarChart
            // record={get(props, "samplingDataset.characters", {})}
            />
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
          <Row gutter={[38, 16]}>
            <Col xs={{ span: 24 }} md={{ span: 24 }} xl={{ span: 14 }}>
              <Character
              // onChange={(detail) => handleChange("characters", get(detail, "value"), get(detail, "label"))} record={get(props, "samplingDataset.characters", {})}
              />
            </Col>
            <Col xs={{ span: 24 }} md={{ span: 24 }} xl={{ span: 10 }}>
              <div className="mb-5 common_card_section">
                <div className="d-flex align-items-center mb-2">
                  <img src={SVGIcon.FurtherCommentIcon} alt="Further comments" className="mr-2" style={{ width: "20px", height: "20px" }} />
                  <span>Further comments</span>
                </div>
                <TextArea
                  type="comments"
                  placeholder="Enter Comments"
                  // onChange={(e) => handleChange("characters", e.target.value, "comments")}
                  // value={get(props, "samplingDataset.characters.comments", "")}
                  rows={2}
                />
              </div>
            </Col>
          </Row>
        </div>
      ),
      icon: <img src={SVGIcon.DominantCharacterIcon} />,
    },
    {
      title: "Finish",
      content: (
        <div className="summary__additional_details">
          <div className="range_slider_box bg-white">
            <RangeSlider
              data={finishSliderData}
              //  defaultValue={get(props, "samplingDataset.finish")}
              stepName={finishSliderName}
              //   onChange={(v) => handleChange("finish", v)}
            />
          </div>
          <div className="common_card_section mt-4">
            <div className="d-flex align-items-center mb-2">
              <img src={SVGIcon.FurtherCommentIcon} alt="Further comments" className="mr-2" style={{ width: "20px", height: "20px" }} />
              <span>Further comments</span>
            </div>
            <TextArea
              type="comments"
              placeholder="Enter Comments"
              rows={2}
              // onChange={(e) => handleChange("finish_comments", e.target.value)}
              // value={get(props, "samplingDataset.finish_comments", "")}
            />
          </div>
        </div>
      ),
      icon: <img src={SVGIcon.FinishIcon} />,
    },
    {
      title: "Overall Rating",
      content: (
        <div className="summary__additional_details">
          <div className="range_slider_box bg-white">
            <RangeSlider
              type="string"
              data={overallRatingSliderData}
              //   defaultValue={get(props, "samplingDataset.overall_rating")}
              stepName={overallRatingSliderName}
              //   onChange={(v) => handleChange("overall_rating", v)}
            />
          </div>

          <div className="common_card_section mb-4 mt-4">
            <div className="d-flex align-items-center mb-2">
              <img src={SVGIcon.FurtherCommentIcon} alt="Further comments" className="mr-2" style={{ width: "20px", height: "20px" }} />
              <span>Further comments</span>
            </div>
            <TextArea
              type="comments"
              placeholder="Enter Comments"
              //   onChange={(e) => handleChange("overall_rating_comments", e.target.value)}
              //   value={get(props, "samplingDataset.overall_rating_comments", "")}
              //   style={{ minHeight: "20px" }}
              rows={2}
            />
          </div>
          <div className="common_card_section">
            <div className="d-flex align-items-center mb-2 ">
              <span style={{ fontWeight: 700, fontSize: 16 }}>Feinty,vegetative or off notes?</span>
            </div>
            <Radio.Group
              // onChange={onChangeCommonQuestions}
              name="fienty_vegetative"
              //  value={get(props, "samplingDataset.fienty_vegetative")}
              className="question_radio"
            >
              <Radio value="yes">Yes</Radio>
              <Radio value="no">No</Radio>
              <Radio value="not sure">Not Sure</Radio>
            </Radio.Group>
          </div>
          <div className="mt-4 common_card_section">
            <div className="d-flex align-items-center mb-2">
              <img src={SVGIcon.FurtherCommentIcon} alt="Further comments" className="mr-2" style={{ width: "20px", height: "20px" }} />
              <span>Further comments</span>
            </div>
            <TextArea
              type="comments"
              placeholder="Enter Comments"
              // onChange={(e) => handleChange("fienty_vegetative_comments", e.target.value)}
              // value={get(props, "samplingDataset.fienty_vegetative_comments", "")}
              rows={2}
            />
          </div>
          <div className="common_card_section">
            <div className="d-flex align-items-center mb-2">
              <span style={{ fontWeight: 700, fontSize: 16 }}>Is the whisky profile younger than its age?</span>
            </div>

            <Radio.Group
              // onChange={onChangeCommonQuestions}
              name="whisky_profile_younger"
              // value={get(props, "samplingDataset.whisky_profile_younger")}
              className="question_radio"
            >
              <Radio value="yes">Yes</Radio>
              <Radio value="no">No</Radio>
              <Radio value="not sure">Not Sure</Radio>
            </Radio.Group>
          </div>
          <div className="mt-4 common_card_section">
            <div className="d-flex align-items-center mb-2">
              <img src={SVGIcon.FurtherCommentIcon} alt="Further comments" className="mr-2" style={{ width: "20px", height: "20px" }} />
              <span>Further comments</span>
            </div>
            <TextArea
              type="comments"
              placeholder="Enter Comments"
              // onChange={(e) => handleChange("whisky_profile_younger_comments", e.target.value)}
              // value={get(props, "samplingDataset.whisky_profile_younger_comments", "")}
              rows={2}
            />
          </div>

          <div className="common_card_section">
            <div className="d-flex align-items-center mb-2">
              <span style={{ fontWeight: 700, fontSize: 16 }}>Is sample comparable to benchmark/best example?</span>
            </div>
            <Radio.Group
              // onChange={onChangeCommonQuestions}
              name="comparable_to_benchmark"
              // value={get(props, "samplingDataset.comparable_to_benchmark")}
              className="question_radio"
            >
              <Radio value="yes">Yes</Radio>
              <Radio value="no">No</Radio>
              <Radio value="not sure">Not Sure</Radio>
            </Radio.Group>
          </div>

          <div className="common_card_section mt-4">
            <div className="d-flex align-items-center mb-2">
              <img src={SVGIcon.FurtherCommentIcon} alt="Further comments" className="mr-2" style={{ width: "20px", height: "20px" }} />
              <span>Further comments</span>
            </div>
            <TextArea
              type="comments"
              placeholder="Enter Comments"
              // onChange={(e) => handleChange("comparable_to_benchmark_comments", e.target.value)}
              // value={get(props, "samplingDataset.comparable_to_benchmark_comments", "")}
              rows={2}
            />
          </div>
        </div>
      ),
      icon: <img src={SVGIcon.FinishIcon} />,
    },
    {
      title: "Additional details ",
      content: <UploadDocument />,
      icon: <img src={SVGIcon.AdditionalDetailsIcon} />,
    },
  ];

  const handleNext = () => {
    if (currentStep <= 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = () => {
    console.log("save");
  };

  return (
    <>
      <ErrorBoundary>
        <h1 style={{ fontWeight: 600, fontSize: 15, lineHeight: "18px", marginBottom: "20px" }}>Sampling form</h1>
        <CustomStepsProgress data={samplingSteps} onSubmit={() => handleSave()} handleNext={handleNext} handlePrev={handlePrev} current={currentStep} />
      </ErrorBoundary>
    </>
  );
};

export default MobileSamplingForm;
