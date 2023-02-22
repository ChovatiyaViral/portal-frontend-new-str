import { FolderAddOutlined, CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { Button, Col, Modal, Progress, Row, Select, Spin, Upload } from "antd";
import axios from "axios";
import { cloneDeep, get, has, omit } from "lodash";
import moment from "moment";
import React from "react";
import CommonService from "../../../../helpers/request/Common";
import { getRequestHeader, requestPath } from "../../../../helpers/service";
import EditableDocument from "../../../CommonComponents/Upload/editableDocument";
import { CustomInputText as InputChange, CustomInputTextArea as InputTextArea } from "../../../UIComponents/Input/customInput";
import { openNotificationWithIcon } from "../../../UIComponents/Toast/notification";
import { approveCaskDefaultValue } from "../constants";
import "./index.scss";

const { Dragger } = Upload;
const { Option } = Select;

let uploadedDoc = [];

const ActionCRRDetails = (props) => {
  const [warehouseListing, setWarehouseListing] = React.useState([]);
  const [actionValue, setActionValue] = React.useState({ ...cloneDeep(approveCaskDefaultValue) });
  const [progress, setProgress] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleChange = React.useCallback((key, value, type = "") => {
    let newValue = { ...actionValue };
    newValue[key] = value;
    setActionValue(newValue);
  });

  const getDTLocationList = async () => {
    await CommonService.getDataSource(requestPath.wareHouse.getDTLocation, {
      page: "all",
    })
      .then((list) => {
        setWarehouseListing(get(list, "data.data", []));
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.log("Warehouse listing CRR action", err);
      });
  };

  React.useEffect(() => {
    let newValue = { ...actionValue };
    newValue["dt_location"] = get(props, "record.cask_details.dt_location", "");
    setActionValue(newValue);
  }, [props]);

  React.useEffect(() => {
    getDTLocationList();
  }, []);

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

        handleChange("approval_documents", uploadedDoc);
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
      // eslint-disable-next-line no-console
      console.log("Files", info.fileList);
    },
    onDrop(e) {
      // eslint-disable-next-line no-console
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  const getRequestPayload = () => {
    const approvalDocumentsPayload = get(actionValue, "approval_documents", []).map((dataList) => {
      let newValue = { ...dataList };
      newValue = omit(newValue, "file_name");
      newValue = omit(newValue, "key");
      return newValue;
    });

    const requestPayload = {
      crr_id: get(props, "crr_id"),
      approve: get(props, "CRRStatus") === "approve" ? "yes" : "no",
      dt_location: get(actionValue, "dt_location", ""),
      dt_location_specifics: get(actionValue, "dt_location_specifics", ""),
      approval_documents: approvalDocumentsPayload,
      approval_notes: get(actionValue, "approval_notes", ""),
    };

    return requestPayload;
  };

  const handleGateEntryCaskApproveDataSubmit = async () => {
    const rest = await axios({
      method: "POST",
      data: getRequestPayload(),
      url: `${process.env.REACT_APP_API_ENDPOINT}/api/v1/crr/approve`,
      headers: { ...getRequestHeader() },
    }).catch((err) => {
      setIsLoading(false);
      openNotificationWithIcon("error", "CRR Details", `${get(err, "response.data.message", "Something Went Wrong")} `);
    });

    if (get(rest, "data.status")) {
      uploadedDoc = [];
      props.onClose();
      setIsLoading(false);
      openNotificationWithIcon("success", "CRR Details", `${get(rest, "data.message", "Updated successfully")} `);
      if (has(props, "history") && get(props, "CRRStatus") === "approve") {
        props.history.push("/cask-master-listing");
      }
    }

    if (!get(rest, "data.status", true)) {
      setIsLoading(false);
      openNotificationWithIcon("error", "CRR Details", `${get(rest, "data.message", "Something Went Wrong")} `);
    }
  };

  return (
    <>
      <Modal
        open={true}
        closable={false}
        centered
        maskClosable={false}
        keyboard={false}
        width={789}
        footer={[
          <Button type="secondary" onClick={() => props.onClose()} icon={<CloseCircleOutlined />}>
            Cancel
          </Button>,
          <Button
            key="OK"
            type="primary"
            onClick={() => {
              setIsLoading(true);
              handleGateEntryCaskApproveDataSubmit();
            }}
            icon={get(props, "CRRStatus") === "approve" ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
          >
            {get(props, "CRRStatus") === "approve" ? "Approve" : "Hold"}
          </Button>,
        ]}
        className="approve_gate_entry_modal"
      >
        <Spin spinning={isLoading}>
          <h1>{`Would you like to ${get(props, "CRRStatus")} gate entry for Cask Number ${get(props, "record.cask_details.cask_number")}?`}</h1>
          <h6>{`On ${get(props, "CRRStatus") === "approve" ? "approving" : "holding"} gate entry, you'll have to house the cask at your warehouse location.`}</h6>
          <Row gutter={[24, 24]}>
            <Col xs={{ span: 24 }} md={{ span: 11 }}>
              <label>Location:</label>
              <div className="location_select">
                <Select
                  style={{
                    width: "100%",
                  }}
                  required
                  disabled
                  value={get(actionValue, "dt_location", "")}
                  placeholder="Search to Select"
                  onChange={(value) => {
                    handleChange("dt_location", value);
                  }}
                >
                  {warehouseListing.map((list) => {
                    return (
                      <Option key={get(list, "location_name", "")} value={get(list, "location_name", "")}>
                        {get(list, "location_name", "")}
                      </Option>
                    );
                  })}
                </Select>
              </div>
            </Col>
            <Col xs={{ span: 24 }} md={{ span: 13 }}>
              <InputChange
                type="dt_location_specifics"
                className="mt-0 mb-0 w-100 location_input"
                label="Location specifics:"
                placeholder="Enter rack/room number"
                handleChange={handleChange}
                value={get(actionValue, "dt_location_specifics", "")}
                style={{ maxWidth: "100%" }}
              />
            </Col>
          </Row>
          <Row gutter={[24, 24]}>
            <Col xs={{ span: 24 }} md={{ span: 11 }}>
              <InputTextArea
                className="mt-0 mb-0 w-100 text_area mt-4"
                handleChange={handleChange}
                value={get(actionValue, "approval_notes", "")}
                type="approval_notes"
                label="Add Notes"
                placeholder="Click to add new notes"
                autoSize={false}
                style={{ maxWidth: "100%", minHeight: 142 }}
              />
            </Col>
            <Col xs={{ span: 24 }} md={{ span: 13 }}>
              <div className="add_document_section mt-4 mb-5">
                <h2>Add Documents</h2>
                <Dragger {...documentProps} className="mt-4">
                  <p className="ant-upload-drag-icon">
                    <FolderAddOutlined />
                  </p>
                  <p className="ant-upload-text">Drag and drop or Browse your documents</p>
                  <p className="ant-upload-text"> or photos to start uploading </p>
                </Dragger>
                {get(actionValue, "approval_documents", []).length > 0 && (
                  <div style={{ marginTop: 24 }}>
                    {progress > 0 ? <Progress size="small" className="mb-2" percent={progress} /> : null}
                    <EditableDocument
                      dataSource={get(actionValue, "approval_documents", [])}
                      handleDocuments={(doc) => {
                        let newValue = { ...actionValue };
                        newValue["approval_documents"] = doc;
                        setActionValue(newValue);
                      }}
                    />
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </Spin>
      </Modal>
    </>
  );
};

export default ActionCRRDetails;
