import { LeftOutlined } from "@ant-design/icons";
import { Button, message, Spin, Tabs } from "antd";
import axios from "axios";
import { get } from "lodash";
import React from "react";
import { useDispatch } from "react-redux";
import { getRequestHeader } from "../../../../../helpers/service";
import { setCurrentView } from "../../../../../store/Auth/auth.actions";
import ErrorBoundary from "../../../../UIComponents/ErrorBoundary";
import { openNotificationWithIcon } from "../../../../UIComponents/Toast/notification";
import JobDetail from "../details";
import ComparisonDetails from "../details/comparisonDetails";

const headerTitle = {
  "Job detail": "View Job detail",
  "Comparison Details": "View Comparison Details",
};

const SamplingJobDetails = (props) => {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = React.useState(true);
  const [cask_number, setCaskNumber] = React.useState("");
  const [expectedData, setExpectedData] = React.useState([]);
  const [isDocumentListVisible, setIsDocumentListVisible] = React.useState(false);
  const [isImageListVisible, setIsImageListVisible] = React.useState(false);

  React.useEffect(() => {
    // dispatch(setCurrentView(headerTitle["Job detail"]));
  }, []);

  const handleTabChange = (tab, e) => {
    if (tab === "Comparison Details") {
      if (cask_number) {
        fetchCompletedList();
      } else {
        message.info("Cask Number not found");
      }
    }
    // dispatch(setCurrentView(headerTitle[e.target.innerText]));
  };

  const fetchCompletedList = async () => {
    const rest = await axios({
      method: "POST",
      data: {
        cask_number: cask_number,
        last_sampling_id: get(props, "match.params.id", ""),
      },
      url: `${process.env.REACT_APP_API_ENDPOINT}/api/v1/cask_sample/previous_samplings`,
      headers: { ...getRequestHeader() },
    }).catch((err) => {
      setIsLoading(false);
      openNotificationWithIcon("error", `${get(err, "response.data.message", "Something Went Wrong")} `);
    });

    if (get(rest, "data.status")) {
      setIsLoading(false);
      setExpectedData(get(rest, "data.data", []));
    }

    if (!get(rest, "data.status", true)) {
      setIsLoading(false);
      openNotificationWithIcon("error", `${get(rest, "response.data.message", "Something Went Wrong")} `);
    }
  };

  const getItems = () => {
    return [
      {
        key: "Job detail",
        label: "Job detail",
        children: <JobDetail
          {...props}
          getCaskNumber={(num) => setCaskNumber(num)}
          handleDocumentView={() => setIsDocumentListVisible(!isDocumentListVisible)}
          handleImagesView={() => setIsImageListVisible(!isImageListVisible)}
          isDocumentListVisible={isDocumentListVisible}
          isImageListVisible={isImageListVisible}
        />
      },
      {
        key: "Comparison Details",
        label: "Comparison Details",
        children: <Spin spinning={expectedData.length === 0}>{expectedData.length > 0 && <ComparisonDetails samplingData={expectedData} />}</Spin>
      },
    ];
  };

  return (
    <div className="portal_styling__2 table-responsive-padding">
      <ErrorBoundary>
        <div className="order_tabs border-radius-12">
          <div className="order_tab_box d-flex flex-row-reverse">
            {isDocumentListVisible || isImageListVisible ? (
              <Button
                type="secondary"
                icon={<LeftOutlined />}
                className="btn_back"
                onClick={() => {
                  setIsDocumentListVisible(false);
                  setIsImageListVisible(false);
                }}
              >
                Back to Sampling Details
              </Button>
            ) : (
              <Button type="link" icon={<LeftOutlined />} className="btn_back" onClick={() => props.history.goBack()}>
                Back to Sampling List
              </Button>
            )}
          </div>
          {isDocumentListVisible || isImageListVisible ? (
            <JobDetail
              {...props}
              getCaskNumber={(num) => setCaskNumber(num)}
              handleDocumentView={() => setIsDocumentListVisible(!isDocumentListVisible)}
              handleImagesView={() => setIsImageListVisible(!isImageListVisible)}
              isDocumentListVisible={isDocumentListVisible}
              isImageListVisible={isImageListVisible}
            />
          ) : (
            <Tabs defaultActiveKey="1" items={getItems()} onTabClick={handleTabChange} className="m-0" />
          )}
        </div>
      </ErrorBoundary>
    </div>
  );
};

export default SamplingJobDetails;
