'use strict';

(function () {
  var EFFECT_PIN_OFFSET = 9;
  var MIN_SCALE_SIZE = 25;
  var MAX_SCALE_SIZE = 100;
  var SCALE_STEP = 25;
  var imgUpload = document.querySelector('.img-upload');
  var effectLevelPin = imgUpload.querySelector('.effect-level__pin');
  var effectLevelLine = imgUpload.querySelector('.effect-level__line');
  var effectsList = imgUpload.querySelector('.effects__list');
  var effectLevelValue = imgUpload.querySelector('.effect-level__value');
  var effectLevelDepth = imgUpload.querySelector('.effect-level__depth');
  var effectLevel = imgUpload.querySelector('.effect-level');
  var imgUploadPreview = imgUpload.querySelector('.img-upload__preview');
  var scaleControlValue = imgUpload.querySelector('.scale__control--value');
  var imgUploadPreviewImg = imgUploadPreview.querySelector('img');
  var scaleSmallerBtn = imgUpload.querySelector('.scale__control--smaller');
  var scaleBiggerBtn = imgUpload.querySelector('.scale__control--bigger');

  function getCoords(element) {
    var box = element.getBoundingClientRect();

    return {
      top: Math.round(box.top + pageYOffset),
      left: Math.round(box.left + pageXOffset),
      width: Math.round(box.width)
    };
  }

  function getEffectLevel() {
    var lineCoords = getCoords(effectLevelLine);
    var pinCoords = getCoords(effectLevelPin);

    return Math.round((pinCoords.left + EFFECT_PIN_OFFSET - lineCoords.left) * 100 / lineCoords.width);
  }

  function effectPinMouseupHandler() {
    getEffectLevel();
  }

  function setEffectDefault() {
    effectLevelPin.style.left = '100%';
    effectLevelValue.value = 100;
    effectLevelDepth.style.width = '100%';
  }

  function addEffect(effect) {
    imgUploadPreview.style.filter = effect;
    return effect === 'none' ? effectLevel.classList.add('hidden') : effectLevel.classList.remove('hidden');
  }

  function setEffect(element) {
    var target = element.classList;

    switch (true) {
      case target.contains('effects__preview--chrome'):
        addEffect('grayscale(1)');
        break;
      case target.contains('effects__preview--sepia'):
        addEffect('sepia(1)');
        break;
      case target.contains('effects__preview--marvin'):
        addEffect('invert(100%)');
        break;
      case target.contains('effects__preview--phobos'):
        addEffect('blur(3px)');
        break;
      case target.contains('effects__preview--heat'):
        addEffect('brightness(3)');
        break;
      case target.contains('effects__preview--none'):
        addEffect('none');
        break;
    }
  }

  function effectClickHandler(evt) {
    var target = evt.target;

    if (target.classList.contains('effects__preview')) {
      setEffectDefault();
      setEffect(target);
      getEffectLevel();
    }
  }

  // Увеличивает/уменьшает фотографию
  function scaleImage(scaleBtn) {
    var currentValue = scaleControlValue.value;
    var currentValueNumber = parseInt(currentValue.substring(0, currentValue.length - 1), 10);

    function setNewScale(number) {
      imgUploadPreviewImg.style.transform = 'scale(' + number * 0.01 + ')';
      scaleControlValue.value = number + '%';
    }

    if (scaleBtn === scaleSmallerBtn && currentValueNumber > MIN_SCALE_SIZE) {
      currentValueNumber -= SCALE_STEP;
      setNewScale(currentValueNumber);
    }

    if (scaleBtn === scaleBiggerBtn && currentValueNumber < MAX_SCALE_SIZE) {
      currentValueNumber += SCALE_STEP;
      setNewScale(currentValueNumber);
    }
  }

  function scaleBtnClickHandler(evt) {
    scaleImage(evt.target);
  }

  function startApp() {
    effectsList.addEventListener('click', effectClickHandler);
    effectLevelPin.addEventListener('mouseup', effectPinMouseupHandler);
    imgUpload.addEventListener('click', scaleBtnClickHandler);
  }

  startApp();
})();
