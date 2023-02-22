import { Card, List } from "antd";
import axios from "axios";
import { get } from "lodash";
import React from "react";
import { getRequestHeader } from "../../../helpers/service";
import { getBlobURL } from "../../../helpers/utility";
import ErrorBoundary from "../../UIComponents/ErrorBoundary";

const ImageListView = (props) => {
  const [imagesList, setImagesList] = React.useState([]);

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
      imageUploaded.map(async (list) => {
        const uri = await getImageFromS3(get(list, "document_url"));
        return uri;
      })
    );

    if (allImages.length > 0) {
      setImagesList(allImages);
    }

    return allImages;
  };

  React.useEffect(() => {
    getAllImages(get(props, "imgList", []));
  }, [props]);

  return (
    <>
      <div className="bg-white p-4" style={{ marginTop: 25, borderRadius: 20 }}>
        <ErrorBoundary>
          <List
            size="small"
            grid={{
              gutter: [8, 0],
              column: 4,
            }}
            className="cask_action_items__cask_comments"
            bordered={false}
            dataSource={imagesList}
            renderItem={(item) => (
              <List.Item>
                <Card className="cask_uploadedList_card">
                  <img src={item} alt="Cask Image" className="cask_uploadedList_image" />
                </Card>
              </List.Item>
            )}
          />
        </ErrorBoundary>
      </div>
    </>
  );
};

export default ImageListView;
