//第三方库
class ThirdPartyLogger {
    logMessage(level, message) {
        console.log(`[${level}] ${message}`);
    }
}
//适配器类
class LoggerAdapter {
    constructor() {
        this.thirdPartyLogger = new ThirdPartyLogger();
    }
    logInfo(message) {
        this.thirdPartyLogger.logMessage("INFO", message);
    }
    logError(message) {
        this.thirdPartyLogger.logMessage("ERROR", message);
    }
}
//客户端代码
function clientCode(log) {
    console.log("客户端代码开始执行");
    log.logInfo("这是一条信息");
    log.logError("这是一条错误信息");
    console.log("客户端代码执行完毕");
}
let adapter = new LoggerAdapter();
clientCode(adapter);
