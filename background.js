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

    var req = new XMLHttpRequest();

    req.open("POST", EVERDO_URL.everdo_api_url + "/api/items?key=" + EVERDO_KEY.everdo_api_key, true);

    req.setRequestHeader("Content-Type", "application/json");
    req.addEventListener("timeout", function() {
      console.log("timeout");
    });
    req.addEventListener("error", function() {
      console.log("error");
    });

    note = "----------------------------------------------------------------\n";
    note += "Author: " + message.author + "\n";
    note += "Subject: " + message.subject + "\n";
    note += "Date: " + message.date + "\n";

    if (message.recipients.length > 0) {
        note += "Recipients: ";
        for (const recipient of message.recipients){
		note += recipient + ", ";
        }
	note += "\n";
    }

    if (message.ccList.length > 0) {
        note += "CC: ";
        for (const recipient of message.ccList){
		note += recipient + ", ";
        }
	note += "\n";
    }

    if (message.bccList.length > 0) {
        note += "BCC: ";
        for (const recipient of message.bccList){
		note += recipient + ", ";
        }
	note += "\n";
    }

    msg = await messenger.messages.getFull(message.id);
    console.log(msg);

    note += processParts(msg.parts);

    note += "----------------------------------------------------------------\n";

    req.send('{"title": "' + message.subject + '", "note": ' + JSON.stringify(note) + ' }');
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

/*
 * FETCH CONFIGURATION VALUES
 */
function onError(error) {
  console.log(`Error: ${error}`);
}

function onGotURL(item) {
  let url = "EVERDO_API_URL";
  if (item.everdo_api_url) {
    url = item.everdo_api_url;
  }
  EVERDO_API_URL = url;
  console.log("EVERDO API URL: " + EVERDO_API_URL);
}

function onGotKey(item) {
  let key = "EVERDO_API_KEY";
  if (item.everdo_api_key) {
    key = item.everdo_api_key;
  }
  EVERDO_API_KEY = key;
  console.log("EVERDO API KEY: " + EVERDO_API_KEY);
}

