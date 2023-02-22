import { Col, Divider, Row } from "antd";
import { cloneDeep, get } from "lodash";
import React from "react";
import { connect } from "react-redux";
import { defaultTaxonomyMasterDataListName, MasterDataKeyPair } from "../../../../constants";
import { getKeyValuePair } from "../../../../helpers/utility";
import { defaultRequestOptions } from "../../../../settings";
import { getCasedGoodsTags } from "../../../../store/CasedGoods/casedGoods.actions";
import { getTaxonomyData, updateAllTaxonomyData } from "../../../../store/Taxonomy/taxonomy.actions";
import { CustomDatePicker } from "../../../UIComponents/DatePicker";
import ErrorBoundary from "../../../UIComponents/ErrorBoundary";
import { CustomInputNumber as InputNumberChange, CustomInputText as InputChange } from "../../../UIComponents/Input/customInput";
import { SingleSelect as Select } from "../../../UIComponents/Select/singleSelect";
import EditableTagGroup from "../../../UIComponents/Tags/editableTags";
import { openNotificationWithIcon } from "../../../UIComponents/Toast/notification";
import "../index.scss";
import { getTags } from "../utility/helper";

const BasicDetailsCasedGood = (props) => {
  const [clonedTags, updateClonedTags] = React.useState([]);
  const [isTagsCleared, setIsTagsCleared] = React.useState(false);

  const fetchTaxonomyData = async (masterKey = defaultTaxonomyMasterDataListName, sort_key = "", sort_order = "ASC") => {
    let requestOptions = cloneDeep(defaultRequestOptions);
    requestOptions[MasterDataKeyPair.MasterDataKey] = masterKey;
    requestOptions["orderby_field"] = sort_key;
    requestOptions["orderby_value"] = sort_order;
    const taxonomyData = await props.getTaxonomyData(requestOptions);

    if (get(taxonomyData, "error", false)) {
      openNotificationWithIcon("error", `${capitalizeAllLetter(masterKey.replace(/_/g, " "))}`, `${get(taxonomyData, "error.message", "Something Went Wrong")} `);
    }

    const currentDataObj = { [masterKey]: { ...get(taxonomyData, "response"), requestPayload: requestOptions } };
    props.updateAllTaxonomyData(currentDataObj);
  };

  const fetchTags = async () => {
    const requestOptions = { page: "all" };
    const tagsResponse = await props.getCasedGoodsTags(requestOptions);

    if (get(tagsResponse, "response.status")) {
      updateTags(get(tagsResponse, "response.data"));
      setIsTagsCleared(true);
    }

    if (!get(tagsResponse, "response.status")) {
      openNotificationWithIcon("info", "Inventory", `${get(tagsResponse, "response.message", "Something Went Wrong")} `);
    }

    if (get(tagsResponse, "error", false)) {
      openNotificationWithIcon("error", "Inventory", `${get(tagsResponse, "error.message", "Something Went Wrong")} `);
    }
  };

  const updateTags = (tagsResponse) => {
    updateClonedTags(getTags(tagsResponse));
  };

  React.useEffect(() => {
    if (get(props, "casedGoodsTags.data", []).length === 0) {
      fetchTags();
    } else {
      updateTags(get(props, "casedGoodsTags.data", []));
    }
  }, []);

  return (
    <>
      <div className="common_card_section">
        <ErrorBoundary>
          <Row gutter={[16, 0]}>
            <Col xs={{ span: 24 }} md={{ span: 24 }}>
              <Row gutter={[16, 16]}>
                <Col xs={{ span: 24 }} md={{ span: 8 }} lg={{ span: 6 }}>
                  <Select
                    handleChange={(key, value) => props.handleChange(key, value)}
                    value={get(props, "newCase.brand", "")}
                    type="brand"
                    label="Brand Name"
                    required
                    onDropdownVisibleChange={() => {
                      if (get(props, "masterAllData.brand.data", []).length === 0 || get(props, "masterAllData.brand.requestPayload.orderby_value", "") !== "ASC") {
                        fetchTaxonomyData("brand", "brand_name", "ASC");
                      }
                    }}
                    loading={get(props, "isTaxonomyDataLoading", false)}
                    validateStatus={get(props, "error.brand") && "error"}
                    helpText={get(props, "error.brand") && "Brand cannot be empty"}
                    options={getKeyValuePair(get(props, "masterAllData.brand.data", []), "brand_name", false)}
                    className="mt-0 mb-0"
                  />
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 8 }} lg={{ span: 6 }}>
                  <Select
                    handleChange={props.handleChange}
                    value={get(props, "newCase.spirit_type", "")}
                    type="spirit_type"
                    required
                    onDropdownVisibleChange={() => {
                      if (get(props, "masterAllData.spirit_type.data", []).length === 0) {
                        fetchTaxonomyData("spirit_type");
                      }
                    }}
                    loading={get(props, "isTaxonomyDataLoading", false)}
                    validateStatus={get(props, "error.spirit_type") && "error"}
                    helpText={get(props, "error.spirit_type") && "Spirit cannot be empty"}
                    label="Spirit Type"
                    className="mt-0 mb-0"
                    options={getKeyValuePair(get(props, "masterAllData.spirit_type.data", []), "spirit_type")}
                  />
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 8 }} lg={{ span: 6 }}>
                  <Select
                    handleChange={props.handleChange}
                    value={get(props, "newCase.distillery", "")}
                    type="distillery"
                    required
                    onDropdownVisibleChange={() => {
                      if (
                        get(props, `masterAllData.${defaultTaxonomyMasterDataListName}.data`, []).length === 0 ||
                        get(props, `masterAllData.${defaultTaxonomyMasterDataListName}.requestPayload.orderby_value"`) !== "ASC"
                      ) {
                        fetchTaxonomyData(defaultTaxonomyMasterDataListName, "distillery_name", "ASC");
                      }
                    }}
                    loading={get(props, "isTaxonomyDataLoading", false)}
                    validateStatus={get(props, "error.distillery") && "error"}
                    helpText={get(props, "error.distillery") && "Distillery cannot be empty"}
                    label="Distillery"
                    className="mt-0 mb-0"
                    options={getKeyValuePair(get(props, `masterAllData.${defaultTaxonomyMasterDataListName}.data`, []), "distillery_name", false)}
                  />
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 8 }} lg={{ span: 6 }}>
                  <InputChange handleChange={props.handleChange} value={get(props, "newCase.cask", "")} type="cask" className="mt-0 mb-0" label="Cask" />
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 8 }} lg={{ span: 6 }}>
                  <Select
                    handleChange={(key, value) => props.handleChange(key, value)}
                    value={get(props, "newCase.gift_box", "")}
                    type="gift_box"
                    label="Gift Box"
                    required
                    onDropdownVisibleChange={() => {
                      if (get(props, "masterAllData.gift_box.data", []).length === 0) {
                        fetchTaxonomyData("gift_box");
                      }
                    }}
                    loading={get(props, "isTaxonomyDataLoading", false)}
                    validateStatus={get(props, "error.gift_box") && "error"}
                    helpText={get(props, "error.gift_box") && "Gift Box cannot be empty"}
                    options={getKeyValuePair(get(props, "masterAllData.gift_box.data", []), "name")}
                    className="mt-0 mb-0"
                  />
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 8 }} lg={{ span: 6 }}>
                  <Select
                    handleChange={props.handleChange}
                    value={get(props, "newCase.cask_type", "")}
                    onDropdownVisibleChange={() => {
                      if (get(props, "masterAllData.cask_type.data", []).length === 0) {
                        fetchTaxonomyData("cask_type");
                      }
                    }}
                    loading={get(props, "isTaxonomyDataLoading", false)}
                    type="cask_type"
                    className="mt-0 mb-0"
                    label="Cask Type"
                    options={getKeyValuePair(get(props, "masterAllData.cask_type.data", []), "cask_type_name")}
                  />
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 8 }} lg={{ span: 6 }}>
                  <CustomDatePicker
                    handleChange={props.handleChange}
                    value={get(props, "newCase.ays", "")}
                    type="ays"
                    placeholder="A.Y.S (YYYY-MM-DD)"
                    validateStatus={get(props, "error.ays") && "error"}
                    helpText={get(props, "error.ays") ? "A.Y.S should be less than Bottling Date" : ""}
                    className="mt-0 mb-0 w-100"
                    label="A.Y.S (YYYY-MM-DD)"
                  />
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 8 }} lg={{ span: 6 }}>
                  <CustomDatePicker
                    handleChange={props.handleChange}
                    value={get(props, "newCase.bottling_date", "")}
                    type="bottling_date"
                    className="mt-0 mb-0 w-100"
                    label="Bottling Date (YYYY-MM-DD)"
                    placeholder="Bottling Date (YYYY-MM-DD)"
                  />
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 8 }} lg={{ span: 6 }}>
                  <InputNumberChange handleChange={props.handleChange} value={get(props, "newCase.age", "")} type="age" className="mt-0 mb-0 w-100" label="Age" />
                </Col>
              </Row>
            </Col>
            <Col xs={{ span: 24 }} md={{ span: 24 }}>
              <Divider orientation="left">Tags</Divider>
              <EditableTagGroup selectedTags={get(props, "newCase.tags", [])} tags={clonedTags} type="tags" isCleared={isTagsCleared} handleChange={props.handleChange} />
            </Col>
          </Row>
        </ErrorBoundary>
      </div>
    </>
  );
};

export default connect(
  (state) => ({
    taxonomyError: state.taxonomy.error,
    isTaxonomyDataLoading: state.taxonomy.loading,
    masterAllData: state.taxonomy.masterAllData,
    casedGoodsTags: state.casedGoods.tags,
  }),
  {
    getCasedGoodsTags,
    getTaxonomyData,
    updateAllTaxonomyData,
  }
)(BasicDetailsCasedGood);
