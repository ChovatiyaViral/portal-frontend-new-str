import { Col, Row } from "antd";
import { get } from "lodash";
import React from "react";
import { isMobileOrTab } from "../../../../../constants";
import SVGIcon from "../../../../../constants/svgIndex";
import { getScreenSize } from "../../../../../helpers/utility";
import { RangeSlider } from "../../../../UIComponents/RangeSlider";

const characterData = [
  {
    name: "Peaty/Smokey",
    key: "peaty_or_smokey",
    rangeData: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5],
    image: SVGIcon.SmokePipeIcon,
  },
  {
    name: "Pear/Apple",
    key: "pear_or_apple",
    rangeData: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5],
    image: SVGIcon.PearAppleIcon,
  },
  {
    name: "Grassy/Citrus",
    key: "grassy_or_citrus",
    rangeData: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5],
    image: SVGIcon.LemonIcon,
  },
  {
    name: "Floral/Herbal",
    key: "floral_or_herbal",
    rangeData: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5],
    image: SVGIcon.HerbalIcon,
  },
  {
    name: "Tofee/Vanilla",
    key: "tofee_or_vanilla",
    rangeData: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5],
    image: SVGIcon.ChocolateIcon,
  },
  {
    name: "Nutty/Oilly",
    key: "nutty_or_oilly",
    rangeData: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5],
    image: SVGIcon.NuttyIcon,
  },
  {
    name: "Dried Fruit/Sherry",
    key: "dried_fruit_or_sherry",
    rangeData: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5],
    image: SVGIcon.AlmondIcon,
  },
  {
    name: "Woody/Spicy",
    key: "woody_or_spicy",
    rangeData: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5],
    image: SVGIcon.SpicesIcon,
  },
  {
    name: "Body",
    key: "body",
    rangeData: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5],
    image: SVGIcon.CharacterCaskIcon,
  },
];

const Character = (props) => {
  return (
    <>
      {getScreenSize() > isMobileOrTab ? (
        <div className="character_box">
          <Row>
            <Col span={8}>
              <div className="title"></div>
            </Col>
            <Col span={16}>
              <div className="character_slider">
                <div className="range-slider">
                  <div className="range-slider-title-box">
                    <span>0</span>
                    <span>1</span>
                    <span>2</span>
                    <span>3</span>
                    <span>4</span>
                    <span>5</span>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      ) : null}
      {characterData.map((item, index) => {
        return (
          <div className="character_box" key={index}>
            <Row gutter={[12, 24]}>
              <Col xs={{ span: 24 }} md={{ span: 8 }}>
                <div className="title">
                  <img src={item.image} alt="Additional Details" style={{ width: "20px", height: "20px" }} />
                  <h6 className="ml-2">{item.name}</h6>
                </div>
              </Col>
              <Col xs={{ span: 24 }} md={{ span: 16 }}>
                <div className="character_slider">
                  <RangeSlider
                    defaultValue={get(props, `record.${item["key"]}`)}
                    step={0.5}
                    data={item.rangeData}
                    onChange={(v) => props.onChange({ label: item.key, value: v })}
                    notDisplayTitle={true}
                    max={5}
                    rangeLabelData={[0, 1, 2, 3, 4, 5]}
                  />
                </div>
              </Col>
            </Row>
          </div>
        );
      })}
    </>
  );
};

export default Character;
