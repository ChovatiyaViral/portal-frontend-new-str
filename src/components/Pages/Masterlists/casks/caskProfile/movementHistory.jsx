import { Col, List, Row } from "antd";
import React from "react";
import { isMobileOrTab } from "../../../../../constants";
import SVGIcon from "../../../../../constants/svgIndex";
import { getScreenSize } from "../../../../../helpers/utility";
import "./index.scss";


const data = [
    {
        time: "10 December at 14:00 hrs",
        movement_type: "INTERWAREHOUSE",
        job_number: "285342",
        action: "Exit",
        location: "Huntly Warehouse # 2344"
    },
    {
        time: "10 December at 14:00 hrs",
        movement_type: "INTERWAREHOUSE",
        job_number: "285342",
        action: "Exit",
        location: "Huntly Warehouse # 2344"
    },
    {
        time: "10 December at 14:00 hrs",
        movement_type: "INTERWAREHOUSE",
        job_number: "285342",
        action: "Exit",
        location: "Huntly Warehouse # 2344"
    },
    {
        time: "10 December at 14:00 hrs",
        movement_type: "INTERWAREHOUSE",
        job_number: "285342",
        action: "Entry",
        location: "Huntly Warehouse # 2344"
    },
    {
        time: "10 December at 14:00 hrs",
        movement_type: "INTERWAREHOUSE",
        job_number: "285342",
        action: "Exit",
        location: "Huntly Warehouse # 2344"
    },
    {
        time: "10 December at 14:00 hrs",
        movement_type: "INTERWAREHOUSE",
        job_number: "285342",
        action: "Exit",
        location: "Huntly Warehouse # 2344"
    },
    {
        time: "10 December at 14:00 hrs",
        movement_type: "INTERWAREHOUSE",
        job_number: "285342",
        action: "Entry",
        location: "Huntly Warehouse # 2344"
    }

];

const MovementHistory = () => {
    return (
        <div className={`${getScreenSize() > isMobileOrTab && "common_card_section"} `}>
            <Row gutter={[24, 10]}>
                {getScreenSize() > isMobileOrTab &&
                    <Col span={24} className="movement_history_header">
                        <Row gutter={[16, 16]}>
                            <Col span={7}>
                            </Col>
                            <Col span={4}>
                                <span className="movement_title">
                                    Movement type
                                </span>
                            </Col>
                            <Col span={4}>
                                <span className="movement_title">
                                    Job Number
                                </span>
                            </Col>
                            <Col span={3}>
                                <span className="movement_title">
                                    Action
                                </span>
                            </Col>
                            <Col span={6}>
                                <span className="movement_title">
                                    Location
                                </span>
                            </Col>
                        </Row>
                    </Col>
                }

                {
                    data.map((item, index) => {
                        return (
                            <Col span={24} className="px-4" key={index}>
                                <Row gutter={[16, 16]} className="movement_history_list">
                                    <Col xs={{ span: 12 }} md={{ span: 7 }}>
                                        <div className="time_swction">
                                            <span className="active_round"></span>
                                            <p>{item.time}</p>
                                        </div>
                                    </Col>
                                    <Col xs={{ span: 12 }} md={{ span: 4 }}>
                                        {getScreenSize() < isMobileOrTab && <span className="movement_title">
                                            Movement type
                                        </span>}
                                        <div className="movement_type_section">
                                            <img src={SVGIcon.MovementTypeIcon} alt="svg icon" />
                                        </div>
                                    </Col>
                                    <Col xs={{ span: 12 }} md={{ span: 4 }}>
                                        {getScreenSize() < isMobileOrTab && <span className="movement_title">
                                            Job Number
                                        </span>}
                                        <div className="job_number_section">
                                            {item.job_number}
                                        </div>
                                    </Col>
                                    <Col xs={{ span: 12 }} md={{ span: 3 }}>
                                        {getScreenSize() < isMobileOrTab && <span className="movement_title">
                                            Action
                                        </span>}
                                        <div>
                                            {item.action}
                                        </div>
                                    </Col>
                                    <Col xs={{ span: 12 }} md={{ span: 6 }}>
                                        {getScreenSize() < isMobileOrTab && <span className="movement_title">
                                            Location
                                        </span>}
                                        <div>
                                            {item.location}
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                        );
                    })
                }

            </Row>
        </div>
    );
};

export default MovementHistory;