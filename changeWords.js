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

const gettingStoredSettings = browser.storage.local.get();
gettingStoredSettings.then(checkStoredSettings, onError);
