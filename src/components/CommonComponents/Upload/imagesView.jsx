import React from "react";
import { get } from "lodash";

const UploadImages = (props) => {
    return (
        <>
            {get(props, "dataSource").map((item, index) => {
                return (
                    <div className="img_box" key={index}>
                        {get(props, "showTag") ? <div className="tag_name">Gate Entry</div> : null}
                        <img src={item} alt="upload img" />
                        <div className="img_date">{new Date().toLocaleString()}</div>
                    </div>
                );
            })}
        </>
    );
};

export default UploadImages;
