import { FolderAddOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Col, Form, Input, message, Modal, Progress, Row, Upload } from "antd";
import axios from "axios";
import { get } from "lodash";
import moment from "moment";
import React from "react";
import SVGIcon from "../../../../../constants/svgIndex";
import { getRequestHeader } from "../../../../../helpers/service";
import EditableDocument from "../../../../CommonComponents/Upload/editableDocument";
import UploadImages from "../../../../CommonComponents/Upload/imagesView";
import ErrorBoundary from "../../../../UIComponents/ErrorBoundary";
import "./index.scss";

const { TextArea } = Input;
const { Dragger } = Upload;

let uploadedDoc = [];

/**
 * Renders Additional Details Component
 */
const AdditionalDetails = (props) => {
  const [previewVisible, setPreviewVisible] = React.useState(false);
  const [previewImage, setPreviewImage] = React.useState("");
  const [previewTitle, setPreviewTitle] = React.useState("");

  const [isImageUploaded, setIsImageUploaded] = React.useState(false);
  const [defaultImageFileList, setDefaultImageFileList] = React.useState([]);
  const [defaultDocumentFileList, setDefaultDocumentFileList] = React.useState([]);
  const [progress, setProgress] = React.useState(0);

  const [uploadedDocumentFileList, setUploadedDocumentFileList] = React.useState([]);

  const handleChange = React.useCallback((key, value) => {
    let newValue = { ...get(props, "additional_details", {}) };
    if (key === "files") {
      newValue[key] = value;
      // newValue[key] = [...get(props, "additional_details.files", []), value];
    } else {
      newValue[key] = value;
    }
    props.handleChange("additional_details", newValue, "additional_details");
  });

  React.useEffect(() => {
    const uploadedDoc = get(props, "additional_details.files", []).filter((item) => item.document_type !== "image");
    setUploadedDocumentFileList(uploadedDoc);
  }, [props]);

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => resolve(reader.result);

      reader.onerror = (error) => reject(error);
    });

  const beforeUpload = (file) => {
    if (!checkFile(file)) {
      message.error("You can only upload JPG/PNG file!");
    }

    if (!checkFile(file)) {
      message.error("Image must smaller than 2MB!");
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
          fontFamily: "Inter",
          fontWeight: 500,
          fontSize: 12,
          letterSpacing: "-0.01em",
          textDecorationLine: "underline",
          color: "#38479E",
        }}
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

  const uploadData = async (options, from) => {
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
          document_type: from === "image" ? "image" : "document",
        };

        uploadedDoc = [...uploadedDoc, requestObj];
        handleChange("files", uploadedDoc);

        if (from === "image") {
          setIsImageUploaded(true);
        }
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log("Error: ", err);
      onError({ err });
    }
  };

  return (
    <>
      <ErrorBoundary>
        <div className="common_card_section">
          <div style={{ display: "flex", alignItems: "center" }}>
            <img src={SVGIcon.AdditionalDetailsIcon} alt="Additional Details" style={{ width: "24px", height: "24px" }} />
            <span style={{ fontWeight: 700, fontSize: 20, marginLeft: "10px" }}>Additional Details</span>
          </div>

          <div className="summary__additional_details_last">
            <Row className="mt-4">
              <Col sm={{ span: 24 }}>
                <div className="common_card_section image_upload_section">
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img src={SVGIcon.AddIcon} alt="Add Images" style={{ width: "24px", height: "24px" }} />
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
                    {defaultImageFileList.length > 0 && <UploadImages dataSource={defaultImageFileList} />}
                  </div>
                  <Modal centered open={previewVisible} title={previewTitle} footer={null} onCancel={handleCancel}>
                    <img alt="example" style={{ width: "100%" }} src={previewImage} />
                  </Modal>
                </div>
              </Col>
              <Col xs={{ span: 24 }} sm={{ span: 11 }}>
                <div className="common_card_section">
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img src={SVGIcon.UploadDocumentIcon} alt="upload document" style={{ width: "24px", height: "24px" }} />
                    <span style={{ fontWeight: 700, fontSize: 15, marginLeft: "10px" }}>Upload Documents</span>
                  </div>
                  <span style={{ fontWeight: 700, fontSize: 16 }}></span>
                  <Dragger {...documentProps} className="mt-4">
                    <p className="ant-upload-drag-icon">
                      <FolderAddOutlined />
                    </p>
                    <p className="ant-upload-text">Drag and drop or Browse your documents</p>
                    <p className="ant-upload-text"> or photos to start uploading </p>
                  </Dragger>
                  {uploadedDocumentFileList.length > 0 && (
                    <div style={{ marginTop: 24 }}>
                      {progress > 0 ? <Progress size="small" className="mb-2" percent={progress} /> : null}
                      <EditableDocument
                        dataSource={uploadedDocumentFileList}
                        handleDocuments={(doc) => {
                          const imagesDoc = get(props, "additional_details.files", []).filter((item) => item.document_type === "image");
                          let newValue = { ...get(props, "additional_details", {}) };
                          newValue["files"] = [...imagesDoc, ...doc];
                          props.handleChange("additional_details", newValue);
                        }}
                      />
                    </div>
                  )}
                </div>
              </Col>
              <Col xs={{ span: 24 }} sm={{ span: 12, offset: 1 }}>
                <div className="common_card_section" style={{ padding: "25px 25px 14px 25px" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img src={SVGIcon.AddNotesIcon} alt="add notes" style={{ width: "24px", height: "24px" }} />
                    <span style={{ fontWeight: 700, fontSize: 15, marginLeft: "10px" }}>Add Notes</span>
                  </div>
                  <Form.Item className="mb-0" validateStatus={get(props, "error.additional_details.notes") && "error"} help={get(props, "error.additional_details.notes") ? "Notes is mandatory" : ""}>
                    <Input.TextArea
                      rows={4}
                      placeholder="Enter Notes"
                      status={get(props, "error.additional_details.notes") ? "error" : ""}
                      value={get(props, "additional_details.notes", "")}
                      onChange={(e) => handleChange("notes", e.target.value)}
                      className="mt-4"
                    />
                  </Form.Item>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </ErrorBoundary>
    </>
  );
};

export default AdditionalDetails;
