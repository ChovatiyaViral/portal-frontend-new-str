import { Col, message, Row, Tag } from "antd";
import axios from "axios";
import { filter, get, uniqBy } from "lodash";
import React from "react";
import Carousel, { consts } from "react-elastic-carousel";
import BarrelImg from "../../../../../assets/images/b1.png";
import CaskTypeImg from "../../../../../assets/svg/cask_type.svg";
import { getRequestHeader } from "../../../../../helpers/service";
import ErrorBoundary from "../../../../UIComponents/ErrorBoundary";
import { openNotificationWithIcon } from "../../../../UIComponents/Toast/notification";

/**
 * Renders Select Cask Type Component
 */
const CaskType = (props) => {
  const [selectedItem, setSelectedItem] = React.useState(null);
  const [selectedTag, setSelectedTag] = React.useState(null);
  const [caskTypeListing, setCaskTypeListing] = React.useState([]);

  const handleChange = React.useCallback((key, value) => {
    let newValue = { ...get(props, "cask_type", "") };
    newValue[key] = value;
    props.handleChange("cask_type", newValue);
  });

  const myArrow = ({ type, onClick, isEdge }) => {
    const pointer = type === consts.PREV ? "" : "";
    return <></>;
  };

  const breakPoints = [
    { width: 1, itemsToShow: 1 },
    { width: 550, itemsToShow: 3 },
    { width: 850, itemsToShow: 5 },
    { width: 1150, itemsToShow: 6 },
    { width: 1450, itemsToShow: 7 },
    { width: 1750, itemsToShow: 8 },
  ];

  const getCaskTypeList = async () => {
    const rest = await axios({
      method: "POST",
      data: {
        page: "all",
        masterdata_key: "cask_type",
        status_filter: "all",
        orderby_field: "volume",
        orderby_value: "DESC",
      },
      url: `${process.env.REACT_APP_API_ENDPOINT}/api/masterdata`,
      headers: { ...getRequestHeader() },
    }).catch((err) => {
      openNotificationWithIcon("error", `${get(err, "response.data.message", "Something Went Wrong")} `);
    });

    if (get(rest, "data.status")) {
      setCaskTypeListing(get(rest, "data.data", []));
    }

    if (!get(rest, "data.status", true)) {
      openNotificationWithIcon("error", `${get(rest, "response.data.message", "Something Went Wrong")} `);
    }
  };

  React.useEffect(() => {
    getCaskTypeList();
  }, []);

  const getCaskTypeCodeListing = (item) => {
    const listing = filter(caskTypeListing, function (o) {
      return get(item, "cask_type_name") === get(o, "cask_type_name");
    });

    if (listing.length === 1) {
      setSelectedTag(listing[0]);
      if (!checkForAttribute(listing[0])) {
        message.info("No Attributes found");
      }
      handleChange("cask_selected_code", get(listing[0], "cask_type_code", ""));
    }
  };

  const getFilteredCaskTypeCode = () => {
    const listing = filter(caskTypeListing, function (o) {
      return get(selectedItem, "cask_type_name") === get(o, "cask_type_name");
    });

    return listing;
  };

  const getUniqueCaskTypeName = () => {
    const uniqueList = uniqBy(caskTypeListing, function (e) {
      return e.cask_type_name;
    });
    return uniqueList;
  };

  const checkForAttribute = (list) => {
    if (get(list, "cask_attribute_1") || get(list, "cask_attribute_2") || get(list, "cask_attribute_3")) {
      return true;
    }

    return false;
  };

  const getAttributes = () => {
    let attr = [];

    if (get(selectedTag, "cask_attribute_1")) {
      attr = [...attr, get(selectedTag, "cask_attribute_1")];
    }

    if (get(selectedTag, "cask_attribute_2")) {
      attr = [...attr, get(selectedTag, "cask_attribute_2")];
    }

    if (get(selectedTag, "cask_attribute_3")) {
      attr = [...attr, get(selectedTag, "cask_attribute_3")];
    }

    return attr.join(",");
  };

  return (
    <>
      <ErrorBoundary>
        <div className="common_card_section">
          <div style={{ display: "flex", alignItems: "center" }}>
            <img src={CaskTypeImg} alt="cask type" style={{ width: "24px", height: "24px" }} />
            <span style={{ fontWeight: 700, fontSize: 20, marginLeft: "10px" }}>Select Cask Type</span>
          </div>
          <Row className="mt-4" gutter={[16,0]}>
            <Col span={24}>
              <Carousel itemPadding={[0, 15]} focusOnSelect={false} breakPoints={breakPoints} renderArrow={myArrow} itemsToShow={6}>
                {getUniqueCaskTypeName().map((item) => (
                  <div
                    key={item.id}
                    className="text-center"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setSelectedTag(null);
                      setSelectedItem(item);
                      getCaskTypeCodeListing(item);
                    }}
                  >
                    <div className="cask_type__container">
                      <img src={get(item, "image", BarrelImg)} style={{ marginBottom: 15 }} />
                      <div className={`centered ${get(selectedItem, "id") === item.id ? "selected" : ""}`}>{get(item, "volume", "")}L</div>
                    </div>
                    <p className={`barrel_title ${get(selectedItem, "id") === item.id ? "selected" : ""}`}>{get(item, "cask_type_name", "")}</p>
                  </div>
                ))}
              </Carousel>
            </Col>
            <Col>
              {selectedItem && (
                <div style={{ marginTop: 50, cursor: "pointer" }}>
                  <p style={{ fontSize: 15 }}>
                    <b>Select Cask Type Code:</b>
                  </p>
                  {getFilteredCaskTypeCode().map((list) => (
                    <>
                      <Tag
                        color={selectedTag === list ? "#38479e" : ""}
                        style={{ borderRadius: 12, fontWeight: 700 }}
                        className={`m-2 pl-5 pr-5 pt-2 pb-2 cask_type__codes ${selectedTag === list && "active"}`}
                        key={list}
                        onClick={() => {
                          handleChange("cask_selected_code", get(list, "cask_type_code", ""));
                          if (!checkForAttribute(list)) {
                            message.info("No Attributes found");
                          }
                          setSelectedTag(list);
                        }}
                      >
                        {get(list, "cask_type_code", "")}
                      </Tag>
                    </>
                  ))}
                </div>
              )}
              {selectedTag && getAttributes() && (
                <p className="mt-3 ml-2" style={{ fontSize: 15 }}>
                  <b>Cask Attributes - </b>
                  {getAttributes()}
                </p>
              )}
            </Col>
          </Row>
        </div>
      </ErrorBoundary>
    </>
  );
};

export default CaskType;
