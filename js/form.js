'use strict';

(function () {
  var MAX_HASHTAGS_LENGTH = 5;
  var MAX_HASHTAG_LENGTH = 20;
  var ERROR_MESSAGE = {
    doubleHashtag: 'один и тот же хэш-тег не может быть использован дважды',
    maxCount: 'нельзя указать больше пяти хэш-тегов',
    badFirstSymbol: 'хэш-тег начинается с символа # (решётка)',
    maxLength: 'максимальная длина одного хэш-тега 20 символов, включая решётку',
    minLength: 'хеш-тег не может состоять только из одной решётки',
    badInputs: 'строка после решётки должна состоять из букв и чисел и не может содержать пробелы, спецсимволы (#, @, $ и т.п.), символы пунктуации (тире, дефис, запятая и т.п.), эмодзи и т.д.;',
    maxDescriptionLength: 'длина комментария не может составлять больше 140 символов',
    noError: ''
  };
  var pageBody = document.querySelector('body');
  var picturesList = pageBody.querySelector('.pictures');
  var imgUpload = document.querySelector('.img-upload');
  var imgUploadOverlay = imgUpload.querySelector('.img-upload__overlay');
  var closeEditBtn = imgUpload.querySelector('.img-upload__cancel');
  var hashtagInput = imgUpload.querySelector('.text__hashtags');
  var imgUploadDescription = imgUpload.querySelector('.text__description');
  var uploadFile = imgUpload.querySelector('#upload-file');
  var effectLevel = imgUpload.querySelector('.effect-level');
  var imgUploadPreview = imgUpload.querySelector('.img-upload__preview');
  var originalFilter = imgUpload.querySelector('#effect-none');

  function clearInputValue(inputElement) {
    inputElement.value = '';
  }

  function uploadChangeHandler() {
    openEditingPopup();
  }

  function closePopupClickHandler() {
    closeEditingPopup();
  }

  function closePopupPressHandler(evt) {
    if (evt.keyCode === window.common.ENTER_KEY) {
      closeEditingPopup();
    }
  }

  function escapePressHandler(evt) {
    var target = evt.target;
    if (evt.keyCode === window.common.ESCAPE_KEY && target !== hashtagInput && target !== imgUploadDescription) {
      closeEditingPopup();
    }
  }

  function uploadFormSubmitHandler() {
    validateHashtags();
    imgUploadDescription.addEventListener('error', descritionErrorHandler);
  }

  // Проверяет на дубликаты хештегов
  function checkHashtagRepeats(array) {
    var hasRepeats = array.some(function (item, position) {
      return array.indexOf(item.toLowerCase()) !== position;
    });
    return hasRepeats;
  }

  // Проверяет текущий хештег, их количество и наличие дубликатов
  function validateHashtagItem(hashtags) {
    var hasRepeats = checkHashtagRepeats(hashtags);

    hashtags.forEach(function (hashtag) {
      switch (true) {
        case hasRepeats:
          hashtagInput.setCustomValidity(ERROR_MESSAGE.doubleHashtag);
          break;
        case hashtags.length > MAX_HASHTAGS_LENGTH:
          hashtagInput.setCustomValidity(ERROR_MESSAGE.maxCount);
          break;
        case hashtag === '':
          hashtagInput.setCustomValidity(ERROR_MESSAGE.noError);
          break;
        case (hashtag.length > 1 && hashtag.charAt(0) !== '#'):
          hashtagInput.setCustomValidity(ERROR_MESSAGE.badFirstSymbol);
          break;
        case (hashtag.length > MAX_HASHTAG_LENGTH):
          hashtagInput.setCustomValidity(ERROR_MESSAGE.maxLength);
          break;
        case (hashtag.length < 2 && hashtag.charAt(0) === '#'):
          hashtagInput.setCustomValidity(ERROR_MESSAGE.minLength);
          break;
        case (!hashtag.substring(1).match(/^[a-zа-я0-9]/gi, '')):
          hashtagInput.setCustomValidity(ERROR_MESSAGE.badInputs);
          break;
        default:
          hashtagInput.setCustomValidity(ERROR_MESSAGE.noError);
      }
    });
  }

  // Проверяет все хештеги
  function validateHashtags() {
    var hashtags = hashtagInput.value.split(' ');

    return hashtags.length > 0 ? validateHashtagItem(hashtags) : hashtagInput.setCustomValidity(ERROR_MESSAGE.noError);
  }

  function descritionErrorHandler(evt) {
    var target = evt.target;

    return target.validity.tooLong ? imgUploadDescription.setCustomValidity(ERROR_MESSAGE.maxDescriptionLength) : imgUploadDescription.setCustomValidity(ERROR_MESSAGE.noError);
  }

  function setImageToDefault() {
    originalFilter.checked = true;
    imgUploadPreview.style.filter = 'none';
    effectLevel.classList.add('hidden');
  }

  function openEditingPopup() {
    setImageToDefault();
    imgUploadOverlay.classList.remove('hidden');

    closeEditBtn.addEventListener('click', closePopupClickHandler);
    closeEditBtn.addEventListener('keydown', closePopupPressHandler);
    document.addEventListener('keydown', escapePressHandler);

    picturesList.removeEventListener('click', window.gallery.pictureClickHandler);
    picturesList.removeEventListener('keydown', window.gallery.picturePressHandler);
  }

  function closeEditingPopup() {
    imgUploadOverlay.classList.add('hidden');
    clearInputValue(uploadFile);
    closeEditBtn.removeEventListener('click', closePopupClickHandler);
    closeEditBtn.removeEventListener('keydown', closePopupPressHandler);
    document.removeEventListener('keydown', escapePressHandler);

    picturesList.addEventListener('click', window.gallery.pictureClickHandler);
    picturesList.addEventListener('keydown', window.gallery.picturePressHandler);
  }

  hashtagInput.addEventListener('input', uploadFormSubmitHandler);
  uploadFile.addEventListener('change', uploadChangeHandler);

})();
