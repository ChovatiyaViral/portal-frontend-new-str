import { Col, Row } from "antd";
import { cloneDeep, get } from "lodash";
import React from "react";
import { useDispatch } from "react-redux";
import { defaultTaxonomyMasterDataListName, MasterDataKeyPair } from "../../../../../constants";
import SVGIcon from "../../../../../constants/svgIndex";
import { capitalizeAllLetter, getKeyValuePair } from "../../../../../helpers/utility";
import { defaultRequestOptions } from "../../../../../settings";
import { getTaxonomyData } from "../../../../../store/Taxonomy/taxonomy.actions";
import ErrorBoundary from "../../../../UIComponents/ErrorBoundary";
import { CustomInputNumber as InputNumberChange } from "../../../../UIComponents/Input/customInput";
import { SingleSelect as Select } from "../../../../UIComponents/Select/singleSelect";
import { openNotificationWithIcon } from "../../../../UIComponents/Toast/notification";

/**
 * Renders Add Cask Content Component
 */
const CaskContents = (props) => {
  const dispatch = useDispatch();

  const [dropDownValues, setDropDownValues] = React.useState({});

  const handleChange = React.useCallback((key, value) => {
    const currentValue = value ? value : "";
    let newValue = { ...get(props, "cask_contents", {}) };
    newValue[key] = currentValue;
    props.handleChange("cask_contents", newValue, key);
  });

  const fetchTaxonomyData = async (masterKey = defaultTaxonomyMasterDataListName, sort_key = "", sort_order = "ASC") => {
    let requestOptions = cloneDeep(defaultRequestOptions);
    requestOptions[MasterDataKeyPair.MasterDataKey] = masterKey;
    requestOptions["orderby_field"] = sort_key;
    requestOptions["orderby_value"] = sort_order;

    const taxonomyData = await dispatch(getTaxonomyData(requestOptions));

    if (get(taxonomyData, "error", false)) {
      openNotificationWithIcon("error", `${capitalizeAllLetter(masterKey.replace(/_/g, " "))}`, `${get(taxonomyData, "error.message", "Something Went Wrong")} `);
    }

    let newValues = { ...dropDownValues };
    newValues[masterKey] = getKeyValuePair(get(taxonomyData, "response.data", []), sort_key, false);
    setDropDownValues(newValues);
  };

  return (
    <>
      <ErrorBoundary>
        <div className="common_card_section">
          <div style={{ display: "flex", alignItems: "center" }}>
            <img src={SVGIcon.CaskContentsIcon} alt="cask image" style={{ width: "24px", height: "24px" }} />
            <span style={{ fontWeight: 700, fontSize: 20, marginLeft: "10px" }}>Spirit Details</span>
          </div>
          <Row className="mt-4" gutter={[16, 0]}>
            <Col xs={{ span: 24 }} sm={{ span: 6 }}>
              <Select
                handleChange={(key, value) => handleChange(key, value)}
                type="brand"
                status={get(props, "error.brand") ? "error" : ""}
                validateStatus={get(props, "error.brand") && "error"}
                helpText={get(props, "error.brand") ? "Brand is mandatory" : ""}
                value={get(props, "cask_contents.brand")}
                label="Brand"
                onDropdownVisibleChange={() => {
                  if (get(dropDownValues, "brand", []).length === 0) {
                    fetchTaxonomyData("brand", "brand_name", "ASC");
                  }
                }}
                placeHolder="Select"
                options={get(dropDownValues, "brand", [])}
                className="mt-0 mb-0"
              />
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 6 }}>
              <Select
                handleChange={(key, value) => handleChange(key, value)}
                type="distillery"
                value={get(props, "cask_contents.distillery")}
                status={get(props, "error.distillery") ? "error" : ""}
                validateStatus={get(props, "error.distillery") && "error"}
                helpText={get(props, "error.distillery") ? "Distillery is mandatory" : ""}
                label="Distillery"
                onDropdownVisibleChange={() => {
                  if (get(dropDownValues, "product_distillery", []).length === 0) {
                    fetchTaxonomyData("product_distillery", "distillery_name", "ASC");
                  }
                }}
                placeHolder="Select"
                options={get(dropDownValues, "product_distillery", [])}
                className="mt-0 mb-0"
              />
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 6 }}>
              <Select
                handleChange={(key, value) => handleChange(key, value)}
                type="spirit_type"
                value={get(props, "cask_contents.spirit_type")}
                label="Spirit Type"
                status={get(props, "error.spirit_type") ? "error" : ""}
                validateStatus={get(props, "error.spirit_type") && "error"}
                helpText={get(props, "error.spirit_type") ? "Spirit type is mandatory" : ""}
                onDropdownVisibleChange={() => {
                  if (get(dropDownValues, "spirit_type", []).length === 0) {
                    fetchTaxonomyData("spirit_type", "spirit_type");
                  }
                }}
                placeHolder="Select"
                options={get(dropDownValues, "spirit_type", [])}
                className="mt-0 mb-0"
              />
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 6 }}>
              <InputNumberChange
                value={get(props, "cask_contents.ola")}
                handleChange={handleChange}
                type="ola"
                status={get(props, "error.ola") ? "error" : ""}
                validateStatus={get(props, "error.ola") && "error"}
                helpText={get(props, "error.ola") ? "OLA is mandatory" : ""}
                className="mt-0 mb-0 w-100"
                label="OLA"
              />
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 6 }}>
              <InputNumberChange
                value={get(props, "cask_contents.rla")}
                handleChange={handleChange}
                type="rla"
                status={get(props, "error.rla") ? "error" : ""}
                validateStatus={get(props, "error.rla") && "error"}
                helpText={get(props, "error.rla") ? "RLA is mandatory" : ""}
                className="mt-0 mb-0 w-100"
                label="RLA"
              />
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 6 }}>
              <InputNumberChange
                value={get(props, "cask_contents.strength")}
                handleChange={handleChange}
                type="strength"
                status={get(props, "error.strength") ? "error" : ""}
                validateStatus={get(props, "error.strength") && "error"}
                helpText={get(props, "error.strength") ? "Strength is mandatory" : ""}
                className="mt-0 mb-0 w-100"
                label="Strength"
              />
            </Col>
          </Row>
        </div>
      </ErrorBoundary>
    </>
  );
};

export default CaskContents;
