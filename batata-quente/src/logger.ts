function log(message: string) {
    console.log(message);
}

export default {
    logInfo (message: string) {
        log(`[INFO] ${message}`);
    },
    logError (message: string) {
        log(`[ERROR] ${message}`);
    }
}