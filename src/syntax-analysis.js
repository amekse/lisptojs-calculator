/*
    Developing the command execution tree
*/

import { logDebug, logError, logOutput } from './utils/logger.js';

const inKeywordsLChecklist = (keyword) => ["defun", "write", "terpri"].includes(keyword);

const checkLDefun = (funcName, functionsLList) => (typeof funcName !== "string" || !isNaN(funcName) || inKeywordsLChecklist(funcName) || functionsLList.includes(funcName)) ?
    {action: "defun", value: true, error: `${funcName} cannot be a function name`} : {action: "defun", value: funcName, error: false};

const checkLSolvableOperation = (operation, index, funcLList) => {
    const operatorLList = ["+", "-", "*", "/", "mod"];
    if (index >= 0) {
        if ((index === 0 && operatorLList.includes(operation[index]) || funcLList.concat["read"].includes(operation[index])) || (index !== 0 && !operatorLList.includes(operation[index]))) // TODO: complete check all possible conditions
            checkLSolvableOperation(operation, --index);
        else
            return false;
    }
    return true;
}

const checkLWrite = (wOutput, funcLList) => {
    if (typeof wOutput === "object" && checkLSolvableOperation(wOutput, wOutput.length-1, funcLList)) {
        return {action: "write", value: true, error: false};
    } else if (typeof wOutput === "string" || typeof wOutput === "number") {
        return {action: "write", value: true, error: false};
    } else {
        return {action: "write", value: false, error: `cannot Write value of ${wOutput}`};
    }
};

const checkSyntaxStructure = (commandList, index, functionsLList) => {
    let lastFuncLList = functionsLList;
    if (index >= 0) {
        let checkRes = {action: null, value: null, error: null};
        if (typeof commandList[index] === "object") {
            checkSyntaxStructure(commandList[index], commandList[index].length-1, lastFuncLList);
        } else {
            if (commandList[index] === "defun")
                checkRes = checkLDefun(commandList[index+1], functionsLList);
            if (commandList[index] === "write")
                checkRes = checkLWrite(commandList[index+1], functionsLList);
        }
        if (checkRes.error) {
            logError("Syntax Error", checkRes.error);
        }
        if (checkRes.value) {
            switch (checkRes.action) {
                case "defun" : lastFuncLList.push(Symbol(checkRes.value)); break;
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