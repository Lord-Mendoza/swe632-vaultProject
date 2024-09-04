import _ from "lodash";

export const isNotAnEmptyArray = (val) => {
    return Array.isArray(val) && val.length > 0;
}

export const isAnEmptyArray = (val) => {
    return !isNotAnEmptyArray(val);
}

export const isSameArray = (arrayOne, arrayTwo) => {
    return arrayOne.length === arrayTwo.length && arrayOne.every((value, index) => value === arrayTwo[index])
}

export const isNotSameArray = (arrayOne, arrayTwo) => {
    return !isSameArray(arrayOne, arrayTwo);
}

export const copyArrayOfObjects = (val) => {
    return val.map(obj => _.cloneDeep(obj))
}