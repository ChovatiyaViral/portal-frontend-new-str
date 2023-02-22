import { FolderAddOutlined, LeftOutlined, PlusCircleOutlined, SaveOutlined, EyeOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Button, Col, Input, List, Modal, Progress, Row, Tooltip, Upload } from "antd";
import axios from "axios";
import { get } from "lodash";
import moment from "moment";
import React from "react";
import { isMobileOrTab } from "../../../../../constants";
import SVGIcon from "../../../../../constants/svgIndex";
import { getRequestHeader } from "../../../../../helpers/service";
import { getBlobURL, getScreenSize, getValue } from "../../../../../helpers/utility";
import DocumentsListView from "../../../../CommonComponents/Upload/documentsView";
import EditableDocument from "../../../../CommonComponents/Upload/editableDocument";
import ImageListView from "../../../../CommonComponents/Upload/imagesListView";
import UploadImages from "../../../../CommonComponents/Upload/imagesView";
import ErrorBoundary from "../../../../UIComponents/ErrorBoundary";
import { openNotificationWithIcon } from "../../../../UIComponents/Toast/notification";
import "./index.scss";
import RegaugingConfirmationModal from "./regaugingConfirmationModal";

const { TextArea } = Input;
const { Dragger } = Upload;

let uploadedDoc = [];

/**
 * Renders Cask Profile Action Items Component
 */
const CaskActionItems = (props) => {
  const [isImageUploaded, setIsImageUploaded] = React.useState(false);
  const [defaultImageFileList, setDefaultImageFileList] = React.useState([]);
  const [defaultDocumentFileList, setDefaultDocumentFileList] = React.useState([]);
  const [progress, setProgress] = React.useState(0);
  const [previewVisible, setPreviewVisible] = React.useState(false);
  const [previewImage, setPreviewImage] = React.useState("");
  const [previewTitle, setPreviewTitle] = React.useState("");
  const [imagesList, setImagesList] = React.useState([]);
  const [isDocumentListVisible, setIsDocumentListVisible] = React.useState(false);
  const [isImageListVisible, setIsImageListVisible] = React.useState(false);

  const [uploadedDocumentFileList, setUploadedDocumentFileList] = React.useState([]);
  const [uploadedDocumentFileListLoader, setUploadedDocumentFileListLoader] = React.useState(false);

  const [uploadedImageFileList, setUploadedImageFileList] = React.useState([]);
  const [uploadedImageFileListLoader, setUploadedImageFileListLoader] = React.useState(false);

  const [comments, setComments] = React.useState("");
  const [commentsLoader, setCommentsLoader] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);

  const handleCommentsSubmit = async () => {
    if (comments) {
      const rest = await axios({
        method: "POST",
        data: {
          cask_id: get(props, "caskDetails.cask_id"),
          comment: comments,
        },
        url: `${process.env.REACT_APP_API_ENDPOINT}/api/v1/cask/add_comment`,
        headers: { ...getRequestHeader() },
      }).catch((err) => {
        openNotificationWithIcon("error", "Cask Details Comments", `${get(err, "response.data.message", "Something Went Wrong")} `);
      });

      if (get(rest, "data.status")) {
        setComments("");
        setCommentsLoader(false);
        props.refetchCaskDetailsData();
        openNotificationWithIcon("success", "Cask Details Comments", get(rest, "data.message", "Comments updated successfully"));
      }

      if (!get(rest, "data.status", true)) {
        setCommentsLoader(false);
        openNotificationWithIcon("error", "Cask Details Comments", get(rest, "data.message", "Something Went Wrong"));
      }
    } else {
      openNotificationWithIcon("info", "Cask Details Comments", "Nothing to update");
      setCommentsLoader(false);
    }
  };

  const handleDocumentsSubmit = async (from = "image") => {
    let filesList = [];

    if (from === "document") {
      filesList = uploadedDocumentFileList.map((list) => {
        delete list["file_name"];
        return list;
      });
    } else {
      filesList = uploadedImageFileList.map((list) => {
        delete list["file_name"];
        return list;
      });
    }

    const rest = await axios({
      method: "POST",
      data: {
        cask_id: get(props, "caskDetails.cask_id"),
        files: filesList,
      },
      url: `${process.env.REACT_APP_API_ENDPOINT}/api/v1/cask/add_files`,
      headers: { ...getRequestHeader() },
    }).catch((err) => {
      openNotificationWithIcon("error", "Cask Details", `${get(err, "response.data.message", "Something Went Wrong")} `);
    });

    if (get(rest, "data.status")) {
      if (from === "document") {
        setUploadedDocumentFileList([]);
        setUploadedDocumentFileListLoader(false);
      } else {
        setIsImageUploaded(false);
        setDefaultImageFileList([]);
        setUploadedImageFileList([]);
        setUploadedImageFileListLoader(false);
      }
      uploadedDoc = [];
      setImagesList([]);
      props.refetchCaskDetailsData();
      openNotificationWithIcon("success", "Cask Details", get(rest, "data.message", "Files uploaded successfully"));
    }

    if (!get(rest, "data.status", true)) {
      if (from === "document") {
        setUploadedDocumentFileListLoader(false);
      } else {
        setUploadedImageFileListLoader(false);
      }
      openNotificationWithIcon("error", "Cask Details", get(rest, "data.message", "Something Went Wrong"));
    }
  };

  const handleChange = React.useCallback((key, value, from = "image") => {
    let newValue = [];
    if (from === "document") {
      newValue = [...uploadedDocumentFileList];
    } else {
      newValue = [...uploadedImageFileList];
    }

    if (key === "files") {
      newValue = [...newValue, ...value];
    } else {
      newValue[key] = value;
    }

    if (from === "document") {
      setUploadedDocumentFileList(newValue);
    } else {
      setUploadedImageFileList(newValue);
    }
  });

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
  const handleCancel = () => setPreviewVisible(false);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf("/") + 1));
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
    const file_path = `test_cask_upload/${datePath}/`;

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
        getAllImages(uploadedDoc);
        handleChange("files", uploadedDoc, from);

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

  const getAllImages = async (imgListing, setRule = true) => {
    let imageUploaded = imgListing ? imgListing : uploadedImages;
    const allImages = await Promise.all(
      imageUploaded.map(async (list) => {
        const uri = await getImageFromS3(get(list, "document_url"));
        return uri;
      })
    );
    if (setRule) {
      if (allImages.length > 0) {
        setImagesList(allImages);
      }
    }
    return allImages;
  };

  const uploadedDocList = get(props, "caskDetails.all_files", []).filter((item) => item.document_type === "document");
  const uploadedImages = get(props, "caskDetails.all_files", []).filter((item) => item.document_type === "image");

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <>
      <RegaugingConfirmationModal showModal={showModal} toggleModal={toggleModal} />
      {isDocumentListVisible || isImageListVisible ? (
        <>
          <div className="back_to_list">
            <a onClick={() => (isDocumentListVisible ? setIsDocumentListVisible(false) : setIsImageListVisible(false))}>
              <LeftOutlined style={{ paddingRight: 24 }} />
              Back to action items
            </a>
          </div>
          {isDocumentListVisible && <DocumentsListView docList={uploadedDocList} />}
          {isImageListVisible && <ImageListView imgList={uploadedImages} />}
        </>
      ) : (
        <div className="table-responsive-padding">
          <ErrorBoundary>
            <Row>
              <Col md={{ span: 19 }}>
                <Row gutter={[16, 0]}>
                  <Col flex="100%">
                    <div className="common_card_section">
                      <div className="d-flex align-items-center mb-3">
                        <img src={SVGIcon.Barrel1Icon} alt="Overall Rating" className="mr-2" style={{ width: "24px", height: "24px" }} />
                        <span style={{ fontWeight: 700, fontSize: 16 }}>Cask Status</span>
                      </div>
                      <p className="summary__card_content__title mb-3">Cask is currently in-house</p>
                      <Row gutter={[16, 16]}>
                        <Col xs={{ span: 24 }} md={{ span: 4 }}>
                          <p className="summary__card_content__title">Status</p>
                          <Tooltip placement="topLeft" title={getValue(get(props, "caskDetails.cask_status"))}>
                            <p className="summary__card_content__value">{getValue(get(props, "caskDetails.cask_status"))}</p>
                          </Tooltip>
                        </Col>
                        <Col xs={{ span: 24 }} md={{ span: 4 }}>
                          <p className="summary__card_content__title">Located at</p>
                          <Tooltip placement="topLeft" title={getValue(get(props, "caskDetails.dt_location"))}>
                            <p className="summary__card_content__value">{getValue(get(props, "caskDetails.dt_location"))}</p>
                          </Tooltip>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                  <Col flex="100%">
                    <div className="common_card_section">
                      <div className="d-flex align-items-center mb-3">
                        <img src={SVGIcon.AddNotesIcon} alt="Overall Rating" className="mr-2" style={{ width: "24px", height: "24px" }} />
                        <span style={{ fontWeight: 700, fontSize: 16 }}>Notes</span>
                      </div>
                      <div className="p-3">
                        <p className="summary__card_content__value">{get(props, "caskDetails.notes", "")}</p>
                      </div>
                    </div>
                  </Col>
                  <Col flex="100%">
                    <div className="common_card_section">
                      <div className="d-flex align-items-center mb-3">
                        <img src={SVGIcon.CommentsIcon} alt="Overall Rating" className="mr-2" style={{ width: "24px", height: "24px" }} />
                        <span style={{ fontWeight: 700, fontSize: 16 }}>Comments({get(props, "caskDetails.all_comments", []).length})</span>
                      </div>
                      <>
                        <TextArea rows={5} placeholder="Enter Comments" value={comments} className="mb-4" onChange={(e) => setComments(e.target.value)} />
                        <List
                          size="large"
                          className="cask_action_items__cask_comments"
                          bordered={false}
                          pagination={{
                            onChange: (page) => {
                              // eslint-disable-next-line no-console
                              console.log(page);
                            },
                            size: "small",
                            pageSize: 2,
                          }}
                          dataSource={get(props, "caskDetails.all_comments")}
                          renderItem={(item) => (
                            <List.Item>
                              <div className="cask_action_items__cask_comments_item">
                                <p className="content_1">{get(item, "user_comments", "")}</p>
                                <p className="content_2">
                                  Last updated on {get(item, "created_at", "")} by {get(item, "created_by", "")}
                                </p>
                              </div>
                            </List.Item>
                          )}
                        />
                        <Button
                          type="primary"
                          className="d-flex ml-auto mt-4"
                          loading={commentsLoader}
                          onClick={() => {
                            setCommentsLoader(true);
                            handleCommentsSubmit();
                          }}
                          icon={<SaveOutlined />}
                        >
                          Save
                        </Button>
                      </>
                    </div>
                  </Col>
                  <Col flex="100%">
                    <div className="common_card_section">
                      <div className="d-flex align-items-center mb-3">
                        <img src={SVGIcon.UploadDocumentIcon} alt="Overall Rating" className="mr-2" style={{ width: "24px", height: "24px" }} />
                        <span style={{ fontWeight: 700, fontSize: 16 }}>Documents</span>
                      </div>
                      <div>
                        <div className={`w-100 upload-document-box ${!uploadedDocumentFileList.length > 0 && "doc_not_uploaded"}`}>
                          <Dragger {...documentProps}>
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
                                  setUploadedDocumentFileList(doc);
                                }}
                              />
                            </div>
                          )}
                        </div>

                        <Button type="primary" icon={<EyeOutlined />} onClick={() => setIsDocumentListVisible(!isDocumentListVisible)} className="mt-4 comment_view_btn" ghost>
                          View all
                        </Button>
                        <Button
                          type="primary"
                          className="mt-4 float-right"
                          loading={uploadedDocumentFileListLoader}
                          onClick={() => {
                            setUploadedDocumentFileListLoader(true);
                            handleDocumentsSubmit();
                          }}
                          icon={<SaveOutlined />}
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  </Col>
                  <Col flex="100%">
                    <div className="common_card_section">
                      <div className="d-flex align-items-center mb-3">
                        <img src={SVGIcon.AddIcon} alt="Overall Rating" className="mr-2" style={{ width: "24px", height: "24px" }} />
                        <span style={{ fontWeight: 700, fontSize: 16 }}>Images</span>
                      </div>
                      <div>
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
                            className={`${defaultImageFileList.length === 0 ? "add__images__upload_section" : ""} avatar-uploader`}
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
                        <Button type="primary" icon={<EyeOutlined />} onClick={() => setIsImageListVisible(!isImageListVisible)} className="mt-4 comment_view_btn" ghost>
                          View all
                        </Button>
                        <Button
                          type="primary"
                          className="mt-4 float-right"
                          loading={uploadedImageFileListLoader}
                          onClick={() => {
                            setUploadedImageFileListLoader(true);
                            handleDocumentsSubmit();
                          }}
                          icon={<SaveOutlined />}
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Col>
              {getScreenSize() > isMobileOrTab && (
                <Col md={{ span: 5 }}>
                  <div style={{ marginLeft: 30 }}>
                    <Button type="primary" icon={<img src={SVGIcon.DownloadIcon} />} className="achive_cask_btn w-100">
                      Archive Cask
                    </Button>
                    <Button type="secondary" icon={<CloseCircleOutlined />} className="mb-3 cancel_cask_btn w-100 mt-1">
                      Cancel
                    </Button>
                    <div className="cask_menu">
                      <ul>
                        <li>
                          <div className="menu_icon">
                            <img src={SVGIcon.GateEntryMenuIcon} />
                          </div>
                          <h5>Gate Entry</h5>
                        </li>
                        <li>
                          <div className="menu_icon">
                            <img src={SVGIcon.sampleMenuIcon} />
                          </div>
                          <h5>Sampling Data</h5>
                        </li>
                        <li className="active" onClick={() => toggleModal()}>
                          <div className="menu_icon">
                            <img src={SVGIcon.ReguageMenuIcon} />
                          </div>
                          <h5>Regauging</h5>
                        </li>
                      </ul>
                    </div>
                  </div>
                </Col>
              )}
            </Row>
          </ErrorBoundary>
        </div>
      )}
    </>
  );
};

export default CaskActionItems;
