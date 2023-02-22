import { get, has } from "lodash";
import moment from "moment";
import { capitalizeAllLetter } from "../../../../helpers/utility";

export const getRegaugingManualUiFormRequestPayload = (detail, id) => {
  detail["files"] = get(detail, "all_files", []).map((li) => {
    if (has(li, "file_name")) {
      delete li.file_name;
    }
    if (has(li, "key")) {
      delete li.key;
    }
    return li;
  });

  const data = {
    regauging_id: id,
    regauge_method: "wt_msr",
    regauge_params: {
      dry_dip: get(detail, "dry_dip"),
      wet_dip: get(detail, "wet_dip"),
      incoming_weight: get(detail, "weight"),
      strength: get(detail, "strength"),
      specific_gravity: get(detail, "specific_gravity"),
      bulk_litres: get(detail, "bulk_litres"),
      color: get(detail, "color"),
      color_code: get(detail, "color_code"),
      color_comments: get(detail, "color_comments"),
    },
    all_files: get(detail, "all_files"),
    notes: get(detail, "notes"),
  };
  return data;
};

export const getRegaugingUllageUiFormRequestPayload = (detail, id) => {
  detail["files"] = get(detail, "all_files", []).map((li) => {
    if (has(li, "file_name")) {
      delete li.file_name;
    }
    if (has(li, "key")) {
      delete li.key;
    }
    return li;
  });

  const data = {
    regauging_id: id,
    regauge_method: "ullage",
    regauge_params: {
      dry_dip: get(detail, "dry_dip"),
      wet_dip: get(detail, "wet_dip"),
      strength: get(detail, "strength"),
      temperature: get(detail, "temperature"),
      fill: get(detail, "fill_type"),
      fill_date: get(detail, "fill_date"),
    },
    all_files: get(detail, "all_files"),
    notes: get(detail, "notes"),
  };
  return data;
};

function getDocuments(response, type = "document") {
  const files = get(response, "all_files", []).filter((item) => item.document_type === type);
  return files.map((li) => {
    return {
      document_name: get(li, "document_name"),
      document_url: get(li, "document_url"),
    };
  });
}

export const getRegaugingDataObject = (response) => {

  const dataSource = [
    {
      name: "",
      unique_key: "report_id",
      broken: {
        name: get(response, "[0].report_id") ? get(response, "[0].report_id", "NA") : "Current",
        date: get(response, "[0].completed_at") ? get(response, "[0].completed_at", "NA") : moment().format("DD-MM-YYYY HH:mm:ss"),
      },
      bad: {
        name: get(response, "[1].report_id", "NA"),
        date: get(response, "[1].completed_at", "NA"),
      },
      okay: {
        name: get(response, "[2].report_id", "NA"),
        date: get(response, "[2].completed_at", "NA"),
      },
      best: {
        name: get(response, "[3].report_id", "NA"),
        date: get(response, "[3].completed_at", "NA"),
      },
    },
    {
      name: "Method",
      unique_key: "method",
      broken: capitalizeAllLetter(get(response, "[0].regauge_params.method", "NA").replace(/_/g, " ")),
      bad: capitalizeAllLetter(get(response, "[1].regauge_params.method", "NA").replace(/_/g, " ")),
      okay: capitalizeAllLetter(get(response, "[2].regauge_params.method", "NA").replace(/_/g, " ")),
      best: capitalizeAllLetter(get(response, "[3].regauge_params.method", "NA").replace(/_/g, " ")),
    },
    {
      name: "Dry Dip",
      unique_key: "dry_dip",
      broken: get(response, "[0].regauge_params.dry_dip", "NA"),
      bad: get(response, "[1].regauge_params.dry_dip", "NA"),
      okay: get(response, "[2].regauge_params.dry_dip", "NA"),
      best: get(response, "[3].regauge_params.dry_dip", "NA"),
    },
    {
      name: "Wet Dip",
      unique_key: "wet_dip",
      broken: get(response, "[0].regauge_params.wet_dip", "NA"),
      bad: get(response, "[1].regauge_params.wet_dip", "NA"),
      okay: get(response, "[2].regauge_params.wet_dip", "NA"),
      best: get(response, "[3].regauge_params.wet_dip", "NA"),
    },
    {
      name: get(location, "pathname").includes("/gate-entry") ? "Incoming Weight" : "Weight",
      unique_key: "incoming_weight",
      broken: get(location, "pathname").includes("/gate-entry") ? get(response, "[0].regauge_params.incoming_weight", "NA") : get(response, "[0].regauge_params.weight", "NA"),
      bad: get(response, "[1].regauge_params.incoming_weight", "NA"),
      okay: get(response, "[2].regauge_params.incoming_weight", "NA"),
      best: get(response, "[3].regauge_params.incoming_weight", "NA"),
    },
    {
      name: "Specific Gravity",
      unique_key: "specific_gravity",
      broken: get(response, "[0].regauge_params.specific_gravity", "NA"),
      bad: get(response, "[1].regauge_params.specific_gravity", "NA"),
      okay: get(response, "[2].regauge_params.specific_gravity", "NA"),
      best: get(response, "[3].regauge_params.specific_gravity", "NA"),
    },
    {
      name: "Bulk Litres",
      unique_key: "bulk_litres",
      broken: get(response, "[0].regauge_params.bulk_litres", "NA"),
      bad: get(response, "[1].regauge_params.bulk_litres", "NA"),
      okay: get(response, "[2].regauge_params.bulk_litres", "NA"),
      best: get(response, "[3].regauge_params.bulk_litres", "NA"),
    },
    {
      name: "Color",
      unique_key: "color_code",
      broken: {
        color: get(response, "[0].regauge_params.color_code", "NA"),
        name: get(response, "[0].regauge_params.color", "NA"),
        content: get(response, "[0].regauge_params.content", "NA"),
      },
      bad: {
        color: get(response, "[1].regauge_params.color_code", "NA"),
        name: get(response, "[1].regauge_params.color", "NA"),
        content: get(response, "[1].regauge_params.content", "NA"),
      },
      okay: {
        color: get(response, "[2].regauge_params.color_code", "NA"),
        name: get(response, "[2].regauge_params.color", "NA"),
        content: get(response, "[2].regauge_params.content", "NA"),
      },
      best: {
        color: get(response, "[3].regauge_params.color_code", "NA"),
        name: get(response, "[3].regauge_params.color", "NA"),
        content: get(response, "[3].regauge_params.content", "NA"),
      },
    },
    {
      name: "Fill",
      unique_key: "fill",
      broken: get(response, "[0].regauge_params.fill_type") ? get(response, "[0].regauge_params.fill_type"): get(response, "[0].regauge_params.fill"),
      bad: get(response, "[1].regauge_params.fill", "NA"),
      okay: get(response, "[2].regauge_params.fill", "NA"),
      best: get(response, "[3].regauge_params.fill", "NA"),
    },
    {
      name: "Fill Date",
      unique_key: "fill_date",
      broken: get(response, "[0].regauge_params.fill_date", "NA"),
      bad: get(response, "[1].regauge_params.fill_date", "NA"),
      okay: get(response, "[2].regauge_params.fill_date", "NA"),
      best: get(response, "[3].regauge_params.fill_date", "NA"),
    },
    {
      name: "Temperature",
      unique_key: "temperature",
      broken: get(response, "[0].regauge_params.temperature", "NA"),
      bad: get(response, "[1].regauge_params.temperature", "NA"),
      okay: get(response, "[2].regauge_params.temperature", "NA"),
      best: get(response, "[3].regauge_params.temperature", "NA"),
    },
    {
      name: "Strength",
      unique_key: "strength",
      broken: get(response, "[0].regauge_params.strength", "NA"),
      bad: get(response, "[1].regauge_params.strength", "NA"),
      okay: get(response, "[2].regauge_params.strength", "NA"),
      best: get(response, "[3].regauge_params.strength", "NA"),
    },

    {
      name: "Output RLA",
      unique_key: "output_rla",
      broken: get(response, "[0].regauge_params.output_rla", "NA"),
      bad: get(response, "[1].regauge_params.output_rla", "NA"),
      okay: get(response, "[2].regauge_params.output_rla", "NA"),
      best: get(response, "[3].regauge_params.output_rla", "NA"),
    },
  ];
  return dataSource;
};

export const getRegaugingAdditionalData = (response) => {
  const additionalDetailData = [
    {
      name: "Documents",
      sectionOne: {
        title: "documents",
        display: getDocuments(get(response, "[0]", []), "document"),
      },
      sectionSecond: {
        title: "documents",
        display: getDocuments(get(response, "[1]", []), "document"),
      },
      sectionThird: {
        title: "documents",
        display: getDocuments(get(response, "[2]", []), "document"),
      },
      sectionFourth: {
        title: "documents",
        display: getDocuments(get(response, "[3]", []), "document"),
      },
    },
    {
      name: "Images",
      sectionOne: {
        title: "image",
        display: getDocuments(get(response, "[0]", []), "image"),
      },
      sectionSecond: {
        title: "image",
        display: getDocuments(get(response, "[1]", []), "image"),
      },
      sectionThird: {
        title: "image",
        display: getDocuments(get(response, "[2]", []), "image"),
      },
      sectionFourth: {
        title: "image",
        display: getDocuments(get(response, "[3]", []), "image"),
      },
    },
    {
      name: "Notes",
      sectionOne: {
        title: "notes",
        display: get(response, "[0].notes", "NA") ? get(response, "[0].notes", "NA") : "NA",
      },
      sectionSecond: {
        title: "notes",
        display: get(response, "[1].notes", "NA") ? get(response, "[1].notes", "NA") : "NA",
      },
      sectionThird: {
        title: "notes",
        display: get(response, "[2].notes", "NA") ? get(response, "[2].notes", "NA") : "NA",
      },
      sectionFourth: {
        title: "notes",
        display: get(response, "[3].notes", "NA") ? get(response, "[3].notes", "NA") : "NA",
      },
    },
  ];
  return additionalDetailData;
};

export const getGateEntryRegaugingRequestPayload = (caskDetails, detail, method) => {
  detail["files"] = get(detail, "all_files", []).map((li) => {
    if (has(li, "file_name")) {
      delete li.file_name;
    }
    if (has(li, "key")) {
      delete li.key;
    }
    return li;
  });

  let data = {
    ...caskDetails,
    cask_type_code: get(caskDetails, "cask_type"),
    all_files: get(detail, "all_files", []),
    notes: get(detail, "notes", ""),
  };

  if (method === "wt_msr") {
    data = {
      ...data,
      regauge_method: "wt_msr",
      regauge_params: {
        dry_dip: get(detail, "dry_dip"),
        wet_dip: get(detail, "wet_dip"),
        incoming_weight: get(detail, "incoming_weight"),
        strength: get(detail, "strength"),
        specific_gravity: get(detail, "specific_gravity"),
        bulk_litres: get(detail, "bulk_litres"),
        color: get(detail, "color"),
        color_code: get(detail, "color_code"),
        color_comments: get(detail, "color_comments"),
      },
    };
  } else {
    data = {
      ...data,
      regauge_method: "ullage",
      regauge_params: {
        dry_dip: get(detail, "dry_dip"),
        wet_dip: get(detail, "wet_dip"),
        strength: get(detail, "strength"),
        temperature: get(detail, "temperature"),
        fill: get(detail, "fill_type"),
        fill_date: get(detail, "fill_date"),
      },
    };
  }

  return data;
};
