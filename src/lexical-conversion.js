/*
    Converting lisp file to list of commands
*/

import { logDebug, logError } from './utils/logger.js';
import { initSA } from './syntax-analysis.js';
import { regexStringOccuranceCount } from './utils/micro-utils.js';

const convertCharSetToOperator = (lispCharSet, startCount, endCount) => {
    let lastOut = [endCount, lispCharSet.slice(startCount, endCount).toString().replaceAll(",","")];
    if (lispCharSet[endCount] !== "(" && lispCharSet[endCount] !== ")" && lispCharSet[endCount] !== " " && endCount < lispCharSet.length) {
        lastOut = convertCharSetToOperator(lispCharSet, startCount, ++endCount);
    }
    return lastOut;
}

const convertScopesToLists = (lispCharSet, charCount, listByScopes, parenthesisLevel) => {
    let lastOut = listByScopes;
    if (charCount < lispCharSet.length) {
        if (lispCharSet[charCount] === "(") {
            listByScopes.push("[");
            lastOut = convertScopesToLists(lispCharSet, ++charCount, listByScopes, ++parenthesisLevel);
        } else if (lispCharSet[charCount] !== "(" && lispCharSet[charCount] !== ")" && lispCharSet[charCount] !== " ") {
            const operatorValueStringSet = convertCharSetToOperator(lispCharSet, charCount, charCount+1);
            listByScopes.push(`"${operatorValueStringSet[1]}";`);
            lastOut = convertScopesToLists(lispCharSet, operatorValueStringSet[0], listByScopes, parenthesisLevel);
        } else if (lispCharSet[charCount] === ")") {
            listByScopes.push("]");
            lastOut = convertScopesToLists(lispCharSet, ++charCount, listByScopes, --parenthesisLevel);
        } else {
            lastOut = convertScopesToLists(lispCharSet, ++charCount, listByScopes, parenthesisLevel);
        }
    }
    return lastOut;
}

const enclosingParanthesisCheck = (lispLines) => regexStringOccuranceCount(lispLines, /\(/gi) === regexStringOccuranceCount(lispLines, /\)/gi);

const convertLineBreaksToSpaces = (lispLines) => enclosingParanthesisCheck(lispLines) ?
    convertScopesToLists(lispLines.replaceAll("\n", " ").split(""), 0, [], -1) :
    logError("Scope Error", "Incomplete parenthesis in code");

const lispToListEval = (lispList) => eval(`[${lispList.join().replaceAll(",", " ").replaceAll("] [", "],[").replaceAll('] "', ']; "').replaceAll(";", ",")}]`);

export const initLA = (lispLines) => logDebug("LA output", JSON.stringify(initSA(lispToListEval(convertLineBreaksToSpaces(lispLines)))));