'use strict';

(function () {
  var URL = 'https://js.dump.academy/kekstagram/';
  var TIMEOUT_IN_MS = 10000;
  var SUCCESS_CODE = 200;
  var ESCAPE_KEY = 27;
  var pageBody = document.querySelector('body');
  var pageMain = pageBody.querySelector('main');
  var errorTemplate = pageBody.querySelector('#error').content.querySelector('.error');
  var successTemplate = pageBody.querySelector('#success').content.querySelector('.success');

  function messageEscapePressHandler(evt) {
    if (evt.keyCode === ESCAPE_KEY) {
      removeMessageCloseListeners();
    }
  }

  function messageCloseClickHandler() {
    removeMessageCloseListeners();
  }

  function removeMessageCloseListeners() {
    document.removeEventListener('click', messageCloseClickHandler);
    document.removeEventListener('keydown', messageEscapePressHandler);

    if (pageMain.contains(pageMain.querySelector('.error'))) {
      pageMain.removeChild(pageMain.querySelector('.error'));
    }

    if (pageMain.contains(pageMain.querySelector('.success'))) {
      pageMain.removeChild(pageMain.querySelector('.success'));
    }
  }

  function addMessageListeners() {
    document.addEventListener('click', messageCloseClickHandler);
    document.addEventListener('keydown', messageEscapePressHandler);
  }

  function renderErrorMessage(errorMessage) {
    var errorElement = errorTemplate.cloneNode(true);
    var errorFragment = document.createDocumentFragment();

    errorElement.querySelector('.error__title').textContent = errorMessage;
    errorFragment.appendChild(errorElement);
    pageMain.appendChild(errorFragment);
    addMessageListeners();
  }

  function renderSuccessMessage() {
    var successElement = successTemplate.cloneNode(true);
    var successFragment = document.createDocumentFragment();

    successFragment.appendChild(successElement);
    pageMain.appendChild(successFragment);
    addMessageListeners();
  }

  function makeRequest(succesHandler, errorHandler) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = TIMEOUT_IN_MS;

    xhr.addEventListener('load', function () {
      if (xhr.status === SUCCESS_CODE) {
        succesHandler(xhr.response);
      } else {
        errorHandler('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      errorHandler('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      errorHandler('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    return xhr;
  }

  function load(succesHandler, errorHandler) {
    var xhr = makeRequest(succesHandler, errorHandler);

    xhr.open('GET', URL + 'data');
    xhr.send();
  }

  function save(data, succesHandler, errorHandler) {
    var xhr = makeRequest(succesHandler, errorHandler);

    xhr.open('POST', URL);
    xhr.send(data);
  }

  window.server = {
    load: load,
    save: save,
    renderErrorMessage: renderErrorMessage,
    renderSuccessMessage: renderSuccessMessage
  };

})();
