/* initialise variables */

var inputWordIn = document.querySelector('.wordIn');
var inputWordOut = document.querySelector('.wordOut');

var wordContainer = document.querySelector('.word-container');

var clearBtn = document.querySelector('.clear');
var addBtn = document.querySelector('.add');

/*  add event listeners to buttons */
addBtn.addEventListener('click', addWord);
clearBtn.addEventListener('click', clearAll);

/* generic error handler */
function onError(error) {
  console.log(error);
}

/* display previously-saved stored words on startup */
initialize();

function initialize() {
  var gettingAllStorageItems = browser.storage.local.get(null);
  gettingAllStorageItems.then((results) => {
    var wordKeys = Object.keys(results);
    for (let wordKey of wordKeys) {
      var curValue = results[wordKey];
      displayWord(wordKey, curValue);
    }
  }, onError);
}

/* Add a word to the display, and storage */
function addWord() {
  var wordIn = inputWordIn.value;
  var wordOut = inputWordOut.value;
  var gettingItem = browser.storage.local.get(wordIn);
  gettingItem.then((result) => {
    var objTest = Object.keys(result);
    if (objTest.length < 1 && wordIn !== '' && wordOut !== '') {
      storeWord(wordIn, wordOut);
      inputWordIn.value = '';
      inputWordOut.value = '';
    }
  }, onError);
}

/* function to store a new word in storage */
function storeWord(wordIn, wordOut) {
  var storingWord = browser.storage.local.set({
    [wordIn]: wordOut
  });
  storingWord.then(() => {
    displayWord(wordIn, wordOut);
  }, onError);
}

/* function to display a word in the word box */
function displayWord(wordIn, wordOut) {

  /* create word display box */
  var word = document.createElement('div');
  var wordDisplay = document.createElement('div');
  var wordH = document.createElement('p');
  var wordPara = document.createElement('p');
  var deleteBtn = document.createElement('button');
  var clearFix = document.createElement('div');


  word.setAttribute('class', 'word');
  wordDisplay.setAttribute('class', 'word-line2');

  wordH.textContent = wordIn;
  wordPara.textContent = wordOut;
  deleteBtn.setAttribute('class', 'clear');
  deleteBtn.textContent = 'Delete word';
  clearFix.setAttribute('class', 'clearfix');

  wordDisplay.appendChild(wordH);
  wordDisplay.appendChild(wordPara);
  wordDisplay.appendChild(deleteBtn);
  wordDisplay.appendChild(clearFix);

  word.appendChild(wordDisplay);

  /* set up listener for the delete functionality */
  deleteBtn.addEventListener('click', (e) => {
    const evtTgt = e.target;
    evtTgt.parentNode.parentNode.parentNode.removeChild(evtTgt.parentNode.parentNode);
    browser.storage.local.remove(wordIn);
  })

  /* create word edit box */
  var wordEdit = document.createElement('div');
  var wordInEdit = document.createElement('input');
  var wordOutEdit = document.createElement('input');
  var clearFix2 = document.createElement('div');

  var updateBtn = document.createElement('button');
  var cancelBtn = document.createElement('button');

  updateBtn.setAttribute('class', 'update');
  updateBtn.textContent = 'Update word';
  cancelBtn.setAttribute('class', 'cancel');
  cancelBtn.textContent = 'Cancel update';

  wordEdit.appendChild(wordInEdit);
  wordInEdit.value = wordIn;
  wordEdit.appendChild(wordOutEdit);
  wordOutEdit.textContent = wordOut;
  wordEdit.appendChild(updateBtn);
  wordEdit.appendChild(cancelBtn);

  wordEdit.appendChild(clearFix2);
  clearFix2.setAttribute('class', 'clearfix');

  word.appendChild(wordEdit);

  wordContainer.appendChild(word);
  wordEdit.style.display = 'none';

  /* set up listeners for the update functionality */

  wordH.addEventListener('click', () => {
    wordDisplay.style.display = 'none';
    wordEdit.style.display = 'inline-flex';
  })

  wordPara.addEventListener('click', () => {
    wordDisplay.style.display = 'none';
    wordEdit.style.display = 'inline-flex';
  })

  cancelBtn.addEventListener('click', () => {
    wordDisplay.style.display = 'block';
    wordEdit.style.display = 'none';
    wordInEdit.value = wordIn;
    wordOutEdit.value = wordOut;
  })

  updateBtn.addEventListener('click', () => {
    if (wordInEdit.value !== wordIn || wordOutEdit.value !== wordOut) {
      updateWord(wordIn, wordInEdit.value, wordOutEdit.value);
      word.parentNode.removeChild(word);
    }
  });
}


/* function to update words */

function updateWord(delWord, newWordIn, newWordOut) {
  var storingWord = browser.storage.local.set({
    [newWordIn]: newWordOut
  });
  storingWord.then(() => {
    if (delWord !== newWordIn) {
      var removingWord = browser.storage.local.remove(delWord);
      removingWord.then(() => {
        displayWord(newWordIn, newWordOut);
      }, onError);
    } else {
      displayWord(newWordIn, newWordOut);
    }
  }, onError);
}

/* Clear all words from the display/storage */

function clearAll() {
  while (wordContainer.firstChild) {
    wordContainer.removeChild(wordContainer.firstChild);
  }
  browser.storage.local.clear();
}
