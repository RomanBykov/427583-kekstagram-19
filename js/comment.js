'use strict';

(function () {
  var AVATAR_SIZE = 35;
  var pageBody = document.querySelector('body');
  var bigPictureComments = pageBody.querySelector('.big-picture .social__comments');

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

  // Вставляет комментарии под приближенной фотографией
  function appendCommentsOnBigPhoto(comments) {
    var commentsFragment = document.createDocumentFragment();

    for (var i = 0; i < comments.length; i++) {
      commentsFragment.appendChild(renderComment(comments[i]));
    }

    bigPictureComments.appendChild(commentsFragment);
  }

  window.comments = {
    appendCommentsOnBigPhoto: appendCommentsOnBigPhoto
  };

})();
