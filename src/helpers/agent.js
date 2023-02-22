import Axios from "axios";
import { get } from "lodash";
import { openNotificationWithIcon as notification } from "../components/UIComponents/Toast/notification";
import { getCookie } from "./cookieHelper";
import { APPLICATION_CONTENT_TYPE, ErrorMessage, HeaderProperties } from "./service";

function getClientLanguage() {
  const lang = null;
  if (lang !== null) {
    return lang;
  }
  return "en-US";
}

function getRequestHeader() {
  return {
    Authorization: `Bearer ${getCookie("access_token")}`,
  };
}

const Get = async (url) => {
  try {
    const headers = getRequestHeader();
    headers[HeaderProperties.language] = getClientLanguage();
    return await Axios.get(`${process.env.REACT_APP_API_ENDPOINT}/api/${url}`, { headers })
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        if (get(postError, "response.status") === 401) {
          window.location.href = "/403";
        }
        // eslint-disable-next-line
        console.log(`Error in API ${url}`, get(err, "response.data"));
      });
  } catch (error) {
    throw new Error(ErrorMessage.Get);
  }
};

const Delete = async (url) => {
  try {
    const headers = getRequestHeader();
    headers[HeaderProperties.language] = getClientLanguage();
    return await Axios.delete(`${process.env.REACT_APP_API_ENDPOINT}/api/${url}`, { headers })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        // eslint-disable-next-line
        console.log(ErrorMessage.Delete, error);
        throw new Error(ErrorMessage.Delete);
      });
  } catch (error) {
    throw new Error(ErrorMessage.Delete);
  }
};

const Post = async (url, postObject = {}) => {
  try {
    const headers = getRequestHeader();
    headers[HeaderProperties.contentType] = APPLICATION_CONTENT_TYPE;
    headers[HeaderProperties.language] = getClientLanguage();
    return await Axios.post(`${process.env.REACT_APP_API_ENDPOINT}/api/${url}`, postObject, { headers })
      .then((response) => {
        return response;
      })
      .catch((postError) => {
        notification("error", `${get(postError, "response.data.message", "Something went wrong")}`);
        if (get(postError, "response.status") === 401) {
          window.location.href = "/403";
        }
        // eslint-disable-next-line
        console.log(`Error in API ${url}`, get(err, "response.data"));
        throw get(postError, "response.data");
      });
  } catch (error) {
    throw new Error(ErrorMessage.Post);
  }
};

const Put = async (url, postObject = {}) => {
  try {
    const headers = getRequestHeader();
    headers[HeaderProperties.contentType] = APPLICATION_CONTENT_TYPE;
    headers[HeaderProperties.language] = getClientLanguage();
    return await Axios.put(`${process.env.REACT_APP_API_ENDPOINT}/api/${url}`, postObject, { headers })
      .then((response) => {
        return response.data;
      })
      .catch((postError) => {
        // eslint-disable-next-line
        console.log(`Error in API ${url}`, get(err, "response.data"));
        throw new Error(ErrorMessage.Post);
      });
  } catch (error) {
    throw new Error(ErrorMessage.Post);
  }
};

export { Get, Delete, Post, Put };
