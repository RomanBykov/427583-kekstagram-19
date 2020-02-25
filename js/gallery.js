'use strict';

(function () {
  var ENTER_KEY = 13;
  var pageBody = document.querySelector('body');
  var picturesList = pageBody.querySelector('.pictures');
  var imgFilters = pageBody.querySelector('.img-filters');
  var imgFiltersBtns = imgFilters.querySelectorAll('.img-filters__button');
  var loadedPhotos = [];

  function picturePressHandler(evt) {
    var target = evt.target;

    if (evt.keyCode === ENTER_KEY) {
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
    imgFilters.classList.remove('img-filters--inactive');
  }

  function removePicturesHandlers(element) {
    element.removeEventListener('click', pictureClickHandler);
    element.removeEventListener('keydown', picturePressHandler);
  }

  function addPicturesHandlers(element) {
    element.addEventListener('click', pictureClickHandler);
    element.addEventListener('keydown', picturePressHandler);
  }

  function showDefaultPhotos() {
    window.render.renderPhotos(loadedPhotos);
  }

  function showRandomPhotos() {
    var randomPhotos = window.util.shuffle(loadedPhotos);
    var tenRandomPhotos = randomPhotos.slice(0, 10);
    window.render.renderPhotos(tenRandomPhotos);
  }

  function showDiscussedPhotos() {
    var sortedPhotos = loadedPhotos.slice();

    sortedPhotos.sort(function (leftPhoto, rightPhoto) {
      var leftComments = leftPhoto.comments.length;
      var rightComments = rightPhoto.comments.length;

      return rightComments - leftComments;
    });

    window.render.renderPhotos(sortedPhotos);
  }

  function changeActiveFilterBtn(newFilterBtn) {
    imgFiltersBtns.forEach(function (btn) {
      btn.classList.remove('img-filters__button--active');
    });
    newFilterBtn.classList.add('img-filters__button--active');
  }

  function filterClickhandler(evt) {
    var target = evt.target;

    switch (target.id) {
      case 'filter-discussed':
        window.debounce(showDiscussedPhotos);
        changeActiveFilterBtn(target);
        break;
      case 'filter-random':
        window.debounce(showRandomPhotos);
        changeActiveFilterBtn(target);
        break;
      default:
        window.debounce(showDefaultPhotos);
        changeActiveFilterBtn(imgFiltersBtns[0]);
        break;
    }
  }

  function initGallery() {
    window.server.load(loadSucceshandler, loadErrorHandler);
    addPicturesHandlers(picturesList);
    imgFilters.addEventListener('click', filterClickhandler);
  }

  initGallery();

  window.gallery = {
    removePicturesHandlers: removePicturesHandlers,
    addPicturesHandlers: addPicturesHandlers
  };

})();
