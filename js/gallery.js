'use strict';

(function () {
  var ENTER_KEY = 13;
  var pageBody = document.querySelector('body');
  var picturesList = pageBody.querySelector('.pictures');
  var imgFilters = pageBody.querySelector('.img-filters');
  var imgFiltersBtns = imgFilters.querySelectorAll('.img-filters__button');
  var commentsLoaderBtn = pageBody.querySelector('.social__comments-loader');
  var loadedPhotos = [];
  var bigPhotoComments = [];

  function openBigPhoto(bigPhoto) {
    bigPhotoComments = window.comments.getAll(bigPhoto);

    window.preview.render(bigPhoto);
    window.comments.render(bigPhoto.comments);
    window.preview.show();
  }

  function commentsLoaderClickhandler() {
    window.comments.renderMore(bigPhotoComments);
  }

  function addPicturesHandlers(element) {
    element.addEventListener('click', pictureClickHandler);
    element.addEventListener('keydown', picturePressHandler);
  }

  function removePicturesHandlers(element) {
    element.removeEventListener('click', pictureClickHandler);
    element.removeEventListener('keydown', picturePressHandler);
  }

  function picturePressHandler(evt) {
    var target = evt.target;

    if (evt.keyCode === ENTER_KEY) {
      if (target.classList.contains('picture')) {
        var targetImg = target.querySelector('.picture__img');
        var bigPhoto = window.preview.getData(targetImg, loadedPhotos);
        openBigPhoto(bigPhoto);
      }
    }
  }

  function pictureClickHandler(evt) {
    var target = evt.target;

    if (target.classList.contains('picture__img')) {
      var bigPhoto = window.preview.getData(target, loadedPhotos);
      openBigPhoto(bigPhoto);
    }
  }

  function loadErrorHandler(errorMessage) {
    window.server.renderErrorMessage(errorMessage);
  }

  function loadSucceshandler(photos) {
    loadedPhotos = photos;
    window.photos.render(photos);
    imgFilters.classList.remove('img-filters--inactive');
  }

  function showDefaultPhotos() {
    window.photos.render(loadedPhotos);
  }

  function showRandomPhotos() {
    var randomPhotos = loadedPhotos.slice();
    window.util.shuffle(randomPhotos);
    var tenRandomPhotos = randomPhotos.slice(0, 10);
    window.photos.render(tenRandomPhotos);
  }

  function showDiscussedPhotos() {
    var sortedPhotos = loadedPhotos.slice();

    sortedPhotos.sort(function (leftPhoto, rightPhoto) {
      var leftComments = leftPhoto.comments.length;
      var rightComments = rightPhoto.comments.length;

      return rightComments - leftComments;
    });

    window.photos.render(sortedPhotos);
  }

  function changeActiveFilterBtn(newFilterBtn) {
    imgFiltersBtns.forEach(function (btn) {
      btn.classList.remove('img-filters__button--active');
    });
    newFilterBtn.classList.add('img-filters__button--active');
  }

  function filterClickhandler(evt) {
    var target = evt.target;

    if (target.tagName === 'BUTTON') {
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
          changeActiveFilterBtn(target);
          break;
      }
    }
  }

  function initGallery() {
    window.server.load(loadSucceshandler, loadErrorHandler);
    addPicturesHandlers(picturesList);
    imgFilters.addEventListener('click', filterClickhandler);
    commentsLoaderBtn.addEventListener('click', commentsLoaderClickhandler);
  }

  initGallery();

  window.gallery = {
    removePicturesHandlers: removePicturesHandlers,
    addPicturesHandlers: addPicturesHandlers
  };

})();
