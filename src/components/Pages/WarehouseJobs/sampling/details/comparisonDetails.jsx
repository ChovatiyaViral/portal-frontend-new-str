import { DownloadOutlined, PlusOutlined } from "@ant-design/icons";
import { FloatButton, Table, Tooltip } from "antd";
import { get } from "lodash";
import React from "react";
import { isMobileOrTab } from "../../../../../constants";
import SVGIcon from "../../../../../constants/svgIndex";
import DocumentService from "../../../../../helpers/request/Common/document";
import { getScreenSize } from "../../../../../helpers/utility";
import ErrorBoundary from "../../../../UIComponents/ErrorBoundary";
import RadarChart from "../../../../UIComponents/RadarChart/customRadar";
import { getAdditionalData, getDataObject } from "../helper";
import MobileComparisonDetails from "./mobileComparisonDetails";

const ComparisonDetails = (props) => {
  const [moreItemView, setMoreItemView] = React.useState("");

  const dataSource = getDataObject(get(props, "samplingData", []));
  const additionalDataSource = getAdditionalData(get(props, "samplingData", []));

  const getObj = (name) => {
    const currentObj = get(props, "samplingData", []).find((li) => {
      return get(li, "report_id") === name;
    });
    return currentObj;
  };

  const getLink = (name) => {
    const tempObj = getObj(name);
    if (get(tempObj, "completed_at")) {
      return (
        <a href={`/view-sampling/${get(tempObj, "cask_sample_id")}`} target="_blank">
          {name}
        </a>
      );
    } else {
      return <a>{name}</a>;
    }
  };

  const getDocumentDownload = async (doc) => {
    await DocumentService.downloadDocument(doc);
  };

  const columns = [
    {
      title: "",
      dataIndex: "name",
      key: "name",
      render: (text, record) => {
        if (text === "Dominant Character Markers") {
          return (
            <div className="dominant_character">
              <div className="dominant_character_title">{text}</div>
              <div className="dominant_character_sub_title">
                {record.subTitles.map((item, index) => {
                  return <span key={index}>{item}</span>;
                })}
              </div>
            </div>
          );
        } else {
          return <b>{text}</b>;
        }
      },
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
          case "Action":
            return <b>{text}</b>;
          case "Color Chart":
            return (
              <div className="color_div">
                {
                  text.color !== "NA" &&
                  <div className="color_box" style={{ backgroundColor: text.color }}></div>
                }
                <h5>{text.name}</h5>
                {/* <h6>{text.content}</h6> */}
              </div>
            );
          case "Character":
            return (
              <div className="table_chart">
                <RadarChart record={record.broken} />
              </div>
            );
          case "Dominant Character Markers":
            return (
              <div className="dominant_character_box">
                {record.broken.map((item, index) => {
                  return <span key={index}>{item}</span>;
                })}
              </div>
            );
          default:
            return text;
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
          case "Action":
            return <b>{text}</b>;
          case "Color Chart":
            return (
              <div className="color_div">
                {
                  text.color !== "NA" &&
                  <div className="color_box" style={{ backgroundColor: text.color }}></div>
                }
                <h5>{text.name}</h5>
                {/* <h6>{text.content}</h6> */}
              </div>
            );
          case "Character":
            return (
              <div className="table_chart">
                <RadarChart record={record.bad} />
              </div>
            );
          case "Dominant Character Markers":
            return (
              <div className="dominant_character_box">
                {record.bad.map((item, index) => {
                  return <span key={index}>{item}</span>;
                })}
              </div>
            );
          default:
            return text;
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
          case "Action":
            return <b>{text}</b>;
          case "Color Chart":
            return (
              <div className="color_div">
                {
                  text.color !== "NA" &&
                  <div className="color_box" style={{ backgroundColor: text.color }}></div>
                }
                <h5>{text.name}</h5>
                {/* <h6>{text.content}</h6> */}
              </div>
            );
          case "Character":
            return (
              <div className="table_chart">
                <RadarChart record={record.okay} />
              </div>
            );
          case "Dominant Character Markers":
            return (
              <div className="dominant_character_box">
                {record.okay.map((item, index) => {
                  return <span key={index}>{item}</span>;
                })}
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
          case "Action":
            return <b>{text}</b>;
          case "Color Chart":
            return (
              <div className="color_div">
                {
                  text.color !== "NA" &&
                  <div className="color_box" style={{ backgroundColor: text.color }}></div>
                }
                <h5>{text.name}</h5>
                {/* <h6>{text.content}</h6> */}
              </div>
            );
          case "Character":
            return (
              <div className="table_chart">
                <RadarChart record={record.best} />
              </div>
            );
          case "Dominant Character Markers":
            return (
              <div className="dominant_character_box">
                {record.best.map((item, index) => {
                  return <span key={index}>{item}</span>;
                })}
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
            <img src={SVGIcon.ComparisonDetailsBarrelIcon} alt="Cask Number" className="mr-2" style={{ width: "24px", height: "24px" }} />
            <span style={{ fontWeight: 700, fontSize: 16 }}>Comparison Details</span>
          </div>
          <div className="additional_details_content comparison_table">
            {getScreenSize() > isMobileOrTab ? (
              <Table tableLayout="fixed" dataSource={dataSource} columns={columns} pagination={false} showHeader={false} bordered={true} />
            ) : (
              <MobileComparisonDetails comparisonDetails={dataSource} comparisonAdditionalDetails={additionalDataSource} />
            )}
          </div>
        </div>
        {getScreenSize() > isMobileOrTab ? (
          <div className="summary__additional_details common_card_section">
            <div className="d-flex align-items-center mb-2">
              <img src={SVGIcon.AdditionalDetailsIcon} alt="Additional Details" className="mr-2" style={{ width: "24px", height: "24px" }} />
              <span style={{ fontWeight: 700, fontSize: 16 }}>Additional Details</span>
            </div>
            <div className="additional_details_content comparison_additional_details_table">
              <Table tableLayout="fixed" dataSource={additionalDataSource} columns={additionalDetailsColumns} pagination={false} showHeader={false} bordered={true} />
            </div>
          </div>
        ) : null}
        <Tooltip placement="topLeft" title="Scroll To Top">
          <FloatButton.BackTop />
        </Tooltip>
      </ErrorBoundary>
    </div>
  );
};

export default ComparisonDetails;
