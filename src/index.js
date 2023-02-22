import "bootstrap/dist/css/bootstrap.min.css";
import ReactDOM from "react-dom";
import AdminPortal from "./adminPortal";
import "./assets/styles/app.scss";
import "./assets/styles/index.scss";

const style = {
  position: "absolute",
  top: "40%",
  textAlign: "center",
  margin: "auto",
  width: "100%",
};

function get_browser() {
  var ua = navigator.userAgent,
    tem,
    M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];

  if (/trident/i.test(M[1])) {
    tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
    return { name: "IE", version: tem[1] || "" };
  }

  if (M[1] === "Chrome") {
    tem = ua.match(/\bOPR\/(\d+)/);
    if (tem != null) {
      return { name: "Opera", version: tem[1] };
    }
  }

  if (window.navigator.userAgent.indexOf("Edge") > -1) {
    tem = ua.match(/\Edge\/(\d+)/);
    if (tem != null) {
      return { name: "Edge", version: tem[1] };
    }
  }
  M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, "-?"];
  if ((tem = ua.match(/version\/(\d+)/i)) != null) {
    M.splice(1, 1, tem[1]);
  }
  return {
    name: M[0],
    version: +M[1],
  };
}

function isSupported(browser) {
  var supported = false;

  if (browser.name === "Chrome" && browser.version >= 100) {
    supported = true;
  } else if ((browser.name === "MSIE" || browser.name === "IE") && browser.version >= 12) {
    supported = true;
  } else if (browser.name === "Safari" && browser.version >= 10) {
    supported = true;
  } else if (browser.name === "Firefox" && browser.version >= 100) {
    supported = true;
  } else if (browser.name === "Edge") {
    supported = true;
  }
  return supported;
}

const browser = get_browser();
const isSupportedBrowser = isSupported(browser);

const AppElement = () => {
  if (!isSupportedBrowser) {
    const elem = document.getElementById("root");
    if (elem) {
      return (
        <div style={style}>
          <h1>Browser Not Supported</h1> <p>Try with other browser OR please update your browser.</p>
        </div>
      );
    } else {
      return <h1 style={style}>Try with other browser</h1>;
    }
  } else {
    return <AdminPortal />;
  }
};

ReactDOM.render(<AppElement />, document.getElementById("root"));
