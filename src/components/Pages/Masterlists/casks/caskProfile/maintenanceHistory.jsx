import axios from "axios";
import { get } from "lodash";
import React from "react";
import { TableColumnsList } from "../../../../../constants";
import SVGIcon from "../../../../../constants/svgIndex";
import { getRequestHeader } from "../../../../../helpers/service";
import CustomTable from "../../../../UIComponents/Table/responsiveTable";
import { openNotificationWithIcon } from "../../../../UIComponents/Toast/notification";
import "./index.scss";

const MaintenanceHistory = (props) => {
  const [expectedData, setExpectedData] = React.useState([]);
  const [expectedMetaData, setExpectedMetaData] = React.useState([]);
  const [expectedClonedData, setExpectedClonedData] = React.useState([]);

  const [expectedRegaugingData, setExpectedRegaugingData] = React.useState([]);
  const [expectedRegaugingMetaData, setExpectedRegaugingMetaData] = React.useState([]);
  const [expectedRegaugingClonedData, setExpectedRegaugingClonedData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const handleEditAction = (record, type) => {
    console.log(record, type);
  };

  const updateCompletedList = (data, key) => {
    setExpectedData(data);
    if (expectedClonedData.length === 0) {
      setExpectedClonedData(data);
    }
  };

  const updateRegaugingCompletedList = (data, key) => {
    setExpectedRegaugingData(data);
    if (expectedRegaugingClonedData.length === 0) {
      setExpectedRegaugingClonedData(data);
    }
  };

  const fetchCompletedList = async (requestOptions) => {
    const rest = await axios({
      method: "POST",
      data: requestOptions,
      url: `${process.env.REACT_APP_API_ENDPOINT}/api/v1/cask/sampling_history`,
      headers: { ...getRequestHeader() },
    }).catch((err) => {
      setIsLoading(false);
      openNotificationWithIcon("error", `${get(err, "response.data.message", "Something Went Wrong")} `);
    });

    if (get(rest, "data.status")) {
      setIsLoading(false);
      updateCompletedList(get(rest, "data.data", []), "sampling");
      setExpectedMetaData(get(rest, "data.meta", []));
    }

    if (!get(rest, "data.status", true)) {
      setIsLoading(false);
      openNotificationWithIcon("error", `${get(rest, "response.data.message", "Something Went Wrong")} `);
    }
  };

  const fetchRegaugeCompletedList = async (requestOptions) => {
    const rest = await axios({
      method: "POST",
      data: requestOptions,
      url: `${process.env.REACT_APP_API_ENDPOINT}/api/v1/cask/regauging_history`,
      headers: { ...getRequestHeader() },
    }).catch((err) => {
      setIsLoading(false);
      openNotificationWithIcon("error", `${get(err, "response.data.message", "Something Went Wrong")} `);
    });

    if (get(rest, "data.status")) {
      setIsLoading(false);
      updateRegaugingCompletedList(get(rest, "data.data", []), "regauging");
      setExpectedRegaugingMetaData(get(rest, "data.meta", []));
    }

    if (!get(rest, "data.status", true)) {
      setIsLoading(false);
      openNotificationWithIcon("error", `${get(rest, "response.data.message", "Something Went Wrong")} `);
    }
  };

  const init = () => {
    fetchCompletedList({ page: "all", cask_id: get(props, "caskID") });
    fetchRegaugeCompletedList({ page: "all", cask_id: get(props, "caskID") });
  };

  React.useEffect(() => {
    init();
  }, []);

  return (
    <>
      <div className="common_card_section">
        <p className="d-flex mb-2">
          <img src={SVGIcon.TimeNoteIcon} />{" "}
          <span className="m-0 ml-2" style={{ fontWeight: 700, fontSize: 20 }}>
            Sampling History
          </span>
        </p>
        <CustomTable
          size="small"
          data={expectedData}
          pagination={false}
          meta={expectedMetaData}
          isGlobalFilterEnabled={false}
          clonedData={expectedClonedData}
          columnType={TableColumnsList.CompletedSamplingData}
          isExportAvailable={false}
          isLoading={false}
          handleEdit={(record, type) => handleEditAction(record, type)}
        />
      </div>
      <div className="common_card_section history_table">
        <p className="d-flex mb-2">
          <img src={SVGIcon.TimeNoteIcon} />
          <span className="m-0 ml-2" style={{ fontWeight: 700, fontSize: 20 }}>
            Regauging history
          </span>
        </p>
        <CustomTable
          size="small"
          data={expectedRegaugingData}
          pagination={false}
          meta={expectedRegaugingMetaData}
          isGlobalFilterEnabled={false}
          clonedData={expectedRegaugingClonedData}
          columnType={TableColumnsList.RegaugeList}
          isExportAvailable={false}
          isLoading={false}
          handleEdit={(record, type) => handleEditAction(record, type)}
        />
      </div>
    </>
  );
};

export default MaintenanceHistory;
