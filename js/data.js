'use strict';

(function () {
  var PHOTOS_LENGTH = 25;
  var MIN_LIKES_NUMBER = 15;
  var MAX_LIKES_NUMBER = 200;
  var MIN_AVATAR_NUMBER = 1;
  var MAX_AVATAR_NUMBER = 6;
  var COMMENTS_LENGTH = 6;
  var names = ['Элли', 'Крис', 'Джоел', 'Джошуа', 'Чак', 'Юэн'];
  var messages = [
    'Всё отлично!',
    'В целом всё неплохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
  ];
  var usersComments = createUsersComments();
  var photos = [];

  // Создает фейковые комментарии
  function createUsersComments() {
    var comments = [];

    for (var i = 0; i < COMMENTS_LENGTH; i++) {
      comments.push({
        avatar: 'img/avatar-' + window.common.getRandomInt(MIN_AVATAR_NUMBER, MAX_AVATAR_NUMBER) + '.svg',
        message: messages[window.common.getRandomInt(0, messages.length - 1)],
        name: names[window.common.getRandomInt(0, names.length - 1)]
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
        likes: window.common.getRandomInt(MIN_LIKES_NUMBER, MAX_LIKES_NUMBER),
        comments: window.common.getRandomArray(usersComments)
      });
    }

    return arr;
  }

  createPhotos(photos);

  window.data = {
    photos: photos
  };
})();
