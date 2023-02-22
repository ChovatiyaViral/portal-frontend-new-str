import { Card, Col, Row, Tooltip } from "antd";
import { get } from "lodash";
import React from "react";
import SVGIcon from "../../../../../constants/svgIndex";
import CommonService from "../../../../../helpers/request/Common";
import { requestPath } from "../../../../../helpers/service";
import { getValue } from "../../../../../helpers/utility";

import "./index.scss";

const CaskDetails = (props) => {
  const [expectedData, setExpectedData] = React.useState([]);

  const fetchCaskDetails = async () => {
    await CommonService.getDetails(`${requestPath.masterListing.cask.getDetails}/${get(props, "caskID")}`).then((data) => {
      if (get(data, "status")) {
        setExpectedData(get(data, "data", []));
      }

      if (!get(data, "data.status", true)) {
        openNotificationWithIcon("error", "Cask Details", `${get(data, "data.message", "Something Went Wrong")} `);
      }
    });
  };

  React.useEffect(() => {
    fetchCaskDetails();
  }, []);

  return (
    <div className="summary_details log_gate_summary__cask_summary">
      <Row gutter={[16, 16]}>
        <Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
          <Card
            title={
              <p className="summary__card_title">
                <img src={SVGIcon.CaskContentsIcon} /> <span>Cask Contents</span>
              </p>
            }
            bordered={false}
          >
            <div className="summary__card_content">
              <Row gutter={[16, 0]}>
                <Col xs={{ span: 12 }}>
                  <p className="summary__card_content__title">Brand Name</p>
                  <p className="summary__card_content__value">
                    <Tooltip placement="topLeft" title={getValue(get(expectedData, "brand"))}>
                      {getValue(get(expectedData, "brand"))}
                    </Tooltip>
                  </p>
                </Col>
                <Col xs={{ span: 12 }}>
                  <p className="summary__card_content__title">Distillery</p>
                  <p className="summary__card_content__value">
                    <Tooltip placement="topLeft" title={getValue(get(expectedData, "distillery"))}>
                      {getValue(get(expectedData, "distillery"))}
                    </Tooltip>
                  </p>
                </Col>
                <Col xs={{ span: 12 }}>
                  <p className="summary__card_content__title">Last Known OLA / RLA </p>
                  <p className="summary__card_content__value">
                    <Tooltip placement="topLeft" title={`${getValue(get(expectedData, "last_known_ola"))} / ${getValue(get(expectedData, "last_known_rla"))}`}>
                      {getValue(get(expectedData, "last_known_ola"))} / {getValue(get(expectedData, "last_known_rla"))}
                    </Tooltip>
                  </p>
                </Col>
                <Col xs={{ span: 12 }}>
                  <p className="summary__card_content__title">Last Known Strength (%)</p>
                  <p className="summary__card_content__value">
                    <Tooltip placement="topLeft" title={getValue(get(expectedData, "last_known_strength"))}>
                      {getValue(get(expectedData, "last_known_strength"))}
                    </Tooltip>
                  </p>
                </Col>
              </Row>
            </div>
          </Card>
        </Col>

        <Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
          <Card
            title={
              <p className="summary__card_title">
                <img src={SVGIcon.CaskDetailsIcon} /> <span>Cask Details</span>
              </p>
            }
            bordered={false}
          >
            <div className="summary__card_content">
              <Row gutter={[16, 0]}>
                <Col xs={{ span: 12 }} sm={{ span: 12 }}>
                  <p className="summary__card_content__title">AYS</p>
                  <p className="summary__card_content__value">
                    <Tooltip placement="topLeft" title={getValue(get(expectedData, "ays"))}>
                      {getValue(get(expectedData, "ays"))}
                    </Tooltip>
                  </p>
                </Col>
                <Col xs={{ span: 12 }} sm={{ span: 12 }}>
                  <p className="summary__card_content__title">Cask No. / Passport No. </p>
                  <p className="summary__card_content__value">
                    <Tooltip placement="topLeft" title={`${getValue(get(expectedData, "cask_number"))} / ${getValue(get(expectedData, "passport_number"))}`}>
                      {getValue(get(expectedData, "cask_number"))} / {getValue(get(expectedData, "passport_number"))}
                    </Tooltip>
                  </p>
                </Col>
                <Col xs={{ span: 12 }} sm={{ span: 12 }}>
                  <p className="summary__card_content__title">Cask Type</p>
                  <p className="summary__card_content__value">
                    <Tooltip placement="topLeft" title={getValue(get(expectedData, "cask_type"))}>
                      <img src={SVGIcon.CaskType1Icon} /> <span style={{ marginLeft: 11 }}> {getValue(get(expectedData, "cask_type"))}</span>
                    </Tooltip>
                  </p>
                </Col>
                <Col xs={{ span: 12 }} sm={{ span: 12 }}>
                  <p className="summary__card_content__title">Created by </p>
                  <p className="summary__card_content__value">
                    <Tooltip placement="topLeft" title={getValue(get(expectedData, "created_by"))}>
                      <span>{getValue(get(expectedData, "created_by"))}</span>
                    </Tooltip>
                  </p>
                </Col>
              </Row>
            </div>
          </Card>
        </Col>

        <Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
          <Card
            title={
              <p className="summary__card_title">
                <img src={SVGIcon.WareHouseCaskIcon} /> <span>Arrived from {getValue(get(expectedData, "dt_location"))} </span>
              </p>
            }
            bordered={false}
          >
            <div className="summary__card_content">
              <Row>
                <Col sm={{ span: 24 }} xs={{ span: 24 }}>
                  <p className="summary__card_content__title">Warehouse Name & Warehouse Address </p>
                  <p className="summary__card_content__value">
                    {getValue(get(expectedData, "warehouse_name"))} <br />
                    {getValue(get(expectedData, "warehouse_keeper_name"))} <br />
                    {getValue(get(expectedData, "address1"))} <br />
                    {getValue(get(expectedData, "address2"))}
                  </p>
                </Col>
              </Row>
            </div>
          </Card>
        </Col>
      </Row>
      <Row gutter={[30, 30]}></Row>
    </div>
  );
};

export default CaskDetails;
