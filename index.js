/*
    Starting file to take input based on version and input type
*/

import { readFile } from 'fs';
import { logError } from './src/utils/logger.js';
import { convertLispToLists } from './src/lisp-to-list.js';
import featureSwitch from './feature-switch.json' assert { type: "json" };

function readLocalCodeFile() {
    readFile('./test-code.lsp', 'utf8', (err, data) => {
        if (err) {
            logError("file read failed", err);
            return;
        }
        convertLispToLists(data);
    });
}

function readExternalInput(codePiece = "") {}

(featureSwitch['inp-sys'] === "cmd" && featureSwitch['version-level'] >= 1) ?
    readLocalCodeFile() :
    (featureSwitch['inp-sys'] === "web" && featureSwitch['version-level'] >= 2) ?
    readExternalInput() :
    logError("feature switch mismatch", "set FS to cmd or web");
