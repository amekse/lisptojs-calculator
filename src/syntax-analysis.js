/*
    Developing the command execution tree
*/

import { logError, logOutput } from './utils/logger.js'

const inKeywordsLChecklist = (keyword) => ["defun", "write", "terpri"].includes(keyword);

const checkLFunctionName = (funcName, functionsLList) => (typeof funcName !== "string" || !isNaN(funcName) || inKeywordsLChecklist(funcName) || functionsLList.includes(funcName)) ?
    logError("Syntax Error", `${funcName} cannot be a function name`) : null;

const checkSyntaxStructure = (commandList, index, functionsLList) => {
    if (index >= 0) {
        if (typeof commandList[index] === "object") {
            checkSyntaxStructure(commandList[index], commandList[index].length-1, functionsLList);
        } else {
            if (commandList[index] === "defun") {
                checkLFunctionName(commandList[index+1], functionsLList);
            }
            if (commandList[index] === "write") {
                
            }
        }
        checkSyntaxStructure(commandList, --index, functionsLList);
    }
    return index;
}

export const initSA = (commandList) => {
    checkSyntaxStructure(commandList, commandList.length-1, []);
    return commandList;
}