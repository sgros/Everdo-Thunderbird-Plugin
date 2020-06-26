function saveOptions(e) {
  e.preventDefault();
  browser.storage.sync.set({
    everdo_api_url: document.querySelector("#everdo_api_url").value,
    everdo_api_key: document.querySelector("#everdo_api_key").value,
    task_title: document.querySelector("#task_title").value,
    task_template: document.querySelector("#task_template").value
  });
}

function restoreOptions() {

  function setEverdoAPIURL(result) {
    document.querySelector("#everdo_api_url").value = result.everdo_api_url || "<INSERT EVERDO URL>";
  }

  function setEverdoAPIKey(result) {
    document.querySelector("#everdo_api_key").value = result.everdo_api_key || "<INSERT EVERDO KEY>";
  }

  function setTaskTitle(result) {
    document.querySelector("#task_title").value = result.task_title || "";
  }

  function setTaskTemplate(result) {
    document.querySelector("#task_template").value = result.task_template || "";
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  let gettingUrl = browser.storage.sync.get("everdo_api_url");
  gettingUrl.then(setEverdoAPIURL, onError);
  let gettingKey = browser.storage.sync.get("everdo_api_key");
  gettingKey.then(setEverdoAPIKey, onError);
  let gettingTaskTitle = browser.storage.sync.get("task_title");
  gettingTaskTitle.then(setTaskTitle, onError);
  let gettingTaskTemplate = browser.storage.sync.get("task_template");
  gettingTaskTemplate.then(setTaskTemplate, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
