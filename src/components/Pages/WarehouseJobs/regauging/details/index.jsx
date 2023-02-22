import { Card, Col, Divider, Input, Row, Tooltip } from "antd";
import { get, isArray } from "lodash";
import React from "react";
import SVGIcon from "../../../../../constants/svgIndex";
import DocumentService from "../../../../../helpers/request/Common/document";
import ErrorBoundary from "../../../../UIComponents/ErrorBoundary";
import "../index.scss";

const JobDetail = (props) => {
  const getValue = (val) => {
    return val ? val : "NA";
  };

  const { uploadedImages, imagesList, documentsUploaded } = props;

  const getDocumentDownload = async (doc) => {
    await DocumentService.downloadDocument(doc);
  };

  return (
    <div className="portal_styling__2 table-responsive-padding">
      <ErrorBoundary>
        <div className="summary__additional_details common_card_section">
          <div className="d-flex align-items-center mb-2">
            <img src={SVGIcon.SampleCaskIcon} alt="Cask Number" className="mr-2" style={{ width: "24px", height: "24px" }} />
            <span style={{ fontWeight: 700, fontSize: 16 }}>Cask Details</span>
          </div>
          <div className="additional_details_content">
            <Row gutter={[12, 8]}>
              <Col xs={{ span: 24 }} sm={{ span: 5 }}>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <p className="summary__card_content__title">Brand Name</p>
                    <Tooltip placement="topLeft" title={getValue(get(props, "details.cask_details.brand"))}>
                      <p className="summary__card_content__value">{getValue(get(props, "details.cask_details.brand"))}</p>
                    </Tooltip>
                  </Col>
                  <Col span={12}>
                    <p className="summary__card_content__title">Distillery</p>
                    <Tooltip placement="topLeft" title={getValue(get(props, "details.cask_details.distillery"))}>
                      <p className="summary__card_content__value">{getValue(get(props, "details.cask_details.distillery"))}</p>
                    </Tooltip>
                  </Col>
                  <Col span={12}>
                    <p className="summary__card_content__title">AYS</p>
                    <Tooltip placement="topLeft" title={getValue(get(props, "details.cask_details.ays"))}>
                      <p className="summary__card_content__value">{getValue(get(props, "details.cask_details.ays"))}</p>
                    </Tooltip>
                  </Col>
                  <Col span={12}>
                    <p className="summary__card_content__title">Cask Type</p>
                    <Tooltip placement="topLeft" title={getValue(get(props, "details.cask_details.cask_type"))}>
                      <p className="summary__card_content__value">
                        <img src={SVGIcon.CaskType1Icon} className="mr-1" /> {getValue(get(props, "details.cask_details.cask_type"))}
                      </p>
                    </Tooltip>
                  </Col>
                </Row>
              </Col>
              <Col xs={{ span: 24 }} sm={{ span: 2 }}>
                <div className="vertical_divider"></div>
              </Col>
              <Col xs={{ span: 24 }} sm={{ span: 8 }}>
                <Row gutter={[16, 16]}>
                  <Col xs={{ span: 12 }}>
                    <p className="summary__card_content__title">Passport Number </p>
                    <Tooltip placement="topLeft" title={getValue(get(props, "details.cask_details.passport_number"))}>
                      <p className="summary__card_content__value"> {getValue(get(props, "details.cask_details.passport_number"))} </p>
                    </Tooltip>
                  </Col>
                  <Col xs={{ span: 12 }}>
                    <p className="summary__card_content__title">Created By</p>
                    <Tooltip placement="topLeft" title={getValue(get(props, "details.created_by"))}>
                      <p className="summary__card_content__value">{getValue(get(props, "details.created_by"))}</p>
                    </Tooltip>
                  </Col>
                  <Col xs={{ span: 12 }}>
                    <p className="summary__card_content__title">Whisky Type</p>
                    <Tooltip placement="topLeft" title={getValue(get(props, "details.cask_details.whisky_type"))}>
                      <p className="summary__card_content__value"> {getValue(get(props, "details.cask_details.whisky_type"))}</p>
                    </Tooltip>
                  </Col>
                  <Col xs={{ span: 12 }}>
                    <p className="summary__card_content__title">Last Known Strength / RLA</p>
                    <p className="summary__card_content__value">
                      <Tooltip placement="topLeft" title={`${getValue(get(props, "details.cask_details.last_known_strength"))} / ${getValue(get(props, "details.cask_details.last_known_rla"))}`}>
                        {getValue(get(props, "details.cask_details.last_known_strength"))} / {getValue(get(props, "details.cask_details.last_known_rla"))}
                      </Tooltip>
                    </p>
                  </Col>
                </Row>
              </Col>
              <Col xs={{ span: 24 }} sm={{ span: 2 }}>
                <div className="vertical_divider"></div>
              </Col>
              <Col xs={{ span: 24 }} sm={{ span: 7 }}>
                <Row gutter={[16, 16]}>
                  {get(props, "details.source") === "Gate Entry" && (
                    <Col span={12}>
                      <p className="summary__card_content__title">Delivered By</p>
                      <Tooltip placement="topLeft" title={getValue(get(props, "details.delivered_by_name"))}>
                        <p className="summary__card_content__value">{getValue(get(props, "details.delivered_by_name"))}</p>
                      </Tooltip>
                    </Col>
                  )}
                  <Col span={12}>
                    <p className="summary__card_content__title">Warehouse Keeper Name </p>
                    <Tooltip placement="topLeft" title={getValue(get(props, "details.warehouse_details.warehouse_keeper_name"))}>
                      <p className="summary__card_content__value">{getValue(get(props, "details.warehouse_details.warehouse_keeper_name"))} </p>
                    </Tooltip>
                  </Col>
                  <Col span={12}>
                    <p className="summary__card_content__title">Warehouse Name</p>
                    <Tooltip placement="topLeft" title={getValue(get(props, "details.warehouse_details.warehouse_name"))}>
                      <p className="summary__card_content__value">{getValue(get(props, "details.warehouse_details.warehouse_name"))} </p>
                    </Tooltip>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        </div>

        {get(props, "details.method") === "wt_msr" && (
          <>
            <div className="summary__additional_details common_card_section">
              <div className="d-flex align-items-center mb-2">
                <img src={SVGIcon.ColorChartIcon} alt="Colour Chart" className="mr-2" style={{ width: "20px", height: "20px" }} />
                <span style={{ fontWeight: 700, fontSize: 16 }}>Color Chart</span>
              </div>
              <div className="additional_details_content">
                <Row gutter={[24, 24]}>
                  <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 6 }} lg={{ span: 6 }}>
                    <div className="view_sampling_color_chart align-items-center mt-3">
                      <div className="chose_color" style={{ background: get(props, "details.wt_msr_regauge_params.color_code") }}></div>
                      <div className="color_data">
                        <h1> {getValue(get(props, "details.wt_msr_regauge_params.color"))} </h1>
                      </div>
                    </div>
                  </Col>
                  <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }} lg={{ span: 8 }}>
                    <div className="comment_section">
                      <div className="d-flex align-items-center mb-2">
                        <img src={SVGIcon.CommentsIcon} alt="Further comments" className="mr-2" style={{ width: "20px", height: "20px" }} />
                        <span>Further comments</span>
                      </div>
                      <Input.TextArea value={get(props, "details.wt_msr_regauge_params.color_comments")} rows={2} disabled />
                    </div>
                  </Col>
                </Row>
              </div>
            </div>

            <div className="summary__additional_details common_card_section">
              <div className="d-flex align-items-center mb-2">
                <img src={SVGIcon.MeasurementsIcon} alt="Character" className="mr-2" style={{ width: "20px", height: "20px" }} />
                <span style={{ fontWeight: 700, fontSize: 16 }}>{getValue(get(props, "details.method")) === "ullage" ? "Ullage" : "Weights & Measurements"}</span>
              </div>
              <div className="additional_details_content">
                <Row gutter={[24, 8]}>
                  <Col xs={{ span: 24 }} sm={{ span: 14 }} md={{ span: 8 }}>
                    <Row gutter={[16, 16]}>
                      <Col xs={{ span: 12 }} md={{ span: 8 }}>
                        <p className="summary__card_content__title">Dry Dip</p>
                        <Tooltip placement="topLeft" title={getValue(get(props, "details.wt_msr_regauge_params.dry_dip"))}>
                          <p className="summary__card_content__value">{getValue(get(props, "details.wt_msr_regauge_params.dry_dip"))}</p>
                        </Tooltip>
                      </Col>
                      <Col xs={{ span: 12 }} md={{ span: 8 }}>
                        <p className="summary__card_content__title">Wet Dip</p>
                        <Tooltip placement="topLeft" title={getValue(get(props, "details.wt_msr_regauge_params.wet_dip"))}>
                          <p className="summary__card_content__value">{getValue(get(props, "details.wt_msr_regauge_params.wet_dip"))}</p>
                        </Tooltip>
                      </Col>
                      <Col xs={{ span: 12 }} md={{ span: 8 }}>
                        <p className="summary__card_content__title"> {get(props, "details.source") === "Gate Entry" ? "Incoming Weight" : "Weight"} </p>
                        <Tooltip placement="topLeft" title={getValue(get(props, "details.wt_msr_regauge_params.incoming_weight"))}>
                          <p className="summary__card_content__value">{getValue(get(props, "details.wt_msr_regauge_params.incoming_weight"))}</p>
                        </Tooltip>
                      </Col>
                      <Col xs={{ span: 12 }} md={{ span: 8 }}>
                        <p className="summary__card_content__title">Strength</p>
                        <Tooltip placement="topLeft" title={getValue(get(props, "details.wt_msr_regauge_params.strength"))}>
                          <p className="summary__card_content__value">{getValue(get(props, "details.wt_msr_regauge_params.strength"))}</p>
                        </Tooltip>
                      </Col>
                      <Col xs={{ span: 12 }} md={{ span: 8 }}>
                        <p className="summary__card_content__title">Specific Gravity</p>
                        <Tooltip placement="topLeft" title={getValue(get(props, "details.wt_msr_regauge_params.specific_gravity"))}>
                          <p className="summary__card_content__value">{getValue(get(props, "details.wt_msr_regauge_params.specific_gravity"))}</p>
                        </Tooltip>
                      </Col>
                      <Col xs={{ span: 12 }} md={{ span: 8 }}>
                        <p className="summary__card_content__title">Bulk Litres</p>
                        <Tooltip placement="topLeft" title={getValue(get(props, "details.wt_msr_regauge_params.bulk_litres"))}>
                          <p className="summary__card_content__value">{getValue(get(props, "details.wt_msr_regauge_params.bulk_litres"))}</p>
                        </Tooltip>
                      </Col>
                    </Row>
                  </Col>
                  <Col xs={{ span: 24 }} sm={{ span: 2 }}>
                    <div className="vertical_divider"></div>
                  </Col>
                  <Col xs={{ span: 24 }} sm={{ span: 8 }} md={{ span: 9 }}>
                    <Row gutter={[16, 16]}>
                      <Col xs={{ span: 12 }} md={{ span: 16 }}>
                        <p className="summary__card_content__title">Est. Tare Weight</p>
                        <Tooltip placement="topLeft" title={getValue(get(props, "details.wt_msr_regauge_params.estimated_tare_weight"))}>
                          <p className="summary__card_content__value">{getValue(get(props, "details.wt_msr_regauge_params.estimated_tare_weight"))}</p>
                        </Tooltip>
                      </Col>
                      <Col xs={{ span: 12 }} md={{ span: 8 }}>
                        <p className="summary__card_content__title">Net Weight</p>
                        <Tooltip placement="topLeft" title={getValue(get(props, "details.wt_msr_regauge_params.nett_weight"))}>
                          <p className="summary__card_content__value">{getValue(get(props, "details.wt_msr_regauge_params.nett_weight"))}</p>
                        </Tooltip>
                      </Col>
                      <Col xs={{ span: 12 }} md={{ span: 16 }}>
                        <p className="summary__card_content__title">RLA (Based On Est. Tare Weight)</p>
                        <Tooltip placement="topLeft" title={getValue(get(props, "details.wt_msr_regauge_params.estimated_tares_rla"))}>
                          <p className="summary__card_content__value">{getValue(get(props, "details.wt_msr_regauge_params.estimated_tares_rla"))}</p>
                        </Tooltip>
                      </Col>
                      <Col xs={{ span: 12 }} md={{ span: 8 }}>
                        <p className="summary__card_content__title">Difference</p>
                        <Tooltip placement="topLeft" title={getValue(get(props, "details.wt_msr_regauge_params.difference"))}>
                          <p className="summary__card_content__value">{getValue(get(props, "details.wt_msr_regauge_params.difference"))}</p>
                        </Tooltip>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </div>
            </div>
          </>
        )}
        {get(props, "details.method") === "ullage" && (
          <div className="summary__additional_details common_card_section">
            <div className="d-flex align-items-center mb-2">
              <img src={SVGIcon.MeasurementsIcon} alt="Character" className="mr-2" style={{ width: "20px", height: "20px" }} />
              <span style={{ fontWeight: 700, fontSize: 16 }}>{getValue(get(props, "details.method")) === "ullage" ? "Ullage" : "Weights & Measurements"}</span>
            </div>
            <div className="additional_details_content">
              <Row gutter={[24, 16]}>
                <Col xs={{ span: 12 }} sm={{ span: 4 }}>
                  <p className="summary__card_content__title">Dry Dip</p>
                  <Tooltip placement="topLeft" title={getValue(get(props, "details.ullage_regauge_params.dry_dip"))}>
                    <p className="summary__card_content__value">{getValue(get(props, "details.ullage_regauge_params.dry_dip"))}</p>
                  </Tooltip>
                </Col>
                <Col xs={{ span: 12 }} sm={{ span: 4 }}>
                  <p className="summary__card_content__title">Wet Dip</p>
                  <Tooltip placement="topLeft" title={getValue(get(props, "details.ullage_regauge_params.wet_dip"))}>
                    <p className="summary__card_content__value">{getValue(get(props, "details.ullage_regauge_params.wet_dip"))}</p>
                  </Tooltip>
                </Col>
                <Col xs={{ span: 12 }} sm={{ span: 4 }}>
                  <p className="summary__card_content__title">Fill Date</p>
                  <Tooltip placement="topLeft" title={getValue(get(props, "details.ullage_regauge_params.fill_date"))}>
                    <p className="summary__card_content__value">{getValue(get(props, "details.ullage_regauge_params.fill_date"))}</p>
                  </Tooltip>
                </Col>
                <Col xs={{ span: 12 }} sm={{ span: 4 }}>
                  <p className="summary__card_content__title">Fill Type</p>
                  <Tooltip placement="topLeft" title={getValue(get(props, "details.ullage_regauge_params.fill"))}>
                    <p className="summary__card_content__value">{getValue(get(props, "details.ullage_regauge_params.fill"))}</p>
                  </Tooltip>
                </Col>
                <Col xs={{ span: 12 }} sm={{ span: 4 }}>
                  <p className="summary__card_content__title">Strength</p>
                  <Tooltip placement="topLeft" title={getValue(get(props, "details.ullage_regauge_params.strength"))}>
                    <p className="summary__card_content__value">{getValue(get(props, "details.ullage_regauge_params.strength"))}</p>
                  </Tooltip>
                </Col>
                <Col xs={{ span: 12 }} sm={{ span: 4 }}>
                  <p className="summary__card_content__title">Temperature</p>
                  <Tooltip placement="topLeft" title={getValue(get(props, "details.ullage_regauge_params.temperature"))}>
                    <p className="summary__card_content__value">{getValue(get(props, "details.ullage_regauge_params.temperature"))}</p>
                  </Tooltip>
                </Col>
              </Row>
              <Divider />
              <Row gutter={[16, 16]}>
                <Col xs={{ span: 12 }} sm={{ span: 4 }}>
                  <p className="summary__card_content__title">Duration In Wood</p>
                  <Tooltip placement="topLeft" title={getValue(get(props, "details.ullage_regauge_params.duration_in_wood"))}>
                    <p className="summary__card_content__value">{getValue(get(props, "details.ullage_regauge_params.duration_in_wood"))}</p>
                  </Tooltip>
                </Col>
                <Col xs={{ span: 12 }} sm={{ span: 4 }}>
                  <p className="summary__card_content__title">Original Bulk</p>
                  <Tooltip placement="topLeft" title={getValue(get(props, "details.ullage_regauge_params.original_bulk_litres"))}>
                    <p className="summary__card_content__value">{getValue(get(props, "details.ullage_regauge_params.original_bulk_litres"))}</p>
                  </Tooltip>
                </Col>
                <Col xs={{ span: 12 }} sm={{ span: 4 }}>
                  <p className="summary__card_content__title">New Bulk</p>
                  <Tooltip placement="topLeft" title={getValue(get(props, "details.ullage_regauge_params.new_bulk_litres"))}>
                    <p className="summary__card_content__value">{getValue(get(props, "details.ullage_regauge_params.new_bulk_litres"))}</p>
                  </Tooltip>
                </Col>
                <Col xs={{ span: 12 }} sm={{ span: 4 }}>
                  <p className="summary__card_content__title">Bulk Loss %</p>
                  <Tooltip placement="topLeft" title={getValue(get(props, "details.ullage_regauge_params.bulk_loss_percent"))}>
                    <p className="summary__card_content__value">{getValue(get(props, "details.ullage_regauge_params.bulk_loss_percent"))}</p>
                  </Tooltip>
                </Col>
                <Col xs={{ span: 12 }} sm={{ span: 4 }}>
                  <p className="summary__card_content__title">New LOA</p>
                  <Tooltip placement="topLeft" title={getValue(get(props, "details.ullage_regauge_params.new_loa"))}>
                    <p className="summary__card_content__value">{getValue(get(props, "details.ullage_regauge_params.new_loa"))}</p>
                  </Tooltip>
                </Col>
                <Col xs={{ span: 12 }} sm={{ span: 4 }}>
                  <p className="summary__card_content__title">RLA Loss %</p>
                  <Tooltip placement="topLeft" title={getValue(get(props, "details.ullage_regauge_params.rla_loss_percent"))}>
                    <p className="summary__card_content__value">{getValue(get(props, "details.ullage_regauge_params.rla_loss_percent"))}</p>
                  </Tooltip>
                </Col>
                <Col xs={{ span: 12 }} sm={{ span: 4 }}>
                  <p className="summary__card_content__title">TCF</p>
                  <Tooltip placement="topLeft" title={getValue(get(props, "details.ullage_regauge_params.tcf"))}>
                    <p className="summary__card_content__value">{getValue(get(props, "details.ullage_regauge_params.tcf"))}</p>
                  </Tooltip>
                </Col>

                <Col xs={{ span: 12 }} sm={{ span: 4 }}>
                  <p className="summary__card_content__title">A LINE</p>
                  <Tooltip placement="topLeft" title={getValue(get(props, "details.ullage_regauge_params.a_line"))}>
                    <p className="summary__card_content__value">{getValue(get(props, "details.ullage_regauge_params.a_line"))}</p>
                  </Tooltip>
                </Col>

                <Col xs={{ span: 12 }} sm={{ span: 4 }}>
                  <p className="summary__card_content__title">B LINE</p>
                  <Tooltip placement="topLeft" title={getValue(get(props, "details.ullage_regauge_params.b_line"))}>
                    <p className="summary__card_content__value">{getValue(get(props, "details.ullage_regauge_params.b_line"))}</p>
                  </Tooltip>
                </Col>

                <Col xs={{ span: 12 }} sm={{ span: 4 }}>
                  <p className="summary__card_content__title">Total RLA Loss</p>
                  <Tooltip placement="topLeft" title={getValue(get(props, "details.ullage_regauge_params.total_rla_loss"))}>
                    <p className="summary__card_content__value">{getValue(get(props, "details.ullage_regauge_params.total_rla_loss"))}</p>
                  </Tooltip>
                </Col>

                <Col xs={{ span: 12 }} sm={{ span: 4 }}>
                  <p className="summary__card_content__title">Total RLA Loss PY</p>
                  <Tooltip placement="topLeft" title={getValue(get(props, "details.ullage_regauge_params.total_rla_loss_per_year"))}>
                    <p className="summary__card_content__value">{getValue(get(props, "details.ullage_regauge_params.total_rla_loss_per_year"))}</p>
                  </Tooltip>
                </Col>

                <Col xs={{ span: 12 }} sm={{ span: 4 }}>
                  <p className="summary__card_content__title">Total RLA Loss PY %</p>
                  <Tooltip placement="topLeft" title={getValue(get(props, "details.ullage_regauge_params.total_rla_loss_per_year_percent"))}>
                    <p className="summary__card_content__value">{getValue(get(props, "details.ullage_regauge_params.total_rla_loss_per_year_percent"))}</p>
                  </Tooltip>
                </Col>

                <Col xs={{ span: 12 }} sm={{ span: 4 }}>
                  <p className="summary__card_content__title">Target RLA Loss (2% PY)</p>
                  <Tooltip placement="topLeft" title={getValue(get(props, "details.ullage_regauge_params.target_rla_loss"))}>
                    <p className="summary__card_content__value">{getValue(get(props, "details.ullage_regauge_params.target_rla_loss"))}</p>
                  </Tooltip>
                </Col>

                <Col xs={{ span: 12 }} sm={{ span: 4 }}>
                  <p className="summary__card_content__title">Loss Perf</p>
                  <Tooltip placement="topLeft" title={getValue(get(props, "details.ullage_regauge_params.loss_performance"))}>
                    <p className="summary__card_content__value">{getValue(get(props, "details.ullage_regauge_params.loss_performance"))}</p>
                  </Tooltip>
                </Col>
              </Row>
            </div>
          </div>
        )}
        <div className="summary__additional_details common_card_section">
          <div className="d-flex align-items-center mb-2">
            <img src={SVGIcon.AdditionalDetailsIcon} alt="Additional Details" className="mr-2" style={{ width: "24px", height: "24px" }} />
            <span style={{ fontWeight: 700, fontSize: 16 }}>Additional Details</span>
          </div>
          <div className="crr_details__additional__content summary_details">
            <Row gutter={[16, 16]}>
              <Col flex="1 0 3%">
                <Card
                  style={{ minHeight: 234 }}
                  title={
                    <p className="summary__card_title">
                      <img src={SVGIcon.AddIcon} /> <span>Photos</span>
                    </p>
                  }
                  bordered={false}
                >
                  <div className="photos_section">
                    {isArray(imagesList) && (
                      <>
                        {(imagesList.length > 3 ? imagesList.slice(0, 3) : imagesList).map((img, index) => {
                          return <img src={img} alt="photo 1" key={index} onClick={() => getDocumentDownload(uploadedImages[index])} className="cursor-pointer" />;
                        })}

                        {isArray(imagesList) && imagesList.length > 3 && (
                          <a
                            style={{
                              fontWeight: 500,
                              fontSize: 12,
                              color: "#38479E",
                            }}
                            onClick={() => props.handleImagesView()}
                          >
                            +{imagesList.length - 3} More
                          </a>
                        )}
                        {imagesList.length === 0 && <>NO IMAGES FOUND</>}
                      </>
                    )}
                  </div>
                </Card>
              </Col>

              <Col flex="1 0 1%">
                <Card
                  style={{ minHeight: 234 }}
                  title={
                    <p className="summary__card_title">
                      <img src={SVGIcon.UploadDocumentIcon} /> <span>Documents</span>
                    </p>
                  }
                  bordered={false}
                >
                  {(documentsUploaded.length > 3 ? documentsUploaded.slice(0, 3) : documentsUploaded).map((li, index) => {
                    return (
                      <div style={{ cursor: "pointer" }} className="d-flex align-items-center additional_details_doc" key={index} onClick={() => getDocumentDownload(li)}>
                        <img src={SVGIcon.PDFIcon} alt="Sebring Details" style={{ width: "24px", height: "24px", paddingRight: 7 }} />
                        <span className="additional_details_doc__title_text"> {get(li, "document_name")} </span>
                      </div>
                    );
                  })}
                  {documentsUploaded.length > 3 && (
                    <a
                      style={{
                        fontWeight: 500,
                        fontSize: 12,
                        color: "#38479E",
                      }}
                      onClick={() => props.handleDocumentView()}
                    >
                      +{documentsUploaded.length - 3} More
                    </a>
                  )}
                  {documentsUploaded.length === 0 && <p>NO DOCUMENTS AVAILABLE</p>}
                </Card>
              </Col>

              <Col flex="1 0 3%">
                <Card
                  style={{ minHeight: 234 }}
                  title={
                    <p className="summary__card_title">
                      <img src={SVGIcon.AddNotesIcon} /> <span>Notes</span>
                    </p>
                  }
                  bordered={false}
                >
                  <div className="add_note_section">
                    <div className="text_box">
                      <Input.TextArea value={get(props, "details.notes", "NA")} rows={2} disabled />
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
        </div>
      </ErrorBoundary>
    </div>
  );
};

export default JobDetail;
