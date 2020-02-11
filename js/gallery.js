'use strict';

(function () {
  var pageBody = document.querySelector('body');
  var pictureTemplate = pageBody.querySelector('#picture').content.querySelector('.picture');
  var picturesList = pageBody.querySelector('.pictures');

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
        window.preview.openBigPhoto(targetImg);
      }
    }
  }

  function pictureClickHandler(evt) {
    var target = evt.target;
    if (target.classList.contains('picture__img')) {
      window.preview.openBigPhoto(target);
    }
  }

  picturesList.addEventListener('click', pictureClickHandler);
  picturesList.addEventListener('keydown', picturePressHandler);
  insertPhotosOnPage(window.data.photos);

  window.gallery = {
    pictureClickHandler: pictureClickHandler,
    picturePressHandler: picturePressHandler
  };
})();
