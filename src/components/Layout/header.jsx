import { EnvironmentOutlined, UpOutlined } from "@ant-design/icons";
import { useIsAuthenticated } from "@azure/msal-react";
import { Col, Dropdown, Menu, Row } from "antd";
import { get } from "lodash";
import { useSelector } from "react-redux";
import { isMobileOrTab } from "../../constants";
import { getScreenSize } from "../../helpers/utility";
import { SignInButton } from "../Pages/Login/signInButton";
// import AutoCompleteSelect from "../UIComponents/AutoComplete";
import { ResponsiveHeader } from "./responsiveHeader";
// import { SignOutButton } from "../Pages/Login/signOutButton";
import { UserProfile } from "./userProfile";

/**
 * Renders the navbar component with a sign-in or sign-out button depending on whether or not a user is authenticated
 */

export const Header = (props) => {
  const isAuthenticated = useIsAuthenticated();

  const currentView = useSelector((state) => {
    return get(state, "auth.currentView", null);
  });

  const items = [
    {
      key: "1",
      label: <span>gate Entry</span>,
    },
  ];

  return (
    <>
      {getScreenSize() > isMobileOrTab ? (
        <div className="app_header ">
          <Row>
            <Col flex="auto">
              {isAuthenticated ? (
                <>
                  <div className="d-flex justify-content-between align-items-center ml-3">
                    {/* <AutoCompleteSelect /> */}
                    <span className="app__page_title">{currentView}</span>
                    <div className="header_gate_entry_dropdown mr-3 ml-auto d-none">
                      <Dropdown menu={{ items }}>
                        <div className="header_dropdown">
                          <EnvironmentOutlined />
                          <h6>Huntly Warehouse #1</h6>
                          <UpOutlined />
                        </div>
                      </Dropdown>
                    </div>
                    <UserProfile />
                  </div>
                </>
              ) : (
                <SignInButton />
              )}
            </Col>
          </Row>
        </div>
      ) : (
        <>{isAuthenticated ? <ResponsiveHeader loggedInUser={get(props, "loggedInUser")} {...props} currentView={currentView} /> : <SignInButton />}</>
      )}
    </>
  );
};
