import { LeftOutlined } from "@ant-design/icons";
import { Button } from "antd";
import axios from "axios";
import { get } from "lodash";
import React from "react";
import { useDispatch } from "react-redux";
import BarrelImage from "../../../../assets/images/crrDetailsBarrel.png";
import { getRequestHeader } from "../../../../helpers/service";
import { getBlobURL } from "../../../../helpers/utility";
import { setCurrentView } from "../../../../store/Auth/auth.actions";
import ErrorBoundary from "../../../UIComponents/ErrorBoundary";

import { openNotificationWithIcon } from "../../../UIComponents/Toast/notification";
import CRRDetails from "./details";
import "./index.scss";

/**
 * Renders CRR Details Index component
 */
const CRRDetailsIndex = (props) => {
  const dispatch = useDispatch();
  const [crrDetailsSummary, setCrrDetailsSummary] = React.useState(null);
  const [imagesList, setImagesList] = React.useState([]);

  const { match, history } = props;

  const fetchCRRDetails = async () => {
    const rest = await axios({
      method: "GET",
      url: `${process.env.REACT_APP_API_ENDPOINT}/api/v1/crr/details/${get(match, "params.id")}`,
      headers: { ...getRequestHeader() },
    }).catch((err) => {
      openNotificationWithIcon("error", "CRR Details", `${get(err, "response.data.message", "Something Went Wrong")} `);
    });

    if (get(rest, "data.status")) {
      dispatch(setCurrentView(getTitle(get(rest, "data.data", {}))));
      setCrrDetailsSummary(get(rest, "data.data", {}));
      const imgListing = get(rest, "data.data.all_files", []).filter((item) => item.document_type === "image");
      getAllImages(imgListing);
    }

    if (!get(rest, "data.status", true)) {
      openNotificationWithIcon("error", "CRR Details", `${get(rest, "data.message", "Something Went Wrong")} `);
    }
  };

  const documentsUploaded = get(crrDetailsSummary, "all_files", []).filter((item) => item.document_type === "document");
  const uploadedImages = get(crrDetailsSummary, "all_files", []).filter((item) => item.document_type === "image");

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
    let imageUploaded = imgListing ? imgListing : uploadedImages;
    const allImages = await Promise.all(
      await imageUploaded.map(async (list) => {
        const uri = await getImageFromS3(get(list, "document_url"));
        return uri;
      })
    );

    if (allImages.length > 0) {
      setImagesList(allImages);
    }
  };

  const getTitle = (data) => {
    return (
      <div className="details__card_title d-flex align-items-center sampling_detail_card">
        <img src={BarrelImage} alt="ReGaugingIcon" />
        <div className="pl-3">
          <p className="details__summary__card_content__title">CRR Details: # {get(data, "custom_id")}</p>
          <p className="details__summary__card_content__value text-transform-none">
            Cask number: {get(data, "cask_details.cask_number")} | Cask Type: {get(data, "cask_details.cask_type")} | Passport number: {get(data, "cask_details.passport_number")}
          </p>
        </div>
      </div>
    );
  };

  React.useEffect(() => {
    fetchCRRDetails();
  }, []);

  return (
    <>
      <div className="table-responsive-padding">
        <ErrorBoundary>
          <div className="crr__details__page crr_cask_detail_section">
            <div className="order_tab_box d-flex flex-row-reverse mb-2">
              <Button type="link" icon={<LeftOutlined />} className="btn_back" onClick={() => history.goBack()}>
                Back to CRR Listing
              </Button>
            </div>

            <CRRDetails
              uploadedImages={uploadedImages}
              documentsUploaded={documentsUploaded}
              details={crrDetailsSummary}
              history={history}
              uploadedDocList={uploadedImages}
              crrId={get(match, "params.id")}
              imagesList={imagesList}
            />
          </div>
        </ErrorBoundary>
      </div>
    </>
  );
};

export default CRRDetailsIndex;
