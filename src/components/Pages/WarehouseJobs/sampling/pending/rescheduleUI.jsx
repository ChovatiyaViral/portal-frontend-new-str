import { Modal, Spin } from "antd";
import { get } from "lodash";
import React from "react";
import { isBlank } from "../../../../../helpers/utility";
import { CustomDatePicker } from "../../../../UIComponents/DatePicker";
import { CustomInputTextArea as InputTextArea } from "../../../../UIComponents/Input/customInput";

export const RescheduleUI = (props) => {
  const [follow_up_date, setFollowUpDate] = React.useState("");
  const [follow_up_date_error, setFollowUpDateError] = React.useState(false);
  const [comments, setComments] = React.useState("");
  const [commentsError, setCommentsError] = React.useState(false);

  const handleOk = () => {
    if (isBlank(follow_up_date)) {
      setFollowUpDateError(true);
      return false;
    }
    if (isBlank(comments)) {
      setCommentsError(true);
      return false;
    }
    props.handleSubmit({ follow_up_date, comments });
  };

  React.useEffect(() => {
    setFollowUpDate(get(props, "record.scheduled_at"));
  }, [props.record]);

  return (
    <Modal title={get(props, "title", "")} open={get(props, "isModalVisible", false)} onOk={handleOk} centered width={450} onCancel={() => props.handleCancel()}>
      <Spin spinning={get(props, "loading", false)}>
        <CustomDatePicker
          handleChange={(type, val) => {
            setFollowUpDateError(false);
            setFollowUpDate(val);
          }}
          type="scheduled_at"
          required
          format="DD-MM-YYYY"
          validateStatus={follow_up_date_error && "error"}
          helpText={follow_up_date_error ? "Schedule Date is mandatory" : ""}
          value={follow_up_date}
          enableOnlyFutureDate={true}
          placeholder="Schedule At (DD-MM-YYYY)"
          className="mt-0 mb-0 w-100"
          label="Schedule At (DD-MM-YYYY)"
        />
        <InputTextArea
          handleChange={(key, value) => {
            setCommentsError(false);
            setComments(value);
          }}
          className="mt-3 mb-0 w-100"
          type="comments"
          required
          value={comments}
          label="Reason"
          placeholder="Why do you want to reschedule the job?"
          validateStatus={commentsError && "error"}
          helpText={commentsError && "Reason cannot be empty"}
        />
      </Spin>
    </Modal>
  );
};
