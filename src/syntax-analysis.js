/*
    Validating execution tree
*/

import { initST } from './solve-tree.js';
import { logDebug, logError, logOutput } from './utils/logger.js';

const checkExpression = (expression, index, checkRes = true) => {
    if (index < expression.length) {
        if ((index === 0 && !["+", "-", "/", "*"].includes(expression[index]))) {
            logError(`Wrong Expression Operator ${expression}`, 'Expression must start with an operator');
            return false;
        } else if ((index > 0 && ["+", "-", "/", "*"].includes(expression[index]))) {
            logError(`Wrong Expression Operator ${expression}`, 'Expression can have operator only at beginning');
            return false;
        } else {
            return checkExpression(expression, ++index, checkRes);
        }
    }
    return checkRes;
}

const checkOperatorOperandConfiguration = (abstractTree, index, checkRes = true) => {
    if (index < abstractTree.length) {
        checkRes = checkRes && checkExpression(abstractTree[index].expression, 0);
        return checkRes ? checkOperatorOperandConfiguration(abstractTree, ++index, checkRes) : checkRes;
    }
    return checkRes;
}

const checkScopeCompleteness = (lispLines, index, scopeCount = 0) => {
    if (index < lispLines.length) {
        if (lispLines[index] === "(")
            ++scopeCount;
        if (lispLines[index] === ")")
            --scopeCount;
        return checkScopeCompleteness(lispLines, ++index, scopeCount);
    }
    return scopeCount === 0 ? true : false;
}

export const initSAOperationCheck = (abstractTree) =>  {
    if (checkOperatorOperandConfiguration(abstractTree, 0)) {
        logDebug("**SA Output**", true);
        // initST(abstractTree);
    } else {
        logDebug("**SA Output**", false);
    }
}

export const initSAScopeCheck = (lispLines) => {
    const scopeRes = checkScopeCompleteness(lispLines, 0);
    scopeRes ? logDebug("**SA Output**", true) : logError(`Expression Scope Error ${lispLines}`, 'Expression paranthesis mismatch');
    return scopeRes;
}