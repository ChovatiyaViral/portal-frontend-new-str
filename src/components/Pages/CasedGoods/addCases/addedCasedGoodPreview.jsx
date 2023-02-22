import { CaretRightOutlined, CheckSquareTwoTone, CloseSquareTwoTone } from "@ant-design/icons";
import { Col, Collapse, Divider, Row, Spin } from "antd";
import { get, round } from "lodash";
import React from "react";
import { numberWithCommas } from "../../../../helpers/utility";
import { defaultValue } from "../utility/constants";
import { getName, getValue, getValueCheck } from "../utility/helper";
const { Panel } = Collapse;
export default (props) => {
  const basicTabsFields = Object.keys(get(defaultValue, "basic", {}));
  const caseTabsFields = Object.keys(get(defaultValue, "case", {}));
  const priceTabsFields = Object.keys(get(defaultValue, "price", {}));

  const getTabValue = (tab) => {
    if (tab === "total_cases") {
      const BPC = Number(get(props, "newCase.bpc", 0));
      let BIPC = get(props, "newCase.bottles_in_partial_case", ["0/0"]);
      if (BIPC) {
        BIPC = BIPC.split("/");
        BIPC = Number(BIPC[0]);
      }
      const wholeCase = Number(get(props, "newCase.whole_case", 0));
      return round(wholeCase + BIPC / BPC, 2);
    } else {
      return get(props, `newCase.${tab}`);
    }
  };

  const renderData = (index, tab, type = "") => {
    return (
      <div key={index} className="p-2">
        <b className="pr-1">
          {getValueCheck(get(props, `newCase.${tab}`, tab)) ? <CheckSquareTwoTone twoToneColor="#52c41a" className="pr-1" /> : <CloseSquareTwoTone twoToneColor="#ff4d4f" className="pr-1" />}
          {getName(tab)} :
        </b>
        {type === "price" ? <>£ {numberWithCommas(getValue(getTabValue(tab), tab))}</> : getValue(getTabValue(tab), tab)}
      </div>
    );
  };

  return (
    <Spin spinning={get(props, "loading", false)}>
      <div className="common_card_section">
        <Collapse
          bordered={false}
          ghost
          defaultActiveKey={["1", "2", "3"]}
          expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
          expandIconPosition="end"
          className="site-collapse-custom-collapse"
        >
          <Panel
            header={
              <Divider orientation="left" plain>
                <b style={{ fontSize: 14, textTransform: "uppercase" }}>Basic Details</b>
              </Divider>
            }
            key="1"
          >
            <Row gutter={[8, 0]}>
              {[...basicTabsFields, "cask", "cask_type", "ays", "bottling_date", "age", "tags"].map((tab, index) => {
                return (
                  <Col xs={{ span: 24 }} md={{ span: tab === "tags" ? 16 : 8 }} lg={{ span: tab === "tags" ? 18 : 6 }}>
                    {renderData(index, tab)}
                  </Col>
                );
              })}
            </Row>
          </Panel>
          <Panel
            header={
              <Divider orientation="left" plain>
                <b style={{ fontSize: 14, textTransform: "uppercase" }}>Case Details</b>
              </Divider>
            }
            key="2"
          >
            <Row gutter={[8, 0]}>
              {[...caseTabsFields, "total_cases", "comments"].map((tab, index) => {
                return (
                  <Col xs={{ span: 24 }} md={{ span: tab === "comments" ? 24 : 8 }} lg={{ span: 6 }}>
                    {renderData(index, tab)}
                  </Col>
                );
              })}
            </Row>
          </Panel>
          <Panel
            header={
              <Divider orientation="left" plain>
                <b style={{ fontSize: 14, textTransform: "uppercase" }}>Price Details</b>
              </Divider>
            }
            key="3"
          >
            <Row gutter={[8, 0]}>
              {priceTabsFields.map((tab, index) => {
                return (
                  <Col xs={{ span: 24 }} md={{ span: 8 }} lg={{ span: 6 }}>
                    {renderData(index, tab)}
                  </Col>
                );
              })}
            </Row>
          </Panel>
        </Collapse>
      </div>
    </Spin >
  );
};
