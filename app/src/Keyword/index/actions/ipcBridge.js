var ipcRenderer = window
  .require("electron")
  .ipcRenderer;

module.exports = {
  init: function () {
    var self = this;
    ipcRenderer
      .on("message", function (event, text) {
        this.printMessage(text)
      });
    
  }
  printMessage: function (msg) {
    var container = document.getElementById("__messages");
    if (container) {
      container.innerHTML = text;
    }
  }
  
  }
}