// import { InfoCircleOutlined } from "@ant-design/icons";
import { Col, Divider, Row, Spin } from "antd";
import { get } from "lodash";
import React from "react";
import { CustomInputNumber as InputNumberChange, CustomInputTextArea as InputTextArea } from "../../../UIComponents/Input/customInput";

const EditPriceInventory = (props) => {

  const getValue = (val) => {
    return val || val === 0 ? val : "NA";
  };

  return (
    <div className="mt-2 mb-2 edit_price_inventory">
      {/* <span className="d-flex align-items-center mb-2">
        <InfoCircleOutlined /> <b className="pl-2"> All Prices are in GBP </b>
      </span> */}
      <Spin spinning={get(props, "loading", false)} size="medium">
        {/* <Row gutter={[16,16]}>
                    <Col xs={{ span: 24 }} sm={{ span: 7 }}>
                        <InputNumberChange
                            handleChange={props.handlePriceChange}
                            value={get(props, "price.export_price", "")}
                            type="export_price"
                            label="Export Pricing"
                            onBlur={props.handleExportPrice}
                            handleEnterKey={props.handleExportPrice}
                            className="mt-0 mb-0 w-100"
                            required
                            addonBefore="£"
                            validateStatus={get(props, "priceError.export_price") && "error"}
                            helpText={get(props, "priceError.export_price") && "Export Pricing cannot be empty"}
                        />
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 7, offset: 1 }}>
                        <InputNumberChange
                            value={get(props, "price.wholesale_price", "")}
                            type="wholesale_price"
                            label="Wholesale M/Up"
                            className="mt-0 mb-0 w-100"
                            disabled
                            required
                            addonBefore="£"
                            validateStatus={get(props, "priceError.wholesale_price") && "error"}
                            helpText={get(props, "priceError.wholesale_price") && "Whole sale cannot be empty"}
                        />
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 7, offset: 1 }}>
                        <InputNumberChange
                            value={get(props, "price.duty", "")}
                            type="duty"
                            className="mt-0 mb-0 w-100"
                            label="Duty"
                            disabled
                            required
                            addonBefore="£"
                            validateStatus={get(props, "priceError.duty") && "error"}
                            helpText={get(props, "priceError.duty") && "Duty cannot be empty"}
                        />
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 7 }}>
                        <InputNumberChange
                            value={get(props, "price.uk_trade_price", "")}
                            className="mt-0 mb-0 w-100"
                            type="uk_trade_price"
                            label="UK Trade Price"
                            disabled
                            required
                            addonBefore="£"
                            validateStatus={get(props, "priceError.uk_trade_price") && "error"}
                            helpText={get(props, "priceError.uk_trade_price") && "UK Trade Price cannot be empty"}
                        />
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 7, offset: 1 }}>
                        <InputNumberChange
                            value={get(props, "price.retail_price_case", "")}
                            className="mt-0 mb-0 w-100"
                            type="retail_price_case"
                            label="Retail Price Case"
                            disabled
                            required
                            addonBefore="£"
                            validateStatus={get(props, "priceError.retail_price_case") && "error"}
                            helpText={get(props, "priceError.retail_price_case") && "Retail Price Case cannot be empty"}
                        />
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 7, offset: 1 }}>
                        <InputNumberChange
                            value={get(props, "price.retail_price_case_incl_vat", "")}
                            className="mt-0 mb-0 w-100"
                            type="retail_price_case_incl_vat"
                            label="Retail Price Case w VAT"
                            disabled
                            required
                            addonBefore="£"
                            validateStatus={get(props, "priceError.retail_price_case_incl_vat") && "error"}
                            helpText={get(props, "priceError.retail_price_case_incl_vat") && "Retail Price Case VAT cannot be empty"}
                        />
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 7 }}>
                        <InputNumberChange
                            value={get(props, "price.retail_price_unit_incl_vat", "")}
                            className="mt-0 mb-0 w-100"
                            type="retail_price_unit_incl_vat"
                            label="Retail Price Unit w VAT"
                            disabled
                            required
                            addonBefore="£"
                            validateStatus={get(props, "priceError.retail_price_unit_incl_vat") && "error"}
                            helpText={get(props, "priceError.retail_price_unit_incl_vat") && "Retail Price Unit VAT cannot be empty"}
                        />
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 7, offset: 1 }}>
                        <InputNumberChange
                            handleChange={props.handlePriceChange}
                            value={get(props, "price.offer_price", "")}
                            className="mt-0 mb-0 w-100"
                            type="offer_price"
                            label="Offer Price"
                            addonBefore="£"
                        />
                    </Col>
                </Row>
                <InputTextArea
                    handleChange={(key, value) => props.handleChange("comments", props.setComments, value)}
                    className="mt-0 mb-0 w-100"
                    type="comments"
                    value={get(props, "comments")}
                    label="Reason"
                    required
                    validateStatus={get(props, "commentsError") && "error"}
                    helpText={get(props, "commentsError") && "Reason cannot be empty"}
                /> */}

        <Row gutter={[16, 16]}>
          <Col xs={{ span: 24 }} sm={{ span: 8 }}>
            <InputNumberChange
              handleChange={props.handlePriceChange}
              value={get(props, "price.export_price", "")}
              type="export_price"
              label="Export Pricing"
              onBlur={props.handleExportPrice}
              handleEnterKey={props.handleExportPrice}
              className="mt-0 mb-0 w-100"
              required
              addonBefore="£"
              validateStatus={get(props, "priceError.export_price") && "error"}
              helpText={get(props, "priceError.export_price") && "Export Pricing cannot be empty"}
            />
          </Col>
          <Col xs={{ span: 24 }} sm={{ span: 8 }}>
            <InputNumberChange handleChange={props.handlePriceChange} value={get(props, "price.offer_price", "")} className="mt-0 mb-0 w-100" type="offer_price" label="Offer Price" addonBefore="£" />
          </Col>
          <Divider className="mt-0 mb-0" />
          <Col xs={{ span: 24 }}>
            <Row gutter={[16, 6]}>
              <Col xs={{ span: 24 }} sm={{ span: 3 }}>
                <p className="summary__card_content__title">Duty</p>
                <p className="summary__card_content__value">£ {getValue(get(props, "price.duty", "NA"))}</p>
              </Col>
              <Col xs={{ span: 24 }} sm={{ span: 5 }}>
                <p className="summary__card_content__title">Export + Duty</p>
                <p className="summary__card_content__value">£ {getValue(get(props, "price.sum_of_export_and_duty", "NA"))}</p>
              </Col>
              <Col xs={{ span: 24 }} sm={{ span: 6 }}>
                <p className="summary__card_content__title">UK Trade P(15% Margin)</p>
                <p className="summary__card_content__value">£ {getValue(get(props, "price.uk_trade_price", "NA"))}</p>
              </Col>
              <Col xs={{ span: 24 }} sm={{ span: 5 }}>
                <p className="summary__card_content__title">Trade P per Bottle</p>
                <p className="summary__card_content__value">£ {getValue(get(props, "price.trade_price_per_bottle", "NA"))}</p>
              </Col>
              <Col xs={{ span: 24 }} sm={{ span: 5 }}>
                <p className="summary__card_content__title">UK GP per Case</p>
                <p className="summary__card_content__value">£ {getValue(get(props, "price.uk_gp_per_case", "NA"))}</p>
              </Col>
            </Row>
          </Col>
          <Col xs={{ span: 24 }}>
            <table className="retail_table my-2">
              <thead>
                <tr>
                  <th>
                    <p className="summary__card_content__title">Retail Margin</p>
                  </th>
                  {get(props, "price.prices_as_per_retail_margins", []).map((list) => {
                    return (
                      <th key={get(list, "retail_margin_percent")}>
                        <p className="summary__card_content__title">{getValue(get(list, "retail_margin_percent", "NA"))}%</p>
                      </th>
                    );
                  })}
                  {get(props, "price.prices_as_per_retail_margins", []).length === 0 && (
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
                  {get(props, "price.prices_as_per_retail_margins", []).map((list) => {
                    return (
                      <td key={get(list, "uk_retail_price_per_case")}>
                        <p className="summary__card_content__value">£ {getValue(get(list, "uk_retail_price_per_case", "NA"))}</p>
                      </td>
                    );
                  })}
                  {get(props, "price.prices_as_per_retail_margins", []).length === 0 && (
                    <td>
                      <p className="summary__card_content__value">NA</p>
                    </td>
                  )}
                </tr>
                <tr>
                  <th>
                    <p className="summary__card_content__title">UK Retail P/Case w VAT</p>
                  </th>
                  {get(props, "price.prices_as_per_retail_margins", []).map((list) => {
                    return (
                      <td key={get(list, "uk_retail_price_per_case_wit_vat")}>
                        <p className="summary__card_content__value">£ {getValue(get(list, "uk_retail_price_per_case_wit_vat", "NA"))}</p>
                      </td>
                    );
                  })}
                  {get(props, "price.prices_as_per_retail_margins", []).length === 0 && (
                    <td>
                      <p className="summary__card_content__value">NA</p>
                    </td>
                  )}
                </tr>
                <tr>
                  <th>
                    <p className="summary__card_content__title">UK Retail P/Bottle</p>
                  </th>
                  {get(props, "price.prices_as_per_retail_margins", []).map((list) => {
                    return (
                      <td key={get(list, "uk_retail_price_per_bottle")}>
                        <p className="summary__card_content__value">£ {getValue(get(list, "uk_retail_price_per_bottle", "NA"))}</p>
                      </td>
                    );
                  })}
                  {get(props, "price.prices_as_per_retail_margins", []).length === 0 && (
                    <td>
                      <p className="summary__card_content__value">NA</p>
                    </td>
                  )}
                </tr>
              </tbody>
            </table>
          </Col>
          <Col xs={{ span: 24 }}>
            <InputTextArea
              handleChange={(key, value) => props.handleChange("comments", props.setComments, value)}
              className="mt-0 mb-0 w-100"
              type="comments"
              value={get(props, "comments")}
              label="Reason / Comments"
              required
              rows={2}
              validateStatus={get(props, "commentsError") && "error"}
              helpText={get(props, "commentsError") && "Reason cannot be empty"}
            />
          </Col>
        </Row>
      </Spin>
    </div>
  );
};

export default EditPriceInventory;
