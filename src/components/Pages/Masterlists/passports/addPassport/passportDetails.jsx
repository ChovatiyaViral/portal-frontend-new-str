import { CheckCircleOutlined, PlusOutlined, CheckOutlined } from "@ant-design/icons";
import { Badge, Button, Col, Progress, Radio, Row } from "antd";
import { cloneDeep } from "lodash";
import React from "react";
import SVGIcon from "../../../../../constants/svgIndex";
import { useWindowSize } from "../../../../../helpers/checkScreenSize";
import ErrorBoundary from "../../../../UIComponents/ErrorBoundary";
import { CustomInputText as InputChange } from "../../../../UIComponents/Input/customInput";
import { gateEntrySummaryDefaultValues } from "../../../WarehouseJobs/constants";

/**
 * Renders Add Cask Details Component
 */
const PassportDetails = (props) => {
  const [width] = useWindowSize();
  const [logEntryValues, setLogEntryValues] = React.useState({ ...cloneDeep(gateEntrySummaryDefaultValues) });

  const [isPassportNumberAvailable, setIsPassportNumberAvailable] = React.useState("no");
  const [passportNumberToBeVerified, setPassportNumberToBeVerified] = React.useState("");
  const [isPassportGenerated, setIsPassportGenerated] = React.useState(null);
  const [isPassportVerified, setIsPassportVerified] = React.useState(false);
  const [passportVerifiedMessage, setPassportVerifiedMessage] = React.useState(null);
  const [verifyPassportProgress, setVerifyPassportProgress] = React.useState(0);

  // const invokeDebounced = debounce((query) => {
  //   handleVerifyPassportNumberSubmit(query);
  // }, 2000);

  const onPassNumberAvailabilityChange = (e) => {
    setIsPassportNumberAvailable(e.target.value);
  };

  const checkScreenSize = (cardWidth) => {
    if (width > 1500) {
      return cardWidth;
    }
    return "auto";
  };

  const handleGeneratePassportNumberSubmit = () => {
    // let requestPayload = {
    //   cask_type: get(caskSummary, "cask_type"),
    //   cask_id: get(caskSummary, "cask_id"),
    // };
    // if (passportNumberToBeVerified) {
    //   requestPayload = { ...requestPayload, passport_number: passportNumberToBeVerified };
    // }
    // const rest = await axios({
    //   method: "POST",
    //   data: requestPayload,
    //   url: `${process.env.REACT_APP_API_ENDPOINT}/api/v1/passport/generate_passport_num`,
    //   headers: { ...getRequestHeader() },
    // }).catch((err) => {
    //   openNotificationWithIcon("error", "Passport Number", `${get(err, "response.data.message", "Something Went Wrong")} `);
    // });
    // if (get(rest, "data.status")) {
    //   setIsPassportNumberAvailable(null);
    //   setIsPassportGenerated(get(rest, "data.passport_number"));
    //   handleChange("passport_number", get(rest, "data.passport_number"), "passport_details");
    //   openNotificationWithIcon("success", "Passport Number", `${get(rest, "response.data.message", "Passport Number generated successfully")} `);
    // }
    // if (!get(rest, "data.status", true)) {
    //   openNotificationWithIcon("error", "Passport Number", `${get(rest, "data.message", "Something Went Wrong")} `);
    // }
  };

  // const handleChange = React.useCallback((key, value) => {
  //   let newValue = { ...get(props, "cask_details", {}) };
  //   newValue[key] = value;
  //   props.handleChange("cask_details", newValue, key);
  // });

  return (
    <>
      <ErrorBoundary>
        <div className="common_card_section">
          <div style={{ display: "flex", alignItems: "center" }}>
            <img src={SVGIcon.CaskDetailsIcon} alt="cask details" style={{ width: "24px", height: "24px" }} />
            <span style={{ fontWeight: 700, fontSize: 20, marginLeft: "10px" }}>Passport Details</span>
          </div>
          <div className="summary__additional_details" style={{ minWidth: checkScreenSize(1020) }}>
            {!isPassportGenerated && isPassportNumberAvailable && (
              <div className="check__passport_number">
                <p>Do you have a existing passport number?</p>
                <Radio.Group onChange={onPassNumberAvailabilityChange} value={isPassportNumberAvailable}>
                  <Radio value="yes">Yes</Radio>
                  <Radio value="no">No</Radio>
                </Radio.Group>
              </div>
            )}
            <div className="additional_details_content">
              <Row gutter={[16, 16]}>
                {isPassportNumberAvailable ? (
                  <Col span={8}>
                    {isPassportNumberAvailable === "yes" ? (
                      <>
                        <div className="d-flex align-items-center">
                          <InputChange
                            value={passportNumberToBeVerified}
                            // handleChange={(type, value) => {
                            //   setIsPassportVerified(false);
                            //   setPassportVerifiedMessage(null);
                            //   setPassportNumberToBeVerified(value);
                            //   if (value.length > 2) {
                            //     invokeDebounced(value);
                            //   }
                            // }}
                            status={passportVerifiedMessage && (!isPassportVerified ? "error" : "success")}
                            validateStatus={passportVerifiedMessage && !isPassportVerified ? "error" : ""}
                            helpText={
                              passportVerifiedMessage ? (
                                <Badge
                                  color="#fff"
                                  style={{
                                    marginTop: 8,
                                    marginLeft: 0,
                                  }}
                                  text={
                                    <>
                                      {isPassportVerified && (
                                        <span style={{ color: "#389e0d" }}>
                                          <CheckCircleOutlined /> <span>{passportVerifiedMessage}</span>
                                        </span>
                                      )}
                                      {!isPassportVerified && (
                                        <span style={{ color: "#ff4d4f" }}>
                                          <CloseCircleOutlined /> <span>{passportVerifiedMessage}</span>
                                        </span>
                                      )}
                                    </>
                                  }
                                />
                              ) : (
                                ""
                              )
                            }
                            type="passport_number"
                            style={{ width: 292 }}
                            className="mt-0 mb-0 w-100"
                            label="Passport Number"
                          />
                          <Button type="primary" icon={<CheckOutlined />} onClick={() => handleGeneratePassportNumberSubmit()} disabled={!isPassportVerified} className="ml-4 passport_number__verify_btn">
                            Submit
                          </Button>
                        </div>
                        {verifyPassportProgress > 0 ? <Progress size="small" className="mb-2" percent={verifyPassportProgress} style={{ width: 292 }} /> : null}
                      </>
                    ) : (
                      <>
                        {isPassportGenerated ? (
                          <InputChange value={isPassportGenerated} disabled type="passport_number" className="mt-0 mb-0 w-100" label="Passport Number" />
                        ) : (
                          <Button icon={<PlusOutlined />} className="passport_number__generation mb-4" onClick={() => handleGeneratePassportNumberSubmit()}>
                            Generate passport number
                          </Button>
                        )}
                      </>
                    )}
                  </Col>
                ) : (
                  <InputChange
                    // value={get(logEntryValues, "passport_details.passport_number", "")}
                    disabled
                    type="passport_number"
                    style={{ width: 292 }}
                    className="mt-0 mb-0 w-100"
                    label="Passport Number"
                  />
                )}
              </Row>
              <Row gutter={24}>
                <Col span={8}>
                  <InputChange
                    // value={get(logEntryValues, "passport_details.passport_type", "")}
                    // handleChange={(type, value) => handleChange(type, value, "passport_details")}
                    type="passport_type"
                    className="mt-0 mb-0 w-100"
                    label="Passport Type"
                  />
                </Col>
                <Col span={8}>
                  <InputChange
                    // value={get(logEntryValues, "passport_details.spirit_weight", "")}
                    // handleChange={(type, value) => handleChange(type, value, "passport_details")}
                    type="spirit_weight"
                    className="mt-0 mb-0 w-100"
                    label="Spirit Weight"
                  />
                </Col>
                <Col span={8}>
                  <InputChange
                    // value={get(logEntryValues, "passport_details.fills", "")}
                    // handleChange={(type, value) => handleChange(type, value, "passport_details")}
                    type="fills"
                    className="mt-0 mb-0 w-100"
                    label="Fills"
                  />
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </ErrorBoundary>
    </>
  );
};

export default PassportDetails;
