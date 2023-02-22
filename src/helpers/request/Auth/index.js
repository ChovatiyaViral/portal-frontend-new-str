import { get } from "lodash";
import { openNotificationWithIcon as notification } from "../../../components/UIComponents/Toast/notification";
import { Get, Post } from "../../agent";
import { requestPath, URL } from "../../service";

class AuthService {
  login = async (postObj) => {
    return Post(URL + requestPath.auth.login, postObj)
      .then((response) => {
        if (response) {
          return response;
        } else {
          notification("error", "Something went wrong!");
          throw new Error("Something went wrong!");
        }
      })
      .catch((err) => {
        notification("error", `${get(err, "message", "Something went wrong")}`);
        // eslint-disable-next-line no-console
        console.log("Error in fetching addresses", err);
      });
  };
  VerifyToken = async () => {
    return Get(URL + requestPath.auth.verify)
      .then((response) => {
        if (response) {
          return response;
        } else {
          notification("error", "Something went wrong!");
          throw new Error("Something went wrong!");
        }
      })
      .catch((err) => {
        notification("error", `${get(err, "message", "Something went wrong")}`);
        // eslint-disable-next-line no-console
        console.log("Error in fetching addresses", err);
        localStorage.removeItem("access_token");
        window.location.href = "/login";
      });
  };
}

export default new AuthService();
