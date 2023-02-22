import { notification } from "antd";

/**
 * Notification function
 * @param
 */

export const openNotificationWithIcon = (type = "info", message = "", description = "", duration = 8) => {
  notification[type]({ message, description, duration });
};
