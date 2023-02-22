import { Col, Collapse, Row, Space } from "antd";
import { get } from "lodash";
import React from "react";

const { Panel } = Collapse;

const MobileComparisonDetails = (props) => {

  const getLink = (name) => {
    return (
      <>
        <a href={`/regauging/view-details/${name}`} target="_blank">
          {name.name}
        </a>
        <p>({name.date})</p>
      </>
    );
  };

  const getComparisonValue = (key, value, index) => {
    if (key === "color_code") {
      return (
        <div className="color_div">
          {
            get(value, "color") !== "NA" &&
            <div className="color_box" style={{ backgroundColor: value.color }}></div>
          }
          <h5>{value.name}</h5>
        </div>
      );
    } else {
      return value;
    }
  };

  return (
    <>
      <div className="mobile_comparison_details text-capitalize">
        <Space direction="vertical" className="mobile_view_space">
          <Collapse collapsible="header" defaultActiveKey={get(props, "comparisonDetails", []).map((item, index) => index)} expandIconPosition="end">
            {get(props, "comparisonDetails", []).map((item, index) => {
              if (item?.name !== "") {
                return (
                  <Panel header={<span className="comparison_details_header mb-3">{item.name}</span>} key={index}>
                    <>
                      {item.unique_key === "dominant_character_markers" ? (
                        <div className="dominant_character_markers_main_section">
                          {item.subTitles.map((domainItem, titleIndex) => {
                            return (
                              <div key={titleIndex} className="dominant_character_markers_inner_div">
                                <h1>{domainItem}</h1>
                                <Row gutter={[24, 24]}>
                                  <Col span={12}>
                                    <div className="sampling_header">{getLink(get(props, "comparisonDetails")[0]?.broken)}</div>
                                    <div className="summary__card_content__value">{get(item, "broken")[titleIndex]}</div>
                                  </Col>
                                  <Col span={12}>
                                    <div className="sampling_header">{getLink(get(props, "comparisonDetails")[0]?.bad)}</div>
                                    <div className="summary__card_content__value">{get(item, "bad")[titleIndex]}</div>
                                  </Col>
                                  <Col span={12}>
                                    <div className="sampling_header">{getLink(get(props, "comparisonDetails")[0]?.okay)}</div>
                                    <div className="summary__card_content__value">{get(item, "okay")[titleIndex]}</div>
                                  </Col>
                                  <Col span={12}>
                                    <div className="sampling_header">{getLink(get(props, "comparisonDetails")[0]?.best)}</div>
                                    <div className="summary__card_content__value">{get(item, "best")[titleIndex]}</div>
                                  </Col>
                                </Row>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <Row gutter={[24, 24]}>
                          <Col span={item.unique_key === "character" ? 24 : 12}>
                            <div className="sampling_header">{getLink(get(props, "comparisonDetails")[0]?.broken)}</div>
                            <div className={`${item.unique_key === "character" && "w-100"} summary__card_content__value`}>{getComparisonValue(item?.unique_key, get(item, "broken"))}</div>
                          </Col>
                          <Col span={item.unique_key === "character" ? 24 : 12}>
                            <div className="sampling_header">{getLink(get(props, "comparisonDetails")[0]?.bad)}</div>
                            <div className={`${item.unique_key === "character" && "w-100"} summary__card_content__value`}>{getComparisonValue(item?.unique_key, get(item, "bad"))}</div>
                          </Col>
                          <Col span={item.unique_key === "character" ? 24 : 12}>
                            <div className="sampling_header">{getLink(get(props, "comparisonDetails")[0]?.okay)}</div>
                            <div className={`${item.unique_key === "character" && "w-100"} summary__card_content__value`}>{getComparisonValue(item?.unique_key, get(item, "okay"))}</div>
                          </Col>
                          <Col span={item.unique_key === "character" ? 24 : 12}>
                            <div className="sampling_header">{getLink(get(props, "comparisonDetails")[0]?.best)}</div>
                            <div className={`${item.unique_key === "character" && "w-100"} summary__card_content__value`}>{getComparisonValue(item?.unique_key, get(item, "best"))}</div>
                          </Col>
                        </Row>
                      )}
                    </>
                  </Panel>
                );
              }
            })}
          </Collapse>
        </Space>
      </div>
    </>
  );
};

export default MobileComparisonDetails;
