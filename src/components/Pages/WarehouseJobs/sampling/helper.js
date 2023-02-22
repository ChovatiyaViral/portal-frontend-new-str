import { get } from "lodash";
import moment from "moment";

function getKeyByValue(object, value) {
  return Object.keys(object).find((key) => object[key] === value);
}

function getRatingKey(key) {
  let returnVal = key;
  switch (key) {
    case "A":
      returnVal = "A(Best)";
      break;
    case "B":
      returnVal = "B(Good)";
      break;
    case "C":
      returnVal = "C(Okay)";
      break;
    case "D":
      returnVal = "D(Bad)";
      break;
    case "E":
      returnVal = "E(Worst)";
      break;
    default:
      break;
  }
  return returnVal;
}

function getDocuments(response, type = "document") {
  const files = get(response, "all_files", []).filter((item) => item.document_type === type);
  return files.map((li) => {
    return {
      document_name: get(li, "document_name"),
      document_url: get(li, "document_url"),
    };
  });
}

export const getDataObject = (response) => {
  const dataSource = [
    {
      name: "",
      unique_key: "job_id",
      broken: {
        name: get(response, "[0].job_id", "NA") ? get(response, "[0].job_id", "NA") : "Current",
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
      name: "Color Chart",
      unique_key: "color_code",
      broken: {
        color: get(response, "[0].color_code", "NA"),
        name: get(response, "[0].color", "NA"),
        content: get(response, "[0].content", "NA"),
      },
      bad: {
        color: get(response, "[1].color_code", "NA"),
        name: get(response, "[1].color", "NA"),
        content: get(response, "[1].content", "NA"),
      },
      okay: {
        color: get(response, "[2].color_code", "NA"),
        name: get(response, "[2].color", "NA"),
        content: get(response, "[2].content", "NA"),
      },
      best: {
        color: get(response, "[3].color_code", "NA"),
        name: get(response, "[3].color", "NA"),
        content: get(response, "[3].content", "NA"),
      },
    },
    {
      name: "Character",
      unique_key: "character",
      broken: get(response, "[0].created_at") ? get(response, "[0].character", "NA") : get(response, "[0].characters", "NA"),
      bad: get(response, "[1].character", "NA"),
      okay: get(response, "[2].character", "NA"),
      best: get(response, "[3].character", "NA"),
    },
    // {
    //   name: "Dominant Character Markers",
    //   unique_key: "dominant_character_markers",
    //   subTitles: ["Dominant", "Mild", "Weak"],
    //   broken: get(response, "[0].created_at")
    //     ? [get(response, "[0].dominant_character_markers.Dominant", "NA"), get(response, "[0].dominant_character_markers.Mild", "NA"), get(response, "[0].dominant_character_markers.Weak", "NA")]
    //     : [
    //         getKeyByValue(get(response, "[0].dominant_character_markers", {}), "dominant"),
    //         getKeyByValue(get(response, "[0].dominant_character_markers", {}), "mild"),
    //         getKeyByValue(get(response, "[0].dominant_character_markers", {}), "weak"),
    //       ],
    //   bad: [get(response, "[1].dominant_character_markers.Dominant", "NA"), get(response, "[1].dominant_character_markers.Mild", "NA"), get(response, "[1].dominant_character_markers.Weak", "NA")],
    //   okay: [get(response, "[2].dominant_character_markers.Dominant", "NA"), get(response, "[2].dominant_character_markers.Mild", "NA"), get(response, "[2].dominant_character_markers.Weak", "NA")],
    //   best: [get(response, "[3].dominant_character_markers.Dominant", "NA"), get(response, "[3].dominant_character_markers.Mild", "NA"), get(response, "[3].dominant_character_markers.Weak", "NA")],
    // },
    {
      name: "Finish",
      unique_key: "finish",
      broken: get(response, "[0].created_at") ? get(response, "[0].finish", "NA") : `${get(response, "[0].finish", "NA")}/5`,
      bad: get(response, "[1].finish", "NA"),
      okay: get(response, "[2].finish", "NA"),
      best: get(response, "[3].finish", "NA"),
    },
    {
      name: "Overall Rating",
      unique_key: "overall_rating",
      broken: getRatingKey(get(response, "[0].overall_rating", "NA")),
      bad: get(response, "[1].overall_rating", "NA"),
      okay: get(response, "[2].overall_rating", "NA"),
      best: get(response, "[3].overall_rating", "NA"),
    },
    {
      name: "Feinty,vegetative or off notes?",
      unique_key: "fienty_vegetative",
      broken: get(response, "[0].fienty_vegetative", "NA"),
      bad: get(response, "[1].fienty_vegetative", "NA"),
      okay: get(response, "[2].fienty_vegetative", "NA"),
      best: get(response, "[3].fienty_vegetative", "NA"),
    },
    {
      name: "Is the whisky profile younger than its age?",
      unique_key: "whisky_profile_younger",
      broken: get(response, "[0].whisky_profile_younger", "NA"),
      bad: get(response, "[1].whisky_profile_younger", "NA"),
      okay: get(response, "[2].whisky_profile_younger", "NA"),
      best: get(response, "[3].whisky_profile_younger", "NA"),
    },
    {
      name: "Is sample comparable to benchmark/best example?",
      unique_key: "comparable_to_benchmark",
      broken: get(response, "[0].comparable_to_benchmark", "NA"),
      bad: get(response, "[1].comparable_to_benchmark", "NA"),
      okay: get(response, "[2].comparable_to_benchmark", "NA"),
      best: get(response, "[3].comparable_to_benchmark", "NA"),
    },
    {
      name: "Recommended Action",
      unique_key: "action",
      broken: get(response, "[0].recommended_action", "NA"),
      bad: get(response, "[1].recommended_action", "NA"),
      okay: get(response, "[2].recommended_action", "NA"),
      best: get(response, "[3].recommended_action", "NA"),
    },
  ];
  return dataSource;
};

export const getAdditionalData = (response) => {
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
