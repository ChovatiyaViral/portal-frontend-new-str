import { Button, Divider, Input, Progress, Select, Table, Tag } from "antd";
import axios from "axios";
import { debounce, get } from "lodash";
import React from "react";
import { useDispatch } from "react-redux";
import SVGIcon from "../../../../constants/svgIndex";
import { getRequestHeader } from "../../../../helpers/service";
import { setCurrentView } from "../../../../store/Auth/auth.actions";
import { setCurrentWareHouseLocation } from "../../../../store/Tasks/task.actions";
import ErrorBoundary from "../../../UIComponents/ErrorBoundary";
import { openNotificationWithIcon } from "../../../UIComponents/Toast/notification";
import { GateEntryIncomingOptions } from "../constants";
import "./index.scss";
const { Option } = Select;

/**
 * Renders Gate Entry Component
 */
const GateEntry = (props) => {
  const [currentTab, setTab] = React.useState({
    displayName: "Delayed",
    value: "delayed",
  });

  const [caskSearchValue, setCaskSearchValue] = React.useState("");
  const [currentWarehouseValue, setCurrentWarehouseValue] = React.useState("");
  const [isSearchResultAvailable, setIsSearchResultAvailable] = React.useState(false);
  const [caskSearchValueListing, setCaskSearchValueListing] = React.useState([]);
  const [warehouseListing, setWarehouseListing] = React.useState([]);
  const [progress, setProgress] = React.useState(0);
  const [isWareHouseLocationSelected, setIsWareHouseLocationSelected] = React.useState(true);

  const { history } = props;

  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(setCurrentView("Gate Entry"));
  }, []);

  const columns = [
    {
      title: "Cask number",
      dataIndex: "cask_number",
      key: "cask_number",
    },
    {
      title: "Brand name",
      dataIndex: "brand_name",
      key: "brand_name",
    },
    {
      title: "Arriving from",
      dataIndex: "arriving_from",
      key: "arriving_from",
    },
    {
      title: "Contractor",
      dataIndex: "contractor",
      key: "contractor",
    },
    {
      title: "",
      dataIndex: "",
      key: "x",
      render: () => (
        <a onClick={() => history.push("/log-gate-entry-summary/123889")} className="log__gate_entry__link">
          Log gate entry
        </a>
      ),
    },
  ];

  const invokeDebounced = debounce((query) => {
    getCaskDetailsList(query);
  }, 2000);

  const getWareHouseDetailsList = async () => {
    const rest = await axios({
      method: "POST",
      data: {
        page: "all",
      },
      url: `${process.env.REACT_APP_API_ENDPOINT}/api/v1/dt_location`,
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

  const getCaskDetailsList = async (query) => {
    const rest = await axios({
      method: "POST",
      data: {
        page: "all",
        searchable_columns: [
          {
            field_name: "cask_number",
            data_type: "varchar",
            field_value: query,
          },
        ],
      },
      url: `${process.env.REACT_APP_API_ENDPOINT}/api/v1/cask`,
      headers: { ...getRequestHeader() },
      onUploadProgress: (event) => {
        const percent = Math.round((event.loaded * 100) / event.total);
        setProgress(percent);
        if (percent === 100) {
          setTimeout(() => setProgress(0), 1000);
        }
      },
    }).catch((err) => {
      openNotificationWithIcon("error", `${get(err, "response.data.message", "Something Went Wrong")} `);
    });

    if (get(rest, "data.status")) {
      setIsSearchResultAvailable(true);
      setCaskSearchValueListing(get(rest, "data.data", []));
    }

    if (!get(rest, "data.status", true)) {
      openNotificationWithIcon("error", `${get(rest, "response.data.message", "Something Went Wrong")} `);
    }
  };

  React.useEffect(() => {
    getWareHouseDetailsList();
  }, []);

  const getValue = (val) => {
    return val ? val : "NA";
  };

  const getIcon = (type) => {
    if (type === "transport") {
      return SVGIcon.TransportJobIcon;
    }

    if (type === "inter_house_movement") {
      return SVGIcon.InterHouseMovementIcon;
    }

    if (type === "in_facility") {
      return SVGIcon.InFacilityIcon;
    }
  };

  return (
    <div className="p-20 portal_styling__2 table-responsive-padding">
      <ErrorBoundary>
        <div className="task_management__gate_entry">
          <div className="task_management__gate_entry__heading">
            <p>Start by entering cask number</p>
            <span>To log in a cask into the system start by entering the cask number you’d like to log</span>
          </div>

          <div className="task_management__gate_entry__warehouse_dropdown">
            <Select
              style={{
                width: 258,
              }}
              placeholder="Search to Select"
              onChange={(value) => {
                setCurrentWarehouseValue(value);
                setIsWareHouseLocationSelected(false);
                dispatch(setCurrentWareHouseLocation(value));
              }}
            >
              {warehouseListing.map((list) => {
                return (
                  <Option key={get(list, "location_name", "")} value={get(list, "location_name", "")}>
                    <img
                      src={SVGIcon.WarehouseIcon}
                      style={{
                        paddingLeft: 13,
                        paddingRight: 13,
                      }}
                    />
                    {get(list, "location_name", "")}
                  </Option>
                );
              })}
            </Select>
          </div>
          <div className="task_management__gate_entry__warehouse_search">
            <Input
              suffix={caskSearchValue.length > 0 && <img src={SVGIcon.CloseIcon} style={{ paddingRight: 15 }} onClick={() => setCaskSearchValue("")} />}
              placeholder="Enter cask number here"
              prefix={<img src={SVGIcon.SearchIcon} style={{ paddingRight: 15 }} />}
              value={caskSearchValue}
              disabled={isWareHouseLocationSelected}
              onChange={(e) => {
                setCaskSearchValue(e.target.value);
                setIsSearchResultAvailable(false);
                if (e.target.value.length > 2) {
                  invokeDebounced(e.target.value);
                }
              }}
            />
            {progress > 0 ? <Progress size="small" className="mb-2" percent={progress} style={{ width: 721 }} /> : null}
            {caskSearchValueListing.length > 0 && (
              <div className="add_cask_search__exiting__cask_text">
                {caskSearchValueListing.map((list, index) => {
                  return (
                    <>
                      <div
                        className="add_cask_search__exiting__cask_text__item d-flex align-items-center justify-content-between"
                        onClick={() => history.push(`/log-gate-entry-summary/${get(list, "id", "")}?dt-location=${currentWarehouseValue}`)}
                      >
                        <div className="d-flex align-items-center">
                          <p className="summary__card_title">
                            <img src={SVGIcon.CaskIcon2} />
                          </p>
                          <div>
                            <p className="summary__card_content__title">{get(list, "cask_number", "")} </p>
                            <p className="summary__card_content__value">
                              Job number {getValue(get(list, "job_id"))} | {getValue(get(list, "cask_type"))} {getValue(get(list, "distillery"))} | Arriving from:{" "}
                              {getValue(get(list, "arriving_from"))}
                            </p>
                          </div>
                        </div>
                        {get(list, "job_type") && (
                          <Tag color="#E3DEFF">
                            <img src={getIcon(get(list, "job_type"))} style={{ paddingRight: 8 }} />
                            <span style={{ textTransform: "uppercase" }}>{get(list, "job_type")}</span>
                          </Tag>
                        )}
                      </div>
                      <Divider />
                    </>
                  );
                })}
              </div>
            )}
            <div className={`cask__not_found ${isSearchResultAvailable && caskSearchValueListing.length === 0 && "active"}`}>
              <i>No results found</i>
              <div className="d-flex align-items-center cask__not_found__content" onClick={() => history.push(`/log-gate-entry?dt-location=${currentWarehouseValue}`)}>
                <img src={SVGIcon.AddIcon} style={{ paddingRight: 12 }} />
                <div className="cask__not_found__text">
                  <p>Add a new cask</p> <span>Add this cask to the system by creating a new entry </span>
                </div>
              </div>
            </div>
          </div>
          <Divider />
          <div className="task_management__gate_entry__warehouse_listing">
            <p>Expected to arrive in the next few days</p>
            <div className="task_management__gate_entry__warehouse_listing_options">
              <span className="incoming_text"> Incoming </span>
              {GateEntryIncomingOptions.map((list) => {
                return (
                  <Button type="link" key={get(list, "value")} className={get(currentTab, "value") === get(list, "value") ? "active" : ""} onClick={() => setTab(list)}>
                    {get(list, "displayName")}
                  </Button>
                );
              })}
              <div className="task_management__gate_entry__warehouse_listing_view">
                <Table columns={columns} dataSource={[]} size="small" pagination={false} />
              </div>
            </div>
          </div>
        </div>
      </ErrorBoundary>
    </div>
  );
};

export default GateEntry;
