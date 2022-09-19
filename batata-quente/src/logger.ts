function log(message: string) {
    console.log(message);
}

export default {
    logInfo (message: string) {
        log(`${Date.now()} [INFO] ${message}`);
    },
    logError (message: string) {
        log(`${Date.now()} [ERROR] ${message}`);
    }
}