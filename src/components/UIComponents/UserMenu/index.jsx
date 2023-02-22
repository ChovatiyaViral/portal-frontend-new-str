import { BellOutlined, DownOutlined, QuestionCircleOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Badge, Dropdown, Tooltip } from "antd";
import { get } from "lodash";
import React from "react";
import { connect } from "react-redux";
import validator from "validator";
import { isMobileOrTab } from "../../../constants";
import { defaultRequestOptions } from "../../../settings";
// import { uploadHelpImage } from "../../../helpers/s3PutHelper";
import { getScreenSize, getUserPermittedList } from "../../../helpers/utility";
import { addHelpDetails, getHelpDetails } from "../../../store/Help/help.actions";
import Help from "../../Pages/Help";
import DrawerTray from "../../UIComponents/Drawer";
import CustomModal from "../../UIComponents/Modal";
import { info } from "../../UIComponents/Modal/informationModal";
import { openNotificationWithIcon } from "../../UIComponents/Toast/notification";
import "./index.scss";

const UserMenu = (props) => {
  const [isVisible, setVisible] = React.useState(false);
  const [isHelp, setIsHelp] = React.useState(false);
  const [helpData, setHelpData] = React.useState({ url: "", comments: "" });
  const [uploadedImageFile, setUploadedImageFile] = React.useState(null);

  const [urlError, setURLError] = React.useState(false);
  const [commentsError, setCommentsError] = React.useState(false);

  const items = [
    {
      key: "1",
      label: <span onClick={() => onClick("1")}>About</span>,
    },
    {
      key: "2",
      label: <span onClick={() => onClick("2")}>Settings</span>,
    },
    {
      key: "3",
      label: <span onClick={() => onClick("3")}>Release Notes</span>,
    },
    {
      key: "4",
      label: <span onClick={() => onClick("4")}>Sign Out</span>,
    },
  ];

  const onClick = (key) => {
    if (key === "4") {
      props.handleSignOut();
    }

    if (key === "1") {
      info({
        title: "About",
        message: (
          <>
            <p> No info Available </p>
          </>
        ),
      });
    }

    if (key === "2") {
      info({
        title: "Settings",
        message: (
          <>
            <p> No info Available </p>
          </>
        ),
      });
    }

    if (key === "3") {
      info({
        title: "Release Notes",
        message: (
          <>
            <p> No info Available </p>
          </>
        ),
      });
    }
  };

  const handleClose = () => {
    setVisible(false);
  };

  const handleHelp = () => {
    setIsHelp(true);
  };

  const handleOpen = () => {
    setVisible(true);
  };

  const handleHelpClose = () => {
    setIsHelp(false);
  };

  const handleHelpSubmit = async () => {
    const { url, comments } = helpData;

    if (!url || validator.isEmpty(url)) {
      setURLError(true);
      return false;
    }

    if (!comments || validator.isEmpty(comments)) {
      setCommentsError(true);
      return false;
    }
    // const uploadedStatus = await uploadHelpImage(uploadedImageFile, { email: "subbudixith@gmail.com", name: "Subbu Dixit" });
    // console.log(uploadedStatus);

    const requestData = { url, comments, image_url: "" };

    const helpResponseData = await props.addHelpDetails(requestData);

    if (get(helpResponseData, "response.status")) {
      openNotificationWithIcon("success", "Help", `${get(helpResponseData, "response.message", "Added Successfully")} `);
      await props.getHelpDetails(defaultRequestOptions);
    }

    if (get(helpResponseData, "error", false)) {
      openNotificationWithIcon("error", "Help", `${get(helpResponseData, "error.message", "Something Went Wrong")} `);
    }

    handleHelpClose();
  };

  const handleError = (type) => {
    if (type === "urlError") {
      setURLError(false);
    }
    if (type === "commentsError") {
      setURLError(false);
    }
  };

  const handleChange = (data) => {
    let newData = { ...helpData };
    newData[get(data, "key")] = get(data, "value");
    setHelpData(newData);
  };

  const handleUploadImage = (uploadedFile) => {
    setUploadedImageFile(uploadedFile);
  };

  return (
    <>
      <DrawerTray title="Notifications" handleClose={handleClose} visible={isVisible}>
        <center className="pt-5">No notification yet</center>
      </DrawerTray>
      {isHelp && (
        <CustomModal isOpen={isHelp} title="Help" okText="Submit" handleClose={handleHelpClose} handleOk={handleHelpSubmit}>
          <Help
            urlError={urlError}
            commentsError={commentsError}
            handleError={handleError}
            options={getUserPermittedList(get(props, "userPermissions", {}))}
            handleUploadImage={handleUploadImage}
            handleChange={handleChange}
          />
        </CustomModal>
      )}
      <div className="d-flex justify-content-between align-items-center pr-sm-3">
        <Tooltip placement="left" title="Help" color="#3b3a52">
          <QuestionCircleOutlined onClick={handleHelp} className="pr-3 app_header__notification_icon" style={{ color: getScreenSize() > isMobileOrTab ? "#ccc" : "#fff", fontSize: 14 }} />
        </Tooltip>
        <span className="pr-sm-3 app_header__notification_icon" onClick={handleOpen}>
          <Badge dot count={0} size="small">
            <BellOutlined style={{ color: getScreenSize() > isMobileOrTab ? "#ccc" : "#fff" }} />
          </Badge>
        </span>
        <Dropdown
          menu={{
            items,
          }}
          placement="topRight"
          arrow
          trigger={["click"]}
          className="mr-3"
        >
          <a className="text-decoration-none pl-3 mr-3" onClick={(e) => e.preventDefault()}>
            {getScreenSize() > isMobileOrTab && <b className="pr-2">{get(props, "name", "")}</b>}
            <Avatar icon={<UserOutlined />} src={get(props, "profilePic", "")} /> <DownOutlined />
          </a>
        </Dropdown>
      </div>
    </>
  );
};

export default connect(
  (state) => ({
    loading: get(state, "help.loading"),
    error: get(state, "help.error"),
    userPermissions: get(state, "auth.loggedInUserDetails.data.user_permissions", false),
    helpData: get(state, "help.helpDetails"),
  }),
  { addHelpDetails, getHelpDetails }
)(UserMenu);
