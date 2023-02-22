import { Card, Col, Row } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import SVGIcon from "../../../../constants/svgIndex";
import { setCurrentView } from "../../../../store/Auth/auth.actions";
import ErrorBoundary from "../../../UIComponents/ErrorBoundary";
import { Link } from "react-router-dom";

/**
 * Renders Add New Task Component
 */
const AddNewTask = props => {
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(setCurrentView("Create a new task"));
  }, []);

  return (
    <>
      <div className="portal_styling__1 pl-30 portal_styling__2">
        <ErrorBoundary>
          <div className="task_management__add_task">
            <div className="summary_details">
              <Row gutter={40}>
                <Col span={9}>
                  <Card bordered={false}>
                    <Link to={{ pathname: "/gate-entry" }}>
                      <div className="summary__card_content">
                        <Row gutter={20} className="align-items-center">
                          <Col span={6}>
                            <p className="summary__card_image">
                              <img src={SVGIcon.GateEntryIcon} />
                            </p>
                          </Col>
                          <Col span={18}>
                            <p className="summary__card_content__title">Gate Entry </p>
                            <p className="summary__card_content__value">Log a newly arrived cask into the warehouse </p>
                          </Col>
                        </Row>
                      </div>
                    </Link>
                  </Card>
                </Col>
                <Col span={9}>
                  <Card bordered={false}>
                    <Link to={{ pathname: "/" }}>
                      <div className="summary__card_content">
                        <Row gutter={20} className="align-items-center">
                          <Col span={6}>
                            <p className="summary__card_image">
                              <img src={SVGIcon.SamplingDataIcon} />
                            </p>
                          </Col>
                          <Col span={18}>
                            <p className="summary__card_content__title">Sampling data </p>
                            <p className="summary__card_content__value">For simple testing of liquid content</p>
                          </Col>
                        </Row>
                      </div>
                    </Link>
                  </Card>
                </Col>
              </Row>
              <Row gutter={40}>
                <Col span={9}>
                  <Card bordered={false}>
                    <Link to={{ pathname: "/add-new-regauging" }}>
                      <div className="summary__card_content">
                        <Row gutter={20} className="align-items-center">
                          <Col span={6}>
                            <p className="summary__card_image">
                              <img src={SVGIcon.ReGuagingIcon} />
                            </p>
                          </Col>
                          <Col span={18}>
                            <p className="summary__card_content__title">Reguaging</p>
                            <p className="summary__card_content__value">A deep investigation of the cask and it’s liquid content</p>
                          </Col>
                        </Row>
                      </div>
                    </Link>
                  </Card>
                </Col>
                <Col span={9}>
                  <Card bordered={false}>
                    <Link to={{ pathname: "/" }}>
                      <div className="summary__card_content">
                        <Row gutter={20} className="align-items-center">
                          <Col span={6}>
                            <p className="summary__card_image">
                              <img src={SVGIcon.VattingIcon} />
                            </p>
                          </Col>
                          <Col span={18}>
                            <p className="summary__card_content__title">Vatting</p>
                            <p className="summary__card_content__value">Transfer liquid from several donor casks to one reciever </p>
                          </Col>
                        </Row>
                      </div>
                    </Link>
                  </Card>
                </Col>
              </Row>
              <Row gutter={40}>
                <Col span={9}>
                  <Card bordered={false}>
                    <Link to={{ pathname: "/" }}>
                      <div className="summary__card_content">
                        <Row gutter={20} className="align-items-center">
                          <Col span={6}>
                            <p className="summary__card_image">
                              <img src={SVGIcon.ReRackingIcon} />
                            </p>
                          </Col>
                          <Col span={18}>
                            <p className="summary__card_content__title">Re-racking</p>
                            <p className="summary__card_content__value">Transfer liquid from one donor cask to one or several recievers </p>
                          </Col>
                        </Row>
                      </div>
                    </Link>
                  </Card>
                </Col>
                <Col span={9}>
                  <Card bordered={false}>
                    <Link to={{ pathname: "/" }}>
                      <div className="summary__card_content">
                        <Row gutter={20} className="align-items-center">
                          <Col span={6}>
                            <p className="summary__card_image">
                              <img src={SVGIcon.GateExitIcon} />
                            </p>
                          </Col>
                          <Col span={18}>
                            <p className="summary__card_content__title">Gate Exit</p>
                            <p className="summary__card_content__value">Log a cask that is exiting the facility</p>
                          </Col>
                        </Row>
                      </div>
                    </Link>
                  </Card>
                </Col>
              </Row>
            </div>
          </div>
        </ErrorBoundary>
      </div>
    </>
  );
};

export default AddNewTask;
