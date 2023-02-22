import { Col, Row } from "antd";
import { get } from "lodash";
import React from "react";
import ErrorBoundary from "../../../UIComponents/ErrorBoundary";
import { CustomInputNumber as InputNumberChange, CustomInputText as InputChange, CustomInputTextArea as InputTextArea } from "../../../UIComponents/Input/customInput";
import { SingleSelect as Select } from "../../../UIComponents/Select/singleSelect";
import "../index.scss";

const CaseDetailsCasedGood = (props) => {
  return (
    <>
      <div className="common_card_section">
        <ErrorBoundary>
          <Row>
            <Col xs={{ span: 24 }} md={{ span: 24 }}>
              <Row gutter={[16, 16]}>
                <Col xs={{ span: 24 }} md={{ span: 8 }} lg={{ span: 6 }}>
                  <InputNumberChange
                    handleChange={props.handleChange}
                    value={get(props, "newCase.abv", "")}
                    type="abv"
                    required
                    className="mt-0 mb-0 w-100"
                    validateStatus={get(props, "error.abv") && "error"}
                    helpText={get(props, "error.abv") && "ABV cannot be empty"}
                    label="ABV (%)"
                  />
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 8 }} lg={{ span: 6 }}>
                  <InputNumberChange
                    handleChange={props.handleChange}
                    value={get(props, "newCase.bpc", "")}
                    type="bpc"
                    required
                    className="mt-0 mb-0 w-100"
                    validateStatus={get(props, "error.bpc") && "error"}
                    helpText={get(props, "error.bpc") && "BPC cannot be empty"}
                    label="BPC"
                  />
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 8 }} lg={{ span: 6 }}>
                  <Row gutter={[16, 16]}>
                    <Col xs={{ span: 24 }} md={{ span: 14 }}>
                      <InputNumberChange
                        handleChange={props.handleChange}
                        value={get(props, "newCase.whole_case", "")}
                        type="whole_case"
                        required
                        className="mt-0 mb-0 w-100"
                        validateStatus={get(props, "error.whole_case") && "error"}
                        helpText={get(props, "error.whole_case") ? get(error, "error.wholeCaseErr") : ""}
                        label="Whole Cases"
                      />
                    </Col>
                    <Col xs={{ span: 24 }} md={{ span: 10 }}>
                      <Select
                        handleChange={(key, value) => props.handleChange(key, value)}
                        type="bottles_in_partial_case"
                        label="Part Case"
                        placeholder="Part Case"
                        value={get(props, "newCase.bottles_in_partial_case", 0)}
                        helpText={get(props, "error.bottles_in_partial_case") ? get(props, "error.bottlesInPartialCaseErr") : ""}
                        options={get(props, "partCaseOptionsList", [])}
                        disabled={Number(get(props, "newCase.bpc", 0)) < 2}
                        validateStatus={get(props, "error.bottles_in_partial_case") && "error"}
                        className="mb-2 part-case-field"
                      />
                    </Col>
                  </Row>
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 8 }} lg={{ span: 6 }}>
                  <InputChange
                    handleChange={props.handleChange}
                    value={get(props, "newCase.case_reference", "")}
                    type="case_reference"
                    required
                    className="mt-0 mb-0"
                    validateStatus={get(props, "error.case_reference") && "error"}
                    helpText={get(props, "error.case_reference") && "Case Ref cannot be empty"}
                    label="Case Reference"
                  />
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 8 }} lg={{ span: 6 }}>
                  <InputNumberChange
                    handleChange={props.handleChange}
                    value={get(props, "newCase.volume", "")}
                    type="volume"
                    required
                    className="mt-0 mb-0 w-100"
                    validateStatus={get(props, "error.volume") && "error"}
                    helpText={get(props, "error.volume") && "Volume cannot be empty"}
                    label="Volume (in litres)"
                  />
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 8 }} lg={{ span: 6 }}>
                  <InputNumberChange
                    handleChange={props.handleChange}
                    value={get(props, "newCase.bottles", "")}
                    type="bottles"
                    className="mt-0 mb-0 w-100"
                    required
                    disabled
                    validateStatus={get(props, "error.bottles") && "error"}
                    helpText={get(props, "error.bottles") && "Bottles cannot be empty"}
                    label="Bottles"
                  />
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 8 }} lg={{ span: 6 }}>
                  <InputNumberChange
                    handleChange={props.handleChange}
                    value={get(props, "newCase.loA", "")}
                    type="loA"
                    className="mt-0 mb-0 w-100"
                    required
                    disabled
                    validateStatus={get(props, "error.loA") && "error"}
                    helpText={get(props, "error.loA") && "loA cannot be empty"}
                    label=" LoA per Case"
                  />
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 24 }}>
                  <InputTextArea handleChange={props.handleChange} value={get(props, "newCase.comments", "")} type="comments" label="Comments" />
                </Col>
              </Row>
            </Col>
          </Row>
        </ErrorBoundary>
      </div>
    </>
  );
};

export default CaseDetailsCasedGood;
