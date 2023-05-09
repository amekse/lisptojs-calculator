/*
    Developing the command execution tree
*/

import { logError, logOutput } from "./utils/logger.js";

const idGenerator = (level, index) => `${level}${index}${Date.now()}`;

const findNextNodePoint = (leveledList, startIdx, endIdx) => {
    let lastChunk = [endIdx, leveledList[startIdx], leveledList.slice(startIdx+1, endIdx)];
    if (typeof leveledList[endIdx] !== "number" && endIdx < leveledList.length) {
        lastChunk = findNextNodePoint(leveledList, startIdx, ++endIdx);
    }
    return lastChunk;
}

const traverseListToFeedTree = (leveledList, index, ast) => {
    let lastAst = ast;
    if(typeof leveledList[index] === "number" && index < leveledList.length) {
        const chunkAndSkip = findNextNodePoint(leveledList, index, ++index);
        ast.push([idGenerator(chunkAndSkip[1], index), chunkAndSkip[1], chunkAndSkip[2]])
        lastAst = traverseListToFeedTree(leveledList, chunkAndSkip[0], ast);
    }
    return lastAst;
}

export const createAST = (commandListByLevels) => {
    traverseListToFeedTree(commandListByLevels, 0, []).map(item => logOutput(item));
    return commandListByLevels;
}