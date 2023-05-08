/*
    Converting lisp file to list of commands
*/

import { logError, logOutput } from './utils/logger.js';

const convertCharSetToOperator = (lispCharSet, startCount, endCount) => {
    let lastOut = [endCount, lispCharSet.slice(startCount, endCount).toString().replaceAll(",","")];
    if (lispCharSet[endCount] !== "(" && lispCharSet[endCount] !== ")" && lispCharSet[endCount] !== " " && endCount < lispCharSet.length) {
        lastOut = convertCharSetToOperator(lispCharSet, startCount, ++endCount);
    }
    return lastOut;
}

const convertScopesToLists = (lispCharSet, charCount, listByScopes, parenthesisLevel) => {
    let lastOut = [listByScopes];
    if (charCount < lispCharSet.length) {
        if (lispCharSet[charCount] === "(") {
            listByScopes.push([++parenthesisLevel]);
            lastOut = convertScopesToLists(lispCharSet, ++charCount, listByScopes, parenthesisLevel);
        } else if (lispCharSet[charCount] !== "(" && lispCharSet[charCount] !== ")" && lispCharSet[charCount] !== " ") {
            const operatorValueStringSet = convertCharSetToOperator(lispCharSet, charCount, ++charCount);
            listByScopes.push(operatorValueStringSet[1]);
            lastOut = convertScopesToLists(lispCharSet, operatorValueStringSet[0], listByScopes, parenthesisLevel);
        } else if (lispCharSet[charCount] === ")") {
            lastOut = convertScopesToLists(lispCharSet, ++charCount, listByScopes, --parenthesisLevel);
        } else {
            lastOut = convertScopesToLists(lispCharSet, ++charCount, listByScopes, parenthesisLevel);
        }
    }
    return lastOut;
}

const convertLineBreaksToSpaces = (lispLines) => convertScopesToLists(lispLines.replaceAll("\n", " ").split(""), 0, [], -1);

export const initLA = (lispLines) => {
    logOutput("", lispLines.replaceAll("\n", " "));
    logOutput(convertLineBreaksToSpaces(lispLines));
};