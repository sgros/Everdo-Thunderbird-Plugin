function processParts(parts) {

    let note = "";

    for (const part of parts) {
    	if (part.parts) {
	    note += processParts(part.parts);
    	} else if (part.contentType == "text/plain") {
	    note += part.body;
	}
    }

    return note;
}

async function processMessage(message, index, array) {
    let gettingUrl = browser.storage.sync.get("everdo_api_url");
    EVERDO_URL = await gettingUrl;

    let gettingKey = browser.storage.sync.get("everdo_api_key");
    EVERDO_KEY = await gettingKey;

    let taskTitle = browser.storage.sync.get("task_title");
    TASK_TITLE = await taskTitle;

    let taskTemplate = browser.storage.sync.get("task_template");
    TASK_TEMPLATE = await taskTemplate;

    var req = new XMLHttpRequest();

    req.open("POST", EVERDO_URL.everdo_api_url + "/api/items?key=" + EVERDO_KEY.everdo_api_key, true);

    req.setRequestHeader("Content-Type", "application/json");
    req.addEventListener("timeout", function() {
      console.log("timeout");
    });
    req.addEventListener("error", function() {
      console.log("error");
    });

    title = TASK_TITLE.task_title.replace(/%S/, message.subject).replace(/%A/, message.author).replace(/%D/, message.date);
    note = TASK_TEMPLATE.task_template.replace(/%S/, message.subject).replace(/%A/, message.author).replace(/%D/, message.date);

    recipients = "";
    for (const recipient of message.recipients){
        recipients += recipient + ", ";
    }

    title = title.replace(/%T/, recipients);
    note = note.replace(/%T/, recipients);

    ccList = "";
    for (const recipient of message.ccList){
        ccList += recipient + ", ";
    }

    title = title.replace(/%C/, ccList);
    note = note.replace(/%C/, ccList);

    bccList = "";
    for (const recipient of message.bccList){
        bccList += recipient + ", ";
    }

    title = title.replace(/%B/, bccList);
    note = note.replace(/%B/, bccList);

    msg = await messenger.messages.getFull(message.id);
    messageText = processParts(msg.parts);

    note = note.replace(/%T/, messageText);

    req.send('{"title": "' + title + '", "note": ' + JSON.stringify(note) + ' }');
};

async function startProcess(info) {
    info.selectedMessages.messages.forEach(processMessage);
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

