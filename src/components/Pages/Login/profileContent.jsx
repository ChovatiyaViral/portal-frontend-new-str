import { CheckSquareOutlined } from "@ant-design/icons";
import { useMsal } from "@azure/msal-react";
import { Button } from "antd";
import React, { useState } from "react";
import "../../../assets/styles/app.scss";
import { warning } from "../../UIComponents/Message";

/**
 * Renders information about the signed-in user or a button to retrieve data about the user
 */
const ProfileContent = () => {
    const { instance, accounts } = useMsal();
    const [graphData, setGraphData] = useState(null);

    return (
        <>
            <h5 className="card-title">Welcome, <b> {accounts[0].name} </b></h5>
            <Button
                type="primary"
                className="mt-1"
                icon={<CheckSquareOutlined />}
                onClick={() => warning("IN PROGRESS")}
            >
                Request Access
            </Button>
        </>
    );
};

export default ProfileContent;