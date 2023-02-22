import { Tabs } from "antd";
import { get } from "lodash";
import React from "react";

const { TabPane } = Tabs;

const TabsNew = (props) => {
  const callback = (key) => {
    // eslint-disable-next-line no-console
    console.log(key);
  };

  const name = get(props, "name", "");
  const defaultIndex = get(props, "defaultIndex", "1");
  return (
    <Tabs defaultActiveKey="1" onChange={callback}>
      <TabPane tab={name} key={defaultIndex}>
        {this.props.children}
      </TabPane>
    </Tabs>
  );
};

export default TabsNew;
