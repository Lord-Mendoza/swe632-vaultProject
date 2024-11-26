import _ from "lodash";
import {isNotEmptyString} from "./StringVariableValidators";

export const isNotAnEmptyObject = (val) => {
    return val !== undefined && val !== null
        && typeof val === "object" && Object.keys(val).length > 0;
}

export const isAnEmptyObject = (val) => {
    return !isNotAnEmptyObject(val);
}

export const isSameObject = (objOne, objTwo) => {
    if (objOne === undefined && objTwo === undefined) {
        return true;
    } else if (isNotAnEmptyObject(objOne) && isNotAnEmptyObject(objTwo)) {
        return _.isEqual(objOne, objTwo);
    } else if (isAnEmptyObject(objOne) && isAnEmptyObject(objTwo))
        return false;
    else if (isAnEmptyObject(objOne) && isNotAnEmptyObject(objTwo))
        return false;
    else if (isNotAnEmptyObject(objOne) && isAnEmptyObject(objTwo))
        return false;
    else
        return null;
}

export const isNotSameObject = (objOne, objTwo) => {
    let isSameObjectResults = isSameObject(objOne, objTwo);
    if (typeof isSameObjectResults === "boolean")
        return !isSameObjectResults;
    else
        return null;
}

export const isNotNullNorUndefined = (val) => {
    return val !== null && val !== undefined;
}

export const isNullOrUndefined = (val) => {
    return !isNotNullNorUndefined(val);
}

export const copyObject = (val) => {
    return _.cloneDeep(val);
}

export const removeNullsFromObject = (obj) => {
    let newObj = {};

    if (isNotAnEmptyObject(obj)) {
        Object.keys(obj).forEach(prop => {
            if (isNotNullNorUndefined(obj[prop])) {
                if (typeof obj[prop] === "string") {
                    if (isNotEmptyString(obj[prop]))
                        newObj[prop] = obj[prop];
                } else {
                    newObj[prop] = obj[prop];
                }
            }
        })
    }

    return newObj;
}