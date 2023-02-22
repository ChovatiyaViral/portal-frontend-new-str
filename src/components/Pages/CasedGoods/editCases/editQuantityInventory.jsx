import { CustomInputTextArea as InputTextArea } from "../../../UIComponents/Input/customInput";
import { get } from "lodash";
import React from "react";
import EditRotationNumber from "./editRotationNumber";

const EditQuantityInventory = (props) => {
  const [partCaseOptionsList, setPartCaseOptionsList] = React.useState([]);
  const [quantityValue, updateQuantityValue] = React.useState(undefined);

  const handlePartCaseOptions = (BPC) => {
    if (BPC) {
      let partCaseOptions = [];
      for (let i = 1; i < BPC; i++) {
        partCaseOptions.push({
          label: `${i} / ${BPC}`,
          value: `${i}/${BPC}`,
        });
      }
      if (partCaseOptions.length === 0) {
        partCaseOptions = [{ label: 0, value: 0 }];
        setPartCaseOptionsList([...partCaseOptions]);
      } else {
        setPartCaseOptionsList([...partCaseOptions]);
      }
    }
  };

  React.useEffect(() => {
    handlePartCaseOptions(get(props, "record.bpc", 0));
  }, [props.record.bpc]);

  return (
    <>
      <div className="mt-3 mb-3">
        <EditRotationNumber
          record={get(props, "record", {})}
          partCaseOptions={partCaseOptionsList}
          quantityState={(val) => updateQuantityValue(val)}
          updateSaveDisabled={(val) => props.updateSaveDisabled(val)}
          updateRotationNumber={props.updateRotationNumber}
        />
      </div>
      <InputTextArea
        handleChange={(key, value) => props.handleChange("comments", props.setComments, value)}
        className="mt-0 mb-0"
        type="comments"
        autoSize={true}
        value={get(props, "comments")}
        label="Reason"
        required
        validateStatus={get(props, "commentsError") && "error"}
        helpText={get(props, "commentsError") && "Reason cannot be empty"}
      />
    </>
  );
};

export default EditQuantityInventory;
