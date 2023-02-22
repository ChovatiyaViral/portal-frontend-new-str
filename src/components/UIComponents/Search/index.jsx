import { Input } from "antd";
import { get } from "lodash";
import React from "react";
import SVGIcon from "../../../constants/svgIndex";
/**
 * Global level search component
 * @param
 * @returns searched values
 */
export const SearchInput = (props) => {
  const [value, setValue] = React.useState("");

  React.useEffect(() => {
    if (props.clearSearchString) {
      setValue("");
    }
  }, [props]);

  const onSearch = (searchString) => {
    setValue(searchString);
    let filteredData = [];
    const isClient = get(props, "isClient", true);
    if (isClient) {
      filteredData = get(props, "data", []).filter((obj) =>
        Object.values(obj).some((val) => {
          const valueString = val ? val.toString() : "";
          return valueString.toLowerCase().includes(searchString.toLowerCase());
        })
      );
    }
    const returnSearchValues = { searchString, filteredData, isClient };
    props.handleSearch(returnSearchValues);
  };

  return (
    <div className="portal__listing__search mb-3">
      <Input
        placeholder={`${get(props, "label", "Type to search")}`}
        suffix={
          value.length > 0 && (
            <img
              src={SVGIcon.CloseIcon}
              style={{ paddingRight: 15 }}
              onClick={() => {
                onSearch("");
                setValue("");
              }}
            />
          )
        }
        allowClear={false}
        value={value}
        onChange={(e) => onSearch(e.target.value)}
        prefix={<img src={SVGIcon.SearchIcon} style={{ paddingRight: 15 }} />}
        // style={{ minWidth: 360 }}
      />
    </div>
  );
};
