var logHelper = {
  log (message) {
    if (Memory.logging) {
      console.log(message);
    }
  }
}
module.exports = logHelper;
