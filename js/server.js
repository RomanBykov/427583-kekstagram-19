'use strict';

(function () {
  var URL = 'https://js.dump.academy/kekstagram/';
  var TIMEOUT_IN_MS = 10000;
  var SUCCESS_CODE = 200;
  var pageBody = document.querySelector('body');
  var errorMessageStyle = 'z-index: 100; margin: 0 auto; padding: 12px; text-align: center; background-color: red; position: absolute; left: 0; right: 0; font-size: 30px;';

  function errorHandler(errorMessage) {
    var errorMessageElement = document.createElement('div');
    errorMessageElement.style = errorMessageStyle;
    errorMessageElement.textContent = errorMessage;
    pageBody.insertAdjacentElement('afterbegin', errorMessageElement);
  }

  function makeRequest(succesHandler) {
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

  function load(succesHandler) {
    var xhr = makeRequest(succesHandler);

    xhr.open('GET', URL + 'data');
    xhr.send();
  }

  function save(data, succesHandler) {
    var xhr = makeRequest(succesHandler);

    xhr.open('POST', URL);
    xhr.send(data);
  }

  window.server = {
    load: load,
    save: save
  };

})();
