export default class KeywordValidation {
    constructor (commandList) {
        this.commandList = commandList;
    }

    checklistLKeywords = ["defun", "write", "terpri"];
    checklistLFunctions = [];

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

    #checkLDefun = (index) => (typeof this.commandList[index+1] === "string" && !this.checklistLKeywords.includes(this.commandList[index])) ?
            {value: this.commandList[index], error: null} : {value: this.commandList[index], error: `${this.commandList[index+1]} cannot be a function name`};

}