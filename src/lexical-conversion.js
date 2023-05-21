/*
    Developing command tree
*/

import { logDebug, logOutput } from './utils/logger.js';

class NodeDef {
    constructor (id, listStartIndex) {
        this.id = id;
        this.listStartIndex = listStartIndex;
        this.listEndIndex = -1;
        this.children = [];
        this.expression = [];
    }

    getNodeDetails = () => ({
        id: this.id,
        listStartIndex: this.listStartIndex,
        listEndIndex: this.listEndIndex,
        children: this.children
    });

    updateChild = (childId) => this.children.push(childId);

    updateExpression = (expression) => this.expression = expression;

    setListEndIndex = (end) => this.listEndIndex = end;
}

const isOperand = (char, charCount = 0, check = true) => {
    if (charCount < char.length) {
        if (["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "-"].includes(char[charCount]))
            check = check && true;
        else
            check = check && false;
        isOperand(char, ++charCount, check);
    }
    return check;
}

const isWhitespace = (char) => {
    return char === ' '
        || char === '\n'
        || char === '\t'
        || char === '\r'
        || char === '\f'
        || char === '\v'
        || char === '\u00a0'
        || char === '\u1680'
        || char === '\u2000'
        || char === '\u200a'
        || char === '\u2028'
        || char === '\u2029'
        || char === '\u202f'
        || char === '\u205f'
        || char === '\u3000'
        || char === '\ufeff'
}

const convertLispToScopeMap = (lispChars, index, charList, parenthesisScopeMapTemp, parenthesisScopeMap, spaceCount) => {
    if(index < lispChars.length) {
        if (!isWhitespace(lispChars[index]) && lispChars[index] !== null) {
            if (lispChars[index] === "(") {
                parenthesisScopeMapTemp.push(new NodeDef(index-spaceCount, index - spaceCount));
            }
            if (lispChars[index] === ")") {
                parenthesisScopeMapTemp[parenthesisScopeMapTemp.length-1].setListEndIndex(index - spaceCount);
                parenthesisScopeMap.push(parenthesisScopeMapTemp.pop());
                
                parenthesisScopeMap[parenthesisScopeMap.length-1].updateExpression(
                    charList.slice(
                        parenthesisScopeMap[parenthesisScopeMap.length-1].listStartIndex+1,
                        parenthesisScopeMap[parenthesisScopeMap.length-1].listEndIndex
                    )
                );

                charList.splice(
                    parenthesisScopeMap[parenthesisScopeMap.length-1].listStartIndex+1,
                    parenthesisScopeMap[parenthesisScopeMap.length-1].expression.length,
                    ...Array(parenthesisScopeMap[parenthesisScopeMap.length-1].expression.length).fill([parenthesisScopeMap[parenthesisScopeMap.length-1].id])
                );

                if (parenthesisScopeMapTemp.length > 0)
                    parenthesisScopeMapTemp[parenthesisScopeMapTemp.length-1].updateChild(parenthesisScopeMap[parenthesisScopeMap.length-1].id);
            }
            charList.push(lispChars[index]);
        } else {
            ++spaceCount;
        }
        return convertLispToScopeMap(lispChars, index+1, charList, parenthesisScopeMapTemp, parenthesisScopeMap, spaceCount);
    }
    return {
        lisp: charList,
        parenthesisScopeMap: parenthesisScopeMap
    };
};

const removeClosuresAndIds = (expression, index, isChild) => {
    if (index < expression.length) {
        if (expression[index] === "(")
            isChild = expression[index+1];
        if (isChild) {
            if (expression[index] === ")") {
                expression.splice(index, 1, isChild);
                isChild = false;
            } else {
                expression.splice(index, 1);
            }
            --index;
        }
        return removeClosuresAndIds(expression, ++index, isChild);
    }
    return expression;
}

const clearSourceMapJunks = (scopeMap, index) => {
    if(index < scopeMap.length) {
        scopeMap[index].updateExpression(removeClosuresAndIds(scopeMap[index].expression, 0, false));
        return clearSourceMapJunks(scopeMap, ++index);
    }
    return scopeMap;
}

const detectOperands = (lispLines, index, lispChars) => {
    if (index < lispLines.length) {
        if (index-1 > 0 && isOperand(lispLines[index]) && isOperand(lispChars[lispChars.length-1])) {
            lispChars[lispChars.length-1] = lispChars[lispChars.length-1]+lispLines[index];
        } else {
            lispChars.push(lispLines[index]);
        }
        return detectOperands(lispLines, ++index, lispChars);
    }
    return lispChars;
}

export const initLA = (lispLines) => {
    logOutput(lispLines)
    clearSourceMapJunks(
        convertLispToScopeMap(
            detectOperands(lispLines, 0, []),
            0, [], [], [], 0
        ).parenthesisScopeMap,
        0
        ).map(i=>{
        logDebug(JSON.stringify(i))
    });
}