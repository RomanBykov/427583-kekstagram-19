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
  function render(photosArr) {
    var picturesFragment = document.createDocumentFragment();

    while (picturesList.lastChild.tagName === 'A') {
      picturesList.removeChild(picturesList.lastChild);
    }

    for (var i = 0; i < photosArr.length; i++) {
      picturesFragment.appendChild(renderPhoto(photosArr[i]));
    }

    picturesList.appendChild(picturesFragment);
  }

  window.photos = {
    render: render
  };

})();
