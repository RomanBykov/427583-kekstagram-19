'use strict';

(function () {
  var pageBody = document.querySelector('body');
  var pictureTemplate = pageBody.querySelector('#picture').content.querySelector('.picture');
  var picturesList = pageBody.querySelector('.pictures');
  var loadedPhotos = {};

  // Рендерит фотографию на основе данных из массива
  function renderPhoto(photo) {
    var photoElement = pictureTemplate.cloneNode(true);

    photoElement.querySelector('.picture__img').src = photo.url;
    photoElement.querySelector('.picture__likes').textContent = photo.likes;
    photoElement.querySelector('.picture__comments').textContent = photo.comments.length;

    return photoElement;
  }

  // Вставляет отрендеренные фотографии на страницу
  function insertPhotosOnPage(photosArr) {
    var picturesFragment = document.createDocumentFragment();

    for (var i = 0; i < photosArr.length; i++) {
      picturesFragment.appendChild(renderPhoto(photosArr[i]));
    }

    picturesList.appendChild(picturesFragment);
  }

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

  function getLoadedPhotos(photosFromServer) {
    loadedPhotos = photosFromServer;

    return loadedPhotos;
  }

  function loadSucceshandler(photos) {
    getLoadedPhotos(photos);
    insertPhotosOnPage(photos);
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
    window.server.load(loadSucceshandler);
    addPicturesHandlers(picturesList);
  }

  initGallery();

  window.gallery = {
    removePicturesHandlers: removePicturesHandlers,
    addPicturesHandlers: addPicturesHandlers
  };

})();
