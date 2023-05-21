/*
    Solve code
*/

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