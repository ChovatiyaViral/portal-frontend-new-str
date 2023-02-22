import { Col, Row } from "antd";
import { get } from "lodash";
import React from "react";
import { isAlphanumeric } from "validator";
import SVGIcon from "../../../../../constants/svgIndex";
import { CustomDatePicker } from "../../../../UIComponents/DatePicker";
import ErrorBoundary from "../../../../UIComponents/ErrorBoundary";
import { CustomInputText as InputChange } from "../../../../UIComponents/Input/customInput";

/**
 * Renders Add Cask Details Component
 */
const CaskDetails = (props) => {
  const handleChange = React.useCallback((key, value) => {
    let newValue = { ...get(props, "cask_details", {}) };
    newValue[key] = value;
    props.handleChange("cask_details", newValue, key);
  });

  return (
    <>
      <ErrorBoundary>
        <div className="common_card_section">
          <div style={{ display: "flex", alignItems: "center" }}>
            <img src={SVGIcon.CaskDetailsIcon} alt="cask details" style={{ width: "24px", height: "24px" }} />
            <span style={{ fontWeight: 700, fontSize: 20, marginLeft: "10px" }}>Cask Details</span>
          </div>
          <Row className="mt-4" gutter={[16, 0]}>
            <Col xs={{ span: 24 }} sm={{ span: 6 }}>
              <InputChange
                handleChange={(type, value) => {
                  if (!value || isAlphanumeric(value)) {
                    handleChange(type, value);
                  }
                }}
                value={get(props, "cask_details.cask_number", "")}
                type="cask_number"
                status={get(props, "error.cask_number") ? "error" : ""}
                validateStatus={get(props, "error.cask_number") && "error"}
                helpText={get(props, "error.cask_number") ? "Cask Number is mandatory" : ""}
                className="mt-0 mb-0 w-100"
                label="Cask Number"
              />
            </Col>
            {/* <Col xs={{ span: 24 }} sm={{ span: 6 }}>
              <InputChange
                handleChange={handleChange}
                value={get(props, "cask_details.passport_number", "")}
                type="passport_number"
                className="mt-0 mb-0 w-100"
                label="Passport Number"
              />
            </Col> */}
            <Col xs={{ span: 24 }} sm={{ span: 6 }}>
              <CustomDatePicker
                handleChange={handleChange}
                value={get(props, "cask_details.ays", "")}
                type="ays"
                placeholder="A.Y.S (YYYY-MM-DD)"
                status={get(props, "error.ays") ? "error" : ""}
                validateStatus={get(props, "error.ays") && "error"}
                helpText={get(props, "error.ays") ? "A.Y.S is mandatory" : ""}
                className="mt-0 mb-0 w-100"
                label="A.Y.S (YYYY-MM-DD)"
              />
            </Col>
          </Row>
        </div>
      </ErrorBoundary>
    </>
  );
};

export default CaskDetails;
