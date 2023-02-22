import { Col, Divider, Input, Row, Spin, Tooltip } from "antd";
import { get } from "lodash";
import React from "react";
import SVGIcon from "../../../../../constants/svgIndex";
import ColorPicker from "../../../../UIComponents/ColorPicker";
import ErrorBoundary from "../../../../UIComponents/ErrorBoundary";
import { CustomInputNumber as InputNumberChange } from "../../../../UIComponents/Input/customInput";
const { TextArea } = Input;

const RegaugingManualUiForm = (props) => {
  const handleChange = React.useCallback((key, value, deepKey) => {
    let newValue = { ...get(props, "regaugeDataset") };
    if (key === "color") {
      newValue["color"] = get(value, "name");
      newValue["color_code"] = get(value, "code");
    } else if (deepKey) {
      newValue[key][deepKey] = value;
    } else {
      newValue[key] = value;
    }
    props.setRegaugeDataset(newValue);
  });

  return (
    <ErrorBoundary>
      <div className="summary__additional_details common_card_section pb-0">
        <div className="d-flex align-items-center mb-2">
          <img src={SVGIcon.ColorChartIcon} alt="Color Chart" className="mr-2" style={{ width: "20px", height: "20px" }} />
          <span style={{ fontWeight: 700, fontSize: 16 }}>Color Chart</span>
        </div>
        <Row gutter={[16, 16]}>
          <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} xl={{ span: 16 }}>
            <ColorPicker value={get(props, "regaugeDataset.color")} onChange={(colorCode) => handleChange("color", colorCode)} type="custom" />
          </Col>
          <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} xl={{ span: 8 }}>
            <div className="common_card_section comment">
              <div className="d-flex align-items-center mb-2">
                <img src={SVGIcon.FurtherCommentIcon} alt="Further comments" className="mr-2" style={{ width: "20px", height: "20px" }} />
                <span>Further comments</span>
              </div>
              <TextArea
                type="comments"
                placeholder="Enter Comments"
                rows={5}
                value={get(props, "regaugeDataset.color_comments", "")}
                onChange={(e) => handleChange("color_comments", e.target.value)}
              />
            </div>
          </Col>
        </Row>
      </div>

      <div className="summary__additional_details common_card_section">
        <div className="d-flex align-items-center mb-2">
          <img src={SVGIcon.AssessmentIcon} alt="Cask Number" className="mr-2" style={{ width: "24px", height: "24px" }} />
          <span style={{ fontWeight: 700, fontSize: 16 }}>Weights & Measurements</span>
        </div>
        <Spin spinning={get(props, "isLoading")}>
          <div className="additional_details_content">
            <Row gutter={[16, 12]}>
              <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 6 }}>
                <InputNumberChange
                  type="dry_dip"
                  required
                  value={get(props, "regaugeDataset.dry_dip", "")}
                  handleChange={(type, val) => handleChange("dry_dip", val)}
                  label="Dry Dip (Cms)"
                  onBlur={props.handleAssessmentParameters}
                  handleEnterKey={props.handleAssessmentParameters}
                  className="mt-0 mb-0 w-100"
                  placeholder="Enter Dry Dip here"
                />
              </Col>
              <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 6 }}>
                <InputNumberChange
                  type="wet_dip"
                  required
                  value={get(props, "regaugeDataset.wet_dip", "")}
                  handleChange={(type, val) => handleChange("wet_dip", val)}
                  label=" Wet Dip (Cms)"
                  className="mt-0 mb-0 w-100"
                  placeholder="Enter Wet Dip here"
                />
              </Col>
              <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 6 }}>
                {get(location, "pathname").includes("gate-entry") ? (
                  <InputNumberChange
                    type="incoming_weight"
                    required
                    onBlur={props.handleAssessmentParameters}
                    handleEnterKey={props.handleAssessmentParameters}
                    handleChange={(type, val) => handleChange("incoming_weight", val)}
                    label="Incoming Weight (Kgs)"
                    value={get(props, "regaugeDataset.incoming_weight", "")}
                    className="mt-0 mb-0 w-100"
                    placeholder="Enter Incoming Weight here"
                  />
                ) : (
                  <InputNumberChange
                    type="weight"
                    required
                    handleChange={(type, val) => handleChange("weight", val)}
                    label="Weight (Kgs)"
                    onBlur={props.handleAssessmentParameters}
                    handleEnterKey={props.handleAssessmentParameters}
                    value={get(props, "regaugeDataset.weight", "")}
                    className="mt-0 mb-0 w-100"
                    placeholder="Enter Weight here"
                  />
                )}
              </Col>
              <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 6 }}>
                <InputNumberChange
                  value={get(props, "regaugeDataset.strength", "")}
                  handleChange={(type, value) => handleChange(type, value)}
                  type="strength"
                  required
                  onBlur={props.handleAssessmentParameters}
                  handleEnterKey={props.handleAssessmentParameters}
                  className="mt-0 mb-0 w-100"
                  label="Strength (%)"
                />
              </Col>
              <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 6 }}>
                <InputNumberChange
                  value={get(props, "regaugeDataset.specific_gravity", "")}
                  handleChange={(type, value) => handleChange(type, value)}
                  type="specific_gravity"
                  required
                  onBlur={props.handleAssessmentParameters}
                  handleEnterKey={props.handleAssessmentParameters}
                  className="mt-0 mb-0 w-100"
                  label="Specific Gravity"
                />
              </Col>
              <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 6 }}>
                <InputNumberChange
                  value={get(props, "regaugeDataset.bulk_litres", "")}
                  handleChange={(type, value) => handleChange(type, value)}
                  type="bulk_litres"
                  required
                  className="mt-0 mb-0 w-100"
                  label="Bulk Litres"
                />
              </Col>
            </Row>
            <Divider />
            <Row gutter={[16, 12]}>
              <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 6 }}>
                <label>Est. Tare Weight (Kgs)</label>
                <Tooltip placement="topLeft" title={get(props, "regaugeDataset.estimated_tare_weight")}>
                  <p>{get(props, "regaugeDataset.estimated_tare_weight") ? get(props, "regaugeDataset.estimated_tare_weight") : "----"}</p>
                </Tooltip>
              </Col>
              <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 6 }}>
                <label>Net Weight (Kgs)</label>
                <Tooltip placement="topLeft" title={get(props, "regaugeDataset.nett_weight")}>
                  <p>{get(props, "regaugeDataset.nett_weight") ? get(props, "regaugeDataset.nett_weight") : "----"}</p>
                </Tooltip>
              </Col>

              <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 6 }}>
                <label>RLA (Based on Est. Tare weight) (Kgs)</label>
                <Tooltip placement="topLeft" title={get(props, "regaugeDataset.estimated_tares_rla")}>
                  <p>{get(props, "regaugeDataset.estimated_tares_rla") ? get(props, "regaugeDataset.estimated_tares_rla") : "----"}</p>
                </Tooltip>
              </Col>

              <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 6 }}>
                <label>Difference</label>
                <Tooltip placement="topLeft" title={get(props, "regaugeDataset.difference")}>
                  <p>{get(props, "regaugeDataset.difference") ? get(props, "regaugeDataset.difference") : "----"}</p>
                </Tooltip>
              </Col>
            </Row>
          </div>
        </Spin>
      </div>
    </ErrorBoundary>
  );
};

export default RegaugingManualUiForm;
