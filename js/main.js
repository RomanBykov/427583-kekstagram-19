'use strict';

var PHOTOS_LENGTH = 25;
var MIN_LIKES_NUMBER = 15;
var MAX_LIKES_NUMBER = 200;
var MIN_AVATAR_NUMBER = 1;
var MAX_AVATAR_NUMBER = 6;
var AVATAR_SIZE = 35;
var COMMENTS_LENGTH = 6;

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

  pageBody.classList.add('modal-open');
  bigPictureSocialCommentCount.classList.add('hidden');
  bigPictureCommentsLoader.classList.add('hidden');
  bigPicture.classList.remove('hidden');
}

startApp();
