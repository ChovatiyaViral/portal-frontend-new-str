export const GateEntryIncomingOptions = [
  {
    displayName: "Delayed",
    value: "delayed",
  },
  {
    displayName: "Arriving today",
    value: "arriving_today",
  },
  {
    displayName: "Arriving this week",
    value: "arriving_this_week",
  },
];

export const gateEntrySummaryDefaultValues = {
  passport_details: {
    passport_number: "",
    passport_type: "",
    spirit_weight: "",
    fills: "",
  },
  incoming_cask_details: {
    delivered_by_name: "",
    whisky_type: "",
    color: "",
    dry_dip: "",
    wet_dip: "",
    strength: "",
    bulk_litres: "",
    incoming_weight: "",
    specific_gravity: "",
    temperature: "",
    consignor_doc_rla: "",
  },
  assessment: {
    estimated_tare_weight: "",
    nett_weight: "",
    estimated_tares_rla: "",
    difference: "",
  },
  sebring_details: {
    sebring_original_rla: "",
    sebring_original_strength: "",
    sebring_basis_date: "",
    sebring_estimated_rla: "",
    diff_of_sebring_estimated: "",
    discrepancy_as_age_percent: "",
    time_difference: "",
    percent_loss: "",
    loss_loa: "",
  },
  files: [],
  notes: "",
};

export const approveCaskDefaultValue = {
  crr_id: "",
  approve: "",
  dt_location: "",
  dt_location_specifics: "",
  approval_documents: [],
  approval_notes: "",
};

export const samplingCaskDetailsDataDefaultValue = {
  cask_number: "",
  passport_number: "",
  ays: "",
  cask_type: "",
  distillery: "",
  scheduled_at: "",
  sampling_id: "",
};

export const samplingDataDefaultValue = {
  cask_number: "",
  distillery: "",
  passport_number: "",
  cask_type: "",
  ays: "",
  cask_sample_id: "",
  color: "",
  color_code: "",
  color_comments: "",
  recommended_action: "",
  characters: {
    peaty_or_smokey: 0,
    pear_or_apple: 0,
    grassy_or_citrus: 0,
    floral_or_herbal: 0,
    tofee_or_vanilla: 0,
    nutty_or_oilly: 0,
    dried_fruit_or_sherry: 0,
    woody_or_spicy: 0,
    body: 0,
    comments: "",
  },
  dominant_character_markers: {
    floral: "",
    fruit: "",
    rich: "",
  },
  dominant_character_markers_comments: "",
  finish: "",
  finish_comments: "",
  fill_type: "",
  overall_rating: "",
  overall_rating_comments: "",
  fienty_vegetative: "",
  fienty_vegetative_comments: "",
  whisky_profile_younger: "",
  whisky_profile_younger_comments: "",
  comparable_to_benchmark: "",
  comparable_to_benchmark_comments: "",
  recommended_action: "",
  bottling_date: "",
  customer_id: "",
  additional_details: {
    files: [],
    notes: "",
  },
};

export const validationCheckCommonArray = [
  "sampling_id",
  "cask_number",
  "cask_type",
  "passport_number",
  "distillery",
  "color",
  "color_code",
  "finish",
  "fienty_vegetative",
  "whisky_profile_younger",
  "comparable_to_benchmark",
  "overall_rating",
];

export const dominantCharacterMarkerCheck = ["dominant", "mild", "weak"];

export const characterCheck = ["peaty_or_smokey", "pear_or_apple", "grassy_or_citrus", "floral_or_herbal", "tofee_or_vanilla", "nutty_or_oilly", "dried_fruit_or_sherry", "woody_or_spicy", "body"];

export const regaugingCaskDetailsDefault = {
  cask_number: "",
  scheduled_at: "",
  passport_number: "",
  ays: "",
  delivered_by: "",
  brand: "",
  distillery: "",
  cask_type: "",
  whisky_type: "",
  last_known_ola: "",
  last_known_rla: "",
  last_known_strength: "",
  warehouse_keeper_name: "",
  warehouse_name: "",
};

export const regaugingDataSetDefault = {
  manual: {
    color: "",
    color_code: "",
    color_comments: "",
    dry_dip: "",
    wet_dip: "",
    strength: "",
    bulk_litres: "",
    incoming_weight: "",
    estimated_tare_weight: "",
    nett_weight: "",
    specific_gravity: "",
    estimated_tares_rla: "",
  },
  ullage: {
    fill_date: "",
    dry_dip: "",
    wet_dip: "",
    duration_in_wood: "",
    fill_type: "",
    original_bulk_litres: "",
    temperature: "",
    strength: "",
    tcf: "",
    a_line: "",
    b_line: "",
    new_bulk_litres: "",
    bulk_loss_percent: "",
    new_loa: "",
    rla_loss_percent: "",
    total_rla_loss: "",
    total_rla_loss_py: "",
    total_rla_loss_per_year_percent: "",
    target_rla_loss_py_2_percentage: "",
    loss_performance: "",
  },
};

export const gateEntryCaskDefaultValues = {
  cask_number: "",
  scheduled_at: "",
  passport_number: "",
  ays: "",
  delivered_by_name: "",
  brand: "",
  distillery: "",
  cask_type: "",
  whisky_type: "",
  last_known_ola: "",
  last_known_rla: "",
  last_known_strength: "",
  warehouse_keeper_name: "",
  warehouse_name: "",
  dt_location: "",
  regauge_method: "",
};

export const validationCheckGateEntryCaskCommonArray = [
  "cask_number",
  "cask_type",
  "passport_number",
  "distillery",
  "warehouse_keeper_name",
  "delivered_by_name",
  "ays",
  "whisky_type",
  "last_known_ola",
  "last_known_rla",
  "last_known_strength",
  "dt_location",
  "regauge_method",
];

export const validationCheckGateEntryRegaugeCommonArray = {
  wt_msr: ["dry_dip", "wet_dip", "incoming_weight", "strength", "specific_gravity", "bulk_litres", "color"],
  ullage: ["dry_dip", "wet_dip", "strength", "temperature", "fill_type", "fill_date"],
};

export const validationCheckRegaugeCommonArray = {
  wt_msr: ["dry_dip", "wet_dip", "weight", "strength", "specific_gravity", "bulk_litres", "color"],
  ullage: ["dry_dip", "wet_dip", "strength", "temperature", "fill_type", "fill_date"],
};