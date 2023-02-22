import { ClockCircleOutlined } from "@ant-design/icons";
import { Button, Card, Col, Divider, Input, Popconfirm, Radio, Row, Spin, Tooltip } from "antd";
import { get, isArray } from "lodash";
import moment from "moment";
import React from "react";
import { Link } from "react-router-dom";
import { isMobileOrTab } from "../../../../constants";
import SVGIcon from "../../../../constants/svgIndex";
import CommonService from "../../../../helpers/request/Common";
import DocumentService from "../../../../helpers/request/Common/document";
import { requestPath } from "../../../../helpers/service";
import { getScreenSize } from "../../../../helpers/utility";
import ErrorBoundary from "../../../UIComponents/ErrorBoundary";
import { openNotificationWithIcon } from "../../../UIComponents/Toast/notification";
import { RescheduleUI } from "../regauging/pending/rescheduleUI";
import ActionCRRDetails from "./actionCRRDetails";

const JobDetail = (props) => {
  const [isActionModalVisible, setIsActionModalVisible] = React.useState(false);
  const [crrStatus, setCRRStatus] = React.useState(null);
  const [rescheduleUIloading, setRescheduleUIloading] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isRescheduleModalVisible, setIsRescheduleModalVisible] = React.useState(false);
  const [selectedAction, setSelectedAction] = React.useState(null);
  const { uploadedImages, imagesList, documentsUploaded } = props;


  const getValue = (val) => {
    return val ? val : "NA";
  };


  const getDocumentDownload = async (doc) => {
    await DocumentService.downloadDocument(doc);
  };

  const confirm = (e) => {
    if (selectedAction === "regauge_schedule_now" || selectedAction === "sampling_schedule_now") {
      setIsRescheduleModalVisible(true);
    }

    if (selectedAction === "regauge_now" || selectedAction === "sampling_now") {
      setIsLoading(true);
      handleSubmit();
    }
  };

  const handleSubmit = async (data) => {
    const requestPayload = {
      crr_id: get(props, "crrId"),
      scheduled_at: get(data, "follow_up_date") ? get(data, "follow_up_date") : moment().format("DD-MM-YYYY"),
      comments: get(data, "comments", ""),
    };

    const path = selectedAction.includes("regauge") ? requestPath.wareHouseJobsManagement.regauging.createJobForCRR : requestPath.wareHouseJobsManagement.sampling.createJobForCRR;

    await CommonService.getDataSource(path, requestPayload).then((rest) => {
      if (get(rest, "data.status")) {
        setRescheduleUIloading(false);
        setIsLoading(false);
        openNotificationWithIcon("success", `${get(rest, "data.message", "Job created successfully.")} `);

        if (selectedAction === "regauge_schedule_now") {
          props.history.push("/regauging");
        }

        if (selectedAction === "sampling_schedule_now") {
          props.history.push("/sampling");
        }

        if (selectedAction === "regauge_now") {
          props.history.push(`/regauging/complete/${get(rest, "data.regauging_id")}`);
        }

        if (selectedAction === "sampling_now") {
          props.history.push(`/sampling/complete/${get(rest, "data.cask_sample_id")}`);
        }
      }

      if (!get(rest, "data.status", true)) {
        setRescheduleUIloading(false);
        setIsLoading(false);
        openNotificationWithIcon("error", `${get(rest, "data.message", "Something Went Wrong")} `);
      }
    });
  };

  return (
    <div className="portal_styling__2 table-responsive-padding">
      <ErrorBoundary>
        {isActionModalVisible && (
          <ActionCRRDetails
            record={get(props, "details")}
            CRRStatus={crrStatus}
            history={get(props, "history")}
            crr_id={get(props, "crrId", "")}
            isVisible={isActionModalVisible}
            onClose={() => {
              setIsActionModalVisible(false);
              setCRRStatus(null);
            }}
          />
        )}

        {isRescheduleModalVisible && (
          <RescheduleUI
            isModalVisible={isRescheduleModalVisible}
            record={get(props, "details")}
            title="Reason for Scheduling"
            loading={rescheduleUIloading}
            handleCancel={() => setIsRescheduleModalVisible(false)}
            handleSubmit={(data) => {
              handleSubmit(data);
              setRescheduleUIloading(true);
            }}
          />
        )}
        <Spin spinning={isLoading}>
          <div className="summary__additional_details common_card_section">
            <div className="d-flex align-items-center mb-2">
              <img src={SVGIcon.SampleCaskIcon} alt="Cask Number" className="mr-2" style={{ width: "24px", height: "24px" }} />
              <span style={{ fontWeight: 700, fontSize: 16 }}>Cask Details</span>
            </div>
            <div className="additional_details_content">
              <Row gutter={[12, 8]}>
                <Col xs={{ span: 24 }} sm={{ span: 6 }}>
                  <Row gutter={[16, 16]}>
                    <Col xs={{ span: 12 }} sm={{ span: 16 }}>
                      <p className="summary__card_content__title">Distillery</p>
                      <Tooltip placement="topLeft" title={getValue(get(props, "details.cask_details.distillery"))}>
                        <p className="summary__card_content__value">{getValue(get(props, "details.cask_details.distillery"))}</p>
                      </Tooltip>
                    </Col>
                    <Col xs={{ span: 12 }} sm={{ span: 8 }}>
                      <p className="summary__card_content__title">AYS</p>
                      <Tooltip placement="topLeft" title={getValue(get(props, "details.cask_details.ays"))}>
                        <p className="summary__card_content__value">{getValue(get(props, "details.cask_details.ays"))}</p>
                      </Tooltip>
                    </Col>
                    <Col xs={{ span: 12 }} sm={{ span: 16 }}>
                      <p className="summary__card_content__title">Cask Type</p>
                      <Tooltip placement="topLeft" title={getValue(get(props, "details.cask_details.cask_type"))}>
                        <p className="summary__card_content__value">
                          <img src={SVGIcon.CaskType1Icon} className="mr-1" /> {getValue(get(props, "details.cask_details.cask_type"))}
                        </p>
                      </Tooltip>
                    </Col>
                    <Col xs={{ span: 12 }} sm={{ span: 8 }}>
                      <p className="summary__card_content__title">Whisky Type</p>
                      <Tooltip placement="topLeft" title={getValue(get(props, "details.cask_details.whisky_type"))}>
                        <p className="summary__card_content__value"> {getValue(get(props, "details.cask_details.whisky_type"))}</p>
                      </Tooltip>
                    </Col>
                  </Row>
                </Col>
                <Col xs={{ span: 24 }} sm={{ span: 1 }}>
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
                      <p className="summary__card_content__title">Last Known Strength (%)</p>
                      <Tooltip placement="topLeft" title={getValue(get(props, "details.details.cask_details.last_known_strength"))}>
                        <p className="summary__card_content__value">{getValue(get(props, "details.details.cask_details.last_known_strength"))}</p>
                      </Tooltip>
                    </Col>
                    <Col xs={{ span: 12 }}>
                      <p className="summary__card_content__title">Last Known OLA / RLA</p>
                      <p className="summary__card_content__value">
                        <Tooltip placement="topLeft" title={`${getValue(get(props, "details.cask_details.last_known_ola"))} / ${getValue(get(props, "details.cask_details.last_known_rla"))}`}>
                          {getValue(get(props, "details.cask_details.last_known_ola"))} / {getValue(get(props, "details.cask_details.last_known_rla"))}
                        </Tooltip>
                      </p>
                    </Col>
                  </Row>
                </Col>
                <Col xs={{ span: 24 }} sm={{ span: 1 }}>
                  <div className="vertical_divider"></div>
                </Col>
                <Col xs={{ span: 24 }} sm={{ span: 8 }}>
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <p className="summary__card_content__title">Delivered By</p>
                      <Tooltip placement="topLeft" title={getValue(get(props, "details.delivered_by_name"))}>
                        <p className="summary__card_content__value">{getValue(get(props, "details.delivered_by_name"))}</p>
                      </Tooltip>
                    </Col>
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
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 10 }} lg={{ span: 6 }}>
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
                    <Col xs={{ span: 24 }} sm={{ span: 14 }} md={{ span: 9 }}>
                      <Row gutter={[16, 16]}>
                        <Col xs={{ span: 12 }} sm={{ span: 8 }}>
                          <p className="summary__card_content__title">Dry Dip</p>
                          <Tooltip placement="topLeft" title={getValue(get(props, "details.wt_msr_regauge_params.dry_dip"))}>
                            <p className="summary__card_content__value">{getValue(get(props, "details.wt_msr_regauge_params.dry_dip"))}</p>
                          </Tooltip>
                        </Col>
                        <Col xs={{ span: 12 }} sm={{ span: 8 }}>
                          <p className="summary__card_content__title">Wet Dip</p>
                          <Tooltip placement="topLeft" title={getValue(get(props, "details.wt_msr_regauge_params.wet_dip"))}>
                            <p className="summary__card_content__value">{getValue(get(props, "details.wt_msr_regauge_params.wet_dip"))}</p>
                          </Tooltip>
                        </Col>
                        <Col xs={{ span: 12 }} sm={{ span: 8 }}>
                          <p className="summary__card_content__title">Incoming Weight</p>
                          <Tooltip placement="topLeft" title={getValue(get(props, "details.wt_msr_regauge_params.incoming_weight"))}>
                            <p className="summary__card_content__value">{getValue(get(props, "details.wt_msr_regauge_params.incoming_weight"))}</p>
                          </Tooltip>
                        </Col>
                        <Col xs={{ span: 12 }} sm={{ span: 8 }}>
                          <p className="summary__card_content__title">Strength</p>
                          <Tooltip placement="topLeft" title={getValue(get(props, "details.wt_msr_regauge_params.strength"))}>
                            <p className="summary__card_content__value">{getValue(get(props, "details.wt_msr_regauge_params.strength"))}</p>
                          </Tooltip>
                        </Col>
                        <Col xs={{ span: 12 }} sm={{ span: 8 }}>
                          <p className="summary__card_content__title">Specific Gravity</p>
                          <Tooltip placement="topLeft" title={getValue(get(props, "details.wt_msr_regauge_params.specific_gravity"))}>
                            <p className="summary__card_content__value">{getValue(get(props, "details.wt_msr_regauge_params.specific_gravity"))}</p>
                          </Tooltip>
                        </Col>
                        <Col xs={{ span: 12 }} sm={{ span: 8 }}>
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
                        <Col xs={{ span: 12 }}>
                          <p className="summary__card_content__title">Est. Tare Weight</p>
                          <Tooltip placement="topLeft" title={getValue(get(props, "details.wt_msr_regauge_params.estimated_tare_weight"))}>
                            <p className="summary__card_content__value">{getValue(get(props, "details.wt_msr_regauge_params.estimated_tare_weight"))}</p>
                          </Tooltip>
                        </Col>
                        <Col xs={{ span: 12 }}>
                          <p className="summary__card_content__title">Net Weight</p>
                          <Tooltip placement="topLeft" title={getValue(get(props, "details.wt_msr_regauge_params.nett_weight"))}>
                            <p className="summary__card_content__value">{getValue(get(props, "details.wt_msr_regauge_params.nett_weight"))}</p>
                          </Tooltip>
                        </Col>
                        <Col xs={{ span: 12 }}>
                          <p className="summary__card_content__title">RLA (Based On Est. Tare Weight)</p>
                          <Tooltip placement="topLeft" title={getValue(get(props, "details.wt_msr_regauge_params.estimated_tares_rla"))}>
                            <p className="summary__card_content__value">{getValue(get(props, "details.wt_msr_regauge_params.estimated_tares_rla"))}</p>
                          </Tooltip>
                        </Col>
                        <Col xs={{ span: 12 }}>
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
                        </>
                      )}
                      {!imagesList && <>NO IMAGES FOUND</>}
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
          {get(props, "details.status", "pending_approval") === "pending_approval" && (
            <div className="summary__additional_details common_card_section">
              <div className="d-flex align-items-center mb-3">
                <img src={SVGIcon.AdditionalDetailsIcon} alt="Additional Details" className="mr-2" style={{ width: "24px", height: "24px" }} />
                <span style={{ fontWeight: 700, fontSize: 16 }}>Actions</span>
              </div>
              <Button
                type="primary"
                onClick={() => {
                  setCRRStatus("approve");
                  setIsActionModalVisible(true);
                }}
                className="mr-2 mb-2"
              >
                <img src={SVGIcon.ApproveIcon} style={{ width: 24, height: 24 }} className="pr-2" /> Approve
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  setCRRStatus("hold");
                  setIsActionModalVisible(true);
                }}
                className="mr-2 mb-2"
              >
                <ClockCircleOutlined /> Hold
              </Button>
              <Popconfirm
                title="Choose Action"
                description={
                  <Radio.Group onChange={(e) => setSelectedAction(e.target.value)} className={getScreenSize() > isMobileOrTab ? "d-flex mt-3 mb-3" : "mt-3 mb-3"}>
                    <Radio value="regauge_schedule_now">Schedule</Radio>
                    <Radio value="regauge_now" className="pl-sm-3">
                      Regauge Now
                    </Radio>
                  </Radio.Group>
                }
                onConfirm={confirm}
                okText="Proceed"
                cancelText="Cancel"
              >
                <Button type="primary" className="mr-2 mb-2">
                  <img src={SVGIcon.ReGuageIcon} style={{ width: 24, height: 24 }} className="pr-2" /> Send to regauge
                </Button>
              </Popconfirm>
              <Popconfirm
                title="Choose Action"
                description={
                  <Radio.Group onChange={(e) => setSelectedAction(e.target.value)} className={getScreenSize() > isMobileOrTab ? "d-flex mt-3 mb-3" : "mt-3 mb-3"}>
                    <Radio value="sampling_schedule_now">Schedule</Radio>
                    <Radio value="sampling_now" className="pl-sm-3">
                      Sample Now
                    </Radio>
                  </Radio.Group>
                }
                onConfirm={confirm}
                okText="Proceed"
                cancelText="Cancel"
              >
                <Button type="primary" className="mr-2 mb-2">
                  <img src={SVGIcon.SamplingRecordIcon} style={{ width: 24, height: 24 }} className="pr-2" /> Add Sampling Record
                </Button>
              </Popconfirm>
              <Link to={`/view-cask-profile/${get(props, "details.cask_id")}`} className="text-decoration-none">
                <Button type="primary">
                  <img src={SVGIcon.CaskProfileIcon} style={{ width: 24, height: 24 }} className="pr-2" /> View cask profile
                </Button>
              </Link>
            </div>
          )}
        </Spin>
      </ErrorBoundary>
    </div>
  );
};

export default JobDetail;
