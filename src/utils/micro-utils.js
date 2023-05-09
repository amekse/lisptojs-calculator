/*
    Micro calculations
*/

export const regexStringOccuranceCount = (string, regex) => {
    return (string.match(regex) || []).length;
}