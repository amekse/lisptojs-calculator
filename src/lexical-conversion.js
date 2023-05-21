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
    }

    getNodeDetails = () => ({
        id: this.id,
        listStartIndex: this.listStartIndex,
        listEndIndex: this.listEndIndex,
        children: this.children
    });

    addChild = (childId) => this.children.push(childId);

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

const convertLispStringToCharList = (lispLines, index, charList, parenthesisScopeMapTemp, parenthesisScopeMap, spaceCount) => {
    if(index < lispLines.length) {
        if (!isWhitespace(lispLines[index]) && lispLines[index] !== null) {
            if (lispLines[index] === "(") {
                const nodeId = `${index-spaceCount}` //`${index-spaceCount}${Date.now()}`;
                parenthesisScopeMapTemp.push(new NodeDef(nodeId, index - spaceCount));
                if (parenthesisScopeMapTemp[parenthesisScopeMapTemp.length-1])
                    parenthesisScopeMapTemp[parenthesisScopeMapTemp.length-1].addChild(nodeId);
            }
            if (lispLines[index] === ")") {
                parenthesisScopeMapTemp[parenthesisScopeMapTemp.length-1].setListEndIndex(index - spaceCount);
                parenthesisScopeMap.push(parenthesisScopeMapTemp.pop());
            }
            charList.push(lispLines[index] === "(" || lispLines[index] === ")" ? `${index-spaceCount}${lispLines[index]}` : lispLines[index]);
        } else {
            ++spaceCount;
        }
        return convertLispStringToCharList(lispLines, index+1, charList, parenthesisScopeMapTemp, parenthesisScopeMap, spaceCount);
    }
    return {
        lisp: charList,
        parenthesisScopeMap: parenthesisScopeMap
    };
};

export const initLA = (lispLines) => {
    const tempOut = convertLispStringToCharList(lispLines, 0, [], [], [], 0);
    logDebug(JSON.stringify(tempOut.lisp));
    tempOut.parenthesisScopeMap.map(i => logOutput(JSON.stringify(i)))
}