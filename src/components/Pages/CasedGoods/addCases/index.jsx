import { cloneDeep, find, get } from "lodash";
import React from "react";
import { connect, useDispatch } from "react-redux";
import { AddCasesTabs } from "../../../../constants";
import SVGIcon from "../../../../constants/svgIndex";
import { defaultRequestKey, defaultRequestOptions } from "../../../../settings";
import { setCurrentView } from "../../../../store/Auth/auth.actions";
import { addInventory, getCasedGoods, getPricingParameters } from "../../../../store/CasedGoods/casedGoods.actions";
import ErrorBoundary from "../../../UIComponents/ErrorBoundary";
import StepsProgress from "../../../UIComponents/Steps/customSteps";
import { openNotificationWithIcon } from "../../../UIComponents/Toast/notification";
import "../index.scss";
import SuccessPage from "../successPage";
import { defaultValue } from "../utility/constants";
import { checkBottlingDate, getAge, getBottles, getLoA } from "../utility/helper";
import AddedCasedGoodPreview from "./addedCasedGoodPreview";
import BasicDetailsCasedGood from "./basicDetails";
import CaseDetailsCasedGood from "./caseDetails";
import PriceDetailsCasedGood from "./priceDetails";

const AddCasedGood = (props) => {
  const dispatch = useDispatch();

  const defaultFieldsToBeValidated = { ...defaultValue.basic, ...defaultValue.case };
  const [newCase, updateCase] = React.useState({ ...defaultFieldsToBeValidated, ...defaultValue.price, ...defaultValue.others });
  const [currentStep, setCurrentStep] = React.useState(0);
  const [error, updateError] = React.useState({});
  const [partCaseOptionsList, setPartCaseOptionsList] = React.useState([]);
  const [disableNext, setDisableNext] = React.useState(true);
  const [submitSuccess, setSubmitSuccess] = React.useState(false);

  React.useEffect(() => {
    dispatch(setCurrentView(" Add New Cases to the Inventory"));
  }, []);

  React.useEffect(() => {
    if (currentStep === 0) {
      setDisableNext(true);
      const basicTabsFields = Object.keys(cloneDeep(get(defaultValue, "basic", {})));
      const basicTabValidation = find(basicTabsFields, function (o) {
        return !newCase[o];
      });

      if (!basicTabValidation) {
        setDisableNext(false);
      }

      if (get(error, "ays")) {
        setDisableNext(true);
      }
    }

    if (currentStep === 1) {
      setDisableNext(true);
      const caseTabsFields = Object.keys(cloneDeep(get(defaultValue, "case", {})));

      const caseTabValidation = find(caseTabsFields, function (o) {
        if (o === "whole_case" && newCase[o] === 0) {
          return false;
        }
        if (o === "bottles_in_partial_case") {
          return false;
        }
        if (!newCase["whole_case"] && !newCase["bottles_in_partial_case"]) {
          return true;
        }
        return !newCase[o];
      });

      if (!caseTabValidation) {
        setDisableNext(false);
      }
    }

    // if (currentStep === 2) {
    //   setDisableNext(true);

    //   const priceTabsFields = Object.keys(cloneDeep(get(defaultValue, "price", {})));
    //   const priceTabValidation = find(priceTabsFields, function (o) {
    //     return !newCase[o];
    //   });

    //   if (!priceTabValidation) {
    //     setDisableNext(false);
    //   }
    // }

    const previewTabValidation = find(Object.keys(defaultFieldsToBeValidated), function (o) {
      return !newCase[o];
    });

    if (!previewTabValidation) {
      setDisableNext(false);
    }
  }, [newCase, currentStep, error]);

  const handlePartCaseOptions = (BPC) => {
    if (BPC) {
      let partCaseOptions = [];
      for (let i = 1; i < BPC; i++) {
        partCaseOptions.push({
          label: `${i} / ${BPC}`,
          value: `${i}/${BPC}`,
        });
      }
      if (partCaseOptions.length === 0) {
        partCaseOptions = [{ label: 0, value: 0 }];
        setPartCaseOptionsList([...partCaseOptions]);
      } else {
        setPartCaseOptionsList([...partCaseOptions]);
      }
    }
  };

  const handleChange = React.useCallback(
    (key, value) => {
      const newProds = { ...newCase };
      newProds[key] = value;
      if (newProds["ays"] && newProds["bottling_date"] && key !== "age") {
        const yearData = { ays: newProds["ays"], bottling_date: newProds["bottling_date"] };
        newProds["age"] = getAge(yearData);
        updateError({ ...error, ays: checkBottlingDate(yearData) });
      }

      if (!newProds["ays"] || !newProds["bottling_date"]) {
        // newProds["age"] = "";
        updateError({ ...error, ays: false });
      }

      if (key === "bpc") {
        newProds["evaluated_bottles_in_partial_case"] = "";
        newProds["bottles_in_partial_case"] = "";
        newProds["bpc"] = value || value === 0 ? Math.trunc(Number(value)) : "";
        handlePartCaseOptions(Number(Math.trunc(value)));
      }

      if (key === "whole_case") {
        newProds["whole_case"] = value || value === 0 ? Math.trunc(Number(value)) : "";
      }

      if (key === "bottles_in_partial_case") {
        const partCaseValue = value.split("/");
        newProds["evaluated_bottles_in_partial_case"] = partCaseValue[0] ? Number(partCaseValue[0]) : 0;
      }

      if (!newProds["whole_case"] || !newProds["evaluated_bottles_in_partial_case"]) {
        newProds["bottles"] = getBottles(newProds["bpc"], Number(get(newProds, "whole_case", 0))) + Number(get(newProds, "evaluated_bottles_in_partial_case", 0));
      }

      if (newProds["bpc"] && (newProds["whole_case"] || newProds["evaluated_bottles_in_partial_case"])) {
        const BIPC = get(newProds, "evaluated_bottles_in_partial_case", 0);
        newProds["bottles"] = getBottles(newProds["bpc"], Number(get(newProds, "whole_case", 0))) + Number(BIPC);
      }

      if (!newProds["abv"] || !newProds["bpc"] || !newProds["volume"]) {
        newProds["loA"] = "";
      }

      if (newProds["abv"] && newProds["bpc"] && newProds["volume"]) {
        newProds["loA"] = getLoA(newProds["abv"], newProds["bpc"], newProds["volume"]);
      }

      updateCase(newProds);
    },
    [newCase]
  );

  const handleSave = async () => {
    let newCaseValues = { ...newCase };
    newCaseValues["bottles_in_partial_case"] = newCaseValues["evaluated_bottles_in_partial_case"] ? newCaseValues["evaluated_bottles_in_partial_case"] : 0;
    delete newCaseValues["evaluated_bottles_in_partial_case"];
    let requestOptions = { ...newCaseValues, ...defaultRequestKey };

    const addInventoryData = await props.addInventory(requestOptions);

    if (get(addInventoryData, "error", false)) {
      openNotificationWithIcon("error", "Failed to add inventory", `${get(addInventoryData, "error.message", "Something Went Wrong")} `);
    }

    if (get(addInventoryData, "response.status", false)) {
      setSubmitSuccess(true);
      const searchable_columns = [{ field_name: "deleted", field_value: "no" }];
      const casedGoodInventory = await props.getCasedGoods({ ...defaultRequestOptions, searchable_columns });

      if (get(casedGoodInventory, "error", false)) {
        openNotificationWithIcon("error", "Inventory", `${get(casedGoodInventory, "error.message", "Something Went Wrong")} `);
      }

      openNotificationWithIcon("success", "Add Inventory", get(addInventoryData, "response.message", "Added Successfully"));
    } else {
      openNotificationWithIcon("warning", "Add Inventory", get(addInventoryData, "response.message", "Something went wrong"));
    }
  };

  const clearData = () => {
    const newRecords = { ...defaultValue.basic, ...defaultValue.case, ...defaultValue.transaction_details, ...defaultValue.others };
    updateCase(newRecords);
    setCurrentStep(0);
  };

  const topFunction = () => {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  };

  const handleNext = (current) => {
    topFunction();
    setCurrentStep(currentStep + 1);
  };

  const handlePrev = (current) => {
    topFunction();
    setCurrentStep(currentStep - 1);
  };

  const fetchPricingParameters = async (requestOptions) => {
    const pricingParametersResponse = await props.getPricingParameters(requestOptions);
    updateCase({ ...newCase, ...get(pricingParametersResponse, "response.data") });
  };

  const handleExportPrice = React.useCallback(
    (key, value) => {
      if (key && value) {
        const newProds = { ...newCase };
        newProds[key] = value;
        updateCase(newProds);
        const { abv, volume, bpc } = newProds;

        if (key === "export_price") {
          const options = { export_price: value, abv, volume, bpc };
          const requestOptions = { ...options, ...defaultRequestKey };
          fetchPricingParameters(requestOptions);
        }
      }
    },
    [newCase]
  );

  let stepsToBePerformed = [
    {
      title: AddCasesTabs.Basics,
      content: <BasicDetailsCasedGood handleChange={handleChange} newCase={newCase} error={error} />,
      icon: <img src={SVGIcon.CaskContentsIcon} />,
    },
    {
      title: AddCasesTabs.Case,
      content: <CaseDetailsCasedGood handleChange={handleChange} newCase={newCase} error={error} partCaseOptionsList={partCaseOptionsList} />,
      icon: <img src={SVGIcon.CaskDetailsIcon} />,
    },
    {
      title: AddCasesTabs.Price,
      content: <PriceDetailsCasedGood handleChange={handleChange} handleExportPrice={handleExportPrice} newCase={newCase} error={error} />,
      icon: <img src={SVGIcon.SebringDetailsIcon} />,
    },
    {
      title: AddCasesTabs.Preview,
      content: <AddedCasedGoodPreview newCase={newCase} />,
      icon: <img src={SVGIcon.AdditionalDetailsIcon} />,
    },
  ];

  return (
    <>
      <div className="inventory__add_cases">
        <ErrorBoundary>
          {submitSuccess ? (
            <SuccessPage
              setSubmitSuccess={(val) => {
                setSubmitSuccess(false);
                clearData();
              }}
            />
          ) : (
            <StepsProgress nextDisableStatus={disableNext} data={stepsToBePerformed} onSubmit={() => handleSave()} handleNext={handleNext} handlePrev={handlePrev} current={currentStep} />
          )}
        </ErrorBoundary>
      </div>
    </>
  );
};

export default connect((state) => ({}), {
  getPricingParameters,
  addInventory,
  getCasedGoods,
})(AddCasedGood);
