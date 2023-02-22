import { CheckOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Button, Steps } from "antd";
import { get } from "lodash";
import React from "react";
import "./index.scss";

const { Step } = Steps;

const CustomStepsProgress = (props) => {
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (props.setToInitial) {
      setCurrent(0);
    }
  }, [props]);

  const next = () => {
    props.handleNext();
  };

  const prev = () => {
    props.handlePrev();
  };

  const handleSubmit = () => {
    props.onSubmit();
  };

  const onChange = (current) => {
    if (!get(props, "nextDisableStatus", false)) {
      if (get(props, "current") > current) {
        props.handlePrev();
      } else {
        props.handleNext();
      }
    }
  };

  const StepsTabs = get(props, "data", []);

  return (
    <>
      <div className="step_outer_div">
        <Steps current={props.current} onChange={onChange} className="task_steps mb-4" size="small" responsive={false} labelPlacement="horizontal" items={StepsTabs} />
      </div>
      <div className="steps-content">{get(StepsTabs, `${[props.current]}.content`, "")}</div>
      <div className="task_footer_cta">
        {props.current > 0 && (
          <Button style={{ margin: "0 8px" }} type="secondary" size="middle" onClick={() => prev()} icon={<LeftOutlined />}>
            Previous
          </Button>
        )}
        {props.current < StepsTabs.length - 1 && (
          <Button type="primary" onClick={() => next()} size="middle" disabled={get(props, "nextDisableStatus", false)}>
            Next <RightOutlined />
          </Button>
        )}
        {props.current === StepsTabs.length - 1 && (
          <Button type="primary" size="middle" onClick={() => handleSubmit()} icon={<CheckOutlined />}>
            Submit
          </Button>
        )}
      </div>
    </>
  );
};

export default CustomStepsProgress;
