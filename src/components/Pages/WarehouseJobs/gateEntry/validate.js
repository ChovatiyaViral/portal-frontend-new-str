import { get, isNumber, isObject, isString, toString } from "lodash";
import validator from "validator";

export const ValidatePayload = (data) => {
  let errorObj = {},
    isErrorAvailable = false;
  const keysToBeVerified = Object.keys(data);
  keysToBeVerified.map((list) => {
    if (isObject(get(data, list, ""))) {
      const keysToBeVerifiedInObj = Object.keys(get(data, list, {}));
      keysToBeVerifiedInObj.map((child) => {
        const checkValue = get(data, list, {});
        if (isString(get(checkValue, child, "")) && validator.isEmpty(get(checkValue, child, ""))) {
          errorObj[list] = {
            ...errorObj[list],
            [child]: true,
          };
        }
      });
    }

    if (isString(get(data, list, "")) && validator.isEmpty(get(data, list, ""))) {
      errorObj[list] = true;
      isErrorAvailable = true;
    }

    return;
  });

  return { errorObj, isErrorAvailable };
};

export const ValidateCurrentValue = (data, errorObj, currentKey) => {
  let temErrorObj = { ...errorObj };

  if (isObject(get(data, currentKey, ""))) {
    const keysToBeVerifiedInObj = Object.keys(get(data, currentKey, {}));
    keysToBeVerifiedInObj.map((child) => {
      const childItemName = data[currentKey][child];
      if (isString(childItemName) && validator.isEmpty(childItemName)) {
        temErrorObj[currentKey] = {
          ...temErrorObj[currentKey],
          [child]: true,
        };
      } else {
        temErrorObj[currentKey] = {
          ...temErrorObj[currentKey],
          [child]: false,
        };
      }
    });
  }

  if (isString(get(data, currentKey, "")) || isNumber(get(data, currentKey, ""))) {
    if (validator.isEmpty(toString(get(data, currentKey, "")))) {
      temErrorObj[currentKey] = true;
    } else {
      temErrorObj[currentKey] = false;
    }
  }

  return temErrorObj;
};
