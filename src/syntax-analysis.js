/*
    Developing the command execution tree
*/

import { logDebug, logError, logOutput } from './utils/logger.js'

const inKeywordsLChecklist = (keyword) => ["defun", "write", "terpri"].includes(keyword);

const checkLDefun = (funcName, functionsLList) => (typeof funcName !== "string" || !isNaN(funcName) || inKeywordsLChecklist(funcName) || functionsLList.includes(funcName)) ?
    {action: null, value: null, error: `${funcName} cannot be a function name`} : {action: "defun", value: funcName, error: null};

const checkSyntaxStructure = (commandList, index, functionsLList) => {
    let lastFuncLList = functionsLList;
    if (index >= 0) {
        let checkRes = {action: null, value: null, error: null};
        if (typeof commandList[index] === "object") {
            checkSyntaxStructure(commandList[index], commandList[index].length-1, lastFuncLList);
        } else {
            if (commandList[index] === "defun") {
                checkRes = checkLDefun(commandList[index+1], functionsLList); 
            }
        }
        if (checkRes.error && !checkRes.action) {
            logError("Syntax Error", checkRes.error);
        }
        if (checkRes.action && checkRes.value && !checkRes.error) {
            switch (checkRes.action) {
                case "defun" : lastFuncLList.push(checkRes.value); break;
                default : null;
            }
        }
        checkSyntaxStructure(commandList, --index, lastFuncLList);
    }
    return lastFuncLList;
}

export const initSA = (commandList) => {
    logDebug("SA output", checkSyntaxStructure(commandList, commandList.length-1, []));
    return commandList;
}