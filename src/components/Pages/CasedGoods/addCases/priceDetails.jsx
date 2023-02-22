import { Col, Divider, Row } from "antd";
import { get } from "lodash";
import React from "react";
import ErrorBoundary from "../../../UIComponents/ErrorBoundary";
import { CustomInputNumber as InputNumberChange } from "../../../UIComponents/Input/customInput";
import "../index.scss";

const PriceDetailsCasedGood = (props) => {
  const getValue = (val) => {
    return val || val === 0 ? val : "NA";
  };

  return (
    <>
      <div className="common_card_section">
        <ErrorBoundary>
          <Row gutter={[16, 16]}>
            <Col xs={{ span: 24 }} md={{ span: 8 }} lg={{ span: 6 }}>
              <InputNumberChange
                handleChange={props.handleChange}
                value={get(props, "newCase.export_price", "")}
                type="export_price"
                label="Export Pricing"
                addonBefore="£"
                onBlur={props.handleExportPrice}
                handleEnterKey={props.handleExportPrice}
                className="mt-0 mb-0 w-100"
                validateStatus={get(props, "error.export_price") && "error"}
                helpText={get(props, "error.export_price") && "Export Pricing cannot be empty"}
              />
            </Col>
            <Col xs={{ span: 24 }} md={{ span: 8 }} lg={{ span: 6 }}>
              <InputNumberChange handleChange={props.handleChange} value={get(props, "newCase.offer_price", "")} type="offer_price" label="Offer Price" addonBefore="£" className="mt-0 mb-0 w-100" />
            </Col>
          </Row>
          <Divider className="mt-3 mb-3" />
          <Row gutter={[16, 6]} className="mt-3 mb-3">
            <Col xs={{ span: 24 }} sm={{ span: 10 }}>
              <Row gutter={[16, 16]}>
                <Col xs={{ span: 24 }} sm={{ span: 8 }}>
                  <p className="summary__card_content__title">Duty</p>
                  <p className="summary__card_content__value">£ {getValue(get(props, "newCase.duty", "NA"))}</p>
                </Col>
                <Col xs={{ span: 24 }} sm={{ span: 12 }}>
                  <p className="summary__card_content__title">Export + Duty</p>
                  <p className="summary__card_content__value">£ {getValue(get(props, "newCase.sum_of_export_and_duty", "NA"))}</p>
                </Col>
                <Col xs={{ span: 24 }} sm={{ span: 8 }}>
                  <p className="summary__card_content__title">UK Trade P(15% Margin)</p>
                  <p className="summary__card_content__value">£ {getValue(get(props, "newCase.uk_trade_price", "NA"))}</p>
                </Col>
                <Col xs={{ span: 24 }} sm={{ span: 8 }}>
                  <p className="summary__card_content__title">Trade P per Bottle</p>
                  <p className="summary__card_content__value">£ {getValue(get(props, "newCase.trade_price_per_bottle", "NA"))}</p>
                </Col>
                <Col xs={{ span: 24 }} sm={{ span: 8 }}>
                  <p className="summary__card_content__title">UK GP per Case</p>
                  <p className="summary__card_content__value">£ {getValue(get(props, "newCase.uk_gp_per_case", "NA"))}</p>
                </Col>
              </Row>
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 14 }}>
              <table className="retail_table my-2">
                <thead>
                  <tr>
                    <th>
                      <p className="summary__card_content__title">Retail Margin</p>
                    </th>
                    {get(props, "newCase.prices_as_per_retail_margins", []).map((list) => {
                      return (
                        <th key={get(list, "retail_margin_percent")}>
                          <p className="summary__card_content__title">{getValue(get(list, "retail_margin_percent", "NA"))}%</p>
                        </th>
                      );
                    })}
                    {get(props, "newCase.prices_as_per_retail_margins", []).length === 0 && (
                      <td>
                        <p className="summary__card_content__value">NA</p>
                      </td>
                    )}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th>
                      <p className="summary__card_content__title">UK Retail P/Case</p>
                    </th>
                    {get(props, "newCase.prices_as_per_retail_margins", []).map((list) => {
                      return (
                        <td key={get(list, "uk_retail_price_per_case")}>
                          <p className="summary__card_content__value">£ {getValue(get(list, "uk_retail_price_per_case", "NA"))}</p>
                        </td>
                      );
                    })}
                    {get(props, "newCase.prices_as_per_retail_margins", []).length === 0 && (
                      <td>
                        <p className="summary__card_content__value">NA</p>
                      </td>
                    )}
                  </tr>
                  <tr>
                    <th>
                      <p className="summary__card_content__title">UK Retail P/Case w VAT</p>
                    </th>
                    {get(props, "newCase.prices_as_per_retail_margins", []).map((list) => {
                      return (
                        <td key={get(list, "uk_retail_price_per_case_wit_vat")}>
                          <p className="summary__card_content__value">£ {getValue(get(list, "uk_retail_price_per_case_wit_vat", "NA"))}</p>
                        </td>
                      );
                    })}
                    {get(props, "newCase.prices_as_per_retail_margins", []).length === 0 && (
                      <td>
                        <p className="summary__card_content__value">NA</p>
                      </td>
                    )}
                  </tr>
                  <tr>
                    <th>
                      <p className="summary__card_content__title">UK Retail P/Bottle</p>
                    </th>
                    {get(props, "newCase.prices_as_per_retail_margins", []).map((list) => {
                      return (
                        <td key={get(list, "uk_retail_price_per_bottle")}>
                          <p className="summary__card_content__value">£ {getValue(get(list, "uk_retail_price_per_bottle", "NA"))}</p>
                        </td>
                      );
                    })}
                    {get(props, "newCase.prices_as_per_retail_margins", []).length === 0 && (
                      <td>
                        <p className="summary__card_content__value">NA</p>
                      </td>
                    )}
                  </tr>
                </tbody>
              </table>
            </Col>
          </Row>
        </ErrorBoundary>
      </div>
    </>
  );
};

export default PriceDetailsCasedGood;
