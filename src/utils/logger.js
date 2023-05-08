/*
    File to decorate logs and use various loggers
*/

export function logError(message, error) {
    console.log(message, '\x1B[31m'+error+'\x1b[37m');
}

export function logOutput(message, output) {
    console.log(message, '\x1B[36m'+output+'\x1b[37m');
}