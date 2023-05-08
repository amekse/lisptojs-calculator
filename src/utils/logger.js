/*
    File to decorate logs and use various loggers
*/

export function logError(message, error) {
    console.log(message);
    console.log('\x1B[31m'+error);
}

export function logOutput(message, output) {
    console.log(message);
    console.log('\x1B[36m'+output);
}