/*
Default settings. Initialize storage to these values.
*/
// var savedString =
// {
//   wordIn: "wordIn",
//   wordOut: "wordOut"
// }

if (window.addEventListener) {
  window.addEventListener("load", init, false);
} else if (window.attachEvent) {
  window.attachEvent("onload", init);
} else {
  document.addEventListener("load", init, false);
}

String.prototype.replaceWithCase=function(subStr, newStr)
{
  return this.replace( new RegExp(subStr, 'ig'), function(found)
  {
    return /[A-Z]/.test(found.charAt(0))?( newStr.charAt(0).toUpperCase() + newStr.substring(1) ) : newStr.toLowerCase();
  } );
}

function totalReplace(wordIn, wordOut)
{
  document.body.innerHTML = document.body.innerHTML.replaceWithCase(wordIn, wordOut);
}

function initialize()
{
  var gettingAllStorageItems = browser.storage.local.get(null);
  gettingAllStorageItems.then((results) =>
  {
    var wordKeys = Object.keys(results);
    for (let wordKey of wordKeys)
    {
      var curValue = results[wordKey]; // wordOut
      var regexExpression = "\\b(" + wordKey + ")\\b"; // wordIn
      var currentRegex = new RegExp(regexExpression, "g"); // wordIn
      totalReplace(currentRegex, curValue);
    }
  }, onError);
}

function init()
{
  initialize();
}

/*
Generic error logger.
*/
function onError(e)
{
  console.error(e);
}

/*
On startup, check whether we have stored settings.
If we don't, then store the default settings.
*/
// function checkStoredSettings(storedSettings) {
//   if (!storedSettings.savedString) {
//     browser.storage.local.set({savedString});
//   }
// }

const gettingStoredSettings = browser.storage.local.get();
gettingStoredSettings.then(checkStoredSettings, onError);
