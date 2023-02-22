import { get, has } from "lodash";
import React from "react";
import ErrorBoundary from "../../../../UIComponents/ErrorBoundary";
import { defaultCaskValues } from "../constants";
import AdditionalDetails from "./additionalDetails";
import CaskContents from "./caskContent";
import CaskDetails from "./caskDetails";
import CaskType from "./caskType";
import "./index.scss";
import WareHouseDetails from "./wareHouseDetails";

/**
 * Renders Add Cask Component
 */
const AddCask = (props) => {
  const [caskValues, setCaskValues] = React.useState(defaultCaskValues);

  const handleChange = React.useCallback((key, value, currentKey) => {
    let newValue = { ...caskValues };
    newValue[key] = value;
    setCaskValues(newValue);
    if (has(props, "handleChange")) {
      props.handleChange(newValue, currentKey);
    }
  });

  return (
    <>
      <div className="p-0 portal_styling__1 table-responsive-padding">
        <ErrorBoundary>
          <CaskDetails error={get(props, "error")} cask_details={get(caskValues, "cask_details", {})} handleChange={handleChange} />
          <CaskType error={get(props, "error")}  cask_type={get(caskValues, "cask_type", {})} handleChange={handleChange} />
          <CaskContents error={get(props, "error")}  cask_contents={get(caskValues, "cask_contents", {})} handleChange={handleChange} />
          <WareHouseDetails error={get(props, "error")}  warehouse_details={get(caskValues, "warehouse_details", {})} handleChange={handleChange} />
          <AdditionalDetails error={get(props, "error")}  additional_details={get(caskValues, "additional_details", {})} handleChange={handleChange} />
        </ErrorBoundary>
      </div>
    </>
  );
};

export default AddCask;
