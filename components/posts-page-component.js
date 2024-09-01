import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { goToPage, user } from "../index.js";
import { getPosts, likePostActive, likePostDislike } from "../api.js";
import { getToken } from "../index.js";
import formatDistance from "date-fns/formatDistance";
import  { ru }  from 'date-fns/locale'
import { sanitizeHTML } from "../helpers.js";

export let posts = [];

export const fetchGetPosts = () => {

  getPosts().then((responseData) => {
    posts = responseData.posts.map((post) => {
      return {
        imageProfile: post.user.imageUrl,
        name: post.user.name,
        imageUrl: post.imageUrl,
        likes: post.likes,
        date: formatDistance(new Date(), new Date(post.createdAt), {locale: ru}),
        description: post.description,
        isLiked: post.isLiked,
        idUser: post.user.id,
        idPost: post.id,

      };
    });
    renderPostsPageComponent();
  })
};


export function renderPostsPageComponent() {

  const usersHtml = posts.map((user, index) => {
    return `<li class="post" data-index="${index}">
          <div class="post-header" data-user-id="${user.idUser}">
              <img src="${user.imageProfile}" class="post-header__user-image">
              <p class="post-header__user-name">${sanitizeHTML(user.name)}</p>
          </div>
          <div class="post-image-container">
            <img class="post-image" src="${user.imageUrl}">
          </div>
          <div class="post-likes">
            <button data-post-id="${user.idPost}" data-index="${index}" data-like="${user.isLiked}" class="like-button ${user.isLiked ? "like-active-button" : ""}">
            </button>
            <p class="post-likes-text">
              Нравится: <strong>${user.likes.length > 1 ? user.likes.at(-1).name + " и еще " + (user.likes.length - 1) : user.likes.length === 1 ? user.likes.at(-1).name : "0"}</strong>
            </p>
          </div>
          <p class="">
            <span class="user-name">${sanitizeHTML(user.name)}</span>
            ${sanitizeHTML(user.description)}
          </p>
          <p class="post-date">
            ${user.date} назад
          </p>
        </li>`
  }).join('');
  
  const appHtml = `
              <div class="page-container">
                <div class="header-container"></div>
                <ul class="posts">
                ${usersHtml}
                </ul>
              </div>`;
  const appEl = document.getElementById('app')

  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  for (const button of document.querySelectorAll(".like-button")) {
    button.addEventListener('click', () => {
      const id = button.dataset.postId;
      const index = button.dataset.index;
      if (!getToken()) {
        alert("Лайкать посты могут только автризованные пользователи")       
      }
      if (user) {
        if (posts[index].isLiked === false) {
          likePostActive({ id })
          .then((response) => {
          posts[index].isLiked = true;
          posts[index].likes.push({
            id: response.post.likes.at(-1).id,
            name: response.post.likes.at(-1).name,
          })
            renderPostsPageComponent();
          })
  
        } else {
          posts[index].isLiked = false;
          posts[index].likes.pop();
          likePostDislike({ id })
          .then((response) => {
            renderPostsPageComponent();
          })  
        }
      }
    })
  }

  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      }) 
      const userId = userEl.dataset.userId
      const userPosts = [];
      for (let i = 0; i < posts.length; i++) {
        if (posts[i].idUser == userId) {         
          userPosts.push(posts[i]);
        }
      }
    
    renderUserPosts()

    function renderUserPosts() {
      const userPostHtml = userPosts.map((user, index) => {
        return `<li class="post" data-index="${index}">
              <div class="post-image-container">
                <img class="post-image" src="${user.imageUrl}">
              </div>
              <div class="post-likes">
                <button data-post-id="${user.idPost}" data-index=${index} class="like-button ${user.isLiked ? "like-active-button" : ""}">
                </button>
                <p class="post-likes-text">
                  Нравится: <strong>${user.likes.length > 1 ? user.likes.at(-1).name + " и еще " + (user.likes.length - 1) : user.likes.length === 1 ? user.likes.at(-1).name : "0"}</strong>
                </p>
              </div>
              <p class="">
                <span class="user-name">${sanitizeHTML(user.name)}</span>
                ${sanitizeHTML(user.description)}
              </p>
              <p class="post-date">
                ${user.date} назад
              </p>
            </li>`
      }).join('');

      const appHtml = `
          <div class="page-container">
            <div class="header-container"></div>
            <div class="post-header" data-user-id="${userPosts[0].idUser}">
                  <img src="${userPosts[0].imageProfile}" class="post-header__user-image user-post-image">
                  <h1 class="post-header__user-name">${sanitizeHTML(userPosts[0].name)}</h1>
              </div>
            <ul class="posts">
            ${userPostHtml}
            </ul>
          </div>`

      appEl.innerHTML = appHtml;
      renderHeaderComponent({
        element: document.querySelector(".header-container"),  
      });
      for (const button of document.querySelectorAll(".like-button")) {
        button.addEventListener('click', () => {    
          const id = button.dataset.postId;
          const index = button.dataset.index;
          if (!getToken()) {
            alert("Лайкать посты могут только автризованные пользователи")            
          }
          if (user) {
            if (userPosts[index].isLiked === false) {  
              likePostActive({ id }).then((response) => {             
              userPosts[index].isLiked = true;
              userPosts[index].likes.push({     
                id: response.post.likes.at(-1).id,
                name: response.post.likes.at(-1).name,     
              })      
                renderUserPosts();               
              })      
            } else {     
              userPosts[index].isLiked = false;
              userPosts[index].likes.pop();     
              likePostDislike({ id }).then((response) => {
                renderUserPosts();     
              })              
            }           
          }    
        })    
      }    
    }  
      window.scrollTo(0, 0);
    });
  }
}
