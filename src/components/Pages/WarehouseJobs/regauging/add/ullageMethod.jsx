import { Col, Divider, Row, Spin, Tooltip } from "antd";
import { cloneDeep, get } from "lodash";
import React from "react";
import { useDispatch } from "react-redux";
import { defaultTaxonomyMasterDataListName, MasterDataKeyPair } from "../../../../../constants";
import SVGIcon from "../../../../../constants/svgIndex";
import { capitalizeAllLetter, getKeyValuePair } from "../../../../../helpers/utility";
import { defaultRequestOptions } from "../../../../../settings";
import { getTaxonomyData } from "../../../../../store/Taxonomy/taxonomy.actions";
import { CustomDatePicker } from "../../../../UIComponents/DatePicker";
import ErrorBoundary from "../../../../UIComponents/ErrorBoundary";
import { CustomInputNumber as InputNumberChange } from "../../../../UIComponents/Input/customInput";
import { SingleSelect as Select } from "../../../../UIComponents/Select/singleSelect";
import { openNotificationWithIcon } from "../../../../UIComponents/Toast/notification";

const RegaugingUllageUiForm = (props) => {
  const dispatch = useDispatch();
  const { history } = props;
  const [dropDownValues, setDropDownValues] = React.useState({});

  const handleChange = React.useCallback((key, value, deepKey) => {
    let newValue = { ...get(props, "regaugeDataset") };
    if (deepKey) {
      newValue[key][deepKey] = value;
    } else {
      newValue[key] = value;
    }
    props.setRegaugeDataset(newValue);
  });

  const fetchTaxonomyData = async (masterKey = defaultTaxonomyMasterDataListName, sort_key = "", sort_order = "ASC", otherKey = "") => {
    let requestOptions = cloneDeep(defaultRequestOptions);
    requestOptions[MasterDataKeyPair.MasterDataKey] = masterKey;
    requestOptions["orderby_field"] = sort_key;
    requestOptions["orderby_value"] = sort_order;

    if (masterKey === "cask_type") {
      requestOptions["status_filter"] = "all";
    }

    const taxonomyData = await dispatch(getTaxonomyData(requestOptions));

    if (get(taxonomyData, "error", false)) {
      openNotificationWithIcon("error", `${capitalizeAllLetter(masterKey.replace(/_/g, " "))}`, `${get(taxonomyData, "error.message", "Something Went Wrong")} `);
    }

    let newValues = { ...dropDownValues };
    newValues[masterKey] = getKeyValuePair(get(taxonomyData, "response.data", []), sort_key, false, otherKey);
    setDropDownValues(newValues);
  };

  return (
    <ErrorBoundary>
      <div className="summary__additional_details common_card_section">
        <div className="d-flex align-items-center mb-2">
          <img src={SVGIcon.AssessmentIcon} alt="Cask Number" className="mr-2" style={{ width: "24px", height: "24px" }} />
          <span style={{ fontWeight: 700, fontSize: 16 }}>Ullage Method</span>
        </div>
        <Spin spinning={get(props, "isLoading")}>
          <div className="additional_details_content">
            <Row gutter={[16, 12]}>
              <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 6 }}>
                <CustomDatePicker
                  handleChange={(type, val) => handleChange("fill_date", val)}
                  type="fill_date"
                  format="DD-MM-YYYY"
                  required
                  onBlur={props.handleAssessmentParameters}
                  value={get(props, "regaugeDataset.fill_date", "")}
                  placeholder="Fill Date (DD-MM-YYYY)"
                  className="mt-0 mb-0 w-100"
                  label="Fill Date (DD-MM-YYYY)"
                />
              </Col>

              <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 6 }}>
                <Select
                  handleChange={(key, value) => handleChange(key, value)}
                  type="fill_type"
                  label="Fill Type"
                  required
                  value={get(props, "regaugeDataset.fill_type")}
                  onDropdownVisibleChange={() => {
                    if (get(dropDownValues, "fill", []).length === 0) {
                      fetchTaxonomyData("fill", "fill_type", "ASC");
                    }
                  }}
                  placeHolder="Select"
                  options={get(dropDownValues, "fill", [])}
                  className="mt-0 mb-0"
                />
              </Col>

              <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 6 }}>
                <InputNumberChange
                  type="dry_dip"
                  handleChange={(type, val) => handleChange("dry_dip", val)}
                  label="Dry Dip (Cms)"
                  required
                  onBlur={props.handleAssessmentParameters}
                  handleEnterKey={props.handleAssessmentParameters}
                  value={get(props, "regaugeDataset.dry_dip", "")}
                  className="mt-0 mb-0 w-100"
                  placeholder="Enter Dry Dip here"
                />
              </Col>
              <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 6 }}>
                <InputNumberChange
                  type="wet_dip"
                  value={get(props, "regaugeDataset.wet_dip", "")}
                  handleChange={(type, val) => handleChange("wet_dip", val)}
                  label="Wet Dip (Cms)"
                  required
                  onBlur={props.handleAssessmentParameters}
                  handleEnterKey={props.handleAssessmentParameters}
                  className="mt-0 mb-0 w-100"
                  placeholder="Enter Wet Dip here"
                />
              </Col>
              <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 6 }}>
                <InputNumberChange
                  type="temperature"
                  handleChange={(type, val) => handleChange("temperature", val)}
                  label="Temperature (°C)"
                  required
                  onBlur={props.handleAssessmentParameters}
                  handleEnterKey={props.handleAssessmentParameters}
                  value={get(props, "regaugeDataset.temperature", "")}
                  className="mt-0 mb-0 w-100"
                  placeholder="Enter Temperature here"
                />
              </Col>
              <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 6 }}>
                <InputNumberChange
                  type="strength"
                  required
                  onBlur={props.handleAssessmentParameters}
                  handleEnterKey={props.handleAssessmentParameters}
                  handleChange={(type, val) => handleChange("strength", val)}
                  label="Strength (%)"
                  value={get(props, "regaugeDataset.strength", "")}
                  className="mt-0 mb-0 w-100"
                  placeholder="Enter Strength here"
                />
              </Col>
            </Row>
            <Divider />
            <Row gutter={[16, 12]}>
              <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 6 }}>
                <label>Duration in Wood</label>
                <Tooltip placement="topLeft" title={get(props, "regaugeDataset.duration_in_wood")}>
                  <p className="summary__card_content__value">{get(props, "regaugeDataset.duration_in_wood") ? get(props, "regaugeDataset.duration_in_wood") : "----"}</p>
                </Tooltip>
              </Col>
              <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 6 }}>
                <label>Original Bulk (Ltr)</label>
                <Tooltip placement="topLeft" title={get(props, "regaugeDataset.original_bulk_litres")}>
                  <p className="summary__card_content__value">{get(props, "regaugeDataset.original_bulk_litres") ? get(props, "regaugeDataset.original_bulk_litres") : "----"}</p>
                </Tooltip>
              </Col>
              <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 6 }}>
                <label>New Bulk (Ltr)</label>
                <Tooltip placement="topLeft" title={get(props, "regaugeDataset.new_bulk_litres")}>
                  <p className="summary__card_content__value">{get(props, "regaugeDataset.new_bulk_litres") ? get(props, "regaugeDataset.new_bulk_litres") : "----"}</p>
                </Tooltip>
              </Col>
              <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 6 }}>
                <label>Bulk Loss %</label>
                <Tooltip placement="topLeft" title={get(props, "regaugeDataset.bulk_loss_percent")}>
                  <p className="summary__card_content__value">{get(props, "regaugeDataset.bulk_loss_percent") ? get(props, "regaugeDataset.bulk_loss_percent") : "----"}</p>
                </Tooltip>
              </Col>
            </Row>
            <Divider />
            <Row gutter={[16, 12]}>
              <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 6 }}>
                <label>TCF</label>
                <Tooltip placement="topLeft" title={get(props, "regaugeDataset.tcf")}>
                  <p className="summary__card_content__value">{get(props, "regaugeDataset.tcf") ? get(props, "regaugeDataset.tcf") : "----"}</p>
                </Tooltip>
              </Col>

              <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 6 }}>
                <label>A LINE</label>
                <Tooltip placement="topLeft" title={get(props, "regaugeDataset.a_line")}>
                  <p className="summary__card_content__value">{get(props, "regaugeDataset.a_line") ? get(props, "regaugeDataset.a_line") : "----"}</p>
                </Tooltip>
              </Col>

              <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 6 }}>
                <label>B LINE</label>
                <Tooltip placement="topLeft" title={get(props, "regaugeDataset.b_line")}>
                  <p className="summary__card_content__value">{get(props, "regaugeDataset.b_line") ? get(props, "regaugeDataset.b_line") : "----"}</p>
                </Tooltip>
              </Col>
            </Row>
            <Divider />
            <Row gutter={[16, 12]}>
              <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 6 }}>
                <label>New LOA</label>
                <Tooltip placement="topLeft" title={get(props, "regaugeDataset.new_loa")}>
                  <p className="summary__card_content__value">{get(props, "regaugeDataset.new_loa") ? get(props, "regaugeDataset.new_loa") : "----"}</p>
                </Tooltip>
              </Col>

              <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 6 }}>
                <label>Total RLA Loss</label>
                <Tooltip placement="topLeft" title={get(props, "regaugeDataset.total_rla_loss")}>
                  <p className="summary__card_content__value">{get(props, "regaugeDataset.total_rla_loss") ? get(props, "regaugeDataset.total_rla_loss") : "----"}</p>
                </Tooltip>
              </Col>

              <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 6 }}>
                <label>RLA Loss %</label>
                <Tooltip placement="topLeft" title={get(props, "regaugeDataset.rla_loss_percent")}>
                  <p className="summary__card_content__value">{get(props, "regaugeDataset.rla_loss_percent") ? get(props, "regaugeDataset.rla_loss_percent") : "----"}</p>
                </Tooltip>
              </Col>
            </Row>
            <Divider />
            <Row gutter={[16, 12]}>
              <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 6 }}>
                <label>Total RLA Loss PY</label>
                <Tooltip placement="topLeft" title={get(props, "regaugeDataset.total_rla_loss_per_year")}>
                  <p className="summary__card_content__value">{get(props, "regaugeDataset.total_rla_loss_per_year") ? get(props, "regaugeDataset.total_rla_loss_per_year") : "----"}</p>
                </Tooltip>
              </Col>

              <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 6 }}>
                <label>Total RLA Loss PY %</label>
                <Tooltip placement="topLeft" title={get(props, "regaugeDataset.total_rla_loss_per_year_percent")}>
                  <p className="summary__card_content__value">{get(props, "regaugeDataset.total_rla_loss_per_year_percent") ? get(props, "regaugeDataset.total_rla_loss_per_year_percent") : "----"}</p>
                </Tooltip>
              </Col>

              <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 6 }}>
                <label>Target RLA Loss (2% PY)</label>
                <Tooltip placement="topLeft" title={get(props, "regaugeDataset.target_rla_loss")}>
                  <p className="summary__card_content__value">{get(props, "regaugeDataset.target_rla_loss") ? get(props, "regaugeDataset.target_rla_loss") : "----"}</p>
                </Tooltip>
              </Col>

              <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 6 }}>
                <label>Loss Perf</label>
                <Tooltip placement="topLeft" title={get(props, "regaugeDataset.loss_performance")}>
                  <p className="summary__card_content__value">{get(props, "regaugeDataset.loss_performance") ? get(props, "regaugeDataset.loss_performance") : "----"}</p>
                </Tooltip>
              </Col>
            </Row>
          </div>
        </Spin>
      </div>
    </ErrorBoundary>
  );
};

export default RegaugingUllageUiForm;
