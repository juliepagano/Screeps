const LOG_LEVEL = require('constants.log')

const logHelper = {
  log (message, level) {
    const currentLogLevel = Memory.logLevel || LOG_LEVEL.ERROR

    // Do not log.
    if (currentLogLevel === LOG_LEVEL.NONE ||
        level === LOG_LEVEL.NONE) {
      return
    }

    // Assumes debug level if not set
    level = level || LOG_LEVEL.DEBUG

    // Always log if debug level or levels match.
    if (Memory.logLevel === level ||
        Memory.logLevel === LOG_LEVEL.DEBUG) {
      console.log(message);
      return
    }

    // If error level, also log INFO level logs.
    if (Memory.logLevel === LOG_LEVEL.ERROR &&
        level === LOG_LEVEL.INFO) {
      console.log(message)
      return
    }
  }
}
module.exports = logHelper;
