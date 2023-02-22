import { getCookie } from "./cookieHelper";

export const StatusCodes = {
  UNAUTHORIZED: 401,
  NOTFOUND: 404,
};

export const ErrorMessage = {
  Get: "Error in Get",
  Post: "Error in Post",
  Delete: "Error in Delete",
  Insert: "Error in Insert",
};

export const APPLICATION_CONTENT_TYPE = "application/json; charset=utf-8";

export const HeaderProperties = {
  language: "Accept-Language",
  contentType: "Content-Type",
};

export const getRequestHeader = () => {
  return {
    Authorization: "Bearer " + getCookie("access_token"),
  };
};

export const requestPath = {
  auth: {
    login: "login",
    verify: "auth/verify-token",
  },
  taxonomy: {
    masterList: "masterdata_list",
    masterData: "masterdata",
    updateMasterData: "masterdata/updateStatus",
  },
  masterListing: {
    cask: {
      addCask: "v1/cask/add",
      summary: "v1/cask/summary",
      getList: "v1/cask",
      masterList: "v1/cask/master",
      addComment: "v1/cask/add_comment",
      addFiles: "v1/cask/add_files",
      getDetails: "v1/cask/details",
      eventLogs: "v1/cask/event_log",
    },
    passport: {
      verify: "v1/passport/verify",
      generate: "v1/passport/generate_passport_num",
      masterList: "v1/passport/master",
      add: "v1/passport/add",
      getDetails: "v1/passport/details",
    },
  },
  wareHouse: {
    add: "v1/warehouse/add",
    getList: "v1/warehouse",
    getDTLocation: "v1/dt_location",
  },
  wareHouseJobsManagement: {
    gateEntry: {
      getList: "v1/crr",
      addToCRR: "v1/crr/addCrr",
      getDetails: "v1/crr/details",
      getApproved: "v1/crr/approve",
      validateCask: "v1/crr/is_cask_valid_for_crr",
    },
    sampling: {
      getPendingList: "v1/cask_sample/pending",
      getCompletedList: "v1/cask_sample/completed",
      getCancelledList: "v1/cask_sample/cancelled",
      getHistory: "v1/cask_sample/sampling_history",
      createJob: "v1/cask_sample/create_job",
      completeJob: "v1/cask_sample/complete_job",
      getDetails: "v1/cask_sample/details",
      cancelJob: "v1/cask_sample/cancel_job",
      rescheduleJob: "v1/cask_sample/reschedule_job",
      getPreviousSamplingsList: "v1/cask_sample/previous_samplings",
      createJobForCRR: "v1/cask_sample/create_job_for_crr",
    },
    regauging: {
      getList: "v1/cask_regauge/list",
      getPendingList: "v1/cask_regauge/pending",
      getCompletedList: "v1/cask_regauge/completed",
      getCancelledList: "v1/cask_regauge/cancelled",
      getHistory: "v1/cask_regauge/regauging_history",
      createJob: "v1/cask_regauge/create_job",
      wtMsrCalculation: "v1/cask_regauge/wt_msr_calc_data",
      ullageCalculation: "v1/cask_regauge/ullage_calc_data",
      completeJob: "v1/cask_regauge/complete_job",
      getDetails: "v1/cask_regauge/details",
      cancelJob: "v1/cask_regauge/cancel_job",
      rescheduleJob: "v1/cask_regauge/reschedule_job",
      getPreviousRegaugingList: "v1/cask_regauge/previous_regaugings",
      createJobForCRR: "v1/cask_regauge/create_job_for_crr",
    },
    common: {
      getDTLocationList: "v1/dt_location",
      getColorList: "v1/color",
    },
  },
  common: {
    uploadFileToS3: "v1/upload_file",
  },
};
