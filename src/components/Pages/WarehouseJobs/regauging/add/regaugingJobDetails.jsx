import { LeftOutlined } from "@ant-design/icons";
import { Button, message, Spin, Tabs } from "antd";
import axios from "axios";
import { get } from "lodash";
import React from "react";
import { useDispatch } from "react-redux";
import SVGIcon from "../../../../../constants/svgIndex";
import { getRequestHeader } from "../../../../../helpers/service";
import { getBlobURL } from "../../../../../helpers/utility";
import { setCurrentView } from "../../../../../store/Auth/auth.actions";
import DocumentsListView from "../../../../CommonComponents/Upload/documentsView";
import ImageListView from "../../../../CommonComponents/Upload/imagesListView";
import ErrorBoundary from "../../../../UIComponents/ErrorBoundary";
import { openNotificationWithIcon } from "../../../../UIComponents/Toast/notification";
import JobDetail from "../details";
import ComparisonDetails from "../details/comparisonDetails";

const RegaugingJobDetails = (props) => {
  const [expectedData, setExpectedData] = React.useState([]);
  const [cask_number, setCaskNumber] = React.useState("");
  const [expectedComparisonData, setExpectedComparisonData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [imagesList, setImagesList] = React.useState([]);
  const [isDocumentListVisible, setIsDocumentListVisible] = React.useState(false);
  const [isImageListVisible, setIsImageListVisible] = React.useState(false);

  const { match, history } = props;

  const dispatch = useDispatch();

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

  const getValue = (val) => {
    return val ? val : "NA";
  };

  const fetchCompletedList = async () => {
    const rest = await axios({
      method: "POST",
      data: {
        cask_number: cask_number,
        last_regauging_id: get(props, "match.params.id", ""),
      },
      url: `${process.env.REACT_APP_API_ENDPOINT}/api/v1/cask_regauge/previous_regaugings`,
      headers: { ...getRequestHeader() },
    }).catch((err) => {
      setIsLoading(false);
      openNotificationWithIcon("error", `${get(err, "response.data.message", "Something Went Wrong")} `);
    });

    if (get(rest, "data.status")) {
      setIsLoading(false);
      setExpectedComparisonData(get(rest, "data.data", []));
    }

    if (!get(rest, "data.status", true)) {
      setIsLoading(false);
      openNotificationWithIcon("error", `${get(rest, "response.data.message", "Something Went Wrong")} `);
    }
  };

  const fetchDetails = async () => {
    const rest = await axios({
      method: "GET",
      url: `${process.env.REACT_APP_API_ENDPOINT}/api/v1/cask_regauge/details/${get(match, "params.id")}`,
      headers: { ...getRequestHeader() },
    }).catch((err) => {
      setIsLoading(false);
      openNotificationWithIcon("error", `${get(err, "response.data.message", "Something Went Wrong")} `);
    });

    if (get(rest, "data.status")) {
      setIsLoading(false);
      dispatch(setCurrentView(getTitle(get(rest, "data.data", {}))));
      const imgListing = get(rest, "data.data.all_files", []).filter((item) => item.document_type === "image");
      if (imgListing.length > 0) {
        setImagesList(getAllImages(imgListing));
      }
      setExpectedData(get(rest, "data.data", []));
      setCaskNumber(get(rest, "data.data.cask_number", ""));
    }

    if (!get(rest, "data.status", true)) {
      setIsLoading(false);
      openNotificationWithIcon("error", `${get(rest, "data.message", "Something Went Wrong")} `);
    }
  };

  const init = () => {
    fetchDetails();
  };

  const getTitle = (data) => {
    return (
      <div className="details__card_title d-flex align-items-center sampling_detail_card">
        <img src={SVGIcon.ReGuagingIcon} alt="ReGaugingIcon" />
        <div className="pl-3">
          <p className="details__summary__card_content__title">Regauging Details - # {get(data, "report_id")}</p>
          <p className="details__summary__card_content__value text-transform-none">
            Cask Number - {get(data, "cask_number", "NA")} | Regauged At - {getValue(get(data, "completed_at", "NA"))} | Regauged By - {getValue(get(data, "completed_by", "NA"))}
          </p>
        </div>
      </div>
    );
  };

  const getImageFromS3 = async (s3URL) => {
    return await axios({
      method: "GET",
      url: `${process.env.REACT_APP_API_ENDPOINT}/api/get_s3_file_by_url?url=${s3URL.trim()}`,
      headers: { ...getRequestHeader() },
    })
      .then((data) => {
        return getBlobURL(s3URL, get(data, "data.file"));
      })
      .catch((err) => {
        openNotificationWithIcon("error", `${get(err, "response.data.message", "Something Went Wrong")} `);
      });
  };

  const getAllImages = async (imgListing) => {
    let imageUploaded = imgListing;
    const allImages = await Promise.all(
      imageUploaded.map(async (list) => {
        const uri = await getImageFromS3(get(list, "document_url"));
        return uri;
      })
    );

    if (allImages.length > 0) {
      setImagesList(allImages);
    }
  };

  const documentsUploaded = get(expectedData, "all_files", []).filter((item) => item.document_type === "document");
  const uploadedImages = get(expectedData, "all_files", []).filter((item) => item.document_type === "image");

  React.useEffect(() => {
    init();
  }, []);

  const getItems = () => {
    return [
      {
        key: "Job detail",
        label: "Job detail",
        children: (
          <JobDetail
            details={expectedData}
            imagesList={imagesList}
            uploadedImages={uploadedImages}
            documentsUploaded={documentsUploaded}
            handleDocumentView={() => setIsDocumentListVisible(!isDocumentListVisible)}
            handleImagesView={() => setIsImageListVisible(!isImageListVisible)}
          />
        ),
      },
      {
        key: "Comparison Details",
        label: "Comparison Details",
        children: (
          <Spin spinning={isLoading}>
            <ComparisonDetails details={expectedComparisonData} />
          </Spin>
        ),
      },
    ];
  };

  return (
    <div className="portal_styling__2 pr-4 pl-4 table-responsive-padding">
      <ErrorBoundary>
        {isDocumentListVisible || isImageListVisible ? (
          <>
            <div className="back_to_list">
              <Button type="link" icon={<LeftOutlined />} className="btn_back" onClick={() => (isDocumentListVisible ? setIsDocumentListVisible(false) : setIsImageListVisible(false))}>
                Back to Regauging Details
              </Button>
            </div>
            {isDocumentListVisible && <DocumentsListView docList={documentsUploaded} />}
            {isImageListVisible && <ImageListView imgList={uploadedImages} />}
          </>
        ) : (
          <div className="order_tabs border-radius-12">
            <div className="order_tab_box d-flex flex-row-reverse">
              <Button type="link" icon={<LeftOutlined />} className="btn_back" onClick={() => history.goBack()}>
                Back to Regauging List
              </Button>
            </div>

            <Tabs defaultActiveKey="1" items={getItems()} onTabClick={handleTabChange} className="m-0" />
          </div>
        )}
      </ErrorBoundary>
    </div>
  );
};

export default RegaugingJobDetails;
