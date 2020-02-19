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

  function removeErrorMessageCloseListeners() {
    var errorElement = pageMain.querySelector('.error');
    errorElement.removeEventListener('click', errorMessageCloseClickHandler);
    document.removeEventListener('keydown', errorMessageEscapePressHandler);
    pageMain.removeChild(errorElement);
  }

  function errorMessageEscapePressHandler(evt) {
    if (evt.keyCode === ESCAPE_KEY) {
      removeErrorMessageCloseListeners();
    }
  }

  function errorMessageCloseClickHandler() {
    removeErrorMessageCloseListeners();
  }

  function renderErrorMessage(errorMessage) {
    var errorElement = errorTemplate.cloneNode(true);
    var errorFragment = document.createDocumentFragment();

    errorElement.querySelector('.error__title').textContent = errorMessage;
    errorElement.addEventListener('click', errorMessageCloseClickHandler);
    document.addEventListener('keydown', errorMessageEscapePressHandler);
    errorFragment.appendChild(errorElement);

    pageMain.appendChild(errorFragment);
  }

  function renderSuccessMessage() {
    var successElement = successTemplate.cloneNode(true);
    var successFragment = document.createDocumentFragment();

    // successElement.addEventListener('click', errorMessageCloseClickHandler);
    // document.addEventListener('keydown', errorMessageEscapePressHandler);
    successFragment.appendChild(successElement);

    pageMain.appendChild(successFragment);
  }


  function makeRequest(succesHandler, errorHandler) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = TIMEOUT_IN_MS;

    xhr.addEventListener('load', function () {
      if (xhr.status === SUCCESS_CODE) {
        succesHandler(xhr.response);
        renderSuccessMessage();
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
    renderErrorMessage: renderErrorMessage
  };

})();
