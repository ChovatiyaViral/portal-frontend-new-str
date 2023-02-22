import { Button } from "antd";
import { CloseCircleOutlined, SaveOutlined } from "@ant-design/icons";
import { get, has } from "lodash";
import React from "react";
import { useDispatch } from "react-redux";
import { setCurrentView } from "../../../../../store/Auth/auth.actions";
import ErrorBoundary from "../../../../UIComponents/ErrorBoundary";
import { defaultCaskValues } from "../constants";
import AdditionalDetails from "./additionalDetails";
import "./index.scss";
import PassportDetails from "./passportDetails";
import PassportType from "./passportType";

/**
 * Renders Add Cask Component
 */
const AddPassport = (props) => {
  const dispatch = useDispatch();
  const [caskValues, setCaskValues] = React.useState(defaultCaskValues);

  React.useEffect(() => {
    dispatch(setCurrentView("Add New Passport"));
  }, []);

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
      <div className=" portal_styling__1 table-responsive-padding">
        <ErrorBoundary>
          <PassportDetails error={get(props, "error")} cask_details={get(caskValues, "cask_details", {})} handleChange={handleChange} />
          <PassportType error={get(props, "error")} cask_type={get(caskValues, "cask_type", {})} handleChange={handleChange} />
          <AdditionalDetails error={get(props, "error")} additional_details={get(caskValues, "additional_details", {})} handleChange={handleChange} />
          <div className="add_passport_footer_section">
            <Button type="secondary" icon={<CloseCircleOutlined />}>
              Cancel
            </Button>
            <Button type="primary" disabled icon={<SaveOutlined />}>
              Save
            </Button>
          </div>
        </ErrorBoundary>
      </div>
    </>
  );
};

export default AddPassport;
