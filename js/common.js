'use strict';

(function () {
  var ENTER_KEY = 13;
  var ESCAPE_KEY = 27;

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }

    return arr;
  }

  function getRandomArray(arr) {
    shuffle(arr);
    var randomArr = arr.slice(0, getRandomInt(1, arr.length - 1));

    return randomArr;
  }

  function removeElementsFromParrent(parrentElement) {
    while (parrentElement.firstChild) {
      parrentElement.removeChild(parrentElement.firstChild);
    }
  }

  function getCoords(element) {
    var box = element.getBoundingClientRect();

    return {
      left: Math.round(box.left + pageXOffset),
      width: Math.round(box.width)
    };
  }

  window.common = {
    getRandomInt: getRandomInt,
    getRandomArray: getRandomArray,
    removeElementsFromParrent: removeElementsFromParrent,
    ENTER_KEY: ENTER_KEY,
    ESCAPE_KEY: ESCAPE_KEY,
    getCoords: getCoords
  };

})();
