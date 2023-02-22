import { AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";
import React, { Suspense } from "react";
import Logo from "./assets/images/duncan-taylor-logo.svg";
import PortalLayout from "./components/Layout";
import { SignInButton } from "./components/Pages/Login/signInButton";
import Loader from "./components/UIComponents/Loader";
import { siteConfig } from "./settings";

/**
 * If a user is authenticated the ProfileContent component above is rendered. Otherwise a message indicating a user is not authenticated is rendered.
 */
const MainContent = (props) => {
  return (
    <div className="App">
      <AuthenticatedTemplate>
        <PortalLayout {...props} />
      </AuthenticatedTemplate>

      <UnauthenticatedTemplate>
        <div className="welcome_note">
          <img src={Logo} alt={siteConfig.appName} width="250" height="250" />
          <h2>{siteConfig.appName}</h2>
          <h5 className="card-title">Please sign in to your account using your Duncan Taylor email credentials</h5>
          <SignInButton />
        </div>
        {/* <Footer /> */}
      </UnauthenticatedTemplate>
    </div>
  );
};

/**
 * Application Entry Component
 * @param props
 */
function App(props) {
  return (
    <Suspense fallback={<Loader />}>
      <MainContent history={props.history} />
    </Suspense>
  );
}

export default App;
