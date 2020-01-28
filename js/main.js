'use strict';

var PHOTOS_LENGTH = 25;
var MIN_LIKES_NUMBER = 15;
var MAX_LIKES_NUMBER = 200;
var MIN_AVATAR_NUMBER = 1;
var MAX_AVATAR_NUMBER = 6;

var messages = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];
var usersComments = [
  {
    avatar: 'img/avatar-' + getRandomInt(MIN_AVATAR_NUMBER, MAX_AVATAR_NUMBER) + '.svg',
    message: messages[getRandomInt(0, messages.length - 1)],
    name: 'Иван'
  },
  {
    avatar: 'img/avatar-' + getRandomInt(MIN_AVATAR_NUMBER, MAX_AVATAR_NUMBER) + '.svg',
    message: messages[getRandomInt(0, messages.length - 1)],
    name: 'Крис'
  },
  {
    avatar: 'img/avatar-' + getRandomInt(MIN_AVATAR_NUMBER, MAX_AVATAR_NUMBER) + '.svg',
    message: messages[getRandomInt(0, messages.length - 1)],
    name: 'Александр'
  },
  {
    avatar: 'img/avatar-' + getRandomInt(MIN_AVATAR_NUMBER, MAX_AVATAR_NUMBER) + '.svg',
    message: messages[getRandomInt(0, messages.length - 1)],
    name: 'Джошуа'
  },
  {
    avatar: 'img/avatar-' + getRandomInt(MIN_AVATAR_NUMBER, MAX_AVATAR_NUMBER) + '.svg',
    message: messages[getRandomInt(0, messages.length - 1)],
    name: 'Чак'
  },
  {
    avatar: 'img/avatar-' + getRandomInt(MIN_AVATAR_NUMBER, MAX_AVATAR_NUMBER) + '.svg',
    message: messages[getRandomInt(0, messages.length - 1)],
    name: 'Юэн'
  }
];
var photos = [];

var pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
var picturesList = document.querySelector('.pictures');

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleArray(arr) {
  for (var i = arr.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }

  return arr;
}

function getRandomArray(arr) {
  shuffleArray(arr);
  var randomArr = arr.slice(0, getRandomInt(1, arr.length - 1));

  return randomArr;
}

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

function renderPhoto(photo) {
  var photoElement = pictureTemplate.cloneNode(true);

  photoElement.querySelector('.picture__img').src = photo.url;
  photoElement.querySelector('.picture__likes').textContent = photo.likes;
  photoElement.querySelector('.picture__comments').textContent = photo.comments.length;

  return photoElement;
}

function insertPhotosOnPage(photosArr) {
  var picturesFragment = document.createDocumentFragment();

  for (var i = 0; i < photosArr.length; i++) {
    picturesFragment.appendChild(renderPhoto(photosArr[i]));
  }

  picturesList.appendChild(picturesFragment);
}

createPhotos(photos);
insertPhotosOnPage(photos);

var pageBody = document.querySelector('body');
var bigPicture = document.querySelector('.big-picture');
var bigPictureImg = bigPicture.querySelector('.big-picture__img');
var bigPictureLikesCount = bigPicture.querySelector('.likes-count');
var bigPictureCommentsCount = bigPicture.querySelector('.comments-count');
var bigPictureComments = bigPicture.querySelector('.social__comments');
var bigPictureSocialCommentCount = bigPicture.querySelector('.social__comment-count');
var bigPictureCommentsLoader = bigPicture.querySelector('.comments-loader');


var currentPhoto = photos[0];

function renderBigPhoto(bigPhoto) {
  var commentsList = bigPictureComments.querySelectorAll('.social__comment');
  var socialComment = commentsList[0].cloneNode(true);
  var socialPicture = socialComment.querySelector('.social__picture');

  while (bigPictureComments.firstChild) {
    bigPictureComments.removeChild(bigPictureComments.firstChild);
  }

  bigPictureImg.querySelector('img').src = bigPhoto.url;
  bigPictureLikesCount.textContent = bigPhoto.likes;
  bigPictureCommentsCount.textContent = bigPhoto.comments.length;
  bigPicture.querySelector('.social__caption').textContent = bigPhoto.description;
  socialPicture.src = bigPhoto.comments[0].avatar;
  socialPicture.alt = bigPhoto.comments[0].name;
  socialComment.querySelector('.social__text').textContent = bigPhoto.comments[0].message;
  bigPictureComments.appendChild(socialComment);
}

renderBigPhoto(currentPhoto);

pageBody.classList.add('modal-open');
bigPictureSocialCommentCount.classList.add('hidden');
bigPictureCommentsLoader.classList.add('hidden');
bigPicture.classList.remove('hidden');
