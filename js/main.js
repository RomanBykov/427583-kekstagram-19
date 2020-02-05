'use strict';

var PHOTOS_LENGTH = 25;
var MIN_LIKES_NUMBER = 15;
var MAX_LIKES_NUMBER = 200;
var MIN_AVATAR_NUMBER = 1;
var MAX_AVATAR_NUMBER = 6;
var AVATAR_SIZE = 35;
var COMMENTS_LENGTH = 6;
var ENTER_KEY = 13;
var ESCAPE_KEY = 27;
var EFFECT_PIN_OFFSET = 9;

var messages = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];
var names = ['Элли', 'Крис', 'Джоел', 'Джошуа', 'Чак', 'Юэн'];
var usersComments = createUsersComments();

var imgUpload = document.querySelector('.img-upload');
var uploadFile = imgUpload.querySelector('#upload-file');
var imgUploadOverlay = imgUpload.querySelector('.img-upload__overlay');
var closeEditBtn = imgUpload.querySelector('.img-upload__cancel');
var effectLevelPin = imgUpload.querySelector('.effect-level__pin');
var effectLevelLine = imgUpload.querySelector('.effect-level__line');
var effectsList = imgUpload.querySelector('.effects__list');
var effectLevelValue = imgUpload.querySelector('.effect-level__value');
var effectLevelDepth = imgUpload.querySelector('.effect-level__depth');
var effectLevel = imgUpload.querySelector('.effect-level');
var imgUploadPreview = imgUpload.querySelector('.img-upload__preview');
var pageBody = document.querySelector('body');
var pictureTemplate = pageBody.querySelector('#picture').content.querySelector('.picture');
var picturesList = pageBody.querySelector('.pictures');
var bigPicture = pageBody.querySelector('.big-picture');
var bigPictureImg = bigPicture.querySelector('.big-picture__img');
var bigPictureLikesCount = bigPicture.querySelector('.likes-count');
var bigPictureCommentsCount = bigPicture.querySelector('.comments-count');
var bigPictureComments = bigPicture.querySelector('.social__comments');
var bigPictureSocialCommentCount = bigPicture.querySelector('.social__comment-count');
var bigPictureCommentsLoader = bigPicture.querySelector('.comments-loader');

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(arr) {
  for (var i = arr.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }

  return arr;
}

function getRandomArray(arr) {
  shuffle(arr);
  var randomArr = arr.slice(0, getRandomInt(1, arr.length - 1));

  return randomArr;
}

function removeElementsFromParrent(parrentElement) {
  while (parrentElement.firstChild) {
    parrentElement.removeChild(parrentElement.firstChild);
  }
}

// Создает фейковые комментарии
function createUsersComments() {
  var comments = [];

  for (var i = 0; i < COMMENTS_LENGTH; i++) {
    comments.push({
      avatar: 'img/avatar-' + getRandomInt(MIN_AVATAR_NUMBER, MAX_AVATAR_NUMBER) + '.svg',
      message: messages[getRandomInt(0, messages.length - 1)],
      name: names[getRandomInt(0, names.length - 1)]
    });
  }

  return comments;
}

// Создает фейковые фотографии
function createPhotos(arr) {
  for (var i = 1; i <= PHOTOS_LENGTH; i++) {
    arr.push({
      url: 'photos/' + i + '.jpg',
      description: 'Рандомная подпись',
      likes: getRandomInt(MIN_LIKES_NUMBER, MAX_LIKES_NUMBER),
      comments: getRandomArray(usersComments)
    });
  }

  return arr;
}

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

// Создает аватар для комментария
function createAvatarElement(user) {
  var avatar = document.createElement('img');

  avatar.classList.add('social__picture');
  avatar.src = user.avatar;
  avatar.alt = user.name;
  avatar.width = AVATAR_SIZE;
  avatar.height = AVATAR_SIZE;

  return avatar;
}

// Создает элемент комментария, куда входят аватар и текст
function createCommentElement() {
  var commentLiElement = document.createElement('li');
  commentLiElement.classList.add('social__comment');

  return commentLiElement;
}

// Создает текст комментария
function createCommentTextElement(comment) {
  var text = document.createElement('p');
  text.classList.add('social__text');
  text.textContent = comment.message;

  return text;
}

// Рендерит комментарий
function renderComment(comment) {
  var commentElement = createCommentElement();
  var commentText = createCommentTextElement(comment);
  var commentAvatar = createAvatarElement(comment);

  commentElement.appendChild(commentAvatar);
  commentElement.appendChild(commentText);

  return commentElement;
}

// Вставляет кооментарии под приближенной фотографией
function insertCommentsOnBigPhoto(comments) {
  var commentsFragment = document.createDocumentFragment();

  for (var i = 0; i < comments.length; i++) {
    commentsFragment.appendChild(renderComment(comments[i]));
  }

  bigPictureComments.appendChild(commentsFragment);
}

// Рендерит фотографию крупным планом вместе с комментариями
function renderBigPhoto(bigPhoto) {
  bigPictureImg.querySelector('img').src = bigPhoto.url;
  bigPictureLikesCount.textContent = bigPhoto.likes;
  bigPictureCommentsCount.textContent = bigPhoto.comments.length;
  bigPicture.querySelector('.social__caption').textContent = bigPhoto.description;

  removeElementsFromParrent(bigPictureComments);
  insertCommentsOnBigPhoto(bigPhoto.comments);
}

function startApp() {
  var photos = [];
  createPhotos(photos);
  var currentPhoto = photos[0];

  insertPhotosOnPage(photos);
  renderBigPhoto(currentPhoto);

  // pageBody.classList.add('modal-open');
  bigPictureSocialCommentCount.classList.add('hidden');
  bigPictureCommentsLoader.classList.add('hidden');
  // bigPicture.classList.remove('hidden');
  effectsList.addEventListener('click', effectClickHandler);
  effectLevelPin.addEventListener('mouseup', effectPinMouseupHandler);
  uploadFile.addEventListener('change', uploadChangeHandler);
}

function uploadChangeHandler() {
  openEditingPopup();
}

function closePopupClickHandler() {
  closeEditingPopup();
}

function closePopupPressHandler(evt) {
  if (evt.keyCode === ENTER_KEY) {
    closeEditingPopup();
  }
}

function escapePressHandler(evt) {
  if (evt.keyCode === ESCAPE_KEY) {
    closeEditingPopup();
  }
}

function clearInputValue(inputElement) {
  inputElement.value = '';
}

function openEditingPopup() {
  imgUploadOverlay.classList.remove('hidden');
  closeEditBtn.addEventListener('click', closePopupClickHandler);
  closeEditBtn.addEventListener('keydown', closePopupPressHandler);
  document.addEventListener('keydown', escapePressHandler);
}

function closeEditingPopup() {
  imgUploadOverlay.classList.add('hidden');
  clearInputValue(uploadFile);
  closeEditBtn.removeEventListener('click', closePopupClickHandler);
  closeEditBtn.removeEventListener('keydown', closePopupPressHandler);
  document.removeEventListener('keydown', escapePressHandler);
}

function getCoords(element) {
  var box = element.getBoundingClientRect();

  return {
    top: Math.round(box.top + pageYOffset),
    left: Math.round(box.left + pageXOffset),
    width: Math.round(box.width)
  };
}

function getEffectLevel() {
  var lineCoords = getCoords(effectLevelLine);
  var pinCoords = getCoords(effectLevelPin);

  return Math.round((pinCoords.left + EFFECT_PIN_OFFSET - lineCoords.left) * 100 / lineCoords.width);
}

function effectPinMouseupHandler() {
  getEffectLevel();
}

function setEffectDefault() {
  effectLevelPin.style.left = '100%';
  effectLevelValue.value = 100;
  effectLevelDepth.style.width = '100%';
}

function addEffect(effect) {
  imgUploadPreview.style.filter = effect;
  return effect === 'none' ? effectLevel.classList.add('hidden') : effectLevel.classList.remove('hidden');
}

function setEffect(element) {
  var target = element.classList;

  switch (true) {
    case target.contains('effects__preview--chrome'):
      addEffect('grayscale(1)');
      break;
    case target.contains('effects__preview--sepia'):
      addEffect('sepia(1)');
      break;
    case target.contains('effects__preview--marvin'):
      addEffect('invert(100%)');
      break;
    case target.contains('effects__preview--phobos'):
      addEffect('blur(3px)');
      break;
    case target.contains('effects__preview--heat'):
      addEffect('brightness(3)');
      break;
    case target.contains('effects__preview--none'):
      addEffect('none');
      break;
  }
}

function effectClickHandler(evt) {
  var target = evt.target;

  if (target.classList.contains('effects__preview')) {
    setEffectDefault();
    setEffect(target);
    getEffectLevel();
  }
}

var hashtagInput = imgUpload.querySelector('.text__hashtags');
var imgUploadForm = imgUpload.querySelector('.img-upload__form');

function checkHashtag(item) {
  // console.log('checking: ' + item);
  // if (item.charAt(0) !== '#') {
  //   console.log('It\'s a trap!' + item);
  // }

  // if (item.length < 2 || item.charAt(1) === '#') {
  //   console.log('It\'s an another trap!' + item);
  // }
}

function checkHashtagRepeats(array) {
  var hasRepeats = array.some(function (item, position) {
    return array.indexOf(item) !== position;
  });
  return hasRepeats;
}

function checkHashtagsLength(array) {
  if (array.length > 5) {
    // console.log();
  }
}

function uploadFormSubmitHandler(evt) {
  evt.preventDefault();

  var hashtags = hashtagInput.value.split(' ');

  for (var i = 0; i < hashtags.length; i++) {
    checkHashtag(hashtags[i]);
  }
}

imgUploadForm.addEventListener('submit', uploadFormSubmitHandler);

startApp();
