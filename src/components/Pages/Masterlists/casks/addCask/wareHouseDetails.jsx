import { Col, Row } from "antd";
import axios from "axios";
import { find, get } from "lodash";
import React from "react";
import SVGIcon from "../../../../../constants/svgIndex";
import { getRequestHeader } from "../../../../../helpers/service";
import { getKeyValuePair } from "../../../../../helpers/utility";
import ErrorBoundary from "../../../../UIComponents/ErrorBoundary";
import { CustomInputText as InputChange } from "../../../../UIComponents/Input/customInput";
import { SingleSelect as Select } from "../../../../UIComponents/Select/singleSelect";
import { openNotificationWithIcon } from "../../../../UIComponents/Toast/notification";

/**
 * Renders Add Warehouse details Component
 */
const WareHouseDetails = (props) => {
  const [warehouseListing, setWarehouseListing] = React.useState([]);

  const handleChange = React.useCallback((key, value) => {
    let currentKey = key;
    if (key === "warehouse_keeper_name") {
      currentKey = "offsite_warehouse";
    }
    let newValue = { ...get(props, "warehouse_details", {}) };
    const newObj = find(warehouseListing, function (o) {
      return get(o, "warehouse_keeper_name") === value;
    });
    if (newObj) {
      newValue = newObj;
    } else {
      newValue[key] = value;
    }
    props.handleChange("warehouse_details", newValue, currentKey);
  });

  const getWareHouseDetailsList = async () => {
    const rest = await axios({
      method: "POST",
      data: {
        page: "all",
      },
      url: `${process.env.REACT_APP_API_ENDPOINT}/api/v1/warehouse`,
      headers: { ...getRequestHeader() },
    }).catch((err) => {
      openNotificationWithIcon("error", `${get(err, "response.data.message", "Something Went Wrong")} `);
    });

    if (get(rest, "data.status")) {
      setWarehouseListing(get(rest, "data.data", []));
    }

    if (!get(rest, "data.status", true)) {
      openNotificationWithIcon("error", `${get(rest, "response.data.message", "Something Went Wrong")} `);
    }
  };

  React.useEffect(() => {
    getWareHouseDetailsList();
  }, []);

  return (
    <>
      <ErrorBoundary>
        <div className="common_card_section">
          <div style={{ display: "flex", alignItems: "center" }}>
            <img src={SVGIcon.WareHouseCaskIcon} alt="Warehouse" style={{ width: "24px", height: "24px" }} />
            <span style={{ fontWeight: 700, fontSize: 20, marginLeft: "10px" }}>Warehouse Details</span>
          </div>
          <Row className="mt-4" gutter={[16, 0]}>
            <Col xs={{ span: 24 }} sm={{ span: 6 }}>
              <Select
                handleChange={(key, value) => handleChange(key, value)}
                type="warehouse_keeper_name"
                status={get(props, "error.offsite_warehouse") ? "error" : ""}
                validateStatus={get(props, "error.offsite_warehouse") && "error"}
                helpText={get(props, "error.offsite_warehouse") ? "Warehouse Keeper Name is mandatory" : ""}
                value={get(props, "warehouse_details.warehouse_keeper_name")}
                label="Warehouse Keeper Name"
                placeHolder="Select"
                options={getKeyValuePair(warehouseListing, "warehouse_keeper_name", false)}
                className="mt-0 mb-0"
              />
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 6 }}>
              <InputChange handleChange={handleChange} disabled type="warehouse_name" className="mt-0 mb-0 w-100" value={get(props, "warehouse_details.warehouse_name")} label="Warehouse Name" />
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 6 }}>
              <InputChange
                value={get(props, "warehouse_details.warehouse_keeper_phone_no")}
                handleChange={handleChange}
                disabled
                type="warehouse_keeper_phone_no"
                className="mt-0 mb-0 w-100"
                label="Phone No"
              />
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 6 }}>
              <InputChange
                handleChange={handleChange}
                value={get(props, "warehouse_details.warehouse_keeper_email")}
                disabled
                type="warehouse_keeper_email"
                className="mt-0 mb-0 w-100"
                label="Email Id"
              />
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 6 }}>
              <InputChange handleChange={handleChange} value={get(props, "warehouse_details.address1")} disabled type="address1" className="mt-0 mb-0 w-100" label="Address 1" />
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 6 }}>
              <InputChange handleChange={handleChange} value={get(props, "warehouse_details.address2")} disabled type="address2" className="mt-0 mb-0 w-100" label="Address 2" />
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 6 }}>
              <InputChange handleChange={handleChange} value={get(props, "warehouse_details.state")} disabled type="state" className="mt-0 mb-0 w-100" label="State" />
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 6 }}>
              <InputChange handleChange={handleChange} value={get(props, "warehouse_details.city")} disabled type="city" className="mt-0 mb-0 w-100" label="City" />
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 6 }}>
              <InputChange handleChange={handleChange} value={get(props, "warehouse_details.postal_code")} disabled type="postal_code" className="mt-0 mb-0 w-100" label="Postal Code" />
            </Col>
          </Row>
        </div>
      </ErrorBoundary>
    </>
  );
};

export default WareHouseDetails;
