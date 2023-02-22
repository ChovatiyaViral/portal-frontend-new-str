import { Result } from "antd";
import { get } from "lodash";
import React from "react";
import { connect, useDispatch } from "react-redux";
import { setCurrentView } from "../../../store/Auth/auth.actions";

/**
 * Renders Dashboard overview component
 */
const DashboardOverview = (props) => {
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(setCurrentView(""));
  }, []);

  return (
    <div className="dashboard_overview">
      <Result
        status="success"
        title="Welcome,"
        subTitle={
          <>
            <b> {get(props, "loggedInUser.data.name", "").toUpperCase()} </b>
            <br />
            {get(props, "loggedInUser.data.email", "")}
          </>
        }
      />
    </div>
  );
};
export default connect((state) => ({ loggedInUser: get(state, "auth.loggedInUserDetails") }), {})(DashboardOverview);
