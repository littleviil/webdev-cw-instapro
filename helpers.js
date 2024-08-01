import { getLike, getDislike, getPostsWithToken, getPosts, getUserPosts, getUserId } from './api.js';
import { appEl, getToken, setPosts, renderApp} from './index.js';
import { renderPost, renderPostsPageComponent, updateLikeButton } from './components/posts-page-component.js';

export function saveUserToLocalStorage(user) {
  window.localStorage.setItem("user", JSON.stringify(user));
}

export function getUserFromLocalStorage(user) {
  try {
    return JSON.parse(window.localStorage.getItem("user"));
  } catch (error) {
    return null;
  }
}

export function removeUserFromLocalStorage(user) {
  window.localStorage.removeItem("user");
}

export const sanitizeHTML = (htmlString) => {
  return htmlString
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
};

export function handleLike(postId, isLiked) {
  console.log(isLiked);
  const token = getToken(); 
  if (isLiked) {
    return getDislike(postId, { token })
      .then((post) => {        
        getPosts({token}).then((data) => {
          setPosts(data);
          renderApp();
        });
      })
      .catch((error) => {
        console.error('Ошибка при дизлайке:', error);
        throw error; 
      });
  } else {
    return getLike(postId, { token })
    .then((post) => {        
      getPosts({token}).then((data) => {
        setPosts(data);
        renderApp();
      });
    })
      .catch((error) => {
        console.error('Ошибка при лайке:', error);
        throw error; 
      });
  }
}

export function handleUserLike(postId, isLiked) {
  console.log(isLiked);
  const token = getToken(); 
  const userId = getUserId();
  if (isLiked) {
    return getDislike(postId, { token })
      .then((post) => {        
        getUserPosts({userId}).then((data) => {
          setPosts(data);
          renderApp();
        });
      })
      .catch((error) => {
        console.error('Ошибка при дизлайке:', error);
        throw error; 
      });
  } else {
    return getLike(postId, { token })
    .then((post) => {        
      getUserPosts({userId}).then((data) => {
        setPosts(data);
        renderApp();
      });
    })
      .catch((error) => {
        console.error('Ошибка при лайке:', error);
        throw error; 
      });
  }
}