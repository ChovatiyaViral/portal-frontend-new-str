import { get } from "lodash";
import React from "react";
import CustomColorChart from "./customColorChart";
import "./index.scss";
import MenuColorChart from "./menuColorChart";

const ColorPicker = (props) => {
  return (
    <>
      {get(props, "type") === "menu" && <MenuColorChart {...props} />}
      {get(props, "type") === "custom" && <CustomColorChart {...props} />}
    </>
  );
};

export default ColorPicker;
