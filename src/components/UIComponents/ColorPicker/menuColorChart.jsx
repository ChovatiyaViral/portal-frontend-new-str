import { DownOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Button, Dropdown, Space } from "antd";
import axios from "axios";
import { find, get, map } from "lodash";
import React from "react";
import { CirclePicker } from "react-color";
import { getRequestHeader } from "../../../helpers/service";
import { openNotificationWithIcon } from "../Toast/notification";
import "./index.scss";

const MenuColorChart = (props) => {
  const [selectedColorIndex, setSelectedColorIndex] = React.useState(get(props, "selectedColor", 5));
  const [applyColorCode, setApplyColorCode] = React.useState("");
  const [availableColorList, setAvailableColorList] = React.useState([]);
  const [dropDownVisibleChange, setDropDownVisibleChange] = React.useState(false);

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
      setAvailableColorList(get(rest, "data.data", []));
    }

    if (!get(rest, "data.status", true)) {
      openNotificationWithIcon("error", `${get(rest, "response.data.message", "Something Went Wrong")} `);
    }
  };

  const colorSequence = map(availableColorList, function (o) {
    return o.code;
  });

  const handleChangeColor = (e) => {
    const findIndex = colorSequence.findIndex((item) => item.toLowerCase() === e.hex);
    setSelectedColorIndex(findIndex);
  };

  const handleSliderSelect = (e) => {
    setSelectedColorIndex(e.target.value);
  };

  const handleApplyColorCode = (selectedColorIndex) => {
    setApplyColorCode(colorSequence[selectedColorIndex]);
    setDropDownVisibleChange(false);
    props.applyColorCode(getColorTitle(colorSequence[selectedColorIndex]));
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

  const menu = [
    {
      key: "1",
      label: (
        <div className="dropdown_Menu" id="custom_color_range_slider">
          <h6>Pick a Color</h6>
          <div className="pick_color_box" style={{ background: colorSequence[selectedColorIndex] }}></div>
          <div className="inner_div">
            <p>{getColorTitle()}</p>
            {/* <span>1.2</span> */}
            <span className="active_color"></span>
            <span>{colorSequence[selectedColorIndex]}</span>
          </div>
          <div className="range_slider">
            <input
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
          <CirclePicker colors={colorSequence} circleSpacing={0} color={colorSequence[selectedColorIndex]} circleSize={24} onChange={handleChangeColor} />
          <Button type="primary" className="float-right" onClick={() => handleApplyColorCode(selectedColorIndex)}>
            Apply
          </Button>
          <Button type="secondary" ghost className="float-right cancel_button" icon={<CloseCircleOutlined />} onClick={() => setDropDownVisibleChange(false)}>
            Cancel
          </Button>
        </div>
      ),
    },
  ];

  React.useEffect(() => {
    fetchColorList();
  }, []);

  return (
    <>
      <label className="dropdown_label">Pick a Color</label>
      <Dropdown
        menu={{ menu }}
        className={`pick_color_dropdown ${get(props, "validateStatus") ? "error" : ""}`}
        open={dropDownVisibleChange}
        onClick={() => setDropDownVisibleChange(!dropDownVisibleChange)}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
          {applyColorCode ? (
            <>
              <div className="color_box" style={{ backgroundColor: applyColorCode }}></div>
              <h6>{getColorTitle(applyColorCode)}</h6>
            </>
          ) : (
            <Space style={{ color: "rgba(0, 0, 0, 0.25)", fontWeight: 500, fontSize: 15 }}>Pick a Color</Space>
          )}
          <DownOutlined />
        </div>
      </Dropdown>
      {get(props, "validateStatus") && (
        <div class="ant-form-item-explain ant-form-item-explain-error">
          <div role="alert">Color is mandatory</div>
        </div>
      )}
    </>
  );
};

export default MenuColorChart;