import { Button, Card, Col, List, Row } from "antd";
import React from "react";
import Barrel from "../../../../../assets/images/b-650.png";
import Barrel1 from "../../../../../assets/images/gate_1.png";
import SVGIcon from "../../../../../constants/svgIndex";
import ErrorBoundary from "../../../../UIComponents/ErrorBoundary";
import "./index.scss";

const pdfData = [
    "Payment Order.pdf",
    "Payment Order.pdf",
    "Payment Order.pdf"
];

const notes = [
    {
        note: "Ensure that this cask isn’t tilted sideways as there is a  leakage observed",
        createdBy: "Added by Darleen today at 17:00 hrs"
    }
];

const PassportDetail = () => {
    return (
        <ErrorBoundary>
            <Row gutter={[16, 16]}>
                <Col flex="402px">
                    <Card
                        style={{ minWidth: 402 }}
                        className="common_card_section"
                        title={
                            <p className="d-flex align-items-center">
                                <img src={SVGIcon.CaskDetailsIcon} /> <span>Passport Details</span>
                            </p>
                        }
                        bordered={false}
                    >
                        <div className="passport_details_sections">
                            <div className="mid_content_1">
                                <Row gutter={[16, 16]}>
                                    <Col flex="160px">
                                        <p>Passport Number</p>
                                        <b>123456</b>
                                    </Col>
                                    <Col flex="auto">
                                        <p>Passport Type</p>
                                        <b>PIPE .650L</b>
                                    </Col>
                                    <Col flex="160px">
                                        <p>Spirit weight</p>
                                        <b>192.0 kg</b>
                                    </Col>
                                    <Col flex="auto">
                                        <p>Fills</p>
                                        <b>123456</b>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col flex="349px">
                    <Card
                        style={{ minWidth: 349 }}
                        className="common_card_section"
                        title={
                            <p className="d-flex align-items-center">
                                <img src={SVGIcon.CaskTypeIcon} /> <span>Passport Type</span>
                            </p>
                        }
                        bordered={false}
                    >
                        <div className="passport_details_sections">
                            <div className="mid_content_1">
                                <Row gutter={[16, 16]}>
                                    <Col flex="160px">
                                        <img src={Barrel} width={107} height={136} />
                                    </Col>
                                    <Col flex="155px">
                                        <Row gutter={[16, 16]}>
                                            <Col>
                                                <p>Passport Type</p>
                                                <b>Pipe</b>
                                            </Col>
                                            <Col>
                                                <p>Passport Capacity</p>
                                                <b>650L</b>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col flex="310px">
                    <Card
                        style={{ minWidth: 310 }}
                        className="common_card_section document"
                        title={
                            <p className="d-flex align-items-center">
                                <img src={SVGIcon.UploadDocumentIcon} /> <span>Documents</span>
                            </p>
                        }
                        bordered={false}
                    >
                        <div className="passport_details_sections">
                            <List
                                itemLayout="horizontal"
                                dataSource={pdfData}
                                renderItem={(item) => (
                                    <List.Item>
                                        <img src={SVGIcon.PDFIcon} />
                                        <span>{item}</span>
                                    </List.Item>
                                )}
                            />
                            <Button type="primary" ghost className="more_item_view">
                                + 12 More
                            </Button>
                        </div>
                    </Card>
                </Col>
                <Col flex="103px">
                    <Card
                        style={{ minWidth: 1093 }}
                        className="common_card_section add_notes_card"
                        title={
                            <p className="d-flex align-items-center">
                                <img src={SVGIcon.AddNotesIcon} /> <span>Notes</span>
                            </p>
                        }
                        bordered={false}
                    >
                        <div className="passport_details_sections">
                            <div className="add_notes">
                                <List
                                    itemLayout="horizontal"
                                    dataSource={notes}
                                    renderItem={(item) => (
                                        <List.Item>
                                            <h1>{item.note}</h1>
                                            <h6>{item.createdBy}</h6>
                                        </List.Item>
                                    )}
                                />
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col flex="103px">
                    <Card
                        style={{ minWidth: 1093 }}
                        className="common_card_section add_notes_card"
                        title={
                            <p className="d-flex align-items-center">
                                <img src={SVGIcon.AddIcon} /> <span>Photos</span>
                            </p>
                        }
                        bordered={false}
                    >
                        <div className="passport_details_sections">
                            <div className="photos_section">
                                <div className="photo">
                                    <img src={Barrel1} />
                                </div>
                                <div className="photo">
                                    <img src={Barrel1} />
                                </div>
                                <div className="photo">
                                    <img src={Barrel1} />
                                </div>
                                <div className="photo">
                                    <img src={Barrel1} />
                                </div>
                                <div className="photo">
                                    <img src={Barrel1} />
                                </div>
                                <div className="photo">
                                    <img src={Barrel1} />
                                </div>
                                <div className="photo">
                                    <img src={Barrel1} />
                                    <span>+ 2 More</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>
        </ErrorBoundary>
    );
};


export default PassportDetail;