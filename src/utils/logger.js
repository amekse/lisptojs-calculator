/*
    File to decorate logs and use various loggers
*/

function logToConsole(message, error = "", color = "") {
    console.log(error !== "" ? color+message : color+"", `${error !== "" ? error : message}`+'\x1b[37m');
}

export function logError(message, error) {
    logToConsole(message, error, '\x1B[31m');
}

export function logDebug(message, output) {
    logToConsole(message, output, '\x1b[35m');
}

export function logOutput(message, output) {
    logToConsole(message, output, '\x1B[36m');
}