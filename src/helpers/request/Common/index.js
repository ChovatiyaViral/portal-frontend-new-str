import { get } from "lodash";
import { openNotificationWithIcon as notification } from "../../../components/UIComponents/Toast/notification";
import { Get, Post } from "../../agent";

class CommonService {
  getDataSource = async (URL, postObj, checkStatus = true) => {
    return Post(URL, postObj)
      .then((response) => {
        if (response) {
          if (get(response, "data.status")) {
            return response;
          } else {
            if (checkStatus) {
              notification("error", get(response, "data.message", "Something went wrong!"));
            } else {
              return response;
            }
          }
        } else {
          notification("error", "Something went wrong!");
          throw new Error("Something went wrong!");
        }
      })
      .catch((err) => {
        notification("error", `${get(err, "message", "Something went wrong")}`);
        // eslint-disable-next-line no-console
        console.log("Error in fetching", err);
        return get(err, "message", "Something went wrong");
      });
  };

  getDetails = async (URL) => {
    return Get(URL)
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
        console.log("Error in fetching", err);
      });
  };
}

export default new CommonService();
