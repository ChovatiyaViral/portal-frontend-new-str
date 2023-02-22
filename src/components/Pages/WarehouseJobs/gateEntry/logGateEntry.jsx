import { ArrowRightOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Button } from "antd";
import axios from "axios";
import { get, omit } from "lodash";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import SVGIcon from "../../../../constants/svgIndex";
import { getRequestHeader } from "../../../../helpers/service";
import { setAppLoader } from "../../../../helpers/utility";
import { setCurrentView } from "../../../../store/Auth/auth.actions";
import ErrorBoundary from "../../../UIComponents/ErrorBoundary";
import { AppCaskLoader } from "../../../UIComponents/Loader";
import { openNotificationWithIcon } from "../../../UIComponents/Toast/notification";
import AddCask from "../../Masterlists/casks/addCask";
import "./index.scss";
import { ValidateCurrentValue, ValidatePayload } from "./validate";

/**
 * Renders Log Gate Entry Component
 */
const LogGateEntry = (props) => {
  const [expectedData, setExpectedData] = React.useState(null);
  const [error, setError] = React.useState({});

  const { history } = props;
  const dispatch = useDispatch();
  const [progress, setProgress] = React.useState(0);

  const urlParams = new URLSearchParams(window.location.search);
  const dt_location = urlParams.get("dt-location");

  React.useEffect(() => {
    dispatch(setCurrentView("Log Gate Entry"));
  }, []);

  const currentWareHouseSelection = useSelector((state) => {
    return get(state, "task.currentWareHouseLocation", "");
  });

  const handleCaskDataChange = (data, currentKey) => {
    const checkValidation = ValidateCurrentValue(getRequestPayload(data), error, currentKey);
    setError(checkValidation);
    setExpectedData(data);
  };

  const getRequestPayload = (data) => {
    const computedValue = data ? data : expectedData;
    const additionalDetailsRequestPayload = get(computedValue, "additional_details.files", []).map((dataList) => {
      let newValue = { ...dataList };
      newValue = omit(newValue, "file_name");
      newValue = omit(newValue, "key");
      return newValue;
    });

    const requestPayload = {
      brand: get(computedValue, "cask_contents.brand", ""),
      spirit_type: get(computedValue, "cask_contents.spirit_type", ""),
      distillery: get(computedValue, "cask_contents.distillery", ""),
      ola: get(computedValue, "cask_contents.ola", ""),
      rla: get(computedValue, "cask_contents.rla", ""),
      strength: get(computedValue, "cask_contents.strength", ""),
      ays: get(computedValue, "cask_details.ays", ""),
      cask_number: get(computedValue, "cask_details.cask_number", ""),
      // passport_number: get(computedValue, "cask_details.passport_number", ""),
      cask_type: get(computedValue, "cask_type.cask_selected_code", ""),
      offsite_warehouse: get(computedValue, "warehouse_details.warehouse_keeper_name", ""),
      // dt_location: currentWareHouseSelection,
      additional_details: {
        files: additionalDetailsRequestPayload,
        notes: get(computedValue, "additional_details.notes", ""),
      },
    };

    return requestPayload;
  };

  const handleCaskDataSubmit = async () => {
    const checkValidation = ValidatePayload(getRequestPayload());

    if (checkValidation.isErrorAvailable) {
      setAppLoader(false);
      setError(checkValidation.errorObj);
    } else {
      const rest = await axios({
        method: "POST",
        data: getRequestPayload(),
        url: `${process.env.REACT_APP_API_ENDPOINT}/api/v1/cask/add`,
        headers: { ...getRequestHeader() },
        onUploadProgress: (event) => {
          const percent = Math.round((event.loaded * 100) / event.total);
          setProgress(percent);
          if (percent === 100) {
            setTimeout(() => setProgress(0), 1000);
          }
        },
      }).catch((err) => {
        setAppLoader(false);
        openNotificationWithIcon("error", "Log Gate Entry", `${get(err, "response.data.message", "Something Went Wrong")} `);
      });

      if (get(rest, "data.status")) {
        setAppLoader(false);
        openNotificationWithIcon("success", "Log Gate Entry", `${get(rest, "response.data.message", "Cask created successfully")} `);
        if (get(rest, "data.cask_id", "")) {
          history.push(`/log-gate-entry-summary/${get(rest, "data.cask_id", "")}?dt-location=${dt_location}`);
        }
      }

      if (!get(rest, "data.status", true)) {
        setAppLoader(false);
        openNotificationWithIcon("error", "Log Gate Entry", `${get(rest, "data.message", "Something Went Wrong")} `);
      }
    }
  };

  return (
    <>
      <div className="portal_styling__2 table-responsive-padding">
        <AppCaskLoader percent={progress} loader_text="Updating Cask details" loader_text2="Moving to Summary Page">
          <ErrorBoundary>
            <div className="task_management__gate_entry__add_cask">
              <div className="task_management__gate_entry__add_cask__steps">
                <p>
                  <span className="add_cask__steps_icon active">
                    <img src={SVGIcon.CaskDetailsIcon} />
                  </span>
                  <span className="add_cask__steps_icon_text">Cask Details</span>
                </p>
                <p>
                  <img src={SVGIcon.HorizontalLineIcon} style={{ marginBottom: 40 }} />
                </p>
                <p>
                  <span className="add_cask__steps_icon">
                    <img src={SVGIcon.GateEntryFormIcon} />
                  </span>
                  <span className="add_cask__steps_icon_text">Gate Entry Form</span>
                </p>
              </div>
              <div className="task_management__gate_entry__add_cask__content">
                <AddCask handleChange={handleCaskDataChange} error={error} />
              </div>
            </div>
            <div className="float-right mt-4 footer_cta">
              <Button
                type="primary"
                className="ml-3 float-right"
                onClick={() => {
                  setAppLoader(true);
                  handleCaskDataSubmit();
                }}
                icon={<ArrowRightOutlined />}
              >
                Next
              </Button>
              <Button type="secondary" ghost className="float-right" icon={<CloseCircleOutlined />}>
                Cancel
              </Button>
            </div>
          </ErrorBoundary>
        </AppCaskLoader>
      </div>
    </>
  );
};

export default LogGateEntry;
