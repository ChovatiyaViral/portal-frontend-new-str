import { useMsal } from "@azure/msal-react";
import { get } from "lodash";
import React from "react";
import { graphConfig } from "../../config/authConfig";
import { siteConfig } from "../../settings";
import ResponsiveMobileHeader from "../CommonComponents/ResponsiveMobileHeader";
import UserMenu from "../UIComponents/UserMenu";

/**
 * Renders the userprofile component
 */
export const ResponsiveHeader = (props) => {
  const { instance } = useMsal();

  const handleSignOut = () => {
    instance.logout();
  };

  return (
    <>
      <div className="responsive_header d-flex flex-row-reverse">
        <UserMenu handleSignOut={handleSignOut} profilePic={graphConfig.graphMeProfilePic} />
        <center className="mr-3">
          <b>{siteConfig.appName}</b>
        </center>
      </div>
      <ResponsiveMobileHeader title={get(props, "currentView")} {...props} />
    </>
  );
};
