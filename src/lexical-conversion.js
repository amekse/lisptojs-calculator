/*
    Developing command tree
*/

import { logDebug, logError, logOutput } from './utils/logger.js';
import { initSAOperationCheck, initSAScopeCheck } from './syntax-analysis.js';

class NodeDef {
    constructor (id, listStartIndex) {
        this.id = id;
        this.listStartIndex = listStartIndex;
        this.listEndIndex = -1;
        this.children = [];
        this.expression = [];
        this.output = null;
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

    putOutput = (output) => this.output = output;

    updateId = (id) => this.id = id;
}

const checkIsNumber = (char, lexCheck = false, charCount = 0, check = true) => {
    if (char === "-" && !lexCheck)
        return false;
    if (charCount < char.length) {
        if (["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "-", "."].includes(char[charCount]))
            check = check && true;
        else
            check = check && false;
        checkIsNumber(char, lexCheck, ++charCount, check);
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

const charToNumberMap = (char) => {
    switch (char) {
        case "0" : return 0;
        case "1" : return 1;
        case "2" : return 2;
        case "3" : return 3;
        case "4" : return 4;
        case "5" : return 5;
        case "6" : return 6;
        case "7" : return 7;
        case "8" : return 8;
        case "9" : return 9;
        case "-" : return -1;
        case "." : return 0.1;
        default : logError('Bad Compiler Bad Dev!!!!', 'String is not number'); return 0;
    }
}

const convertStringToNumber = (sNum, index = 0, output = 0, unit = 1, ngtv = 1, dec = 1) => {
    if (index < sNum.length) {
        const numVal = charToNumberMap(sNum[index]);
        if (numVal !== -1 && numVal !== 0.1) {
            output = numVal + output*unit;
            unit = unit * 10
        }
        if (numVal === -1)
            ngtv = -1;
        if (numVal === 0.1)
            dec = dec * numVal;
        return convertStringToNumber(sNum, ++index, output, unit, ngtv, dec);
    }
    return output * ngtv * dec;
}

const convertLispToScopeMap = (lispChars, index, charList, parenthesisScopeMapTemp, parenthesisScopeMap, spaceCount) => {
    if(index < lispChars.length) {
        if (!isWhitespace(lispChars[index]) && lispChars[index] !== null) {
            if (lispChars[index] === "(") {
                parenthesisScopeMapTemp.push(new NodeDef(index - spaceCount, index - spaceCount));
            }
            if (lispChars[index] === ")") {
                parenthesisScopeMapTemp[parenthesisScopeMapTemp.length-1].setListEndIndex(index - spaceCount);
                parenthesisScopeMap.push(parenthesisScopeMapTemp.pop());
                
                parenthesisScopeMap[parenthesisScopeMap.length-1].updateId(parenthesisScopeMap.length-1);
                
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
            charList.push(checkIsNumber(lispChars[index]) ? convertStringToNumber(lispChars[index]) : lispChars[index]);
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
        if (index-1 > 0 && checkIsNumber(lispLines[index]) && checkIsNumber(lispChars[lispChars.length-1], true)) {
            lispChars[lispChars.length-1] = lispChars[lispChars.length-1]+lispLines[index];
        } else {
            lispChars.push(lispLines[index]);
        }
        return detectOperands(lispLines, ++index, lispChars);
    }
    return lispChars;
}

export const initLA = (lispLines) => {
    logDebug('**LA Output**', lispLines);
    if (initSAScopeCheck(lispLines)) {
        const laOutput = clearSourceMapJunks(
            convertLispToScopeMap(
                detectOperands(lispLines, 0, []),
                0, [], [], [], 0
            ).parenthesisScopeMap,
            0
        );
        logDebug('**LA Output**');
        laOutput.map(i=>{
            logDebug(JSON.stringify(i))
        });
        initSAOperationCheck(laOutput);
    }
}