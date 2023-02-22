import { ArrowLeftOutlined, ArrowRightOutlined, CheckOutlined } from "@ant-design/icons";
import { Button, Spin } from "antd";
import axios from "axios";
import { cloneDeep, get, has } from "lodash";
import React from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import SVGIcon from "../../../../../constants/svgIndex";
import { getRequestHeader } from "../../../../../helpers/service";
import { setCurrentView } from "../../../../../store/Auth/auth.actions";
import ErrorBoundary from "../../../../UIComponents/ErrorBoundary";
import { openNotificationWithIcon } from "../../../../UIComponents/Toast/notification";
import { characterCheck, samplingDataDefaultValue, validationCheckCommonArray } from "../../constants";
import "../index.scss";
import SamplingUiForm from "./samplingUiForm";
import SamplingUiReview from "./samplingUiReview";

const SamplingData = (props) => {
  const dispatch = useDispatch();
  const [inputJSON, setInputJSON] = React.useState({});
  const [samplingDataset, setSamplingDataset] = React.useState(cloneDeep(samplingDataDefaultValue));
  const [step, setStep] = React.useState(1);
  const [disableNextButton, setDisableNextButton] = React.useState(true);
  const [disableSubmitButton, setDisableSubmitButton] = React.useState(true);
  const [loading, setIsLoading] = React.useState(true);

  const search = useLocation().search;
  const id = new URLSearchParams(search).get("cask_number");

  const { match, history } = props;

  React.useEffect(() => {
    dispatch(setCurrentView("Add New Sampling"));
    fetchInputJSON();
    fetchSamplingDetails();
  }, []);

  const fetchInputJSON = async () => {
    const rest = await axios({
      method: "GET",
      url: `${process.env.REACT_APP_API_ENDPOINT}/api/v1/cask_sample/input_form`,
      headers: { ...getRequestHeader() },
    }).catch((err) => {
      openNotificationWithIcon("error", `${get(err, "response.data.message", "Something Went Wrong")} `);
    });

    if (get(rest, "data.status")) {
      setInputJSON(get(rest, "data.data", []));
    }

    if (!get(rest, "data.status", true)) {
      openNotificationWithIcon("error", `${get(rest, "response.data.message", "Something Went Wrong")} `);
    }
  };

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
      newData["job_id"] = get(rest, "data.data.job_id", "");
      newData["custom_cask_sample_id"] = get(rest, "data.data.custom_cask_sample_id", "");
      setSamplingDataset(newData);
    }

    if (!get(rest, "data.status", true)) {
      setIsLoading(false);
      openNotificationWithIcon("error", `${get(rest, "data.message", "Something Went Wrong")} `);
    }
  };

  const handleFinalSubmit = async () => {
    let newData = { ...samplingDataset };
    newData["additional_details"]["files"] = get(newData, "additional_details.files", []).map((li) => {
      if (has(li, "file_name")) {
        delete li.file_name;
      }
      if (has(li, "key")) {
        delete li.key;
      }
      return li;
    });

    const rest = await axios({
      method: "POST",
      data: newData,
      url: `${process.env.REACT_APP_API_ENDPOINT}/api/v1/cask_sample/complete_job`,
      headers: { ...getRequestHeader() },
    }).catch((err) => {
      setIsLoading(false);
      openNotificationWithIcon("error", `${get(err, "response.data.message", "Something Went Wrong")} `);
    });

    if (get(rest, "data.status")) {
      openNotificationWithIcon("success", get(rest, "data.message", "Sampling Data Added successfully"));
      setIsLoading(false);
      props.history.push("/sampling");
    }
    if (!get(rest, "data.status")) {
      openNotificationWithIcon("failure", get(rest, "data.message", "Something Went Wrong"));
      setIsLoading(false);
    }
  };

  const validationCheck = () => {
    if (step === 1) {
      const commonCheck = validationCheckCommonArray.filter((v) => !samplingDataset[v]);
      const characterCheckValidation = characterCheck.some((v) => get(samplingDataset, `characters.${v}`) > 0);
      // const dominantCharacterCheckValidation = dominantCharacterMarkerCheck.filter((v) => !Object.values(get(samplingDataset, "dominant_character_markers")).includes(v));
      if (!commonCheck.length && characterCheckValidation && get(samplingDataset, "overall_rating") !== "N") {
        setDisableNextButton(false);
      } else {
        setDisableNextButton(true);
      }
    }

    if (step === 2) {
      if (samplingDataset["recommended_action"]) {
        setDisableSubmitButton(false);
      } else {
        setDisableSubmitButton(true);
      }
    }
  };

  React.useEffect(() => {
    validationCheck();
  }, [samplingDataset]);

  return (
    <ErrorBoundary>
      <div className="portal_styling__2 table-responsive-padding">
        <div className="task_management__sampling__add">
          <div className="d-flex">
            <div className="task_management__add_sampling__steps">
              <div>
                <span className="add_sampling__steps_icon active">
                  <img src={SVGIcon.SamplingFormIcon} />
                </span>
                <span className="add_sampling__steps_icon_text active">Sampling form</span>
              </div>
              <div>
                <div className="horizontal_line"></div>
              </div>
              <div>
                <span className={`add_sampling__steps_icon ${step === 2 ? "active" : ""}`}>
                  <img src={SVGIcon.ReviewIcon} />
                </span>
                <span className={`add_sampling__steps_icon_text  ${step === 2 ? "active" : ""}`}>Review </span>
              </div>
            </div>
          </div>
        </div>
        <Spin spinning={loading}>
          {step === 1 && (
            <>
              <SamplingUiForm samplingDataset={samplingDataset} setSamplingDataset={setSamplingDataset} caskNumber={id} step={step} />
              <div className="float-right pb-3">
                <Button type="primary" className="ml-3 float-right" icon={<ArrowRightOutlined />} disabled={disableNextButton} onClick={() => setStep(2)}>
                  Next
                </Button>
                <Button type="primary" className="float-right" icon={<ArrowLeftOutlined />} onClick={() => history.push("/sampling")}>
                  Previous
                </Button>
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <SamplingUiReview samplingDataset={samplingDataset} setSamplingDataset={setSamplingDataset} />
              <div className="float-right mt-4 footer_cta">
                <Button
                  type="primary"
                  disabled={disableSubmitButton}
                  className="ml-3 float-right"
                  onClick={() => {
                    setIsLoading(true);
                    handleFinalSubmit();
                  }}
                  icon={<CheckOutlined />}
                >
                  Submit
                </Button>
                <Button type="secondary" ghost className="float-right" icon={<ArrowLeftOutlined />} onClick={() => setStep(1)}>
                  Previous
                </Button>
              </div>
            </>
          )}
        </Spin>
      </div>
    </ErrorBoundary>
  );
};

export default SamplingData;
