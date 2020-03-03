'use strict';

(function () {
  var MAX_HASHTAGS_LENGTH = 5;
  var MAX_HASHTAG_LENGTH = 20;
  var DEFAULT_IMAGE_VALUE = 100;
  var ErrorMessage = {
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
  var effectLevelValue = effectLevel.querySelector('.effect-level__value');
  var imgUploadPreview = imgUpload.querySelector('.img-upload__preview');
  var originalFilter = imgUpload.querySelector('#effect-none');
  var imgUploadForm = imgUpload.querySelector('.img-upload__form');

  function uploadChangeHandler() {
    openEditingPopup();
  }

  function closePopupClickHandler() {
    closeEditingPopup();
  }

  function closePopupPressHandler(evt) {
    if (evt.keyCode === window.util.ENTER_KEY) {
      closeEditingPopup();
    }
  }

  function escapePressHandler(evt) {
    var target = evt.target;
    if (evt.keyCode === window.util.ESCAPE_KEY && target !== hashtagInput && target !== imgUploadDescription) {
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

  function showValidityError(element, errorText) {
    element.setCustomValidity(errorText);
    element.classList.add('error-input');
  }

  function hideValidityError(element) {
    element.setCustomValidity(ErrorMessage.noError);
    element.classList.remove('error-input');
  }

  // Проверяет текущий хештег, их количество и наличие дубликатов
  function validateHashtagItem(hashtags) {
    var hasRepeats = checkHashtagRepeats(hashtags);

    hashtags.forEach(function (hashtag) {
      switch (true) {
        case hasRepeats:
          showValidityError(hashtagInput, ErrorMessage.doubleHashtag);
          break;
        case hashtags.length > MAX_HASHTAGS_LENGTH:
          showValidityError(hashtagInput, ErrorMessage.maxCount);
          break;
        case hashtag === '':
          showValidityError(hashtagInput, ErrorMessage.noError);
          break;
        case (hashtag.length > 1 && hashtag.charAt(0) !== '#'):
          showValidityError(hashtagInput, ErrorMessage.badFirstSymbol);
          break;
        case (hashtag.length > MAX_HASHTAG_LENGTH):
          showValidityError(hashtagInput, ErrorMessage.maxLength);
          break;
        case (hashtag.length < 2 && hashtag.charAt(0) === '#'):
          showValidityError(hashtagInput, ErrorMessage.minLength);
          break;
        case (!hashtag.substring(1).match(/^[a-zа-я0-9]/gi, '')):
          showValidityError(hashtagInput, ErrorMessage.badInputs);
          break;
        default:
          hideValidityError(hashtagInput);
          break;
      }
    });
  }

  // Проверяет все хештеги
  function validateHashtags() {
    var hashtags = hashtagInput.value.split(' ');

    return hashtags.length > 0 ? validateHashtagItem(hashtags) : hashtagInput.setCustomValidity(ErrorMessage.noError);
  }

  function descritionErrorHandler(evt) {
    var target = evt.target;

    return target.validity.tooLong ? showValidityError(imgUploadDescription, ErrorMessage.maxDescriptionLength) : hideValidityError(imgUploadDescription);
  }

  function setImageToDefault() {
    originalFilter.checked = true;
    imgUploadPreview.style.filter = 'none';
    effectLevel.classList.add('hidden');
    effectLevelValue.value = DEFAULT_IMAGE_VALUE;
    window.effects.setNewScale(DEFAULT_IMAGE_VALUE);
    hashtagInput.value = '';
    imgUploadDescription.value = '';
  }

  function openEditingPopup() {
    setImageToDefault();
    imgUploadOverlay.classList.remove('hidden');
    closeEditBtn.addEventListener('click', closePopupClickHandler);
    closeEditBtn.addEventListener('keydown', closePopupPressHandler);
    document.addEventListener('keydown', escapePressHandler);
    window.gallery.removePicturesHandlers(picturesList);
    uploadFileImage();
  }

  function uploadFileImage() {
    var reader = new FileReader();
    var file = uploadFile.files[0];
    var preview = imgUploadPreview.querySelector('img');

    function fileLoadHandler() {
      preview.src = reader.result;
      reader.removeEventListener('load', fileLoadHandler);
    }

    reader.addEventListener('load', fileLoadHandler);
    reader.readAsDataURL(file);
  }

  function closeEditingPopup() {
    setImageToDefault();
    imgUploadOverlay.classList.add('hidden');
    uploadFile.value = '';
    closeEditBtn.removeEventListener('click', closePopupClickHandler);
    closeEditBtn.removeEventListener('keydown', closePopupPressHandler);
    document.removeEventListener('keydown', escapePressHandler);
    window.gallery.addPicturesHandlers(picturesList);
  }

  function uploadErrorHandler(errorMessage) {
    window.server.renderErrorMessage(errorMessage);
    closeEditingPopup();
  }

  function succesUploadHandler(evt) {
    evt.preventDefault();
    window.server.save(new FormData(imgUploadForm), closeEditingPopup, uploadErrorHandler);
    window.server.renderSuccessMessage();
  }

  hashtagInput.addEventListener('input', uploadFormSubmitHandler);
  uploadFile.addEventListener('change', uploadChangeHandler);
  imgUploadForm.addEventListener('submit', succesUploadHandler);

})();
