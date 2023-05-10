/*
    Validating execution tree
*/

import { logDebug, logError } from './utils/logger.js';

const inKeywordsLChecklist = (keyword) => ["defun", "write", "terpri"].includes(keyword);

const checkLDefun = (funcName, paramList, functionsLList) => (typeof funcName !== "string" || !isNaN(funcName) || inKeywordsLChecklist(funcName) || functionsLList.includes(funcName)) && typeof paramList === "object" ?
    {action: "defun", value: false, error: `${funcName} cannot be a function name`} : {action: "defun", value: [funcName, paramList], error: false};

const checkLSolvableOperation = (operation, index, funcLList) => {
    let lastCheck = true;
    const operatorLList = ["+", "-", "*", "/", "mod"];
    if (index >= 0) {
        if ((index === 0 && operatorLList.includes(operation[index]) || funcLList.concat(["read"]).includes(operation[index])) || (index !== 0 && !operatorLList.includes(operation[index]))) // TODO: complete check all possible conditions
            lastCheck = checkLSolvableOperation(operation, --index, funcLList);
        else
            lastCheck = false;
    }
    return lastCheck;
}

const checkLWrite = (wOutput, funcLList) => {
    if (typeof wOutput === "object" && checkLSolvableOperation(wOutput, wOutput.length-1, funcLList)) {
        return {action: "write", value: false, error: false};
    } else if (typeof wOutput === "string" || typeof wOutput === "number") {
        return {action: "write", value: false, error: false};
    } else {
        return {action: "write", value: false, error: `cannot Write value of ${wOutput}`};
    }
};

const checkLFunctionCall = (callDetails, funcLList) => {
    if (callDetails.length-1 !== funcLList[funcLList.indexOf(callDetails[0])+1].length)
        return {action: "function", value: null, error: `parameter mismatch at ${callDetails}`}
    return {action: "function", value: null, error: null}
}

// TODO: type mismatch
// TODO: recursion check

const checkSyntaxStructure = (commandList, index, functionsLList) => {
    let lastFuncLList = functionsLList;
    if (index < commandList.length) {
        let checkRes = {action: null, value: null, error: null};
        if (typeof commandList[index] === "object") {
            lastFuncLList = checkSyntaxStructure(commandList[index], 0, lastFuncLList);
        } else {
            if (index === 0 && !functionsLList.includes(commandList) && !functionsLList.concat(["defun", "terpri", "write", "read", "+", "-", "*", "/", "mod"]).includes(commandList[index]))
                checkRes = {action: "function", value: false, error: `${commandList} invalid operation start`}
            else if (commandList[index] === "defun")
                checkRes = checkLDefun(commandList[index+1], commandList[index+2], lastFuncLList);
            else if (commandList[index] === "write")
                checkRes = checkLWrite(commandList[index+1], lastFuncLList);
            else if (commandList[index] === "terpri" && commandList[index+1])
                checkRes = {action: "terpri", value: null, error: `terpri ${commandList[index+1]} is not possible`};
            else if (functionsLList.includes(commandList[index]) && commandList[index-1] !== "defun")
                !commandList[index -1] ?
                    checkRes = checkLFunctionCall(commandList, lastFuncLList) :
                    checkRes = {action: "function", value: false, error: `${commandList[index-1]} ${commandList[index]} is not possible`}
        }
        if (checkRes.error) {
            logError("Syntax Error", checkRes.error);
        }
        if (checkRes.value) {
            switch (checkRes.action) {
                case "defun" : lastFuncLList = lastFuncLList.concat(checkRes.value); break;
                default : null;
            }
        }
        lastFuncLList = checkSyntaxStructure(commandList, ++index, lastFuncLList);
    }
    return lastFuncLList;
}

export const initSA = (commandList) => {
    logDebug("SA output", JSON.stringify(checkSyntaxStructure(commandList, 0, [])));
    return commandList;
}