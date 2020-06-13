let EVERDO_URL = "https://p51-wg:12800";
let EVERDO_KEY = "<INSERT YOUR API KEY HERE>";

console.log("START");

function processMessage(message, index, array) {
    console.log("processMessage() STARTED");
    console.log(message);

    var req = new XMLHttpRequest();
    req.open("POST", EVERDO_URL + "/api/items?key=" + EVERDO_KEY, true);
    req.setRequestHeader("Content-Type", "application/json");
    req.addEventListener("load", function() {
      console.log(req.response);
    });
    req.addEventListener("timeout", function() {
      console.log("timeout");
    });
    req.addEventListener("error", function() {
      console.log("error");
    });
    req.send('{"title": "' + message.subject + '", "note": "<b>Example</b>" }');
    console.log("processMessage() FINISHED");
};

async function startProcess(info) {
    console.log("startProcess() STARTED");
    info.selectedMessages.messages.forEach(processMessage);
    console.log("startProcess() FINISHED");
};

browser.menus.create({
  id: "mail2task",
  title: "Convert to Everdo Task",
  contexts: ["message_list"],
  async onclick(info) {
    await startProcess(info);
  },
});

browser.menus.onShown.addListener((info) => {
  let oneMessage = info.selectedMessages && true;
  browser.menus.update("mail2task", { visible: oneMessage });
  browser.menus.refresh();
});
