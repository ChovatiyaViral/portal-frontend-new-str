import { ArrowLeftOutlined, ArrowRightOutlined, CloseCircleOutlined, SaveOutlined, SwapOutlined } from "@ant-design/icons";
import { Button, Spin } from "antd";
import { cloneDeep, get } from "lodash";
import moment from "moment";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import CommonService from "../../../../../helpers/request/Common";
import { requestPath } from "../../../../../helpers/service";
import { setCurrentTab } from "../../../../../store/App/app.actions";
import { setCurrentView } from "../../../../../store/Auth/auth.actions";
import { updateRegaugingFinalPayload } from "../../../../../store/WarehouseJobs/warehouseJobs.actions";
import UploadDocument from "../../../../CommonComponents/Upload";
import ErrorBoundary from "../../../../UIComponents/ErrorBoundary";
import { openNotificationWithIcon } from "../../../../UIComponents/Toast/notification";
import { regaugingDataSetDefault, validationCheckRegaugeCommonArray } from "../../constants";
import ComparisonDetails from "../details/comparisonDetails";
import { getRegaugingManualUiFormRequestPayload, getRegaugingUllageUiFormRequestPayload } from "../helper";
import "../index.scss";
import RegaugingCaskDetailsUiForm from "./caskDetailsForm";
import RegaugingManualUiForm from "./manualMethod";
import { ConfirmRegaugeMethod } from "./methodConfirmation";
import RegaugingUllageUiForm from "./ullageMethod";

const RegaugingData = (props) => {
  const dispatch = useDispatch();
  const [isMethodOpted, setIsMethodOpted] = React.useState(true);
  const [methodSelected, setMethodSelected] = React.useState("");
  const [regaugeDataset, setRegaugeDataset] = React.useState(null);
  const [regaugeDatasetDetails, setRegaugeDatasetDetails] = React.useState(null);
  const [loading, setIsLoading] = React.useState(false);
  const [previousListLoading, setPreviousListLoading] = React.useState(false);
  const [step, updateStep] = React.useState(1);
  const [expectedComparisonData, setExpectedComparisonData] = React.useState([]);
  const [isNextButtonDisabled, setIsNextButtonDisabled] = React.useState(true);

  const { match, history } = props;

  const currentTabDetails = useSelector((state) => {
    return get(state, "app.currentTab", null);
  });

  const currentData = useSelector((state) => {
    return get(state, "warehouseJobs.regaugingFinalPayload", null);
  });

  const fetchRegaugingDetails = async () => {
    await CommonService.getDetails(`${requestPath.wareHouseJobsManagement.regauging.getDetails}/${get(match, "params.id")}`).then((data) => {
      if (get(data, "status")) {
        dispatch(setCurrentView(getTitle(get(data, "data"))));
        setRegaugeDatasetDetails(get(data, "data"));
        setIsLoading(false);
      }

      if (!get(data, "status", true)) {
        setIsLoading(false);
        openNotificationWithIcon("error", `${get(data, "message", "Something Went Wrong")} `);
      }
    });
  };

  React.useEffect(() => {
    dispatch(setCurrentView(getTitle(regaugeDatasetDetails)));
  });

  const getTitle = (data) => {
    return (
      <div className="details__card_title d-flex align-items-center sampling_detail_card">
        <div className="p-0">
          <p className="details__summary__card_content__title">Complete Regauging - # {get(data, "job_id")}</p>
          <p className="details__summary__card_content__value">
            Cask Number - {get(data, "cask_details.cask_number")} | Method - {methodSelected === "ullage" ? "Ullage" : "Weight & Measurements"}
          </p>
        </div>
      </div>
    );
  };

  const getCalcData = async (url, payload) => {
    try {
      const data = await CommonService.getDataSource(url, payload);
      if (get(data, "data.status")) {
        setIsLoading(false);
        return get(data, "data.data");
      }

      if (!get(data, "data.status", true)) {
        openNotificationWithIcon("error", "Assessment Parameters", `${get(data, "data.message", "Something Went Wrong")} `);
      }

      setIsLoading(false);  
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  const getAssessmentParameters = async (data) => {
    let requestPayload = {
      measured_strength: get(data, "strength"),
      measured_incoming_weight: get(location, "pathname").includes("/gate-entry") ? get(data, "incoming_weight") : get(data, "weight"),
      measured_specific_gravity: get(data, "specific_gravity"),
      last_known_rla: get(regaugeDatasetDetails, "cask_details.last_known_rla"),
      cask_type_code: get(regaugeDatasetDetails, "cask_details.cask_type_code"),
    };
    const rest = await getCalcData(requestPath.wareHouseJobsManagement.regauging.wtMsrCalculation, requestPayload);
    return rest;
  };

  const getUllageMethodAssessmentParameters = async (data) => {
    let requestPayload = {
      cask_strength: get(regaugeDatasetDetails, "cask_details.strength"),
      cask_rla: get(regaugeDatasetDetails, "cask_details.rla"),
      measured_dry_dip: get(data, "dry_dip"),
      measured_wet_dip: get(data, "wet_dip"),
      measured_strength: get(data, "strength"),
      measured_temperature: get(data, "temperature"),
      fill_date: get(data, "fill_date"),
    };

    const rest = await getCalcData(requestPath.wareHouseJobsManagement.regauging.ullageCalculation, requestPayload);
    return rest;
  };

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

  const handleChange = React.useCallback(async (data) => {
    let tempObj = { ...data };
    setRegaugeDataset(tempObj);
  });

  const handleFinalSubmit = async () => {
    let requestPayload = {};

    if (methodSelected === "wt_msr") {
      requestPayload = getRegaugingManualUiFormRequestPayload(regaugeDataset, get(regaugeDatasetDetails, "regauging_id"));
    }

    if (methodSelected === "ullage") {
      requestPayload = getRegaugingUllageUiFormRequestPayload(regaugeDataset, get(regaugeDatasetDetails, "regauging_id"));
    }

    await CommonService.getDataSource(requestPath.wareHouseJobsManagement.regauging.completeJob, requestPayload, false).then((data) => {
      if (get(data, "data.status")) {
        openNotificationWithIcon("success", "Complete Regauge Job", `${get(data, "data.message", "Completed Regauging Job")} `);
        const tempObj = {
          Regauging: {
            tab: "Completed",
          },
        };
        dispatch(setCurrentTab({ ...currentTabDetails, ...tempObj }));
        history.push("/regauging");
        setIsLoading(false);
      }

      if (!get(data, "data.status", true)) {
        setIsLoading(false);
        openNotificationWithIcon("error", "Complete Regauge Job", `${get(data, "data.message", "Something Went Wrong")} `);
      }
    });
  };

  const fetchPreviousList = async () => {
    const requestPayload = {
      cask_number: get(regaugeDatasetDetails, "cask_details.cask_number"),
      last_regauging_id: get(regaugeDatasetDetails, "regauging_id", ""),
    };

    const path = requestPath.wareHouseJobsManagement.regauging.getPreviousRegaugingList;

    await CommonService.getDataSource(path, requestPayload).then((rest) => {
      if (get(rest, "data.status")) {
        setPreviousListLoading(false);
        setExpectedComparisonData(get(rest, "data.data", []));
      }

      if (!get(rest, "data.status", true)) {
        setPreviousListLoading(false);
        openNotificationWithIcon("error", `${get(rest, "response.data.message", "Something Went Wrong")} `);
      }
    });
  };

  const validationCheck = () => {
    const regaugeValidation = methodSelected ? validationCheckRegaugeCommonArray[methodSelected].filter((v) => !regaugeDataset[v]) : [];
    if (!regaugeValidation.length) {
      setIsNextButtonDisabled(false);
    } else {
      setIsNextButtonDisabled(true);
    }
  };

  React.useEffect(() => {
    validationCheck();
  }, [regaugeDataset]);

  return (
    <>
      <div className="portal_styling__2 table-responsive-padding">
        <ErrorBoundary>
          {step === 1 ? (
            <>
              {methodSelected && (
                <div className="task_management__regauging__add d-flex">
                  <Button
                    type="primary"
                    icon={<SwapOutlined />}
                    className="my-auto ml-auto"
                    onClick={() => {
                      setRegaugeDataset(null);
                      setMethodSelected("");
                      setIsMethodOpted(true);
                    }}
                  >
                    Change Method
                  </Button>
                </div>
              )}
              <ConfirmRegaugeMethod
                title="Select Method"
                handleSubmit={(val) => {
                  fetchRegaugingDetails();
                  setIsMethodOpted(false);
                  setMethodSelected(val);
                  if (val === "ullage") {
                    let tempObj = cloneDeep(get(regaugingDataSetDefault, "ullage"));
                    tempObj["fill_date"] = moment().format("DD-MM-YYYY");
                    setRegaugeDataset(tempObj);
                  } else {
                    setRegaugeDataset(cloneDeep(get(regaugingDataSetDefault, "manual")));
                  }
                }}
                isModalVisible={isMethodOpted}
                handleCancel={() => {
                  setIsMethodOpted(false);
                  history.push("/regauging");
                }}
              />
              {methodSelected && <RegaugingCaskDetailsUiForm type={methodSelected ? "view" : "edit"} regaugeDataset={regaugeDatasetDetails} />}
              {methodSelected === "wt_msr" && (
                <RegaugingManualUiForm regaugeDataset={regaugeDataset} setRegaugeDataset={(data) => handleChange(data)} isLoading={loading} handleAssessmentParameters={handleAssessmentParameters} />
              )}
              {methodSelected === "ullage" && (
                <RegaugingUllageUiForm regaugeDataset={regaugeDataset} setRegaugeDataset={(data) => handleChange(data)} isLoading={loading} handleAssessmentParameters={handleAssessmentParameters} />
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
                    data={{
                      files: get(regaugeDataset, "all_files", []),
                      notes: get(regaugeDataset, "notes", ""),
                    }}
                  />
                  <div className="float-right pb-3">
                    <Button
                      type="primary"
                      icon={<ArrowRightOutlined />}
                      disabled={isNextButtonDisabled}
                      className="ml-3 float-right"
                      onClick={() => {
                        dispatch(updateRegaugingFinalPayload(regaugeDataset));
                        updateStep(2);
                        fetchPreviousList();
                      }}
                    >
                      Next
                    </Button>
                    <Button type="secondary" ghost className="float-right" icon={<CloseCircleOutlined />} onClick={() => history.push("/regauging")}>
                      Cancel
                    </Button>
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              <Spin spinning={previousListLoading}>
                <ComparisonDetails
                  details={[
                    {
                      all_files: get(regaugeDataset, "all_files", []),
                      notes: get(regaugeDataset, "notes", ""),
                      regauge_params: {
                        ...regaugeDataset,
                        method: methodSelected === "wt_msr" ? "Wt Msr" : "Ullage",
                      },
                    },
                    ...expectedComparisonData,
                  ]}
                />
                <div className="float-right pb-3">
                  <Button type="primary" icon={<SaveOutlined />} className="ml-3 float-right" onClick={() => handleFinalSubmit()}>
                    Submit
                  </Button>
                  <Button type="primary" icon={<ArrowLeftOutlined />} className="ml-3 float-right" onClick={() => updateStep(1)}>
                    Previous
                  </Button>
                  <Button type="secondary" ghost className="float-right" icon={<CloseCircleOutlined />} onClick={() => history.push("/regauging")}>
                    Cancel
                  </Button>
                </div>
              </Spin>
            </>
          )}
        </ErrorBoundary>
      </div>
    </>
  );
};

export default RegaugingData;
