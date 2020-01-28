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
    message: messages[getRandomInt(0, messages.length - 1)]
  },
  {
    avatar: 'img/avatar-' + getRandomInt(MIN_AVATAR_NUMBER, MAX_AVATAR_NUMBER) + '.svg',
    message: messages[getRandomInt(0, messages.length - 1)]
  },
  {
    avatar: 'img/avatar-' + getRandomInt(MIN_AVATAR_NUMBER, MAX_AVATAR_NUMBER) + '.svg',
    message: messages[getRandomInt(0, messages.length - 1)]
  },
  {
    avatar: 'img/avatar-' + getRandomInt(MIN_AVATAR_NUMBER, MAX_AVATAR_NUMBER) + '.svg',
    message: messages[getRandomInt(0, messages.length - 1)]
  },
  {
    avatar: 'img/avatar-' + getRandomInt(MIN_AVATAR_NUMBER, MAX_AVATAR_NUMBER) + '.svg',
    message: messages[getRandomInt(0, messages.length - 1)]
  },
  {
    avatar: 'img/avatar-' + getRandomInt(MIN_AVATAR_NUMBER, MAX_AVATAR_NUMBER) + '.svg',
    message: messages[getRandomInt(0, messages.length - 1)]
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
      description: '',
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
