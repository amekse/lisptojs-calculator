/*
    Solve code
*/

import { logDebug } from './utils/logger.js';

const solveExpression = (absTree, expression, operator = expression[0], index = 2, output = (typeof expression[1] === "object" ? absTree[expression[1][0]].output : expression[index])) => {
    if (index < expression.length) {
        if (operator === "+") output = output + (typeof expression[index] === "object" ? absTree[expression[index][0]].output : expression[index]);
        if (operator === "-") output = output - (typeof expression[index] === "object" ? absTree[expression[index][0]].output : expression[index]);
        if (operator === "/") output = output / (typeof expression[index] === "object" ? absTree[expression[index][0]].output : expression[index]);
        if (operator === "*") output = output * (typeof expression[index] === "object" ? absTree[expression[index][0]].output : expression[index]);
        return solveExpression(expression, operator, ++index, output);
    }
    if (index === expression.length-1) {
        absTree.putOutput(output);
    }
    return absTree;
}

const interpretExpression = (abstractTree, index = 0) => {
    if (index < abstractTree.length)
        return interpretExpression(solveExpression(abstractTree, abstractTree[index].expression), ++index);
    return abstractTree;
}

export const initST = (abstractTree) => {
    logDebug("**ST Output**")
    logDebug(JSON.stringify(interpretExpression(abstractTree)))
    // interpretExpression(abstractTree, 0).map(i => {
    //     logDebug(JSON.stringify(i));
    // });
    return true;
}