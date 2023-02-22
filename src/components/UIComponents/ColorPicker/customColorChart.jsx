import { Col, Input, Row } from "antd";
import axios from "axios";
import { find, findIndex, get, map } from "lodash";
import React from "react";
import { CirclePicker } from "react-color";
import { getRequestHeader } from "../../../helpers/service";
import { openNotificationWithIcon } from "../Toast/notification";

const CustomColorChart = (props) => {
  const [selectedColorIndex, setSelectedColorIndex] = React.useState(null);
  const [availableColorList, setAvailableColorList] = React.useState([]);

  React.useEffect(() => {
    fetchColorList();
  }, []);

  const fetchColorList = async () => {
    const rest = await axios({
      method: "POST",
      data: {
        page: "all",
      },
      url: `${process.env.REACT_APP_API_ENDPOINT}/api/v1/color`,
      headers: { ...getRequestHeader() },
    }).catch((err) => {
      openNotificationWithIcon("error", `${get(err, "response.data.message", "Something Went Wrong")} `);
    });

    if (get(rest, "data.status")) {
      if (get(props, "value")) {
        const tempObjIndex = findIndex(get(rest, "data.data", []), function (o) {
          return get(o, "name") === get(props, "value");
        });
        setSelectedColorIndex(tempObjIndex);
      }
      setAvailableColorList(get(rest, "data.data", []));
    }

    if (!get(rest, "data.status", true)) {
      openNotificationWithIcon("error", `${get(rest, "response.data.message", "Something Went Wrong")} `);
    }
  };

  const colorSequence = map(availableColorList, function (o) {
    return o.code;
  });

  const handleSliderSelect = (e) => {
    setSelectedColorIndex(e.target.value);
    props.onChange(availableColorList[e.target.value]);
  };

  const handleChange = (color, event) => {
    const index = colorSequence.indexOf(get(color, "hex", "").toUpperCase());
    setSelectedColorIndex(index);
    props.onChange(availableColorList[index]);
  };

  const getColorTitle = (colorInput) => {
    const colorIndexed = colorInput ? colorInput : colorSequence[selectedColorIndex];
    const selectedObj = find(availableColorList, function (o) {
      return get(o, "code") === colorIndexed;
    });

    return get(selectedObj, "name", "");
  };

  let s = document.createElement("style");
  document.head.appendChild(s);
  s.textContent = `.slider::-webkit-slider-thumb{background-color: ${colorSequence[selectedColorIndex]}}; .slider::-moz-range-thumb{background-color: ${colorSequence[selectedColorIndex]}}; `;

  return (
    <div className={`${get(props, "mobileType") === "mobile_custom" && "common_card_section mb-0"}`}>
      <Row gutter={[16, 16]}>
        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 12 }}>
          <div className={`${get(props, "mobileType") === "mobile_custom" ? "" : "common_card_section"} color_display`}>
            {get(props, "value") ? (
              <>
                <div className="pick_color_box" style={{ backgroundColor: colorSequence[selectedColorIndex] }}></div>
                <div className="inner_div">
                  <p>{getColorTitle()}</p>
                  <span className="active_color"></span>
                  <span>{colorSequence[selectedColorIndex]}</span>
                </div>
              </>
            ) : (
              <div className="pick_color_box" style={{ background: "transparent", lineHeight: "140px", textAlign: "center" }}>
                NO COLOR SELECTED
              </div>
            )}
          </div>
        </Col>
        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 12 }}>
          <div className={`${get(props, "mobileType") === "mobile_custom" ? "" : "common_card_section"} color_display`}>
            <div className="range_slider">
              <Input
                type="range"
                min={0}
                style={{
                  backgroundImage: `linear-gradient(to right,${colorSequence.join(",")})`,
                }}
                max={colorSequence.length - 1}
                className="slider"
                value={selectedColorIndex}
                onChange={handleSliderSelect}
              />
            </div>
            <CirclePicker colors={colorSequence} onChange={handleChange} color={colorSequence[selectedColorIndex]} circleSpacing={0} circleSize={46} />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default CustomColorChart;
