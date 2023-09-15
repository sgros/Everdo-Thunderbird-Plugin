/*
Default settings. Initialize storage to these values.
From: https://github.com/mdn/webextensions-examples/blob/main/stored-credentials/
// TODO: create default values if none are already present
*/
let everdoPluginDataDefaultValues = {
  everdo_api_url: "127.0.0.1:11111",
  everdo_api_key: "",
  task_template: "===============================================================\nAuthor: %A\nTo: %T\nCC: %C\nDate; %D\n===============================================================\n\n%T",
  task_title: "%S",
}

function sendDesktopNotification(msg) {
    browser.notifications.create({
        type : 'basic',
        message : msg,
        title : 'Everdo Thundebird Plugin'
    });
}

// TODO: Some messages don't have text/plain mime type, but only text/html
// There is NPM module that converts HTML to TXT (https://www.npmjs.com/package/html-to-text)
// How to include NPM modules in extensions?
function processParts(parts) {

    let note = "";

    for (const part of parts) {
    	if (part.parts) {
            note += processParts(part.parts);
    	} else {
            console.log(part.contentType);
            if (part.contentType == "text/plain") {
                note += part.body;
            }
        }
    }

    return note;
}

async function processMessage(message, index, array) {
    let pluginData = await browser.storage.sync.get();

    var req = new XMLHttpRequest();

    console.log(pluginData['everdo_api_url'])
    console.log(pluginData['everdo_api_key'])
    req.open("POST", pluginData['everdo_api_url'] + "/api/items?key=" + pluginData['everdo_api_key'], true);

    req.setRequestHeader("Content-Type", "application/json");
    req.addEventListener("timeout", function(event) {
      console.log("timeout");
    });
    req.addEventListener("error", function(event) {
      console.log("error: " + req.status);
    });

    title = pluginData['task_title'].replace(/%S/, message.subject).replace(/%A/, message.author).replace(/%D/, message.date);
    note = pluginData['task_template'].replace(/%S/, message.subject).replace(/%A/, message.author).replace(/%D/, message.date);

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

    await req.send('{"title": "' + title + '", "note": ' + JSON.stringify(note) + ' }');
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

