function saveOptions(e) {
  e.preventDefault();
  browser.storage.sync.set({
    everdo_api_url: document.querySelector("#everdo_api_url").value,
    everdo_api_key: document.querySelector("#everdo_api_key").value
  });
}

function restoreOptions() {

  function setEverdoAPIURL(result) {
    document.querySelector("#everdo_api_url").value = result.everdo_api_url || "<INSERT EVERDO URL>";
  }

  function setEverdoAPIKey(result) {
    document.querySelector("#everdo_api_key").value = result.everdo_api_key || "<INSERT EVERDO KEY>";
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  let gettingUrl = browser.storage.sync.get("everdo_api_url");
  gettingUrl.then(setEverdoAPIURL, onError);
  let gettingKey = browser.storage.sync.get("everdo_api_key");
  gettingKey.then(setEverdoAPIKey, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
