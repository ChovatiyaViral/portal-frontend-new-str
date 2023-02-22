import axios from "axios";
import { get } from "lodash";
import moment from "moment";
import { openNotificationWithIcon } from "../../../components/UIComponents/Toast/notification";
import { getRequestHeader } from "../../service";
import { getFileType } from "../../utility";
class DocumentService {
  downloadDocument = async (doc) => {
    const rest = await axios({
      method: "GET",
      url: `${process.env.REACT_APP_API_ENDPOINT}/api/get_s3_file_by_url?url=${get(doc, "document_url").trim()}`,
      headers: { ...getRequestHeader() },
    }).catch((err) => {
      openNotificationWithIcon("error", `${get(err, "response.data.message", "Something Went Wrong")} `);
    });

    const fileExt = get(doc, "document_url", "").split(".").pop();
    var link = document.createElement("a");
    link.setAttribute("href", `${getFileType(fileExt)};base64,${get(rest, "data.file")}`);
    link.setAttribute("download", `${get(doc, "document_name")}-${new Date().getTime()}.${fileExt}`);
    document.body.appendChild(link); // Required for FF
    link.click();
    openNotificationWithIcon("success", "Document", `${get(doc, "document_name")} Download Successful`);
  };

  uploadToS3 = async (options, document_type = "document") => {
    const { onSuccess, onError, file, onProgress } = options;

    const format = "YYYY/MM/DD";
    const datePath = moment(new Date()).format(format);
    const file_path = `test_upload/${datePath}/`;

    let uploadDocumentRequestPayload = new FormData();
    uploadDocumentRequestPayload.append("file_name", get(file, "name"));
    uploadDocumentRequestPayload.append("file_path", file_path);
    uploadDocumentRequestPayload.append("file_binary", file);

    try {
      const resp = await axios({
        method: "POST",
        url: `${process.env.REACT_APP_API_ENDPOINT}/api/caskFiles_upload`,
        data: uploadDocumentRequestPayload,
        headers: {
          "Content-Type": "multipart/form-data",
          ...getRequestHeader(),
        },
        onUploadProgress: (event) => {
          const percent = Math.floor((event.loaded / event.total) * 100);
          onProgress({ percent: percent });
        },
      }).catch((err) => {
        openNotificationWithIcon("error", "Documents", `${get(err, "response.data.message", "Something Went Wrong")} `);
      });

      onSuccess("OK");
      // eslint-disable-next-line no-console
      console.log("server res: ", resp);

      if (get(resp, "data.status", false)) {
        const requestObj = {
          document_name: get(file, "name"),
          file_name: get(file, "name"),
          document_url: get(resp, "data.file_url"),
          document_type,
        };

        return requestObj;
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log("Error: ", err);
      onError({ err });
    }
  };
}

export default new DocumentService();
