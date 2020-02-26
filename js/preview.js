'use strict';

(function () {
  var ENTER_KEY = 13;
  var ESCAPE_KEY = 27;
  var pageBody = document.querySelector('body');
  var bigPicture = pageBody.querySelector('.big-picture');
  var bigPictureImg = bigPicture.querySelector('.big-picture__img');
  var bigPictureLikesCount = bigPicture.querySelector('.likes-count');
  var bigPictureCommentsCount = bigPicture.querySelector('.comments-count');
  var bigPictureCloseBtn = document.querySelector('.big-picture__cancel');

  // Рендерит фотографию крупным планом вместе с комментариями
  function render(bigPhoto) {
    bigPictureImg.querySelector('img').src = bigPhoto.url;
    bigPictureLikesCount.textContent = bigPhoto.likes;
    bigPictureCommentsCount.textContent = bigPhoto.comments.length;
    bigPicture.querySelector('.social__caption').textContent = bigPhoto.description;
  }

  function show() {
    pageBody.classList.add('modal-open');
    bigPicture.classList.remove('hidden');
    bigPictureCloseBtn.addEventListener('keydown', closeBigPhotoPressHandler);
    document.addEventListener('keydown', closeBigPhotoEscPressHandler);
    bigPictureCloseBtn.addEventListener('click', closeBigPhotoBtnClickhandler);
  }

  function getData(element, loadedData) {
    var currentPhotoID = element.src.split('photos/')[1];
    var photoId = currentPhotoID.substring(0, currentPhotoID.length - 4) - 1;

    return loadedData[photoId];
  }


  function closeBigPhotoEscPressHandler(evt) {
    if (evt.keyCode === ESCAPE_KEY) {
      closeBigPhoto();
    }
  }

  function closeBigPhotoPressHandler(evt) {
    if (evt.keyCode === ENTER_KEY) {
      closeBigPhoto();
    }
  }

  function closeBigPhotoBtnClickhandler() {
    closeBigPhoto();
  }

  function closeBigPhoto() {
    pageBody.classList.remove('modal-open');
    bigPicture.classList.add('hidden');
    bigPictureCloseBtn.removeEventListener('keydown', closeBigPhotoPressHandler);
    document.removeEventListener('keydown', closeBigPhotoEscPressHandler);
    bigPictureCloseBtn.removeEventListener('click', closeBigPhotoBtnClickhandler);
  }

  window.preview = {
    show: show,
    getData: getData,
    render: render,
  };

})();
