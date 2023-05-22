/*
    Solve code
*/

import { logDebug, logOutput } from './utils/logger.js';

const solveExpression = (absTree, tCount = 0, expression = (tCount < absTree.length ? absTree[tCount].expression : []), eCount = 2, outStore = (typeof expression[1] === "object" ? absTree[expression[1][0]].output : expression[1]), operator = expression[0]) => {
    if (tCount < absTree.length) {
        if (eCount < expression.length) {
            if (operator === "+") outStore += (typeof expression[eCount] === "object" ? absTree[expression[eCount][0]].output : expression[eCount]);
            if (operator === "-") outStore -= (typeof expression[eCount] === "object" ? absTree[expression[eCount][0]].output : expression[eCount]);
            if (operator === "/") outStore /= (typeof expression[eCount] === "object" ? absTree[expression[eCount][0]].output : expression[eCount]);
            if (operator === "*") outStore *= (typeof expression[eCount] === "object" ? absTree[expression[eCount][0]].output : expression[eCount]);

            if (eCount === expression.length-1)
                absTree[tCount].output = outStore;

            return solveExpression(absTree, tCount, expression, ++eCount, outStore);
        }
        return solveExpression(absTree, ++tCount);
    }
    return absTree;
}

export const initST = (abstractTree) => {
    logDebug("**ST Output**");
    const expRes = solveExpression(abstractTree);
    expRes.map(i => {
        logDebug(JSON.stringify(i));
    });
    logOutput("**Final Output**", expRes[expRes.length-1].output)
    return true;
}