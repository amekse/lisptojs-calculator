/*
    Solve code
*/

const solveExpression = (expression, operator = expression[0], index = 2, output = expression[1]) => {
    // TODO: check output if object
    if (index < expression.length) {
        if () {
            
        }
        if (operator === "+") output = output + expression[index];
        if (operator === "-") output = output - expression[index];
        if (operator === "/") output = output / expression[index];
        if (operator === "*") output = output * expression[index];
        return solveExpression(expression, operator, ++index, output);
    }
    return output;
}

const interpretExpression = (abstractTree, index) => {
    if (index < abstractTree.length) {
        abstractTree[index].putOutput(solveExpression(abstractTree[index].expression));
        return interpretExpression(abstractTree, ++index);
    }
    return abstractTree[index];
}

export const initST = (abstractTree) => {
    interpretExpression(abstractTree, 0);
    return true;
}