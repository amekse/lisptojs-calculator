/*
    Developing command tree
*/

import { logDebug } from './utils/logger.js';

class NodeDef {
    constructor (id, value) {
        this.id = id;
        this.value = value;
        this.children = [];
    }

    getNodeDetails = () => ({
        id: this.id,
        value: this.value,
        children: this.children
    });

    addChild = (childNode) => this.children.push(childNode);
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

const convertLispStringToCharList = (lispLines, index, charList, parentMap) => {
    if(index < lispLines.length) {
        if (!isWhitespace(lispLines[index]) && lispLines[index] !== null) {
            if (lispLines[index] === "(")
                parentMap.push(index);
            charList.push(lispLines[index]);
        }
        return convertLispStringToCharList(lispLines, ++index, charList, parentMap);
    }
    return {
        lisp: charList,
        parent: parentMap
    };
};

export const initLA = (lispLines) => logDebug("LA output", JSON.stringify(convertLispStringToCharList(lispLines, 0, [], [])));