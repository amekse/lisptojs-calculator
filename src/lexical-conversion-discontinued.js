/*
    Developing command tree
*/

const convertLispStringToList = (codeLine, index, output) => {
    
}

const convertLineBreaksToSingleLine = (lispLines) => convertLispStringToList(lispLines); // TODO: Implement code

export const initLA = (lispLines) => logDebug("LA output", JSON.stringify(convertLineBreaksToSingleLine(lispLines)));