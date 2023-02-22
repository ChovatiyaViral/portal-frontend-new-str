import { ConfigProvider, Layout, theme } from "antd";
import { get } from "lodash";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import AppRouter from "../../appRouter";
import { isMobileOrTab } from "../../constants";
import { getScreenSize } from "../../helpers/utility";
import { siteConfig } from "../../settings";
import { Header as HeaderLayout } from "./header";
import Sidebar from "./sidebar";

const { Header, Content, Footer, Sider } = Layout;

const PortalLayout = (props) => {
  const [collapsed, setCollapsed] = useState(true);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const loggedInUser = useSelector((state) => {
    return get(state, "auth.loggedInUserDetails", false);
  });

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#443F5F",
        },
      }}
    >
      <Layout
        style={{
          minHeight: "100vh",
        }}
      >
        <Sider collapsible={true} collapsed={collapsed} defaultCollapsed={true} collapsedWidth={getScreenSize() <= isMobileOrTab ? 0 : 80} onCollapse={(value) => setCollapsed(value)}>
          <div
            style={{
              padding: "0px 15px 19px",
              margin: "16px 0",
              borderBottom: "0.5px solid #fff",
            }}
          >
            <div className="d-flex align-items-center justify-content-around">
              <Link to="/" className="text-white text-decoration-none app_header__brand__link">
                {collapsed ? siteConfig.appShortName : siteConfig.appName}
              </Link>
            </div>
          </div>
          <Sidebar loggedInUser={loggedInUser} />
        </Sider>

        <Layout className="site-layout">
          <Header
            style={{
              padding: 0,
              top: 0,
              zIndex: 1,
              width: "100%",
              position: "sticky",
              background: colorBgContainer,
            }}
          >
            <HeaderLayout loggedInUser={loggedInUser} {...props} />
          </Header>
          <Content
            style={{
              margin: "20px",
            }}
          >
            <AppRouter loggedInUser={loggedInUser} />
          </Content>
          {/* <Footer
            style={{
              textAlign: "center",
            }}
          >
            Duncan Taylor ©{new Date().getFullYear()}
          </Footer> */}
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};
export default PortalLayout;
