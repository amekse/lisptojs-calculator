/*
    Developing the command execution tree
*/

import { logError } from './utils/logger.js'
import KeywordValidation from "./utils/keyword-validation.js";

const checkSyntaxStructure = (commandList, index, keyVal) => {
    if (index > 0) {
        if (typeof commandList[index] === "object") {
            checkSyntaxStructure(commandList[index], commandList[index].length-1);
        }
        checkSyntaxStructure(commandList, index-1);
        if (keyVal.checklistKeywords.includes(commandList[index])) {
            const valReport = keyVal.validateLKeyword(commandList[index], index);
            if (valReport.error) {
                logError("Syntax Error", valReport.error);
            }
        }
    }
    return index;
}

export const initSA = (commandList) => {
    checkSyntaxStructure(commandList, commandList.length-1, new KeywordValidation(commandList));
    return commandList;
}