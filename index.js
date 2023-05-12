/*
    Starting file to take input based on version and input type
*/

import { readFile } from 'fs';
import { logError } from './src/utils/logger.js';
import { initLA } from './src/lexical-conversion.js';
import featureSwitch from './feature-switch.json' assert { type: "json" };

const readLocalCodeFile = () => {
    readFile('./test-code-v1.lsp', 'utf8', (err, data) => {
        if (err) {
            logError("file read failed", err);
            return;
        }
        initLA(data);
    });
};

const readExternalInput = (codePiece = "") => {};

(featureSwitch['inp-sys'] === "cmd" && featureSwitch['version-level'] >= 1) ?
    readLocalCodeFile() :
    (featureSwitch['inp-sys'] === "web" && featureSwitch['version-level'] >= 3) ?
    readExternalInput() :
    logError("feature switch mismatch", "set FS to cmd or web");
