'use strict';

(function () {
  var pageBody = document.querySelector('body');
  var picturesList = pageBody.querySelector('.pictures');
  var loadedPhotos = {};

  function picturePressHandler(evt) {
    var target = evt.target;

    if (evt.keyCode === window.common.ENTER_KEY) {
      if (target.classList.contains('picture')) {
        var targetImg = target.querySelector('.picture__img');
        window.preview.openBigPhoto(targetImg, loadedPhotos);
      }
    }
  }

  function pictureClickHandler(evt) {
    var target = evt.target;

    if (target.classList.contains('picture__img')) {
      window.preview.openBigPhoto(target, loadedPhotos);
    }
  }

  function loadErrorHandler(errorMessage) {
    window.server.renderErrorMessage(errorMessage);
  }

  function loadSucceshandler(photos) {
    loadedPhotos = photos;
    window.render.renderPhotos(photos);
  }

  function removePicturesHandlers(element) {
    element.removeEventListener('click', pictureClickHandler);
    element.removeEventListener('keydown', picturePressHandler);
  }

  function addPicturesHandlers(element) {
    element.addEventListener('click', pictureClickHandler);
    element.addEventListener('keydown', picturePressHandler);
  }

  function initGallery() {
    window.server.load(loadSucceshandler, loadErrorHandler);
    addPicturesHandlers(picturesList);
  }

  initGallery();

  window.gallery = {
    removePicturesHandlers: removePicturesHandlers,
    addPicturesHandlers: addPicturesHandlers
  };

})();
