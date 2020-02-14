'use strict';

(function () {
  var EFFECT_PIN_OFFSET = 9;
  var MIN_SCALE_SIZE = 25;
  var MAX_SCALE_SIZE = 100;
  var SCALE_STEP = 25;
  var MAX_PIN_POSITION = 453;
  var MIN_PIN_POSITION = 0;
  var MAX_EFFECT_LEVEL = 100;
  var imgUpload = document.querySelector('.img-upload');
  var effectLevelPin = imgUpload.querySelector('.effect-level__pin');
  var effectLevelLine = imgUpload.querySelector('.effect-level__line');
  var effectsList = imgUpload.querySelector('.effects__list');
  var effectLevelValue = imgUpload.querySelector('.effect-level__value');
  var effectLevelDepth = imgUpload.querySelector('.effect-level__depth');
  var effectLevel = imgUpload.querySelector('.effect-level');
  var imgUploadPreview = imgUpload.querySelector('.img-upload__preview');
  var imgUploadPreviewImg = imgUploadPreview.querySelector('img');
  var imgUploadScale = imgUpload.querySelector('.scale');
  var scaleControlValue = imgUploadScale.querySelector('.scale__control--value');
  var scaleSmallerBtn = imgUploadScale.querySelector('.scale__control--smaller');
  var scaleBiggerBtn = imgUploadScale.querySelector('.scale__control--bigger');

  function getEffectLevel() {
    var lineCoords = window.common.getCoords(effectLevelLine);
    var pinCoords = window.common.getCoords(effectLevelPin);

    return Math.round((pinCoords.left + EFFECT_PIN_OFFSET - lineCoords.left) * 100 / lineCoords.width);
  }

  function getNewPosition(shiftValue) {
    var position = effectLevelPin.offsetLeft - shiftValue.x;

    if (position > MAX_PIN_POSITION) {
      position = MAX_PIN_POSITION;
    } else if (position < MIN_PIN_POSITION) {
      position = MIN_PIN_POSITION;
    }

    return position + 'px';
  }

  function pinMoveHandler(evt) {
    evt.preventDefault();

    var isDragged = false;

    var startCoords = {
      x: evt.clientX
    };

    function mouseMoveHandler(moveEvt) {
      moveEvt.preventDefault();

      isDragged = true;

      var shift = {
        x: startCoords.x - moveEvt.clientX
      };

      startCoords = {
        x: moveEvt.clientX
      };

      effectLevelPin.style.left = getNewPosition(shift);
      setEffect();
    }

    function mouseUpHandler(upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);

      function pinClickPreventDefaultHandler(clickEvt) {
        clickEvt.preventDefault();

        effectLevelPin.removeEventListener('click', pinClickPreventDefaultHandler);
      }

      if (isDragged) {
        effectLevelPin.addEventListener('click', pinClickPreventDefaultHandler);
      }
    }

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  }

  function addEffect(effect, isDefault) {
    var effectLevelNumber = getEffectLevel();

    if (isDefault) {
      effectLevelNumber = MAX_EFFECT_LEVEL;
      effectLevelPin.style.left = '100%';
    }

    effectLevelValue.value = effectLevelNumber;
    effectLevelDepth.style.width = effectLevelNumber + '%';
    imgUploadPreview.style.filter = effect;

    return effect === 'none' ? effectLevel.classList.add('hidden') : effectLevel.classList.remove('hidden');
  }

  function setEffect(isDefault) {
    var checkedFilter = effectsList.querySelector('.effects__radio:checked');
    var filterName = checkedFilter.value;
    var effectValue = isDefault ? MAX_EFFECT_LEVEL : effectLevelValue.value;

    switch (filterName) {
      case 'chrome':
        addEffect('grayscale(' + (effectValue * 0.01) + ')', isDefault);
        break;
      case 'sepia':
        addEffect('sepia(' + (effectValue * 0.01) + ')', isDefault);
        break;
      case 'marvin':
        addEffect('invert(' + effectValue + '%)', isDefault);
        break;
      case 'phobos':
        addEffect('blur(' + effectValue * 0.03 + 'px)', isDefault);
        break;
      case 'heat':
        addEffect('brightness(' + Number(effectValue * 0.02 + 1) + ')', isDefault);
        break;
      case 'none':
        addEffect('none');
        break;
    }
  }

  function effectClickHandler(evt) {
    if (evt.target.tagName === 'INPUT') {
      setEffect(true);
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
    var target = evt.target;

    if (target.classList.contains('scale__control') && target.tagName === 'BUTTON') {
      scaleImage(target);
    }
  }

  effectsList.addEventListener('click', effectClickHandler);
  effectLevelPin.addEventListener('mousedown', pinMoveHandler);
  imgUploadScale.addEventListener('click', scaleBtnClickHandler);
})();
