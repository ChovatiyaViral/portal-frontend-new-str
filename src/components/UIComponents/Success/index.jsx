import { EyeOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { get } from "lodash";
import { Link } from "react-router-dom";
import SVGIcon from "../../../constants/svgIndex";
import { setAppSuccessUI } from "../../../helpers/utility";
import "./index.scss";

const Success = (props) => {
  return (
    <>
      <div id="app_success_ui" className="app__success_state_inactive">
        <div className="success_box">
          <div className="success_content">
            <p className="success_img">
              <img src={SVGIcon.SuccessIcon} />
            </p>
            <h1 className="success_heading">Success!</h1>
            <p className="success_text">{get(props, "message")}</p>
            {/* <p className="success_text"></p> */}
            <Link to={get(props, "secondaryBtn.link")} onClick={() => setAppSuccessUI(false)}>
              <Button type="primary" ghost className="btn_back_get_entry" icon={<ArrowLeftOutlined />}>
                {get(props, "secondaryBtn.text")}
              </Button>
            </Link>
            <Link to={get(props, "primaryBtn.link")} onClick={() => setAppSuccessUI(false)}>
              <Button type="secondary" className="btn_view_crr_list" icon={<EyeOutlined />}>
                {get(props, "primaryBtn.text")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
export default Success;
