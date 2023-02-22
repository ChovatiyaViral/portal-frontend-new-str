import { LoadingOutlined } from "@ant-design/icons";
import { Progress, Spin } from "antd";
import { get } from "lodash";
import LoaderBarrel from "../../../assets/images/loader_barrel.png";

const antIcon = <LoadingOutlined style={{ fontSize: 80, color: "#43425d" }} spin />;

const Loader = () => {
  return (
    <div
      style={{
        position: "absolute",
        top: "40%",
        left: "45%"
      }}
    >
      <Spin indicator={antIcon} />
    </div>
  );
};

export const AppCaskLoader = props => {

  const getLoaderText = () => {
    if (get(props, "loader_text2")) {
      if (get(props, "percent") < 60) {
        return get(props, "loader_text");
      } else {
        return get(props, "loader_text2");
      }
    }
    return get(props, "loader_text");
  };

  return (
    <>
      <div id="app_loading" className="app_pageLayout__loading_inactive">
        <div className="app_loader">
          <div className="app_loader_content">
            <p className="app_loader_img">
              <img src={LoaderBarrel} />
            </p>
            <Progress percent={60} showInfo={false} />
            <p className="app_loader_text">{getLoaderText()}</p>
          </div>
        </div>
      </div>
      <div className="app__body__content">{props.children}</div>
    </>
  );
};

export default Loader;
