import React from "react";
import { TableColumnsList } from "../../../../../constants";
import SVGIcon from "../../../../../constants/svgIndex";
import CustomTable from "../../../../UIComponents/Table/responsiveTable";

import "./index.scss";

const expectedData = [
  {
    job_id: 285342,
    from: 285342,
    to: 285342,
    brand_name: "Scottish Glory",
    spirit: "Blended Scotch Whisky",
    role: "Reciever",
    re_racked_on: "2022-01-13 19:00:00",
    qunantity: "1000lr",
  },
  {
    job_id: 285342,
    from: 285342,
    to: 285342,
    brand_name: "Scottish Glory",
    spirit: "Blended Scotch Whisky",
    role: "Donor",
    re_racked_on: "2022-01-13 19:00:00",
    qunantity: "1000lr",
  },
  {
    job_id: 285342,
    from: 285342,
    to: 285342,
    brand_name: "Scottish Glory",
    spirit: "Blended Scotch Whisky",
    role: "Donor",
    re_racked_on: "2022-01-13 19:00:00",
    qunantity: "1000lr",
  },
  {
    job_id: 285342,
    from: 285342,
    to: 285342,
    brand_name: "Scottish Glory",
    spirit: "Blended Scotch Whisky",
    role: "Donor",
    re_racked_on: "2022-01-13 19:00:00",
    qunantity: "1000lr",
  },
  {
    job_id: 285342,
    from: 285342,
    to: 285342,
    brand_name: "Scottish Glory",
    spirit: "Blended Scotch Whisky",
    role: "Donor",
    re_racked_on: "2022-01-13 19:00:00",
    qunantity: "1000lr",
  },
  {
    job_id: 285342,
    from: 285342,
    to: 285342,
    brand_name: "Scottish Glory",
    spirit: "Blended Scotch Whisky",
    role: "Donor",
    re_racked_on: "2022-01-13 19:00:00",
    qunantity: "1000lr",
  },
];

const expectedMetaData = {
  column_info: [
    {
      data_type: "int",
      display_name: "Job ID",
      filter_key: "job_id",
      is_clickable: false,
      is_highlighted: false,
      key_name: "job_id",
      width: 10,
    },
    {
      data_type: "int",
      display_name: "From",
      filter_key: "from",
      is_clickable: false,
      is_highlighted: false,
      key_name: "from",
      width: 10,
    },
    {
      data_type: "int",
      display_name: "TO",
      filter_key: "to",
      is_clickable: false,
      is_highlighted: false,
      key_name: "to",
      width: 10,
    },
    {
      data_type: "varchar",
      display_name: "Brand Name",
      filter_key: "brand_name",
      is_clickable: false,
      is_highlighted: false,
      key_name: "brand_name",
      width: 18,
    },
    {
      data_type: "varchar",
      display_name: "Spirit",
      filter_key: "spirit",
      is_clickable: false,
      is_highlighted: false,
      key_name: "spirit",
      width: 25,
    },
    {
      data_type: "varchar",
      display_name: "Role",
      filter_key: "role",
      is_clickable: false,
      is_highlighted: false,
      key_name: "role",
      width: 10,
    },
    {
      data_type: "varchar",
      display_name: "Re-racked on",
      filter_key: "re_racked_on",
      is_clickable: false,
      is_highlighted: false,
      key_name: "re_racked_on",
      width: 25,
    },
    {
      data_type: "varchar",
      display_name: "Qunantity",
      filter_key: "qunantity",
      is_clickable: false,
      is_highlighted: false,
      key_name: "qunantity",
      width: 12,
    },
    {
      data_type: "action",
      filter_key: "action",
      is_clickable: false,
      is_highlighted: false,
      key_name: "action",
      width: 10,
    },
  ],
};

const SpiritTransfer = () => {
  const handleEditAction = (record, type) => {
    // eslint-disable-next-line no-console
    console.log(record, type);
  };

  return (
    <>
      <div className="common_card_section history_table">
        <p className="d-flex mb-2">
          <img src={SVGIcon.TimeNoteIcon} /> <h1 className="m-0 ml-2" style={{ fontWeight: 700, fontSize: 20 }}>Re-racking </h1>
        </p>
        <CustomTable
          data={expectedData}
          pagination={false}
          meta={expectedMetaData}
          isGlobalFilterEnabled={false}
          clonedData={expectedData}
          columnType={TableColumnsList.SpiritTransfer}
          isExportAvailable={false}
          isLoading={false}
          handleEdit={(record, type) => handleEditAction(record, type)}
        />
      </div>
      <div className="common_card_section history_table">
        <p className="d-flex mb-2">
          <img src={SVGIcon.TimeNoteIcon} /> <h1 className="m-0 ml-2" style={{ fontWeight: 700, fontSize: 20 }}>Vatting</h1>
        </p>
        <CustomTable
          data={expectedData}
          pagination={false}
          meta={expectedMetaData}
          isGlobalFilterEnabled={false}
          clonedData={expectedData}
          columnType={TableColumnsList.SpiritTransfer}
          isExportAvailable={false}
          isLoading={false}
          handleEdit={(record, type) => handleEditAction(record, type)}
        />
      </div>
    </>
  );
};

export default SpiritTransfer;
