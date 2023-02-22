import { CheckCircleOutlined, CloseCircleOutlined, FolderAddOutlined, PlusCircleOutlined, PlusOutlined, EyeOutlined, CheckOutlined, SaveOutlined } from "@ant-design/icons";
import { Badge, Button, Card, Col, Form, Input, message, Modal, Progress, Radio, Row, Spin, Tooltip, Upload } from "antd";
import axios from "axios";
import { cloneDeep, debounce, get, map, omit } from "lodash";
import moment from "moment";
import React from "react";
import { useDispatch } from "react-redux";
import SVGIcon from "../../../../constants/svgIndex";
import { useWindowSize } from "../../../../helpers/checkScreenSize";
import { getRequestHeader } from "../../../../helpers/service";
import { getBlobURL, getScreenSize, setAppLoader, setAppSuccessUI } from "../../../../helpers/utility";
import { setCurrentView } from "../../../../store/Auth/auth.actions";
import EditableDocument from "../../../CommonComponents/Upload/editableDocument";
import CustomColorPicker from "../../../UIComponents/ColorPicker";
import { CustomDatePicker } from "../../../UIComponents/DatePicker";
import ErrorBoundary from "../../../UIComponents/ErrorBoundary";
import { CustomInputNumber as InputNumberChange, CustomInputText as InputChange } from "../../../UIComponents/Input/customInput";
import { AppCaskLoader } from "../../../UIComponents/Loader";
import { SingleSelect as Select } from "../../../UIComponents/Select/singleSelect";
import SuccessUI from "../../../UIComponents/Success";
import { openNotificationWithIcon } from "../../../UIComponents/Toast/notification";
import { ValidateCurrentValue, ValidatePayload } from "./validate";

import "./index.scss";

import { isMobileOrTab } from "../../../../constants";
import UploadImages from "../../../CommonComponents/Upload/imagesView";
import { gateEntrySummaryDefaultValues } from "../constants";

const { Dragger } = Upload;
const { TextArea } = Input;

const assessmentArray = ["strength", "specific_gravity", "incoming_weight", "consignor_doc_rla"];
const sebringArray = ["sebring_original_rla", "sebring_basis_date"];

let uploadedDoc = [];

/**
 * Renders Log Gate Entry Summary Component
 */
const LogGateEntrySummary = (props) => {
  const { match, history } = props;
  const [width] = useWindowSize();

  const [logEntryValues, setLogEntryValues] = React.useState({ ...cloneDeep(gateEntrySummaryDefaultValues) });
  const [previewVisible, setPreviewVisible] = React.useState(false);
  const [isImageUploaded, setIsImageUploaded] = React.useState(false);
  const [previewImage, setPreviewImage] = React.useState("");
  const [previewTitle, setPreviewTitle] = React.useState("");
  const [caskSummary, setCaskSummary] = React.useState(null);
  const [imagesList, setImagesList] = React.useState([]);

  const [isPassportNumberAvailable, setIsPassportNumberAvailable] = React.useState("no");
  const [passportNumberToBeVerified, setPassportNumberToBeVerified] = React.useState("");
  const [isPassportGenerated, setIsPassportGenerated] = React.useState(null);
  const [isPassportVerified, setIsPassportVerified] = React.useState(false);
  const [passportVerifiedMessage, setPassportVerifiedMessage] = React.useState(null);
  const [verifyPassportProgress, setVerifyPassportProgress] = React.useState(0);

  const [computedValuesLoader, setComputedValuesLoader] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const [defaultImageFileList, setDefaultImageFileList] = React.useState([]);
  const [defaultDocumentFileList, setDefaultDocumentFileList] = React.useState([]);
  const [progress, setProgress] = React.useState(0);
  const [submitProgress, setSubmitProgress] = React.useState(0);
  const [error, setError] = React.useState({});

  const urlParams = new URLSearchParams(window.location.search);
  const dt_location = urlParams.get("dt-location");

  const resetSebringComputedValue = (newValue) => {
    newValue["sebring_details"]["sebring_estimated_rla"] = "";
    newValue["sebring_details"]["diff_of_sebring_estimated"] = "";
    newValue["sebring_details"]["discrepancy_as_age_percent"] = "";
    newValue["sebring_details"]["time_difference"] = "";
    newValue["sebring_details"]["percent_loss"] = "";
    newValue["sebring_details"]["loss_loa"] = "";

    return newValue;
  };

  const handleChange = React.useCallback((key, value, type = "") => {
    let newValue = { ...logEntryValues };

    if (key === "files") {
      newValue[key] = value;
    }

    if (type) {
      newValue[type][key] = value;
    }

    if (!type && key !== "files") {
      newValue[key] = value;
    }

    if (assessmentArray.includes(key)) {
      if (checkAssessmentParameters(newValue)) {
        setLoading(true);
        getAssessmentParameters(newValue);
        if (checkSebringParameters(newValue)) {
          getSebringParameters(newValue);
        } else {
          setLoading(false);
          newValue = resetSebringComputedValue(newValue);
        }
      } else {
        setLoading(false);
        const newVal = { ...cloneDeep(gateEntrySummaryDefaultValues) };
        newValue["assessment"] = get(newVal, "assessment");
        newValue = resetSebringComputedValue(newValue);
      }
    }

    if (sebringArray.includes(key)) {
      if (checkSebringParameters(newValue)) {
        setLoading(true);
        getSebringParameters(newValue);
      } else {
        setLoading(false);
        newValue = resetSebringComputedValue(newValue);
      }
    }
    const checkValidation = ValidateCurrentValue(getRequestPayload(newValue), error, key);
    setError(checkValidation);

    setLogEntryValues(newValue);
  });

  const checkAssessmentParameters = (newValue) => {
    const computedCheck = map(assessmentArray, function (o) {
      if (get(newValue, `incoming_cask_details.${o}`)) {
        return true;
      }
      return false;
    });

    return !computedCheck.includes(false) && get(caskSummary, "cask_type");
  };

  const checkSebringParameters = (newValue) => {
    const computedCheck = map(sebringArray, function (o) {
      if (get(newValue, `sebring_details.${o}`)) {
        return true;
      }
      return false;
    });

    return checkAssessmentParameters(newValue) && !computedCheck.includes(false);
  };

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => resolve(reader.result);

      reader.onerror = (error) => reject(error);
    });

  const beforeUpload = (file) => {
    if (!checkFile(file)) {
      message.error("You can only upload JPG/PNG file smaller than 2MB!");
    }

    return checkFile(file);
  };

  const checkFile = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    const isLt2M = file.size / 1024 / 1024 < 2;

    if (!isJpgOrPng) {
      return false;
    }

    if (!isLt2M) {
      return false;
    }

    return isJpgOrPng && isLt2M;
  };

  const uploadButton = (
    <div>
      <PlusCircleOutlined />
      <div
        style={{
          marginTop: 12,
          fontWeight: 500,
          fontSize: 12,
          letterSpacing: "-0.01em",
          textDecorationLine: "underline",
          color: "#38479E",
        }}
        className="add_image_text"
      >
        Add Image
      </div>
    </div>
  );

  const handleCancel = () => setPreviewVisible(false);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf("/") + 1));
  };

  const dispatch = useDispatch();

  const fetchCaskSummary = async () => {
    const rest = await axios({
      method: "GET",
      url: `${process.env.REACT_APP_API_ENDPOINT}/api/v1/cask/summary/${get(match, "params.id")}`,
      headers: { ...getRequestHeader() },
    }).catch((err) => {
      openNotificationWithIcon("error", "Cask Summary", `${get(err, "response.data.message", "Something Went Wrong")} `);
    });

    if (get(rest, "data.status")) {
      if (get(rest, "data.data.passport_number")) {
        setIsPassportNumberAvailable(null);
        handleChange("passport_number", get(rest, "data.data.passport_number"), "passport_details");
      }
      setCaskSummary(get(rest, "data.data", {}));
    }

    if (!get(rest, "data.status", true)) {
      openNotificationWithIcon("error", "Cask Summary", `${get(rest, "data.message", "Something Went Wrong")} `);
    }
  };

  React.useEffect(() => {
    setLogEntryValues({ ...cloneDeep(gateEntrySummaryDefaultValues) });
  }, []);

  React.useEffect(() => {
    dispatch(setCurrentView("Log Gate Entry Summary"));
    fetchCaskSummary();
  }, []);

  const handleGeneratePassportNumberSubmit = async () => {
    let requestPayload = {
      cask_type: get(caskSummary, "cask_type"),
      cask_id: get(caskSummary, "cask_id"),
    };

    if (passportNumberToBeVerified) {
      requestPayload = { ...requestPayload, passport_number: passportNumberToBeVerified };
    }

    const rest = await axios({
      method: "POST",
      data: requestPayload,
      url: `${process.env.REACT_APP_API_ENDPOINT}/api/v1/passport/generate_passport_num`,
      headers: { ...getRequestHeader() },
    }).catch((err) => {
      openNotificationWithIcon("error", "Passport Number", `${get(err, "response.data.message", "Something Went Wrong")} `);
    });

    if (get(rest, "data.status")) {
      setIsPassportNumberAvailable(null);
      setIsPassportGenerated(get(rest, "data.passport_number"));
      handleChange("passport_number", get(rest, "data.passport_number"), "passport_details");
      openNotificationWithIcon("success", "Passport Number", `${get(rest, "response.data.message", "Passport Number generated successfully")} `);
    }

    if (!get(rest, "data.status", true)) {
      openNotificationWithIcon("error", "Passport Number", `${get(rest, "data.message", "Something Went Wrong")} `);
    }
  };

  const invokeDebounced = debounce((query) => {
    handleVerifyPassportNumberSubmit(query);
  }, 2000);

  const handleVerifyPassportNumberSubmit = async (query) => {
    const rest = await axios({
      method: "POST",
      data: {
        passport_number: query,
        // cask_type: get(caskSummary, "cask_type"),
      },
      url: `${process.env.REACT_APP_API_ENDPOINT}/api/v1/passport/verify`,
      headers: { ...getRequestHeader() },
      onUploadProgress: (event) => {
        const percent = Math.round((event.loaded * 100) / event.total);
        setVerifyPassportProgress(percent);
        if (percent === 100) {
          setTimeout(() => setVerifyPassportProgress(0), 1000);
        }
      },
    }).catch((err) => {
      setIsPassportVerified(false);
      setPassportVerifiedMessage(get(err, "response.data.message"));
      // openNotificationWithIcon("error", "Passport Number", `${get(err, "response.data.message", "Something Went Wrong")} `);
    });

    if (get(rest, "data.status")) {
      setIsPassportVerified(true);
      setPassportVerifiedMessage(get(rest, "data.message"));
      // openNotificationWithIcon("success", "Passport Number", `${get(rest, "data.message", "Passport Number created successfully")} `);
    }

    if (!get(rest, "data.status", true)) {
      setIsPassportVerified(false);
      setPassportVerifiedMessage(get(rest, "data.message"));
      // openNotificationWithIcon("error", "Passport Number", `${get(rest, "data.message", "Something Went Wrong")} `);
    }
  };

  const getSebringParameters = async (newValue) => {
    const rest = await axios({
      method: "POST",
      data: {
        strength: get(newValue, "incoming_cask_details.strength"),
        incoming_weight: get(newValue, "incoming_cask_details.incoming_weight"),
        specific_gravity: get(newValue, "incoming_cask_details.specific_gravity"),
        consignor_doc_rla: get(newValue, "incoming_cask_details.consignor_doc_rla"),
        sebring_original_rla: get(newValue, "sebring_details.sebring_original_rla"),
        sebring_basis_date: get(newValue, "sebring_details.sebring_basis_date"),
        cask_type: get(caskSummary, "cask_type"),
        ays: get(caskSummary, "ays"),
      },
      url: `${process.env.REACT_APP_API_ENDPOINT}/api/v1/crr/get_all_computed_params`,
      headers: { ...getRequestHeader() },
    }).catch((err) => {
      setLoading(false);
      openNotificationWithIcon("error", "Sebring Parameters", `${get(err, "response.data.message", "Something Went Wrong")} `);
    });

    if (get(rest, "data.status")) {
      setLoading(false);
      let newValue = { ...logEntryValues };
      const responseValue = get(rest, "data.data", {});
      map(Object.keys(responseValue), function (o) {
        newValue["sebring_details"][o] = responseValue[o];
      });
      setLogEntryValues(newValue);
    }

    if (!get(rest, "data.status", true)) {
      setLoading(false);
      openNotificationWithIcon("error", "Sebring Parameters", `${get(rest, "data.message", "Something Went Wrong")} `);
    }
  };

  const getAssessmentParameters = async (newValue) => {
    const rest = await axios({
      method: "POST",
      data: {
        strength: get(newValue, "incoming_cask_details.strength"),
        incoming_weight: get(newValue, "incoming_cask_details.incoming_weight"),
        specific_gravity: get(newValue, "incoming_cask_details.specific_gravity"),
        consignor_doc_rla: get(newValue, "incoming_cask_details.consignor_doc_rla"),
        cask_type: get(caskSummary, "cask_type"),
      },
      url: `${process.env.REACT_APP_API_ENDPOINT}/api/v1/crr/get_cask_assessment_params`,
      headers: { ...getRequestHeader() },
    }).catch((err) => {
      setLoading(false);
      openNotificationWithIcon("error", "Assessment Parameters", `${get(err, "response.data.message", "Something Went Wrong")} `);
    });

    if (get(rest, "data.status")) {
      setLoading(false);
      let newValue = { ...logEntryValues };
      newValue["assessment"] = get(rest, "data.data", {});
      setLogEntryValues(newValue);
    }

    if (!get(rest, "data.status", true)) {
      setLoading(false);
      openNotificationWithIcon("error", "Assessment Parameters", `${get(rest, "data.message", "Something Went Wrong")} `);
    }
  };

  const uploadData = async (options, document_type = "document") => {
    const { onSuccess, onError, file, onProgress } = options;

    const format = "YYYY/MM/DD";
    const datePath = moment(new Date()).format(format);
    const file_path = `test_upload/${datePath}/`;

    let uploadDocumentRequestPayload = new FormData();
    uploadDocumentRequestPayload.append("file_name", get(file, "name"));
    uploadDocumentRequestPayload.append("file_path", file_path);
    uploadDocumentRequestPayload.append("file_binary", file);

    try {
      const resp = await axios({
        method: "POST",
        url: `${process.env.REACT_APP_API_ENDPOINT}/api/caskFiles_upload`,
        data: uploadDocumentRequestPayload,
        headers: {
          "Content-Type": "multipart/form-data",
          ...getRequestHeader(),
        },
        onUploadProgress: (event) => {
          const percent = Math.floor((event.loaded / event.total) * 100);
          setProgress(percent);
          if (percent === 100) {
            setTimeout(() => setProgress(0), 1000);
          }
          onProgress({ percent: (event.loaded / event.total) * 100 });
        },
      }).catch((err) => {
        openNotificationWithIcon("error", "Documents", `${get(err, "response.data.message", "Something Went Wrong")} `);
      });

      onSuccess("OK");
      // eslint-disable-next-line no-console
      console.log("server res: ", resp);

      if (get(resp, "data.status", false)) {
        const requestObj = {
          document_name: get(file, "name"),
          file_name: get(file, "name"),
          document_url: get(resp, "data.file_url"),
          document_type,
        };

        uploadedDoc = [...uploadedDoc, requestObj];
        getAllImages(uploadedDoc);
        handleChange("files", uploadedDoc);

        if (document_type === "image") {
          setIsImageUploaded(true);
        }
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log("Error: ", err);
      onError({ err });
    }
  };

  const documentProps = {
    multiple: true,
    listType: "picture",
    showUploadList: false,
    customRequest(options) {
      uploadData(options, "document");
    },
    onChange(info) {
      setDefaultDocumentFileList(info.fileList);
    },
    onDrop(e) {
      // eslint-disable-next-line no-console
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  const onPassNumberAvailabilityChange = (e) => {
    setIsPassportNumberAvailable(e.target.value);
  };

  const getValue = (val, type) => {
    const typeCheck = type ? "----" : "NA";
    return val ? val : typeCheck;
  };

  const getDiscrepancyColor = (value) => {
    if (value >= 70 && value <= 100) {
      return "#FF7E7E";
    }

    if (value >= 40 && value <= 69) {
      return "#FDC500";
    }

    if (value >= 0 && value <= 39) {
      return "#9CE861";
    }
  };

  const checkScreenSize = (cardWidth) => {
    if (width > 1500) {
      return cardWidth;
    }
    return "auto";
  };

  const getRequestPayload = (data) => {
    const computedValue = data ? data : logEntryValues;

    const additionalDetailsRequestPayload = get(logEntryValues, "files", []).map((dataList) => {
      let newValue = { ...dataList };
      newValue = omit(newValue, "file_name");
      newValue = omit(newValue, "key");
      return newValue;
    });

    const requestPayload = {
      cask_id: get(caskSummary, "cask_id"),
      dt_location,
      passport_number: get(logEntryValues, "passport_details.passport_number"),
      delivered_by_name: get(logEntryValues, "incoming_cask_details.delivered_by_name"),
      whisky_type: get(logEntryValues, "incoming_cask_details.whisky_type"),
      color: get(logEntryValues, "incoming_cask_details.color"),
      dry_dip: get(logEntryValues, "incoming_cask_details.dry_dip"),
      wet_dip: get(logEntryValues, "incoming_cask_details.wet_dip"),
      strength: get(logEntryValues, "incoming_cask_details.strength"),
      bulk_litres: get(logEntryValues, "incoming_cask_details.bulk_litres"),
      incoming_weight: get(logEntryValues, "incoming_cask_details.incoming_weight"),
      specific_gravity: get(logEntryValues, "incoming_cask_details.specific_gravity"),
      temperature: get(logEntryValues, "incoming_cask_details.temperature"),
      consignor_doc_rla: get(logEntryValues, "incoming_cask_details.consignor_doc_rla"),
      cask_type: get(caskSummary, "cask_type"),
      sebring_original_rla: get(logEntryValues, "sebring_details.sebring_original_rla"),
      sebring_original_strength: get(logEntryValues, "sebring_details.sebring_original_strength"),
      sebring_basis_date: get(logEntryValues, "sebring_details.sebring_basis_date"),
      crr_files: additionalDetailsRequestPayload,
      notes: get(logEntryValues, "notes"),
    };

    return requestPayload;
  };

  const handleGateEntryDataSubmit = async () => {
    const checkValidation = ValidatePayload(getRequestPayload());
    if (checkValidation.isErrorAvailable) {
      setAppLoader(false);
      setError(checkValidation.errorObj);
    } else {
      const rest = await axios({
        method: "POST",
        data: getRequestPayload(),
        url: `${process.env.REACT_APP_API_ENDPOINT}/api/v1/crr/addCaskToCrr`,
        headers: { ...getRequestHeader() },
        onUploadProgress: (event) => {
          const percent = Math.round((event.loaded * 100) / event.total);
          setSubmitProgress(percent);
          if (percent === 100) {
            setTimeout(() => setSubmitProgress(0), 1000);
          }
        },
      }).catch((err) => {
        setAppLoader(false);
        openNotificationWithIcon("error", "Log Gate Entry Summary", `${get(err, "response.data.message", "Something Went Wrong")} `);
      });

      if (get(rest, "data.status")) {
        setAppLoader(false);
        uploadedDoc = [];
        // openNotificationWithIcon("success", "Log Gate Entry Summary", `${get(rest, "response.data.message", "Cask created successfully")} `);
        if (get(rest, "data.crr_id")) {
          setAppSuccessUI(true);
        }
      }

      if (!get(rest, "data.status", true)) {
        setAppLoader(false);
        openNotificationWithIcon("error", "Log Gate Entry Summary", `${get(rest, "data.message", "Something Went Wrong")} `);
      }
    }
  };

  const documentsUploaded = get(logEntryValues, "files", []).filter((item) => item.document_type === "document");
  const uploadedImages = get(logEntryValues, "files", []).filter((item) => item.document_type === "image");

  const getImageFromS3 = async (s3URL) => {
    return await axios({
      method: "GET",
      url: `${process.env.REACT_APP_API_ENDPOINT}/api/get_s3_file_by_url?url=${s3URL.trim()}`,
      headers: { ...getRequestHeader() },
    })
      .then((data) => {
        return getBlobURL(s3URL, get(data, "data.file"));
      })
      .catch((err) => {
        openNotificationWithIcon("error", `${get(err, "response.data.message", "Something Went Wrong")} `);
      });
  };

  const getAllImages = async (imgListing) => {
    let imageUploaded = imgListing ? imgListing : uploadedImages;
    const allImages = await Promise.all(
      imageUploaded.map(async (list) => {
        const uri = await getImageFromS3(get(list, "document_url"));
        return uri;
      })
    );
    if (allImages.length > 0) {
      setImagesList(allImages);
    }
  };

  return (
    <>
      <AppCaskLoader percent={submitProgress} loader_text="Updating Cask details" loader_text2="Moving to CRR list">
        <SuccessUI
          message="Your gate entry details have been added to the CRR list"
          secondaryBtn={{
            text: "Back to Gate Entry",
            link: "/gate-entry",
          }}
          primaryBtn={{
            text: "View CRR List",
            link: "/crr-listing",
          }}
        />
        <div className="portal_styling__1 portal_styling__2 table-responsive-padding">
          <ErrorBoundary>
            {get(match, "params.id") && (
              <div className="d-flex align-items-center justify-content-between add_cask__exiting__cask_text">
                <div className="d-flex align-items-center">
                  <p className="summary__card_title">
                    <img src={SVGIcon.CaskIcon2} />
                  </p>
                  <div>
                    <p className="summary__card_content__title">Cask #{getValue(get(caskSummary, "cask_number"))} </p>
                    <p className="summary__card_content__value">
                      Job number {getValue(get(caskSummary, "job_id"))} | {getValue(get(caskSummary, "cask_type"))} {getValue(get(caskSummary, "distillery"))} | Arriving from{" "}
                      {getValue(get(caskSummary, "arriving_From"))}
                    </p>
                  </div>
                </div>
                <Button type="primary" icon={<EyeOutlined />} className="ml-4 float-right">
                  View cask profile
                </Button>
              </div>
            )}

            <div className="task_management__gate_entry__add_cask">
              {!get(match, "params.id") && (
                <div className="task_management__gate_entry__add_cask__steps">
                  <p>
                    <span className="add_cask__steps_icon">
                      <img src={SVGIcon.CaskDetailsIcon} />
                    </span>
                    <span className="add_cask__steps_icon_text">Cask Details</span>
                  </p>
                  <p>
                    <img src={SVGIcon.HorizontalLineIcon} style={{ marginBottom: 40 }} />
                  </p>
                  <p>
                    <span className="add_cask__steps_icon active">
                      <img src={SVGIcon.GateEntryFormIcon} />
                    </span>
                    <span className="add_cask__steps_icon_text">Gate Entry Form</span>
                  </p>
                </div>
              )}
              <div className="task_management__gate_entry__add_cask__summary">
                <p className="summary_title"> Cask Summary </p>
                <div className="summary_details log_gate_summary__cask_summary">
                  <Row gutter={[16, 16]}>
                    <Col xs={{ span: 24 }} md={{ span: 10 }}>
                      <Card
                        title={
                          <p className="summary__card_title">
                            <img src={SVGIcon.CaskContentsIcon} /> <span>Cask Contents</span>
                          </p>
                        }
                        bordered={false}
                      >
                        <div className="summary__card_content">
                          <Row gutter={16}>
                            <Col flex="1 0 1%">
                              <p className="summary__card_content__title">Brand Name</p>
                              <p className="summary__card_content__value">
                                <Tooltip placement="topLeft" title={getValue(get(caskSummary, "brand"))}>
                                  {getValue(get(caskSummary, "brand"))}
                                </Tooltip>
                              </p>
                            </Col>
                            <Col flex="1 0 1%">
                              <p className="summary__card_content__title">Spirit Type </p>
                              <p className="summary__card_content__value">
                                <Tooltip placement="topLeft" title={getValue(get(caskSummary, "spirit_type"))}>
                                  {getValue(get(caskSummary, "spirit_type"))}
                                </Tooltip>
                              </p>
                            </Col>
                          </Row>
                          <Row gutter={16}>
                            <Col flex="1 0 1%">
                              <p className="summary__card_content__title">OLA / RLA </p>
                              <p className="summary__card_content__value">
                                <Tooltip placement="topLeft" title={`${getValue(get(caskSummary, "ola"))} / ${getValue(get(caskSummary, "rla"))}`}>
                                  {getValue(get(caskSummary, "ola"))} / {getValue(get(caskSummary, "rla"))}
                                </Tooltip>
                              </p>
                            </Col>
                            <Col flex="1 0 1%">
                              <p className="summary__card_content__title">Strength</p>
                              <p className="summary__card_content__value">
                                <Tooltip placement="topLeft" title={getValue(get(caskSummary, "strength"))}>
                                  {getValue(get(caskSummary, "strength"))}
                                </Tooltip>
                              </p>
                            </Col>
                          </Row>
                        </div>
                      </Card>
                    </Col>

                    <Col xs={{ span: 24 }} md={{ span: 14 }}>
                      <Card
                        title={
                          <p className="summary__card_title">
                            <img src={SVGIcon.CaskDetailsIcon} /> <span>Cask Details</span>
                          </p>
                        }
                        bordered={false}
                      >
                        <div className="summary__card_content">
                          <Row>
                            <Col xs={{ span: 12 }} md={{ span: 6 }}>
                              <p className="summary__card_content__title">AYS</p>
                              <p className="summary__card_content__value">
                                <Tooltip placement="topLeft" title={getValue(get(caskSummary, "ays"))}>
                                  {getValue(get(caskSummary, "ays"))}
                                </Tooltip>
                              </p>
                            </Col>
                            <Col xs={{ span: 12 }} md={{ span: 6 }}>
                              <p className="summary__card_content__title">Cask No. </p>
                              <p className="summary__card_content__value">
                                <Tooltip placement="topLeft" title={getValue(get(caskSummary, "cask_number"))}>
                                  {getValue(get(caskSummary, "cask_number"))}
                                </Tooltip>
                              </p>
                            </Col>
                            <Col xs={{ span: 12 }} md={{ span: 6 }}>
                              <p className="summary__card_content__title">Warehouse Name </p>
                              <p className="summary__card_content__value">
                                <Tooltip placement="topLeft" title={getValue(get(caskSummary, "warehouse_name"))}>
                                  {getValue(get(caskSummary, "warehouse_name"))}
                                </Tooltip>
                              </p>
                            </Col>
                            <Col xs={{ span: 12 }} md={{ span: 6 }}>
                              <p className="summary__card_content__title">Warehouse Keeper </p>
                              <p className="summary__card_content__value">
                                <Tooltip placement="topLeft" title={getValue(get(caskSummary, "warehouse_keeper_name"))}>
                                  {getValue(get(caskSummary, "warehouse_keeper_name"))}
                                </Tooltip>
                              </p>
                            </Col>
                            <Col xs={{ span: 12 }} md={{ span: 6 }}>
                              <p className="summary__card_content__title">Cask Type</p>
                              <p className="summary__card_content__value">
                                <Tooltip placement="topLeft" title={getValue(get(caskSummary, "cask_type"))}>
                                  <img src={SVGIcon.CaskType1Icon} /> {getValue(get(caskSummary, "cask_type"))}
                                </Tooltip>
                              </p>
                            </Col>
                            <Col xs={{ span: 12 }} md={{ span: 12 }}>
                              <p className="summary__card_content__title">Created by </p>
                              <p className="summary__card_content__value">
                                <Tooltip placement="topLeft" title={getValue(get(caskSummary, "created_by"))}>
                                  {getValue(get(caskSummary, "created_by"))}
                                </Tooltip>
                              </p>
                            </Col>
                          </Row>
                        </div>
                      </Card>
                    </Col>
                  </Row>
                </div>
                <div className="summary__additional_details" style={{ minWidth: checkScreenSize(1020) }}>
                  <div className="d-flex align-items-center  ">
                    <img src={SVGIcon.AdditionalDetailsIcon} alt="Additional Details" style={{ width: "24px", height: "24px" }} />
                    <span>Passport Details</span>
                  </div>
                  {!isPassportGenerated && isPassportNumberAvailable && (
                    <div className="check__passport_number">
                      <p>Do you have a existing passport number?</p>
                      <Radio.Group onChange={onPassNumberAvailabilityChange} value={isPassportNumberAvailable}>
                        <Radio value="yes">Yes</Radio>
                        <Radio value="no">No</Radio>
                      </Radio.Group>
                    </div>
                  )}
                  <div className="additional_details_content passport_input">
                    <Row gutter={[16, 16]}>
                      {isPassportNumberAvailable ? (
                        <Col span={8}>
                          {isPassportNumberAvailable === "yes" ? (
                            <>
                              <div className="d-flex align-items-center">
                                <InputChange
                                  value={passportNumberToBeVerified}
                                  handleChange={(type, value) => {
                                    setIsPassportVerified(false);
                                    setPassportVerifiedMessage(null);
                                    setPassportNumberToBeVerified(value);
                                    if (value.length > 2) {
                                      invokeDebounced(value);
                                    }
                                  }}
                                  status={passportVerifiedMessage && (!isPassportVerified ? "error" : "success")}
                                  validateStatus={passportVerifiedMessage && !isPassportVerified ? "error" : ""}
                                  helpText={
                                    passportVerifiedMessage ? (
                                      <Badge
                                        color="#fff"
                                        style={{
                                          marginTop: 8,
                                          marginLeft: 0,
                                        }}
                                        text={
                                          <>
                                            {isPassportVerified && (
                                              <span style={{ color: "#389e0d" }}>
                                                <CheckCircleOutlined /> <span>{passportVerifiedMessage}</span>
                                              </span>
                                            )}
                                            {!isPassportVerified && (
                                              <span style={{ color: "#ff4d4f" }}>
                                                <CloseCircleOutlined /> <span>{passportVerifiedMessage}</span>
                                              </span>
                                            )}
                                          </>
                                        }
                                      />
                                    ) : (
                                      ""
                                    )
                                  }
                                  type="passport_number"
                                  style={{ width: 292 }}
                                  className="mt-0 mb-0 w-100"
                                  label="Passport Number"
                                />
                                <Button type="primary" icon={<CheckOutlined />} onClick={() => handleGeneratePassportNumberSubmit()} disabled={!isPassportVerified} className="ml-4 passport_number__verify_btn">
                                  Submit
                                </Button>
                              </div>
                              {verifyPassportProgress > 0 ? <Progress size="small" className="mb-2" percent={verifyPassportProgress} style={{ width: 292 }} /> : null}
                            </>
                          ) : (
                            <>
                              {isPassportGenerated ? (
                                <InputChange value={isPassportGenerated} disabled type="passport_number" className="mt-0 mb-0 w-100" label="Passport Number" />
                              ) : (
                                <Button icon={<PlusOutlined />} className="passport_number__generation mb-4" onClick={() => handleGeneratePassportNumberSubmit()}>
                                  Generate passport number
                                </Button>
                              )}
                            </>
                          )}
                        </Col>
                      ) : (
                        <InputChange
                          value={get(logEntryValues, "passport_details.passport_number", "")}
                          disabled
                          type="passport_number"
                          style={{ width: 292 }}
                          className="mt-0 mb-0 w-100"
                          label="Passport Number"
                        />
                      )}
                    </Row>
                    {/* <Row gutter={24}>
                      <Col span={8}>
                        <InputChange
                          value={get(logEntryValues, "passport_details.passport_type", "")}
                          handleChange={(type, value) => handleChange(type, value, "passport_details")}
                          type="passport_type"
                          className="mt-0 mb-0 w-100"
                          label="Passport Type"
                        />
                      </Col>
                      <Col span={8}>
                        <InputChange
                          value={get(logEntryValues, "passport_details.spirit_weight", "")}
                          handleChange={(type, value) => handleChange(type, value, "passport_details")}
                          type="spirit_weight"
                          className="mt-0 mb-0 w-100"
                          label="Spirit Weight"
                        />
                      </Col>
                      <Col span={8}>
                        <InputChange
                          value={get(logEntryValues, "passport_details.fills", "")}
                          handleChange={(type, value) => handleChange(type, value, "passport_details")}
                          type="fills"
                          className="mt-0 mb-0 w-100"
                          label="Fills"
                        />
                      </Col>
                    </Row> */}
                  </div>
                </div>

                <div className="summary__additional_details" style={{ minWidth: checkScreenSize(1020) }}>
                  <div className="d-flex align-items-center  ">
                    <img src={SVGIcon.IncomingCaskIcon} alt="Incoming Cask " style={{ width: "24px", height: "24px" }} />
                    <span>Incoming Cask Details</span>
                  </div>
                  <div className="additional_details_content">
                    <Row gutter={[16, 16]}>
                      <Col xs={{ span: 24 }} md={{ span: 6 }}>
                        <InputChange
                          value={get(logEntryValues, "incoming_cask_details.delivered_by_name", "")}
                          handleChange={(type, value) => handleChange(type, value, "incoming_cask_details")}
                          status={get(error, "delivered_by_name") ? "error" : ""}
                          validateStatus={get(error, "delivered_by_name") && "error"}
                          helpText={get(error, "delivered_by_name") ? "Delivered By is mandatory" : ""}
                          type="delivered_by_name"
                          className="mt-0 mb-0 w-100"
                          label="Delivered By"
                        />
                      </Col>

                      <Col xs={{ span: 24 }} md={{ span: 6 }}>
                        <Select
                          type="whisky_type"
                          label="Whisky Type"
                          status={get(error, "whisky_type") ? "error" : ""}
                          validateStatus={get(error, "whisky_type") && "error"}
                          helpText={get(error, "whisky_type") ? "Whisky Type is mandatory" : ""}
                          value={get(logEntryValues, "incoming_cask_details.whisky_type", "")}
                          handleChange={(type, value) => handleChange(type, value, "incoming_cask_details")}
                          placeHolder="Select Whisky Type"
                          options={[
                            {
                              label: "Blend 2000 (80:20)",
                              value: "Blend 2000 (80:20)",
                            },
                          ]}
                          className="mt-0 mb-0"
                        />
                      </Col>
                      <Col xs={{ span: 24 }} md={{ span: 6 }}>
                        <CustomColorPicker validateStatus={get(error, "color")} applyColorCode={(colorCode) => handleChange("color", colorCode, "incoming_cask_details")} type="menu" />
                      </Col>
                      <Col xs={{ span: 12 }} md={{ span: 6 }}>
                        <InputNumberChange
                          value={get(logEntryValues, "incoming_cask_details.dry_dip", "")}
                          handleChange={(type, value) => handleChange(type, value, "incoming_cask_details")}
                          type="dry_dip"
                          status={get(error, "dry_dip") ? "error" : ""}
                          validateStatus={get(error, "dry_dip") && "error"}
                          helpText={get(error, "dry_dip") ? "Dry dip is mandatory" : ""}
                          className="mt-0 mb-0 w-100"
                          label="Dry dip"
                        />
                      </Col>
                      <Col xs={{ span: 12 }} md={{ span: 6 }}>
                        <InputNumberChange
                          value={get(logEntryValues, "incoming_cask_details.wet_dip", "")}
                          handleChange={(type, value) => handleChange(type, value, "incoming_cask_details")}
                          type="wet_dip"
                          status={get(error, "wet_dip") ? "error" : ""}
                          validateStatus={get(error, "wet_dip") && "error"}
                          helpText={get(error, "wet_dip") ? "Wet dip is mandatory" : ""}
                          className="mt-0 mb-0 w-100"
                          label="Wet dip"
                        />
                      </Col>
                      <Col xs={{ span: 12 }} md={{ span: 6 }}>
                        <InputNumberChange
                          value={get(logEntryValues, "incoming_cask_details.strength", "")}
                          handleChange={(type, value) => handleChange(type, value, "incoming_cask_details")}
                          type="strength"
                          status={get(error, "strength") ? "error" : ""}
                          validateStatus={get(error, "strength") && "error"}
                          helpText={get(error, "strength") ? "Strength is mandatory" : ""}
                          className="mt-0 mb-0 w-100"
                          label="Strength (%)"
                        />
                      </Col>
                      <Col xs={{ span: 12 }} md={{ span: 6 }}>
                        <InputNumberChange
                          value={get(logEntryValues, "incoming_cask_details.bulk_litres", "")}
                          handleChange={(type, value) => handleChange(type, value, "incoming_cask_details")}
                          type="bulk_litres"
                          status={get(error, "bulk_litres") ? "error" : ""}
                          validateStatus={get(error, "bulk_litres") && "error"}
                          helpText={get(error, "bulk_litres") ? "Bulk Litres is mandatory" : ""}
                          className="mt-0 mb-0 w-100"
                          label="Bulk Litres"
                        />
                      </Col>
                      <Col xs={{ span: 12 }} md={{ span: 6 }}>
                        <InputNumberChange
                          value={get(logEntryValues, "incoming_cask_details.incoming_weight", "")}
                          handleChange={(type, value) => handleChange(type, value, "incoming_cask_details")}
                          type="incoming_weight"
                          status={get(error, "incoming_weight") ? "error" : ""}
                          validateStatus={get(error, "incoming_weight") && "error"}
                          helpText={get(error, "incoming_weight") ? "Incoming Weight is mandatory" : ""}
                          className="mt-0 mb-0 w-100"
                          label="Incoming Weight"
                        />
                      </Col>
                      <Col xs={{ span: 12 }} md={{ span: 6 }}>
                        <InputNumberChange
                          value={get(logEntryValues, "incoming_cask_details.specific_gravity", "")}
                          handleChange={(type, value) => handleChange(type, value, "incoming_cask_details")}
                          type="specific_gravity"
                          status={get(error, "specific_gravity") ? "error" : ""}
                          validateStatus={get(error, "specific_gravity") && "error"}
                          helpText={get(error, "specific_gravity") ? "Specific gravity is mandatory" : ""}
                          className="mt-0 mb-0 w-100"
                          label="Specific gravity"
                        />
                      </Col>
                      <Col xs={{ span: 12 }} md={{ span: 6 }}>
                        <InputNumberChange
                          value={get(logEntryValues, "incoming_cask_details.temperature", "")}
                          handleChange={(type, value) => handleChange(type, value, "incoming_cask_details")}
                          type="temperature"
                          status={get(error, "temperature") ? "error" : ""}
                          validateStatus={get(error, "temperature") && "error"}
                          helpText={get(error, "temperature") ? "Temperature is mandatory" : ""}
                          className="mt-0 mb-0 w-100"
                          label="Temperature"
                        />
                      </Col>
                      <Col xs={{ span: 12 }} md={{ span: 6 }}>
                        <InputNumberChange
                          value={get(logEntryValues, "incoming_cask_details.consignor_doc_rla", "")}
                          handleChange={(type, value) => handleChange(type, value, "incoming_cask_details")}
                          type="consignor_doc_rla"
                          status={get(error, "consignor_doc_rla") ? "error" : ""}
                          validateStatus={get(error, "consignor_doc_rla") && "error"}
                          helpText={get(error, "consignor_doc_rla") ? "RLA (Consignor Doc) is mandatory" : ""}
                          className="mt-0 mb-0 w-100"
                          label="RLA (Consignor Doc)"
                        />
                      </Col>
                    </Row>
                  </div>
                </div>
                <Spin tip="Loading..." spinning={loading}>
                  <div className="summary__additional_details" style={{ minWidth: checkScreenSize(1020) }}>
                    <div className="d-flex align-items-center  ">
                      <img src={SVGIcon.AssessmentIcon} alt="Additional Details" style={{ width: "24px", height: "24px" }} />
                      <span>Assessment</span>
                    </div>
                    <div className="log_entry__assessment">
                      <Row gutter={24}>
                        <Col xs={{ span: 12 }} md={{ span: 6 }}>
                          <p className="log_entry__assessment__label">Est. Tare Weight (kg)</p>
                          <p className="log_entry__assessment__value">{getValue(get(logEntryValues, "assessment.estimated_tare_weight"), "Assessment")} </p>
                        </Col>
                        <Col xs={{ span: 12 }} md={{ span: 6 }}>
                          <p className="log_entry__assessment__label">Net Weight (kg)</p>
                          <p className="log_entry__assessment__value">{getValue(get(logEntryValues, "assessment.nett_weight"), "Assessment")} </p>
                        </Col>
                        <Col xs={{ span: 12 }} md={{ span: 6 }}>
                          <p className="log_entry__assessment__label">Est. RLA (L)</p>
                          <p className="log_entry__assessment__value">{getValue(get(logEntryValues, "assessment.estimated_tares_rla"), "Assessment")} </p>
                        </Col>
                        <Col xs={{ span: 12 }} md={{ span: 6 }}>
                          <p className="log_entry__assessment__label">Difference</p>
                          <p className="log_entry__assessment__value">{getValue(get(logEntryValues, "assessment.difference"), "Assessment")} </p>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </Spin>
                <div className="summary__additional_details" style={{ minWidth: checkScreenSize(1020) }}>
                  <div className="d-flex align-items-center  ">
                    <img src={SVGIcon.SebringDetailsIcon} alt="Additional Details" style={{ width: "24px", height: "24px" }} />
                    <span> Sebring Details</span>
                  </div>
                  <div className="log_entry__assessment">
                    <Row gutter={24}>
                      <Col xs={{ span: 12 }} md={{ span: 8 }}>
                        <InputNumberChange
                          value={get(logEntryValues, "sebring_details.sebring_original_rla", "")}
                          handleChange={(type, value) => handleChange(type, value, "sebring_details")}
                          type="sebring_original_rla"
                          className="mt-0 mb-0 w-100"
                          status={get(error, "sebring_original_rla") ? "error" : ""}
                          validateStatus={get(error, "sebring_original_rla") && "error"}
                          helpText={get(error, "sebring_original_rla") ? "Original RLA is mandatory" : ""}
                          label="Original RLA"
                        />
                      </Col>
                      <Col xs={{ span: 12 }} md={{ span: 8 }}>
                        <InputChange
                          value={get(logEntryValues, "sebring_details.sebring_original_strength", "")}
                          handleChange={(type, value) => handleChange(type, value, "sebring_details")}
                          type="sebring_original_strength"
                          className="mt-0 mb-0 w-100"
                          status={get(error, "sebring_original_strength") ? "error" : ""}
                          validateStatus={get(error, "sebring_original_strength") && "error"}
                          helpText={get(error, "sebring_original_strength") ? "Original Strength is mandatory" : ""}
                          label="Original Strength (%)"
                        />
                      </Col>
                      <Col xs={{ span: 12 }} md={{ span: 8 }}>
                        <CustomDatePicker
                          value={get(logEntryValues, "sebring_details.sebring_basis_date", "")}
                          handleChange={(type, value) => handleChange(type, value, "sebring_details")}
                          type="sebring_basis_date"
                          enableFutureDate={true}
                          placeholder="Basis Date"
                          status={get(error, "sebring_basis_date") ? "error" : ""}
                          validateStatus={get(error, "sebring_basis_date") && "error"}
                          helpText={get(error, "sebring_basis_date") ? "Basis Date is mandatory" : ""}
                          className="mt-0 mb-0 w-100"
                          label="Basis Date"
                        />
                      </Col>
                      {/* <Col span={8}>
                        <InputNumberChange
                          value={get(logEntryValues, "sebring_details.sebring_estimated_rla", "")}
                          handleChange={(type, value) => handleChange(type, value, "sebring_details")}
                          type="sebring_estimated_rla"
                          disabled
                          className="mt-0 mb-0 w-100"
                          label="Est. RLA"
                        />
                      </Col> */}
                    </Row>
                    <Spin tip="Loading..." spinning={loading}>
                      <Row gutter={24}>
                        <Col xs={{ span: 12 }} md={{ span: 4 }}>
                          <p className="log_entry__assessment__label">Sebring Est. RLA</p>
                          <p className="log_entry__assessment__value">{getValue(get(logEntryValues, "sebring_details.sebring_estimated_rla"), "sebring_details")} </p>
                        </Col>
                        <Col xs={{ span: 12 }} md={{ span: 4 }}>
                          <p className="log_entry__assessment__label">Difference</p>
                          <p className="log_entry__assessment__value">{getValue(get(logEntryValues, "sebring_details.diff_of_sebring_estimated"), "sebring_details")}</p>
                        </Col>
                        <Col xs={{ span: 12 }} md={{ span: 4 }}>
                          <p className="log_entry__assessment__label">Discrepancy (%)</p>
                          <p className="log_entry__assessment__value" style={{ color: getDiscrepancyColor(get(logEntryValues, "sebring_details.discrepancy_as_age_percent")) }}>
                            {getValue(get(logEntryValues, "sebring_details.discrepancy_as_age_percent"), "sebring_details")}
                          </p>
                        </Col>
                        <Col xs={{ span: 12 }} md={{ span: 4 }}>
                          <p className="log_entry__assessment__label">Time Difference </p>
                          <p className="log_entry__assessment__value">{getValue(get(logEntryValues, "sebring_details.difference_in_days"), "sebring_details")}</p>
                        </Col>
                        <Col xs={{ span: 12 }} md={{ span: 4 }}>
                          <p className="log_entry__assessment__label">% Loss</p>
                          <p className="log_entry__assessment__value">{getValue(get(logEntryValues, "sebring_details.percent_loss"), "sebring_details")}</p>
                        </Col>
                        <Col xs={{ span: 12 }} md={{ span: 4 }}>
                          <p className="log_entry__assessment__label">Loss LOA </p>
                          <p className="log_entry__assessment__value">{getValue(get(logEntryValues, "sebring_details.loss_loa"), "sebring_details")}</p>
                        </Col>
                      </Row>
                    </Spin>
                  </div>
                </div>

                <div className="summary__additional_details_last" style={{ minWidth: checkScreenSize(1020) }}>
                  <Row className="mt-4">
                    <Col xs={{ span: 24 }}>
                      <div className="common_card_section">
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <img src={SVGIcon.AddIcon} alt="Add Images" style={{ width: "24px", height: "24px" }} className="heding_icon" />
                          <span style={{ fontWeight: 700, fontSize: 20, marginLeft: "10px" }}>Add Images</span>
                        </div>
                        <div className={defaultImageFileList.length > 0 && "image_uploded"}>
                          <Upload
                            multiple={true}
                            listType="picture-card"
                            onChange={(info) => {
                              if (beforeUpload(get(info, "file"))) {
                                if (get(info, "fileList", []).length === 0) {
                                  setIsImageUploaded(false);
                                }
                                setDefaultImageFileList(info.fileList);
                              }
                            }}
                            customRequest={(options) => {
                              if (checkFile(get(options, "file"))) {
                                uploadData(options, "image");
                              }
                            }}
                            showUploadList={false}
                            className={`${defaultImageFileList.length === 0 ? "add__images__upload_section" : ""} avatar-uploader mt-4`}
                            fileList={defaultImageFileList}
                            onPreview={handlePreview}
                          >
                            {defaultImageFileList.length >= 8 ? null : isImageUploaded && uploadButton}
                            {!isImageUploaded && (
                              <div className="add__images__text">
                                <p className="ant-upload-drag-icon">
                                  <img src={SVGIcon.CameraIcon} alt="upload document" style={{ width: "24px", height: "24px", marginBottom: 13 }} />
                                </p>
                                <p className="ant-upload-text">Drag and drop or Browse your </p>
                                <p className="ant-upload-text"> photos to start uploading </p>
                              </div>
                            )}
                          </Upload>
                          {defaultImageFileList.length > 0 && <UploadImages dataSource={imagesList} showTag={false} />}
                        </div>
                        <Modal centered open={previewVisible} title={previewTitle} footer={null} onCancel={handleCancel}>
                          <img alt="example" style={{ width: "100%" }} src={previewImage} />
                        </Modal>
                      </div>
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 11 }}>
                      <div className="common_card_section">
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <img src={SVGIcon.UploadDocumentIcon} alt="upload document" style={{ width: "24px", height: "24px" }} className="heding_icon" />
                          <span style={{ fontWeight: 700, fontSize: 15, marginLeft: "10px" }}>Upload Documents</span>
                        </div>
                        <span style={{ fontWeight: 700, fontSize: 16 }}></span>
                        <Dragger {...documentProps} className={`${defaultDocumentFileList.length > 0 && getScreenSize() < isMobileOrTab && "upload_documents_mobile_screen"} mt-4`}>
                          {defaultDocumentFileList.length > 0 && getScreenSize() < isMobileOrTab ? (
                            <div className="ant-upload-mobile-icon">
                              <PlusCircleOutlined /> <h6> Upload Document</h6>
                            </div>
                          ) : (
                            <>
                              <p className="ant-upload-drag-icon">
                                <FolderAddOutlined />
                              </p>
                              <p className="ant-upload-text">Drag and drop or Browse your documents</p>
                              <p className="ant-upload-text"> or photos to start uploading </p>
                            </>
                          )}
                        </Dragger>
                        {documentsUploaded.length > 0 && (
                          <div style={{ marginTop: 24 }}>
                            {progress > 0 ? <Progress size="small" className="mb-2" percent={progress} /> : null}
                            <EditableDocument
                              dataSource={documentsUploaded}
                              handleDocuments={(doc) => {
                                const imagesDoc = get(logEntryValues, "files", []).filter((item) => item.document_type === "image");
                                let newValue = { ...logEntryValues };
                                let newUploadedValue = [...imagesDoc, ...doc];
                                newValue["files"] = newUploadedValue;
                                setLogEntryValues(newValue);
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 12, offset: 1 }}>
                      <div className="common_card_section">
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <img src={SVGIcon.AddNotesIcon} alt="add notes" style={{ width: "24px", height: "24px" }} className="heding_icon" />
                          <span style={{ fontWeight: 700, fontSize: 15, marginLeft: "10px" }}>Add Notes</span>
                        </div>

                        <Form.Item className="mb-0" validateStatus={get(error, "notes") && "error"} help={get(error, "notes") ? "Notes is mandatory" : ""}>
                          <TextArea
                            rows={4}
                            placeholder="Enter Notes"
                            status={get(logEntryValues, "notes") ? "error" : ""}
                            value={get(logEntryValues, "notes", "")}
                            onChange={(e) => handleChange("notes", e.target.value)}
                            className="mt-4"
                          />
                        </Form.Item>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
            <div className="mt-4 footer_cta">
              <div style={{ minWidth: checkScreenSize(1020) }}>
                <Button
                  type="primary"
                  className="ml-3 float-right"
                  onClick={() => {
                    setAppLoader(true);
                    handleGateEntryDataSubmit();
                  }}
                  icon={<SaveOutlined />}
                >
                  Save to CRR List
                </Button>
                <Button type="secondary" icon={<CloseCircleOutlined />} ghost className="float-right">
                  Cancel
                </Button>
              </div>
            </div>
          </ErrorBoundary>
        </div>
      </AppCaskLoader>
    </>
  );
};

export default LogGateEntrySummary;
