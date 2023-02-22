import { Card, Col, Input, Row, Tooltip } from "antd";
import axios from "axios";
import { cloneDeep, get, has, isArray } from "lodash";
import React from "react";
import { useDispatch } from "react-redux";
import SVGIcon from "../../../../../constants/svgIndex";
import DocumentService from "../../../../../helpers/request/Common/document";
import { getRequestHeader } from "../../../../../helpers/service";
import { getBlobURL } from "../../../../../helpers/utility";
import { setCurrentView } from "../../../../../store/Auth/auth.actions";
import { openNotificationWithIcon } from "../../../..//UIComponents/Toast/notification";
import DocumentsListView from "../../../../CommonComponents/Upload/documentsView";
import ImageListView from "../../../../CommonComponents/Upload/imagesListView";
import ErrorBoundary from "../../../../UIComponents/ErrorBoundary";
import CustomRadarChart from "../../../../UIComponents/RadarChart/customRadar";
import "../index.scss";

const SamplingDataJobDetail = (props) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [expectedData, setExpectedData] = React.useState([]);
  const [imagesList, setImagesList] = React.useState([]);

  const { match } = props;
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(setCurrentView(`Sampling Details - # ${get(match, "params.id")}`));
  }, []);

  const fetchDetails = async () => {
    const rest = await axios({
      method: "GET",
      url: `${process.env.REACT_APP_API_ENDPOINT}/api/v1/cask_sample/details/${get(match, "params.id")}`,
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
      props.getCaskNumber(get(rest, "data.data.cask_number"));
    }

    if (!get(rest, "data.status", true)) {
      setIsLoading(false);
      openNotificationWithIcon("error", `${get(rest, "data.message", "Something Went Wrong")} `);
    }
  };

  const init = () => {
    fetchDetails();
  };

  React.useEffect(() => {
    init();
  }, []);

  const getDocumentDownload = async (doc) => {
    await DocumentService.downloadDocument(doc);
  };

  const getDataSet = () => {
    let tempObj = cloneDeep(get(expectedData, "character"));

    if (tempObj) {
      if (has(tempObj, "comments")) {
        delete tempObj["comments"];
      }

      if (has(tempObj, "character_comments")) {
        delete tempObj["character_comments"];
      }

      const dataNew = Object.keys(tempObj).map((li) => {
        return get(expectedData, `character.${li}`);
      });

      const data = dataNew.map((o) => {
        return Number(o.split("/")[0]);
      });

      return data;
    }
    return [];
  };

  const getTitle = (data) => {
    return (
      <div className="details__card_title d-flex align-items-center sampling_detail_card">
        <img src={SVGIcon.SamplingTitleIcon} alt="Sampling" />
        <div>
          <p className="details__summary__card_content__title">Sampling Details - Report ID - # {get(data, "report_id")}</p>
          <p className="details__summary__card_content__value text-transform-none">
            Cask Number - {get(data, "cask_number", "NA")} | Sampled At - {getValue(get(data, "completed_at", "NA"))} | Sampled By - {getValue(get(data, "completed_by", "NA"))}
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

  const getValue = (val) => {
    return val ? val : "NA";
  };

  return (
    <div className="portal_styling__2 table-responsive-padding">
      {get(props, "isDocumentListVisible") || get(props, "isImageListVisible") ? (
        <ErrorBoundary>
          {get(props, "isDocumentListVisible") && <DocumentsListView docList={documentsUploaded} />}
          {get(props, "isImageListVisible") && <ImageListView imgList={uploadedImages} />}
        </ErrorBoundary>
      ) : (
        <ErrorBoundary>
          <div className="summary__additional_details common_card_section">
            <div className="d-flex align-items-center mb-2">
              <img src={SVGIcon.SampleCaskIcon} alt="Cask Number" className="mr-2" style={{ width: "24px", height: "24px" }} />
              <span style={{ fontWeight: 700, fontSize: 16 }}>Cask Details</span>
            </div>
            <div className="additional_details_content">
              <Row gutter={[24, 24]}>
                <Col xs={{ span: 24 }} sm={{ span: 10 }} lg={{ span: 5 }}>
                  <Row gutter={[24, 24]}>
                    <Col xs={{ span: 12 }}>
                      <p className="summary__card_content__title">Brand Name</p>
                      <Tooltip placement="topLeft" title={getValue(get(expectedData, "brand", "NA"))}>
                        <p className="summary__card_content__value">{getValue(get(expectedData, "brand", "NA"))}</p>
                      </Tooltip>
                    </Col>
                    <Col xs={{ span: 12 }}>
                      <p className="summary__card_content__title">Distillery</p>
                      <Tooltip placement="topLeft" title={getValue(get(expectedData, "distillery", "NA"))}>
                        <p className="summary__card_content__value">{getValue(get(expectedData, "distillery", "NA"))}</p>
                      </Tooltip>
                    </Col>
                    <Col xs={{ span: 12 }}>
                      <p className="summary__card_content__title">AYS</p>
                      <Tooltip placement="topLeft" title={getValue(get(expectedData, "ays", "NA"))}>
                        <p className="summary__card_content__value">{getValue(get(expectedData, "ays", "NA"))}</p>
                      </Tooltip>
                    </Col>
                    <Col xs={{ span: 12 }}>
                      <p className="summary__card_content__title">Cask Type</p>
                      <Tooltip placement="topLeft" title={getValue(get(expectedData, "cask_type", "NA"))}>
                        <p className="summary__card_content__value">{getValue(get(expectedData, "cask_type", "NA"))}</p>
                      </Tooltip>
                    </Col>
                  </Row>
                </Col>
                <Col xs={{ span: 24 }} sm={{ span: 2 }}>
                  <div className="vertical_divider"></div>
                </Col>
                <Col xs={{ span: 24 }} sm={{ span: 10 }} lg={{ span: 10 }}>
                  <Row gutter={[0, 24]}>
                    <Col xs={{ span: 12 }} sm={{ span: 8 }}>
                      <p className="summary__card_content__title">DT Location</p>
                      <p className="summary__card_content__value">{getValue(get(expectedData, "dt_location", "NA"))}</p>
                    </Col>
                    <Col xs={{ span: 12 }} sm={{ span: 14 }}>
                      <p className="summary__card_content__title">Created By</p>
                      <Tooltip placement="topLeft" title={getValue(get(expectedData, "created_by", "NA"))}>
                        <p className="summary__card_content__value">{getValue(get(expectedData, "created_by", "NA"))}</p>
                      </Tooltip>
                    </Col>
                    <Col xs={{ span: 12 }} sm={{ span: 8 }}>
                      <p className="summary__card_content__title">Cask Number</p>
                      <Tooltip placement="topLeft" title={getValue(get(expectedData, "cask_number", "NA"))}>
                        <p className="summary__card_content__value">{getValue(get(expectedData, "cask_number", "NA"))}</p>
                      </Tooltip>
                    </Col>
                    <Col xs={{ span: 12 }} sm={{ span: 14 }}>
                      <p className="summary__card_content__title">Passport Number</p>
                      <Tooltip placement="topLeft" title={getValue(get(expectedData, "passport_number", "NA"))}>
                        <p className="summary__card_content__value">{getValue(get(expectedData, "passport_number", "NA"))}</p>
                      </Tooltip>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
          </div>
          <Row gutter={[24, 0]}>
            {/* <Col xs={{ span: 24 }} lg={{ span: 24 }} xl={{ span: 8 }}>
              <div className="summary__additional_details common_card_section">
                <div className="d-flex align-items-center mb-2">
                  <img src={SVGIcon.DominantCharacterIcon} alt="Dominant Character Markers" className="mr-2" style={{ width: "20px", height: "20px" }} />
                  <span style={{ fontWeight: 700, fontSize: 16 }}>Dominant Character Markers</span>
                </div>
                <div className="additional_details_content text-capitalize">
                  <Row>
                    <Col span={8}>
                      <p className="summary__card_content__title">Dominant</p>
                      <p className="summary__card_content__value">{getValue(get(expectedData, "dominant_character_markers.Dominant", ""))}</p>
                    </Col>
                    <Col span={8}>
                      <p className="summary__card_content__title">Mild</p>
                      <p className="summary__card_content__value">{getValue(get(expectedData, "dominant_character_markers.Mild", ""))}</p>
                    </Col>
                    <Col span={8}>
                      <p className="summary__card_content__title">Weak</p>
                      <p className="summary__card_content__value">{getValue(get(expectedData, "dominant_character_markers.Weak", ""))}</p>
                    </Col>
                  </Row>
                  <div className="comment_section mt-4">
                    <div className="d-flex align-items-center mb-2">
                      <img src={SVGIcon.CommentsIcon} alt="Further comments" className="mr-2" style={{ width: "20px", height: "20px" }} />
                      <span>Further comments</span>
                    </div>
                    <Input.TextArea value={get(expectedData, "dominant_character_markers_comments", "NA")} rows={2} disabled />
                  </div>
                </div>
              </div>
            </Col> */}
            <Col xs={{ span: 24 }} lg={{ span: 12 }} xl={{ span: 12 }}>
              <div className="summary__additional_details common_card_section" style={{ minHeight: 240 }}>
                <div className="d-flex align-items-center mb-2">
                  <img src={SVGIcon.FinishIcon} alt="Finish" className="mr-2" style={{ width: "20px", height: "20px" }} />
                  <span style={{ fontWeight: 700, fontSize: 16 }}>Finish</span>
                </div>
                <div className="additional_details_content">
                  <Row>
                    <Col xs={{ span: 24 }} md={{ span: 24 }}>
                      <p className="summary__card_content__title">{getValue(get(expectedData, "finish", ""))}</p>
                    </Col>
                  </Row>
                  <div className="comment_section mt-4">
                    <div className="d-flex align-items-center mb-2">
                      <img src={SVGIcon.CommentsIcon} alt="Further comments" className="mr-2" style={{ width: "20px", height: "20px" }} />
                      <span>Further comments</span>
                    </div>
                    <Input.TextArea value={get(expectedData, "finish_comments", "NA")} rows={3} disabled />
                  </div>
                </div>
              </div>
            </Col>
            <Col xs={{ span: 24 }} lg={{ span: 12 }} xl={{ span: 12 }}>
              <div className="summary__additional_details common_card_section">
                <div className="d-flex align-items-center mb-2">
                  <img src={SVGIcon.FinishIcon} alt="Overall Rating" className="mr-2" style={{ width: "20px", height: "20px" }} />
                  <span style={{ fontWeight: 700, fontSize: 16 }}>Overall Rating</span>
                </div>
                <div className="additional_details_content">
                  <Row>
                    <Col xs={{ span: 24 }} md={{ span: 24 }}>
                      <p className="summary__card_content__title">{getValue(get(expectedData, "overall_rating", ""))}</p>
                    </Col>
                  </Row>
                  <div className="comment_section mt-4">
                    <div className="d-flex align-items-center mb-2">
                      <img src={SVGIcon.CommentsIcon} alt="Further comments" className="mr-2" style={{ width: "20px", height: "20px" }} />
                      <span>Further comments</span>
                    </div>
                    <Input.TextArea value={get(expectedData, "overall_rating_comments", "NA")} rows={3} disabled />
                  </div>
                </div>
              </div>
            </Col>
          </Row>
          <div className="summary__additional_details common_card_section">
            <div className="d-flex align-items-center mb-2">
              <img src={SVGIcon.ColorChartIcon} alt="Colour Chart" className="mr-2" style={{ width: "20px", height: "20px" }} />
              <span style={{ fontWeight: 700, fontSize: 16 }}>Color Chart</span>
            </div>
            <div className="additional_details_content">
              <Row gutter={[24, 24]}>
                <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }} lg={{ span: 6 }}>
                  <div className="view_sampling_color_chart align-items-center mt-3">
                    <div className="chose_color" style={{ background: get(expectedData, "color_code", "NA") }}></div>
                    <div className="color_data">
                      <h1>{get(expectedData, "color", "NA")}</h1>
                    </div>
                  </div>
                </Col>
                <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }} lg={{ span: 8 }}>
                  <div className="comment_section">
                    <div className="d-flex align-items-center mb-2">
                      <img src={SVGIcon.CommentsIcon} alt="Further comments" className="mr-2" style={{ width: "20px", height: "20px" }} />
                      <span>Further comments</span>
                    </div>
                    <Input.TextArea value={get(expectedData, "color_comments", "NA")} rows={2} disabled />
                  </div>
                </Col>
              </Row>
            </div>
          </div>

          <div className="summary__additional_details common_card_section">
            <div className="d-flex align-items-center mb-2">
              <img src={SVGIcon.CharacterIcon} alt="Character" className="mr-2" style={{ width: "20px", height: "20px" }} />
              <span style={{ fontWeight: 700, fontSize: 16 }}>Character (Score out of 5)</span>
            </div>
            <div className="additional_details_content">
              <Row gutter={[0, 24]}>
                <Col xs={{ span: 24 }} lg={{ span: 10 }}>
                  <Row gutter={[0, 16]} className="mt-5">
                    <Col xs={{ span: 12 }} md={{ span: 8 }} lg={{ span: 8 }}>
                      <p className="summary__card_content__title">Peaty/Smokey</p>
                      <Tooltip placement="topLeft" title={get(expectedData, "character.peaty_or_smokey", "0")}>
                        <p className="summary__card_content__value">{get(expectedData, "character.peaty_or_smokey", "0")}</p>
                      </Tooltip>
                    </Col>
                    <Col xs={{ span: 12 }} md={{ span: 8 }} lg={{ span: 8 }}>
                      <p className="summary__card_content__title">Pear/Apple</p>
                      <Tooltip placement="topLeft" title={get(expectedData, "character.pear_or_apple", "0")}>
                        <p className="summary__card_content__value">{get(expectedData, "character.pear_or_apple", "0")}</p>
                      </Tooltip>
                    </Col>
                    <Col xs={{ span: 12 }} md={{ span: 8 }} lg={{ span: 8 }}>
                      <p className="summary__card_content__title">Grassy/Citrus</p>
                      <Tooltip placement="topLeft" title={get(expectedData, "character.grassy_or_citrus", "0")}>
                        <p className="summary__card_content__value">{get(expectedData, "character.grassy_or_citrus", "0")}</p>
                      </Tooltip>
                    </Col>
                    <Col xs={{ span: 12 }} md={{ span: 8 }} lg={{ span: 8 }}>
                      <p className="summary__card_content__title">Floral/Herbal</p>
                      <Tooltip placement="topLeft" title={get(expectedData, "character.floral_or_herbal", "0")}>
                        <p className="summary__card_content__value">{get(expectedData, "character.floral_or_herbal", "0")}</p>
                      </Tooltip>
                    </Col>
                    <Col xs={{ span: 12 }} md={{ span: 8 }} lg={{ span: 8 }}>
                      <p className="summary__card_content__title">Tofee/Vanilla</p>
                      <Tooltip placement="topLeft" title={get(expectedData, "character.tofee_or_vanilla", "0")}>
                        <p className="summary__card_content__value">{get(expectedData, "character.tofee_or_vanilla", "0")}</p>
                      </Tooltip>
                    </Col>
                    <Col xs={{ span: 12 }} md={{ span: 8 }} lg={{ span: 8 }}>
                      <p className="summary__card_content__title">Nutty/Oilly</p>
                      <Tooltip placement="topLeft" title={get(expectedData, "character.nutty_or_oilly", "0")}>
                        <p className="summary__card_content__value">{get(expectedData, "character.nutty_or_oilly", "0")}</p>
                      </Tooltip>
                    </Col>
                    <Col xs={{ span: 12 }} md={{ span: 8 }} lg={{ span: 8 }}>
                      <p className="summary__card_content__title">Dried Fruit/Sherry</p>
                      <Tooltip placement="topLeft" title={get(expectedData, "character.dried_fruit_or_sherry", "0")}>
                        <p className="summary__card_content__value">{get(expectedData, "character.dried_fruit_or_sherry", "0")}</p>
                      </Tooltip>
                    </Col>
                    <Col xs={{ span: 12 }} md={{ span: 8 }} lg={{ span: 8 }}>
                      <p className="summary__card_content__title">Woody/Spicy</p>
                      <Tooltip placement="topLeft" title={get(expectedData, "character.woody_or_spicy", "0")}>
                        <p className="summary__card_content__value">{get(expectedData, "character.woody_or_spicy", "0")}</p>
                      </Tooltip>
                    </Col>
                    <Col xs={{ span: 12 }} md={{ span: 8 }} lg={{ span: 8 }}>
                      <p className="summary__card_content__title">Body</p>
                      <Tooltip placement="topLeft" title={get(expectedData, "character.body", "0")}>
                        <p className="summary__card_content__value">{get(expectedData, "character.body", "0")}</p>
                      </Tooltip>
                    </Col>
                  </Row>
                </Col>
                <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                  <Row gutter={[24, 0]}>
                    <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                      <div className="common_card_section mb-0">{getDataSet().length > 0 && <CustomRadarChart data={getDataSet()} />}</div>
                    </Col>
                    <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                      <div className="character_further_comment mt-5 further_comments">
                        <div className="d-flex align-items-center">
                          <img src={SVGIcon.CommentsIcon} alt="Further comments" className="mr-2" style={{ width: "20px", height: "20px" }} />
                          <span>Further comments</span>
                        </div>
                        <hr />
                        <div className="character_comments">
                          <Input.TextArea value={get(expectedData, "character_comments", "NA")} style={{ minHeight: "100px" }} disabled />
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
          </div>

          <div className="summary__additional_details common_card_section">
            <div className="additional_details_content">
              <Row gutter={[16, 16]}>
                <Col xs={{ span: 24 }} md={{ span: 8 }}>
                  <p className="summary__card_content__title">Feinty,vegetative or off notes? </p>
                  <p className="summary__card_content__value">{getValue(get(expectedData, "fienty_vegetative", ""))}</p>
                  <div className="comment_section mt-2">
                    <div className="d-flex align-items-center mb-2">
                      <img src={SVGIcon.CommentsIcon} alt="Further comments" className="mr-2" style={{ width: "20px", height: "20px" }} />
                      <span>Further comments</span>
                    </div>
                    <Input.TextArea value={get(expectedData, "fienty_vegetative_comments", "NA")} rows={1} disabled />
                  </div>
                </Col>

                <Col xs={{ span: 24 }} md={{ span: 8 }}>
                  <p className="summary__card_content__title">Is the whisky profile younger than its age?</p>
                  <p className="summary__card_content__value">{getValue(get(expectedData, "whisky_profile_younger", ""))}</p>

                  <div className="comment_section mt-2">
                    <div className="d-flex align-items-center mb-2">
                      <img src={SVGIcon.CommentsIcon} alt="Further comments" className="mr-2" style={{ width: "20px", height: "20px" }} />
                      <span>Further comments</span>
                    </div>
                    <Input.TextArea value={get(expectedData, "whisky_profile_younger_comments", "NA")} rows={1} disabled />
                  </div>
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 8 }}>
                  <p className="summary__card_content__title">Is sample comparable to benchmark/best example?</p>
                  <p className="summary__card_content__value">{getValue(get(expectedData, "comparable_to_benchmark", ""))}</p>

                  <div className="comment_section mt-2">
                    <div className="d-flex align-items-center mb-2">
                      <img src={SVGIcon.CommentsIcon} alt="Further comments" className="mr-2" style={{ width: "20px", height: "20px" }} />
                      <span>Further comments</span>
                    </div>
                    <Input.TextArea value={get(expectedData, "comparable_to_benchmark_comments", "NA")} rows={1} disabled />
                  </div>
                </Col>
              </Row>
            </div>
          </div>
          {get(expectedData, "recommended_action", "") === "Bottle" && (
            <div className="summary__additional_details common_card_section">
              <div className="d-flex align-items-center   mb-2">
                <span style={{ fontWeight: 700, fontSize: 16 }}>Recommended Action</span>
              </div>
              <div className="additional_details_content">
                <Row gutter={[8, 24]}>
                  <Col xs={{ span: 24 }} md={{ span: 5 }} lg={{ span: 6 }} xl={{ span: 5 }}>
                    <div className="d-flex align-items-center">
                      <img src={SVGIcon.actionBottledImage} alt="action Bottled" style={{ width: "40px", height: "40px" }} />
                      <p className="summary__card_content__value" style={{ fontSize: "20px", marginLeft: "11px" }}>
                        {get(expectedData, "recommended_action", "")}
                      </p>
                    </div>
                  </Col>
                  <Col xs={{ span: 16 }} md={{ span: 9 }} lg={{ span: 5 }} xl={{ span: 5 }}>
                    <p className="summary__card_content__title">Target Bottling date</p>
                    <p className="summary__card_content__value">{getValue(get(expectedData, "bottling_date", ""))}</p>
                  </Col>
                  <Col xs={{ span: 8 }} md={{ span: 8 }} lg={{ span: 5 }} xl={{ span: 5 }}>
                    <p className="summary__card_content__title">Customer</p>
                    <p className="summary__card_content__value">{getValue(get(expectedData, "customer", ""))}</p>
                  </Col>
                  <Col xs={{ span: 16 }} md={{ span: 9 }} lg={{ span: 5 }} xl={{ span: 5 }}>
                    <p className="summary__card_content__title">Target Brand</p>
                    <p className="summary__card_content__value">{getValue(get(expectedData, "target_brand", ""))}</p>
                  </Col>
                </Row>
              </div>
            </div>
          )}
          {get(expectedData, "recommended_action", "") === "Octivate" && (
            <div className="summary__additional_details common_card_section">
              <div className="d-flex align-items-center   mb-2">
                <span style={{ fontWeight: 700, fontSize: 16 }}>Recommended Action</span>
              </div>
              <div className="additional_details_content">
                <Row gutter={[8, 24]}>
                  <Col xs={{ span: 24 }} md={{ span: 5 }} lg={{ span: 6 }} xl={{ span: 5 }}>
                    <div className="d-flex align-items-center">
                      <img src={SVGIcon.SampleCaskIcon} alt="action Bottled" style={{ width: "40px", height: "40px" }} />
                      <p className="summary__card_content__value" style={{ fontSize: "20px", marginLeft: "11px" }}>
                        {get(expectedData, "recommended_action", "")}
                      </p>
                    </div>
                  </Col>
                  <Col xs={{ span: 16 }} md={{ span: 9 }} lg={{ span: 10 }} xl={{ span: 7 }}>
                    <p className="summary__card_content__title">Octivate Fill Type</p>
                    <p className="summary__card_content__value">{getValue(get(expectedData, "fill_type", ""))}</p>
                  </Col>
                </Row>
              </div>
            </div>
          )}
          {get(expectedData, "recommended_action", "") === "Rerack" && (
            <div className="summary__additional_details common_card_section">
              <div className="d-flex align-items-center   mb-2">
                <span style={{ fontWeight: 700, fontSize: 16 }}>Recommended Action</span>
              </div>
              <div className="additional_details_content">
                <Row gutter={[8, 24]}>
                  <Col xs={{ span: 24 }} md={{ span: 5 }} lg={{ span: 6 }} xl={{ span: 5 }}>
                    <div className="d-flex align-items-center">
                      <img src={SVGIcon.ReRackActionIcon} alt="action Bottled" style={{ width: "107px", height: "37px" }} />
                      <p className="summary__card_content__value" style={{ fontSize: "20px", marginLeft: "11px" }}>
                        {get(expectedData, "recommended_action", "")}
                      </p>
                    </div>
                  </Col>
                  <Col xs={{ span: 12 }} md={{ span: 3 }}>
                    <p className="summary__card_content__title">Cask Type</p>
                    <p className="summary__card_content__value">{getValue(get(expectedData, "cask_type", ""))}</p>
                  </Col>

                  <Col xs={{ span: 12 }} md={{ span: 8 }}>
                    <p className="summary__card_content__title">Fill Type</p>
                    <p className="summary__card_content__value">{getValue(get(expectedData, "fill_type", ""))}</p>
                  </Col>
                </Row>
              </div>
            </div>
          )}
          {get(expectedData, "recommended_action", "") === "Mature further" && (
            <div className="summary__additional_details common_card_section">
              <div className="d-flex align-items-center   mb-2">
                <span style={{ fontWeight: 700, fontSize: 16 }}>Recommended Action</span>
              </div>
              <div className="additional_details_content">
                <Row gutter={[8, 24]}>
                  <Col xs={{ span: 24 }} md={{ span: 5 }} lg={{ span: 6 }} xl={{ span: 5 }}>
                    <div className="d-flex align-items-center">
                      <img src={SVGIcon.MatureFurtherIcon} alt="action Bottled" style={{ width: "40px", height: "40px" }} />
                      <p className="summary__card_content__value" style={{ fontSize: "20px", marginLeft: "11px" }}>
                        {get(expectedData, "recommended_action", "")}
                      </p>
                    </div>
                  </Col>
                  <Col xs={{ span: 16 }} md={{ span: 9 }} lg={{ span: 10 }} xl={{ span: 7 }}>
                    <p className="summary__card_content__title">Next sampling date</p>
                    <p className="summary__card_content__value">{getValue(get(expectedData, "next_sampling_date", ""))}</p>
                  </Col>
                </Row>
              </div>
            </div>
          )}
          <div className="summary__additional_details common_card_section">
            <div className="d-flex align-items-center   mb-2">
              <img src={SVGIcon.AdditionalDetailsIcon} alt="Additional Details" className="mr-2" style={{ width: "24px", height: "24px" }} />
              <span style={{ fontWeight: 700, fontSize: 16 }}>Additional Details</span>
            </div>
            <div className="crr_details__additional__content summary_details">
              <Row gutter={[16, 16]}>
                <Col flex="1 0 3%">
                  <Card
                    style={{ minHeight: 234 }}
                    title={
                      <p className="summary__card_title">
                        <img src={SVGIcon.AddIcon} /> <span>Photos</span>
                      </p>
                    }
                    bordered={false}
                  >
                    <div className="photos_section">
                      {isArray(imagesList) && (
                        <>
                          {(imagesList.length > 3 ? imagesList.slice(0, 3) : imagesList).map((img, index) => {
                            return <img src={img} alt="photo 1" key={index} onClick={() => getDocumentDownload(uploadedImages[index])} className="cursor-pointer" />;
                          })}

                          {isArray(imagesList) && imagesList.length > 3 && (
                            <a
                              style={{
                                fontWeight: 500,
                                fontSize: 12,
                                color: "#38479E",
                              }}
                              onClick={() => props.handleImagesView()}
                            >
                              +{documentsUploaded.length - 3} More
                            </a>
                          )}
                          {imagesList.length === 0 && <>NO IMAGES FOUND</>}
                        </>
                      )}
                    </div>
                  </Card>
                </Col>

                <Col flex="1 0 1%">
                  <Card
                    style={{ minHeight: 234 }}
                    title={
                      <p className="summary__card_title">
                        <img src={SVGIcon.UploadDocumentIcon} /> <span>Documents</span>
                      </p>
                    }
                    bordered={false}
                  >
                    {(documentsUploaded.length > 3 ? documentsUploaded.slice(0, 3) : documentsUploaded).map((li, index) => {
                      return (
                        <div style={{ cursor: "pointer" }} className="d-flex align-items-center additional_details_doc" key={index} onClick={() => getDocumentDownload(li)}>
                          <img src={SVGIcon.PDFIcon} alt="Sebring Details" style={{ width: "24px", height: "24px", paddingRight: 7 }} />
                          <span className="additional_details_doc__title_text"> {get(li, "document_name")} </span>
                        </div>
                      );
                    })}
                    {documentsUploaded.length > 3 && (
                      <a
                        style={{
                          fontWeight: 500,
                          fontSize: 12,
                          color: "#38479E",
                        }}
                        onClick={() => props.handleDocumentView()}
                      >
                        +{documentsUploaded.length - 3} More
                      </a>
                    )}
                    {documentsUploaded.length === 0 && <p>NO DOCUMENTS AVAILABLE</p>}
                  </Card>
                </Col>

                <Col flex="1 0 3%">
                  <Card
                    style={{ minHeight: 234 }}
                    title={
                      <p className="summary__card_title">
                        <img src={SVGIcon.AddNotesIcon} /> <span>Notes</span>
                      </p>
                    }
                    bordered={false}
                  >
                    <div className="add_note_section">
                      <div className="text_box">
                        <Input.TextArea value={get(expectedData, "notes", "NA")} rows={2} disabled />
                      </div>
                    </div>
                  </Card>
                </Col>
              </Row>
            </div>
          </div>
        </ErrorBoundary>
      )}
    </div>
  );
};

export default SamplingDataJobDetail;
