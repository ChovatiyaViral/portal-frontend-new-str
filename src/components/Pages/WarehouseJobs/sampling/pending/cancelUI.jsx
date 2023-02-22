import { isBlank } from "../../../../../helpers/utility";
import { CustomInputTextArea as InputTextArea } from "../../../../UIComponents/Input/customInput";
import { Modal, Spin } from "antd";
import { get } from "lodash";
import React from "react";

export const CancelUI = (props) => {
  const [comments, setComments] = React.useState("");
  const [commentsError, setCommentsError] = React.useState(false);

  const handleOk = () => {
    if (isBlank(comments)) {
      setCommentsError(true);
      return false;
    }
    props.handleSubmit(comments);
  };

  return (
    <Modal title={get(props, "title", "")} open={get(props, "isModalVisible", false)} onOk={handleOk} centered width={500} onCancel={() => props.handleCancel()}>
      <Spin spinning={get(props, "loading", false)}>
      <p>Are you sure you want to cancel this sampling job?</p>
        <InputTextArea
          handleChange={(key, value) => {
            setCommentsError(false);
            setComments(value);
          }}
          className="mt-0 mb-0 w-100"
          type="comments"
          value={comments}
          note={get(props, "note", "")}
          label={get(props, "label", "")}
          placeholder={get(props, "placeholder", "")}
          validateStatus={commentsError && "error"}
          helpText={commentsError && `${get(props, "label", "Reason")} cannot be empty`}
        />
      </Spin>
    </Modal>
  );
};
