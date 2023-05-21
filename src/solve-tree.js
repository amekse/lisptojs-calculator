/*
    Solve code
*/

const solveExpression = (operator, expression, index, output = 0) => {
    if (index < expression.length) {
        if (operator === "+") output = output + expression[index];
        return solveExpression(operator, expression, index, output);
    }
    return output;
}

const interpretExpression = (abstractTree, index) => {
    if (index < abstractTree.length) {
        return interpretExpression(abstractTree, ++index);
    }
    return abstractTree[index].output;
}

export const initST = (abstractTree) => {
    interpretExpression(abstractTree, 0);
    return true;
}