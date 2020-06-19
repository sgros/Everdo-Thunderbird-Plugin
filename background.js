console.log("START");

async function processMessage(message, index, array) {
    console.log("processMessage() STARTED");
    console.log(message);

    console.log("FETCHING URL");
    let gettingUrl = browser.storage.sync.get("everdo_api_url");
    EVERDO_URL = await gettingUrl;

    console.log("FETCHING KEY");
    let gettingKey = await browser.storage.sync.get("everdo_api_key");
    EVERDO_KEY = await gettingKey;

    var req = new XMLHttpRequest();

    req.open("POST", EVERDO_URL.everdo_api_url + "/api/items?key=" + EVERDO_KEY.everdo_api_key, true);
    console.log(EVERDO_URL.everdo_api_url + "/api/items?key=" + EVERDO_KEY.everdo_api_key);
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
    console.log('{"title": "' + message.subject + '", "note": "<b>Example</b>" }');
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

