import { DownloadOutlined, PlusOutlined } from "@ant-design/icons";
import { Table } from "antd";
import { get } from "lodash";
import React from "react";
import { isMobileOrTab } from "../../../../../constants";
import SVGIcon from "../../../../../constants/svgIndex";
import DocumentService from "../../../../../helpers/request/Common/document";
import { getScreenSize } from "../../../../../helpers/utility";
import ErrorBoundary from "../../../../UIComponents/ErrorBoundary";
import { getRegaugingAdditionalData, getRegaugingDataObject } from "../helper";
import MobileComparisonDetails from "./mobileComparisonDetails";

const ComparisonDetails = (props) => {
  const [moreItemView, setMoreItemView] = React.useState("");

  const dataSource = getRegaugingDataObject(get(props, "details", []));
  const additionalDataSource = getRegaugingAdditionalData(get(props, "details", []));

  const getDocumentDownload = async (doc) => {
    await DocumentService.downloadDocument(doc);
  };

  const getObj = (name) => {
    const currentObj = get(props, "details", []).find((li) => {
      return get(li, "custom_cask_regauge_id") === name;
    });
    return currentObj;
  };

  const getLink = (name) => {
    const tempObj = getObj(name);
    if (get(tempObj, "completed_at")) {
      return (
        <a href={`/regauging/view-details/${get(tempObj, "regauging_id")}`} target="_blank">
          {name}
        </a>
      );
    } else {
      return <a>{name}</a>;
    }
  };

  const columns = [
    {
      title: "",
      dataIndex: "name",
      key: "name",
      render: (text, record) => <b>{text}</b>,
    },
    {
      title: "",
      dataIndex: "broken",
      key: "broken",
      className: "active_column",
      render: (text, record) => {
        switch (record.name) {
          case "":
            return (
              <div className="sampling_header">
                {getLink(text.name)}
                <p>{text.date}</p>
              </div>
            );
          case "Overall Rating":
            return <b>{text}</b>;
          case "Color":
            return (
              <div className="color_div">
                {text.color !== "NA" && <div className="color_box" style={{ backgroundColor: text.color ? text.color : "#FFF" }}></div>}
                <h5>{text.name ? text.name : "NA"}</h5>
              </div>
            );
          default:
            return text ? text : "NA";
        }
      },
    },
    {
      title: "",
      dataIndex: "bad",
      key: "bad",
      render: (text, record) => {
        switch (record.name) {
          case "":
            return (
              <div className="sampling_header">
                {getLink(text.name)}
                <p>{text.date}</p>
              </div>
            );
          case "Overall Rating":
            return <b>{text}</b>;
          case "Color":
            return (
              <div className="color_div">
                {text.color !== "NA" && <div className="color_box" style={{ backgroundColor: text.color }}></div>}
                <h5>{text.name}</h5>
                {/* <h6>{text.content}</h6> */}
              </div>
            );
          default:
            return text ? text : "NA";
        }
      },
    },
    {
      title: "",
      dataIndex: "okay",
      key: "okay",
      render: (text, record) => {
        switch (record.name) {
          case "":
            return (
              <div className="sampling_header">
                {getLink(text.name)}
                <p>{text.date}</p>
              </div>
            );
          case "Overall Rating":
            return <b>{text}</b>;
          case "Color":
            return (
              <div className="color_div">
                {text.color !== "NA" && <div className="color_box" style={{ backgroundColor: text.color }}></div>}
                <h5>{text.name}</h5>
                {/* <h6>{text.content}</h6> */}
              </div>
            );
          default:
            return text;
        }
      },
    },
    {
      title: "",
      dataIndex: "best",
      key: "best",
      render: (text, record) => {
        switch (record.name) {
          case "":
            return (
              <div className="sampling_header">
                {getLink(text.name)}
                <p>{text.date}</p>
              </div>
            );
          case "Overall Rating":
            return <b>{text}</b>;
          case "Color Chart":
            return (
              <div className="color_div">
                {text.color !== "NA" && <div className="color_box" style={{ backgroundColor: text.color }}></div>}
                <h5>{text.name}</h5>
                {/* <h6>{text.content}</h6> */}
              </div>
            );
          default:
            return text;
        }
      },
    },
  ];

  const additionalDetailsColumns = [
    {
      title: "",
      dataIndex: "name",
      key: "name",
      render: (text, record) => {
        switch (record.name) {
          case "Documents":
            return (
              <div className="document_header">
                <img src={SVGIcon.UploadDocumentIcon} alt="Images" style={{ width: "24px", height: "24px", marginRight: "10px" }} className="heding_icon" />
                {text}
              </div>
            );
          case "Images":
            return (
              <div className="document_header">
                <img src={SVGIcon.AddIcon} alt="Images" style={{ width: "24px", height: "24px", marginRight: "10px" }} className="heding_icon" />
                {text}
              </div>
            );
          case "Notes":
            return (
              <div className="document_header">
                <img src={SVGIcon.AddNotesIcon} alt="Images" style={{ width: "24px", height: "24px", marginRight: "10px" }} className="heding_icon" />
                {text}
              </div>
            );
          default:
            return text;
        }
      },
    },
    {
      render: (text, record) => {
        switch (get(record, "sectionOne.title")) {
          case "documents":
            return (
              <div className={`${moreItemView === "document1" && "view_document"} pdf_section`}>
                {(moreItemView === "document1" && get(record, "sectionOne.display", []).length > 3 ? get(record, "sectionOne.display", []) : get(record, "sectionOne.display", []).slice(0, 3)).map(
                  (item, index) => {
                    return (
                      <div key={index} className="pdf_titles">
                        <img src={SVGIcon.PDFIcon} alt="Images" style={{ width: "20px", height: "20px", marginRight: "7px" }} className="heding_icon" /> {item.document_name}
                        <DownloadOutlined onClick={() => getDocumentDownload(item)} />
                      </div>
                    );
                  }
                )}
                {get(record, "sectionOne.display", []).length > 3 && moreItemView !== "document1" ? (
                  <span className="more_item" onClick={() => setMoreItemView("document1")}>
                    <PlusOutlined />
                    {get(record, "sectionOne.display", []).length - 3} More
                  </span>
                ) : null}
                {get(record, "sectionOne.display", []).length === 0 && <span>NA</span>}
              </div>
            );
          case "image":
            return (
              <div className={`${moreItemView === "document2" && "view_document"} pdf_section`}>
                {(moreItemView === "document2" && get(record, "sectionOne.display", []).length > 3 ? get(record, "sectionOne.display", []) : get(record, "sectionOne.display", []).slice(0, 3)).map(
                  (item, index) => {
                    return (
                      <div key={index} className="pdf_titles">
                        <img src={SVGIcon.CaskImageIcon} alt="Images" style={{ width: "20px", height: "20px", marginRight: "7px" }} className="heding_icon" /> {item.document_name}{" "}
                        <DownloadOutlined onClick={() => getDocumentDownload(item)} />
                      </div>
                    );
                  }
                )}
                {get(record, "sectionOne.display", []).length > 3 && moreItemView !== "document2" ? (
                  <span className="more_item" onClick={() => setMoreItemView("document2")}>
                    <PlusOutlined />
                    {get(record, "sectionOne.display", []).length - 3} More
                  </span>
                ) : null}
                {get(record, "sectionOne.display", []).length === 0 && <span>NA</span>}
              </div>
            );
          case "notes":
            return <div className="notes_section">{get(record, "sectionOne.display", "")}</div>;
          default:
            return text;
        }
      },
    },
    {
      render: (text, record) => {
        switch (get(record, "sectionSecond.title")) {
          case "documents":
            return (
              <div className={`${moreItemView === "document3" && "view_document"} pdf_section`}>
                {(moreItemView === "document3" && get(record, "sectionSecond.display", []).length > 3
                  ? get(record, "sectionSecond.display", [])
                  : get(record, "sectionSecond.display", []).slice(0, 3)
                ).map((item, index) => {
                  return (
                    <div key={index} className="pdf_titles">
                      <img src={SVGIcon.PDFIcon} alt="Images" style={{ width: "20px", height: "20px", marginRight: "7px" }} className="heding_icon" /> {item.document_name}{" "}
                      <DownloadOutlined onClick={() => getDocumentDownload(item)} />
                    </div>
                  );
                })}
                {get(record, "sectionSecond.display", []).length > 3 && moreItemView === "document3" ? (
                  <span className="more_item" onClick={() => setMoreItemView("document3")}>
                    <PlusOutlined />
                    {get(record, "sectionSecond.display", []).length - 3} More
                  </span>
                ) : null}
                {get(record, "sectionSecond.display", []).length === 0 && <span>NA</span>}
              </div>
            );
          case "image":
            return (
              <div className={`${moreItemView === "document4" && "view_document"} pdf_section`}>
                {(moreItemView === "document4" && get(record, "sectionSecond.display", []).length > 3
                  ? get(record, "sectionSecond.display", [])
                  : get(record, "sectionSecond.display", []).slice(0, 3)
                ).map((item, index) => {
                  return (
                    <div key={index} className={`${moreItemView === "document1" && "view_document"} pdf_section`}>
                      <img src={SVGIcon.CaskImageIcon} alt="Images" style={{ width: "20px", height: "20px", marginRight: "7px" }} className="heding_icon" /> {item.document_name}{" "}
                      <DownloadOutlined onClick={() => getDocumentDownload(item)} />
                    </div>
                  );
                })}
                {get(record, "sectionSecond.display", []).length > 3 && moreItemView !== "document4" ? (
                  <span className="more_item" onClick={() => setMoreItemView("document4")}>
                    <PlusOutlined />
                    {get(record, "sectionSecond.display", []).length - 3} More
                  </span>
                ) : null}
                {get(record, "sectionSecond.display", []).length === 0 && <span>NA</span>}
              </div>
            );
          case "notes":
            return <div className="notes_section">{get(record, "sectionSecond.display", "")}</div>;
          default:
            return text;
        }
      },
    },
    {
      render: (text, record) => {
        switch (get(record, "sectionThird.title")) {
          case "documents":
            return (
              <div className={`${moreItemView === "document5" && "view_document"} pdf_section`}>
                {(moreItemView === "document5" && get(record, "sectionThird.display", []).length > 3
                  ? get(record, "sectionThird.display", [])
                  : get(record, "sectionThird.display", []).slice(0, 3)
                ).map((item, index) => {
                  return (
                    <div key={index} className="pdf_titles">
                      <img src={SVGIcon.PDFIcon} alt="Images" style={{ width: "20px", height: "20px", marginRight: "7px" }} className="heding_icon" /> {item.document_name}{" "}
                      <DownloadOutlined onClick={() => getDocumentDownload(item)} />
                    </div>
                  );
                })}
                {get(record, "sectionThird.display", []).length > 3 && moreItemView !== "document5" ? (
                  <span className="more_item" onClick={() => setMoreItemView("document5")}>
                    <PlusOutlined />
                    {get(record, "sectionThird.display", []).length - 3} More
                  </span>
                ) : null}
                {get(record, "sectionThird.display", []).length === 0 && <span>NA</span>}
              </div>
            );
          case "image":
            return (
              <div className={`${moreItemView === "document6" && "view_document"} pdf_section`}>
                {(moreItemView === "document6" && get(record, "sectionThird.display", []).length > 3
                  ? get(record, "sectionThird.display", [])
                  : get(record, "sectionThird.display", []).slice(0, 3)
                ).map((item, index) => {
                  return (
                    <div key={index} className="pdf_titles">
                      <img src={SVGIcon.CaskImageIcon} alt="Images" style={{ width: "20px", height: "20px", marginRight: "7px" }} className="heding_icon" /> {item.document_name}{" "}
                      <DownloadOutlined onClick={() => getDocumentDownload(item)} />
                    </div>
                  );
                })}
                {get(record, "sectionThird.display", []).length > 3 && moreItemView !== "document6" ? (
                  <span className="more_item" onClick={() => setMoreItemView("document6")}>
                    <PlusOutlined />
                    {get(record, "sectionThird.display", []).length - 3} More
                  </span>
                ) : null}
                {get(record, "sectionThird.display", []).length === 0 && <span>NA</span>}
              </div>
            );
          case "notes":
            return <div className="notes_section">{get(record, "sectionThird.display", "")}</div>;
          default:
            return text;
        }
      },
    },
    {
      render: (text, record) => {
        switch (get(record, "sectionFourth.title")) {
          case "documents":
            return (
              <div className={`${moreItemView === "document7" && "view_document"} pdf_section`}>
                {(moreItemView === "document7" && get(record, "sectionFourth.display", []).length > 3
                  ? get(record, "sectionFourth.display", [])
                  : get(record, "sectionFourth.display", []).slice(0, 3)
                ).map((item, index) => {
                  return (
                    <div key={index} className="pdf_titles">
                      <img src={SVGIcon.PDFIcon} alt="Images" style={{ width: "20px", height: "20px", marginRight: "7px" }} className="heding_icon" /> {item.document_name}{" "}
                      <DownloadOutlined onClick={() => getDocumentDownload(item)} />
                    </div>
                  );
                })}
                {get(record, "sectionFourth.display", []).length > 3 && moreItemView !== "document7" ? (
                  <span className="more_item" onClick={() => setMoreItemView("document7")}>
                    <PlusOutlined />
                    {get(record, "sectionFourth.display", []).length - 3} More
                  </span>
                ) : null}
                {get(record, "sectionFourth.display", []).length === 0 && <span>NA</span>}
              </div>
            );
          case "image":
            return (
              <div className={`${moreItemView === "document8" && "view_document"} pdf_section`}>
                {(moreItemView === "document8" && get(record, "sectionFourth.display", []).length > 3
                  ? get(record, "sectionFourth.display", [])
                  : get(record, "sectionFourth.display", []).slice(0, 3)
                ).map((item, index) => {
                  return (
                    <div key={index} className="pdf_titles">
                      <img src={SVGIcon.CaskImageIcon} alt="Images" style={{ width: "20px", height: "20px", marginRight: "7px" }} className="heding_icon" /> {item.document_name}{" "}
                      <DownloadOutlined onClick={() => getDocumentDownload(item)} />
                    </div>
                  );
                })}
                {get(record, "sectionFourth.display", []).length > 3 && moreItemView !== "document8" ? (
                  <span className="more_item" onClick={() => setMoreItemView("document8")}>
                    <PlusOutlined />
                    {get(record, "sectionFourth.display", []).length - 3} More
                  </span>
                ) : null}
                {get(record, "sectionFourth.display", []).length === 0 && <span>NA</span>}
              </div>
            );
          case "notes":
            return <div className="notes_section">{get(record, "sectionFourth.display", "")}</div>;
          default:
            return text;
        }
      },
    },
  ];

  return (
    <div className={`portal_styling__2  ${getScreenSize() > isMobileOrTab && "table-responsive-padding"}`} id="comparison_sampling_details">
      <ErrorBoundary>
        <div className={`summary__additional_details  comparison_card ${getScreenSize() > isMobileOrTab && "common_card_section"}`}>
          <div className="d-flex align-items-center mb-2">
            <img src={SVGIcon.ComparisonDetailsBarrelIcon} className="mr-2" alt="Cask Number" style={{ width: "24px", height: "24px" }} />
            <span style={{ fontWeight: 700, fontSize: 16 }}>Comparison Details</span>
          </div>
          <div className="additional_details_content comparison_table mt-3">
            {getScreenSize() > isMobileOrTab ? (
              <Table tableLayout="fixed" dataSource={dataSource} columns={columns} pagination={false} showHeader={false} bordered={true} />
            ) : (
              <MobileComparisonDetails comparisonDetails={dataSource} />
            )}
          </div>
        </div>
        {getScreenSize() > isMobileOrTab ? (
          <div className="summary__additional_details common_card_section">
            <div className="d-flex align-items-center mb-2">
              <img src={SVGIcon.AdditionalDetailsIcon} alt="Cask Number" className="mr-2" style={{ width: "24px", height: "24px" }} />
              <span style={{ fontWeight: 700, fontSize: 16 }}>Additional Details</span>
            </div>
            <div className="additional_details_content comparison_additional_details_table">
              <Table tableLayout="fixed" dataSource={additionalDataSource} columns={additionalDetailsColumns} pagination={false} showHeader={false} bordered={true} />
            </div>
          </div>
        ) : null}
      </ErrorBoundary>
    </div>
  );
};

export default ComparisonDetails;
