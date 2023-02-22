import { FolderAddOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Col, Form, Input, message, Modal, Progress, Row, Spin, Upload } from "antd";
import axios from "axios";
import { get } from "lodash";
import moment from "moment";
import React from "react";
import { isMobileOrTab } from "../../../constants";
import SVGIcon from "../../../constants/svgIndex";
import { useWindowSize } from "../../../helpers/checkScreenSize";
import { getRequestHeader } from "../../../helpers/service";
import { getBlobURL, getScreenSize } from "../../../helpers/utility";
import { openNotificationWithIcon } from "../../UIComponents/Toast/notification";
import EditableDocument from "./editableDocument";
import UploadImages from "./imagesView";

const { Dragger } = Upload;
const { TextArea } = Input;

let uploadedDoc = [];

const UploadDocument = (props) => {
  const [width] = useWindowSize();

  const [logEntryValues, setLogEntryValues] = React.useState({ files: [], notes: "" });
  const [previewVisible, setPreviewVisible] = React.useState(false);
  const [isImageUploaded, setIsImageUploaded] = React.useState(false);
  const [isDocumentUploaded, setIsDocumentUploaded] = React.useState(false);
  const [previewImage, setPreviewImage] = React.useState("");
  const [previewTitle, setPreviewTitle] = React.useState("");
  const [imagesList, setImagesList] = React.useState([]);
  const [imageProgress, setImageProgress] = React.useState(false);

  const [defaultImageFileList, setDefaultImageFileList] = React.useState([]);
  const [defaultDocumentFileList, setDefaultDocumentFileList] = React.useState([]);
  const [progress, setProgress] = React.useState(0);

  const documentsUploaded = get(logEntryValues, "files", []).filter((item) => item.document_type === "document");
  const uploadedImages = get(logEntryValues, "files", []).filter((item) => item.document_type === "image");

  const checkScreenSize = (cardWidth) => {
    if (width > 1500) {
      return cardWidth;
    }
    return "auto";
  };

  const beforeUpload = (file) => {
    if (!checkFile(file)) {
      message.error("You can only upload JPG/PNG file smaller than 2MB!");
    }

    return checkFile(file);
  };

  const checkFile = (file) => {
    const isJpgOrPng = file.type === "image/jpg" || file.type === "image/jpeg" || file.type === "image/png";
    const isLt5M = file.size / 1024 / 1024 < 5;

    if (!isJpgOrPng) {
      return false;
    }

    if (!isLt5M) {
      return false;
    }

    return isJpgOrPng && isLt5M;
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

        uploadedDoc = [...get(logEntryValues, "files", []), requestObj];
        handleChange("files", uploadedDoc);

        if (document_type === "document") {
          setIsDocumentUploaded(true);
        }

        if (document_type === "image") {
          setImageProgress(false);
          const uploadedImages = uploadedDoc.filter((item) => item.document_type === "image");
          getAllImages(uploadedImages);
          setIsImageUploaded(true);
        }
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log("Error: ", err);
      onError({ err });
    }
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

    setLogEntryValues(newValue);
    props.handleChange(newValue);
  });

  const getAllImages = async (imgListing) => {
    let imageUploaded = imgListing ? imgListing : uploadedImages;
    const allImages = await Promise.all(
      imageUploaded.map(async (list) => {
        const uri = await getImageFromS3(get(list, "document_url"));
        return uri;
      })
    );
    
    if (allImages.length > 0) {
      setDefaultImageFileList(allImages);
      setIsImageUploaded(true);
      setImagesList(allImages);
    }
  };

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

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf("/") + 1));
  };

  const handleRemove = async (file) => {
    let newValue = { ...logEntryValues };
    const docArr = get(newValue, "files", []).filter((item) => item.document_type === "document");
    const imagesDoc = get(newValue, "files", []).filter((item) => item.document_type === "image");
    const newData = imagesDoc.filter((item) => item.file_name !== get(file, "name"));

    let newUploadedValue = [...docArr, ...newData];
    newValue["files"] = newUploadedValue;
    props.handleChange(newValue);
    setLogEntryValues(newValue);
  };

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => resolve(reader.result);

      reader.onerror = (error) => reject(error);
    });

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

  React.useState(() => {
    setLogEntryValues(get(props, "data"), { files: [], notes: "" });
  }, [props.data]);

  React.useEffect(() => {
    getAllImages(uploadedImages);
  }, []);

  return (
    <div className="summary__additional_details_last" style={{ minWidth: checkScreenSize(1020) }}>
      <Row className="mt-4" gutter={[16, 8]}>
        <Col xs={{ span: 24 }} sm={{ span: 8 }}>
          <div className="common_card_section">
            <div className="d-flex align-items-center mb-2">
              <img src={SVGIcon.AddIcon} alt="Add Images" style={{ width: "24px", height: "24px" }} className="heding_icon" />
              <span style={{ fontWeight: 700, fontSize: 15, marginLeft: "10px" }}>Add Images</span>
            </div>
            <Spin spinning={imageProgress}>
              <div className={defaultImageFileList.length > 0 ? "image_uploded" : ""}>
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
                      setIsDocumentUploaded(false);
                      setImageProgress(true);
                      uploadData(options, "image");
                    }
                  }}
                  showUploadList={false}
                  className={`${defaultImageFileList.length === 0 ? "add__images__upload_section" : ""} avatar-uploader`}
                  fileList={defaultImageFileList}
                  onPreview={handlePreview}
                  onRemove={handleRemove}
                >
                  {isImageUploaded ? (
                    uploadButton
                  ) : (
                    <div className="add__images__text">
                      <p className="ant-upload-drag-icon">
                        <img src={SVGIcon.CameraIcon} alt="upload document" style={{ width: "24px", height: "24px", marginBottom: 13 }} />
                      </p>
                      <p className="ant-upload-text">Drag and drop or Browse your </p>
                      <p className="ant-upload-text"> photos to start uploading </p>
                    </div>
                  )}
                </Upload>
                {imagesList.length > 0 && <UploadImages dataSource={imagesList} showTag={false} />}
              </div>
              <Modal centered open={previewVisible} title={previewTitle} footer={null} onCancel={handleCancel}>
                <img alt="example" style={{ width: "100%" }} src={previewImage} />
              </Modal>
            </Spin>
          </div>
        </Col>
        <Col xs={{ span: 24 }} sm={{ span: 8 }}>
          <div className="common_card_section">
            <div className="d-flex align-items-center mb-2">
              <img src={SVGIcon.UploadDocumentIcon} alt="upload document" style={{ width: "24px", height: "24px" }} className="heding_icon" />
              <span style={{ fontWeight: 700, fontSize: 15, marginLeft: "10px" }}>Upload Documents</span>
            </div>
            <Dragger {...documentProps} className={`${defaultDocumentFileList.length > 0 && getScreenSize() < isMobileOrTab && "upload_documents_mobile_screen"}`}>
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
                {isDocumentUploaded && progress > 0 ? <Progress size="small" className="mb-2" percent={progress} /> : null}
                <EditableDocument
                  dataSource={documentsUploaded}
                  handleDocuments={(doc) => {
                    const imagesDoc = get(logEntryValues, "files", []).filter((item) => item.document_type === "image");
                    let newValue = { ...logEntryValues };
                    let newUploadedValue = [...imagesDoc, ...doc];
                    newValue["files"] = newUploadedValue;
                    props.handleChange(newValue);
                    setLogEntryValues(newValue);
                  }}
                />
              </div>
            )}
          </div>
        </Col>
        <Col xs={{ span: 24 }} sm={{ span: 8 }}>
          <div className="common_card_section">
            <div className="d-flex align-items-center mb-2">
              <img src={SVGIcon.AddNotesIcon} alt="add notes" style={{ width: "24px", height: "24px" }} className="heding_icon" />
              <span style={{ fontWeight: 700, fontSize: 15, marginLeft: "10px" }}>Add Notes</span>
            </div>

            <Form.Item className="mb-0">
              <TextArea rows={5} placeholder="Enter Notes" value={get(logEntryValues, "notes", "")} onChange={(e) => handleChange("notes", e.target.value)} className="mt-2" />
            </Form.Item>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default UploadDocument;
