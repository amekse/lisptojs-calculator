export default class KeywordValidation {
    constructor (commandList) {
        this.commandList = commandList;
    }

    checklistLKeywords = ["defun", "write", "terpri"];

    validateLKeyword = (keyword, index) => {
        switch (keyword) {
            case "defun": return this.#checkLDefun(index);
            case "write": return this.#checkLWrite(index);
            case "terpri": return this.#checkLTerpri(index);
        }
    };

    #checkLFunctions = (index) => {};

    #checkLWrite = (index) => {};

    #checkLTerpri = (index) => {};

    #checkLDefun = (index) => {};

}