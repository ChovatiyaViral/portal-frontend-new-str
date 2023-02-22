export const defaultCaskValues = {
  cask_contents: {
    brand: "",
    distillery: "",
    spirit_type: "",
    ola: "",
    rla: "",
    strength: "",
  },
  cask_details: {
    ays: "",
    cask_number: "",
    passport_number: "",
  },
  cask_type: {
    created_by: "",
    cask_selected_code: "",
  },
  warehouse_details: {
    warehouse_keeper_name: "",
    warehouse_name: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    postal_code: "",
    warehouse_keeper_email: "",
    warehouse_keeper_phone_no: "",
  },
  additional_details: {
    files: [],
    notes: "",
  },
};

export const addCaskRequestPayload = {
  brand: "",
  spirit_type: "",
  distillery: "",
  ola: "",
  rla: "",
  strength: "",
  ays: "",
  cask_number: "",
  // passport_number: "",
  cask_type: "",
  offsite_warehouse: "",
  // dt_location: "",
  additional_details: {
    files: [],
    notes: "",
  },
};
