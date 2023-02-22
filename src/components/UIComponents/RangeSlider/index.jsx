import { Slider } from "antd";
import { get, has, toString } from "lodash";
import React from "react";
import { isMobileOrTab } from "../../../constants";
import { getScreenSize } from "../../../helpers/utility";
import "./index.scss";

const getKey = (key, type = "number") => {
  let returnVal = key;
  if (type === "string") {
    switch (toString(key)) {
      case "0":
        returnVal = "N";
        break;
      case "1":
        returnVal = "A";
        break;
      case "2":
        returnVal = "B";
        break;
      case "3":
        returnVal = "C";
        break;
      case "4":
        returnVal = "D";
        break;
      case "5":
        returnVal = "E";
        break;
      default:
        returnVal = key;
        break;
    }
  }
  return returnVal;
};

const getNumber = (key, type = "number") => {
  let returnVal = key;
  if (type === "string") {
    switch (toString(key)) {
      case "N":
        returnVal = 0;
        break;
      case "A":
        returnVal = 1;
        break;
      case "B":
        returnVal = 2;
        break;
      case "C":
        returnVal = 3;
        break;
      case "D":
        returnVal = 4;
        break;
      case "E":
        returnVal = 5;
        break;
      default:
        returnVal = key;
        break;
    }
  }
  return returnVal;
};

export const RangeSlider = (props) => {
  const [value, setValue] = React.useState(getNumber(get(props, "defaultValue", 0), get(props, "type")));

  const handleChange = (e) => {
    const valueIndex = get(props, "data").findIndex((item) => item === getKey(e, get(props, "type")));

    if (valueIndex >= 0) {
      setValue(valueIndex);
      if (has(props, "onChange")) {
        props.onChange(getKey(e, get(props, "type")));
      }
    }
  };

  return (
    <div className="range-slider">
      {!get(props, "notDisplayTitle") || getScreenSize() < isMobileOrTab ? (
        <div className="range-slider-title-box">
          {get(props, "data")
            ? (get(props, "rangeLabelData") ? get(props, "rangeLabelData", []) : get(props, "data")).map((item, index) => {
              return (
                <span key={index} className={(get(props, "rangeLabelData") ? value / 2 : value) === index ? "active" : ""}>
                  {item}
                </span>
              );
            })
            : null}
        </div>
      ) : null}
      <Slider min={0} max={get(props, "max") ? get(props, "max", 0) : get(props, "data", []).length - 1} step={get(props, "step", 1)} tooltip={false} defaultValue={value} onChange={handleChange} />
      <div className="range-slider-name-box">
        {get(props, "stepName")
          ? get(props, "stepName").map((item, index) => {
            return <span key={index}>{item}</span>;
          })
          : null}
      </div>
    </div>
  );
};
