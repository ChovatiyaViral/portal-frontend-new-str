import { DatePicker, Form } from "antd";
import { get, has } from "lodash";
import moment from "moment";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

export const CustomDatePicker = (props) => {
  const dateFormat = get(props, "format") ? get(props, "format") : "YYYY-MM-DD";

  const onDateChange = (date, dateString) => {
    props.handleChange(get(props, "type", ""), dateString);
  };

  const disabledDate = (current) => {
    if (current) {
      if (get(props, "enableFutureDate", false)) {
        return current < moment("1960-01-01");
      }

      if (get(props, "enable7DaysFromCurrent", false)) {
        let prevDate = new Date();
        prevDate.setDate(new Date().getDate() - 1);

        let nextDate = new Date();
        nextDate.setDate(new Date().getDate() + 6);

        return current < moment(prevDate) || current > moment(nextDate);
      }

      if (get(props, "enableOnlyFutureDate", false)) {
        let yesterday = new Date();
        yesterday.setDate(new Date().getDate() - 1);
        return current < moment(yesterday);
      }

      return current > moment() || current < moment("1960-01-01");
    }
  };

  const getDefaultValue = () => {
    if (get(props, "defaultValue")) {
      return dayjs(get(props, "defaultValue"), dateFormat);
    }
    return "";
  };

  const onBlur = (e) => {
    if (has(props, "onBlur")) {
      props.onBlur(get(props, "type", ""), e.target.value);
    }
  };

  return (
    <Form layout="vertical">
      <Form.Item
        label={<span>{get(props, "label", "")} </span>}
        validateStatus={get(props, "validateStatus", "")}
        help={get(props, "helpText", "")}
        required={get(props, "required", false)}
        className={get(props, "className", "")}
        style={get(props, "style", {})}
      >
        <DatePicker
          value={get(props, "value") ? dayjs(get(props, "value"), dateFormat) : ""}
          disabledDate={disabledDate}
          status={get(props, "status", "")}
          defaultValue={getDefaultValue()}
          bordered={get(props, "bordered", true)}
          disabled={get(props, "disabled", false)}
          onChange={onDateChange}
          onBlur={onBlur}
          placeholder={`Select ${get(props, "placeholder", "Date (YYYY-MM-DD)")}`}
          format={dateFormat}
          className={get(props, "className", "")}
        />
      </Form.Item>
    </Form>
  );
};
