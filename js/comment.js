'use strict';

(function () {
  var AVATAR_SIZE = 35;
  var pageBody = document.querySelector('body');
  var bigPhotoComments = pageBody.querySelector('.big-picture .social__comments');
  var bigPhotoCommentsCount = pageBody.querySelector('.social__comment-count');
  var commentsLoaderBtn = pageBody.querySelector('.social__comments-loader');

  function getAll(bigPhoto) {
    return bigPhoto.comments;
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

  // Рендерит элемент комментария
  function renderComment(comment) {
    var commentElement = createCommentElement();
    var commentText = createCommentTextElement(comment);
    var commentAvatar = createAvatarElement(comment);

    commentElement.appendChild(commentAvatar);
    commentElement.appendChild(commentText);

    return commentElement;
  }

  // Вставляет комментарии под приближенной фотографией
  function render(comments) {
    var commentsLength = comments.length < 5 ? comments.length : 5;

    renderComments(comments, commentsLength);

    return comments.length < 5 ? commentsLoaderBtn.classList.add('hidden') : commentsLoaderBtn.classList.remove('hidden');
  }

  // Заружает ещё комментарии
  function renderMore(comments) {
    var commentsLength = calculateAdditionalCommentsLength(comments);

    renderComments(comments, commentsLength);

    return comments.length === commentsLength ? commentsLoaderBtn.classList.add('hidden') : commentsLoaderBtn.classList.remove('hidden');
  }

  // Рендерит заданное количество комментариев
  function renderComments(comments, commentsLength) {
    var commentsFragment = document.createDocumentFragment();

    for (var i = 0; i < commentsLength; i++) {
      commentsFragment.appendChild(renderComment(comments[i]));
    }

    bigPhotoCommentsCount.childNodes[0].textContent = commentsLength + ' из ';
    window.util.removeElementsFromParrent(bigPhotoComments);
    bigPhotoComments.appendChild(commentsFragment);
  }

  // Вычисляет сколько ещё загрузить комментариев
  function calculateAdditionalCommentsLength(comments) {
    var currentCommentsLength = bigPhotoComments.childElementCount;
    var commentsLeftLength = comments.length - currentCommentsLength;
    var additionalCommentsLength = commentsLeftLength < 5 ? commentsLeftLength : 5;

    return currentCommentsLength + additionalCommentsLength;
  }

  window.comments = {
    render: render,
    getAll: getAll,
    renderMore: renderMore
  };

})();
