export const isNotEmptyString = (val) => {
    return val !== null && val !== undefined
        && typeof val === "string" && val !== "";
}

export const isEmptyString = (val) => {
    return !isNotEmptyString(val);
}