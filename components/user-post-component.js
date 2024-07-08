import { renderHeaderComponent } from "./header-component.js";
import { formatDate, initLikeButtonListener } from "./posts-page-component.js";
import { handleLike, sanitizeHTML } from "../helpers.js";


export function renderUserPageComponent({ appEl, posts }) {
  const renderUserInfo = (user) => {
    const userInfoHtml = `
      <div class="user-info">
        <img src="${user.imageUrl}" class="user-info__user-image">
        <p class="user-info__user-name">${sanitizeHTML(user.name)}</p>
      </div>
    `;
    return userInfoHtml;
  };

 const renderPost = (post) => {
  const likesCount = post.likes.length;

  let likesText = "Нравится:";
  if (likesCount === 0) {
    likesText += " 0";
  } else if (likesCount === 1) {
    likesText += ` ${sanitizeHTML(post.likes[0].name)}`;
  } else {
    likesText += ` ${sanitizeHTML(post.likes[0].name)} и еще ${likesCount - 1}`;
  }
  const postHtml = `
    <li class="post">
      <div class="post-header" data-user-id="${post.user.id}">
        <div class="user-info-container"></div>
      </div>
      <div class="post-image-container">
        <img class="post-image" src="${post.imageUrl}">
      </div>
      <div class="post-text">
        ${sanitizeHTML(post.description)}
      </div>
      <p class="post-date">
        ${formatDate(post.createdAt)}
      </p>
      <div class="post-likes">
        <button data-post-id="${post.id}" data-liked="${post.isLiked ? 'true' : 'false'}" class="like-button">
          <img src="./assets/images/${post.isLiked ? 'like-active' : 'like-not-active'}.svg">
        </button>
        <p class="post-likes-text">
          ${likesText}
        </p>
      </div>
    </li>
  `;
  return postHtml;
};

  formatDate();
  
  const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      ${renderUserInfo(posts[0].user)}
      <ul class="posts">
        ${posts.map(renderPost).join('')}
      </ul>
    </div>`;

  appEl.innerHTML = appHtml;
  renderHeaderComponent({
    element: appEl.querySelector(".header-container"),
  });

  initLikeButtonListener(appEl, handleLike);
};