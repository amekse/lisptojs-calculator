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

const convertLispToScopeMap = (lispLines, index, charList, parenthesisScopeMapTemp, parenthesisScopeMap, spaceCount) => {
    if(index < lispLines.length) {
        if (!isWhitespace(lispLines[index]) && lispLines[index] !== null) {
            if (lispLines[index] === "(") {
                parenthesisScopeMapTemp.push(new NodeDef(index-spaceCount, index - spaceCount));
            }
            if (lispLines[index] === ")") {
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
                    ...Array(parenthesisScopeMap[parenthesisScopeMap.length-1].expression.length).fill(`id${parenthesisScopeMap[parenthesisScopeMap.length-1].id}`)
                );

                if (parenthesisScopeMapTemp.length > 0)
                    parenthesisScopeMapTemp[parenthesisScopeMapTemp.length-1].updateChild(parenthesisScopeMap[parenthesisScopeMap.length-1].id);
            }
            charList.push(lispLines[index]);
        } else {
            ++spaceCount;
        }
        return convertLispToScopeMap(lispLines, index+1, charList, parenthesisScopeMapTemp, parenthesisScopeMap, spaceCount);
    }
    return {
        lisp: charList,
        parenthesisScopeMap: parenthesisScopeMap
    };
};

const removeClosuresAndIds = (expression, index, isChild) => {
    if (index < expression.length) {
        if (expression[index] === "(" || expression[index] === ")")
            isChild = !isChild;
        if(isChild) {
            expression.splice(index, 1);
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

export const initLA = (lispLines) => {
    clearSourceMapJunks(
        convertLispToScopeMap(lispLines, 0, [], [], [], 0).parenthesisScopeMap,
        0
        ).map(i=>{
        logDebug(JSON.stringify(i))
    })
}