import { getToken } from "./index.js";
import { getUserFromLocalStorage } from "./helpers.js";
const personalKey = "saveleva-elena";
const baseHost = "https://webdev-hw-api.vercel.app";
const postsHost = `${baseHost}/api/v1/${personalKey}/instapro`;

export function getPosts({ token }) {
  return fetch(postsHost, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
      if (response.status === 401) {
        throw new Error("Нет авторизации");
      }

      return response.json();
    })
    .then((data) => {
      return data.posts;
    });
}


// https://github.com/GlebkaF/webdev-hw-api/blob/main/pages/api/user/README.md#%D0%B0%D0%B2%D1%82%D0%BE%D1%80%D0%B8%D0%B7%D0%BE%D0%B2%D0%B0%D1%82%D1%8C%D1%81%D1%8F
export function registerUser({ login, password, name, imageUrl }) {
  return fetch(baseHost + "/api/user", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
      name,
      imageUrl,
    }),
  }).then((response) => {
    if (response.status === 400) {
      throw new Error("Такой пользователь уже существует");
    }
    return response.json();
  });
}

export function loginUser({ login, password }) {
  return fetch(baseHost + "/api/user/login", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
    }),
  }).then((response) => {
    if (response.status === 400) {
      throw new Error("Неверный логин или пароль");
    }
    return response.json();
  });
}

// Загружает картинку в облако, возвращает url загруженной картинки
export function uploadImage({ file }) {
  const data = new FormData();
  data.append("file", file);

  return fetch(baseHost + "/api/upload/image", {
    method: "POST",
    body: data,
  }).then((response) => {
    return response.json();
  });
}

export function addPost({ description, imageUrl }) {
  return fetch(postsHost, {
    method: 'POST',
    headers: {
      Authorization: getToken(),
    },
    body: JSON.stringify({
      description,
      imageUrl,
    }),
  })
  .then((response) => {
    return response.json();
  })
}

export function getUserPosts({id}) {
  return fetch(postsHost + `/user-posts/${id}`, {
    method: "GET",
  }).then((response) => {
    return response.json();
  }).then((data) => {
    return data.posts;
  });
}

export function getUserId() {
  const user = getUserFromLocalStorage(); 
  if (user) {
    return user.id;
  } else {
    throw new Error('Пользователь не авторизован');
  }
}

export function getUsername() {
  const userString = localStorage.getItem('user');
  const user = JSON.parse(userString);
  return user ? user.username : null;
}

export const getLike = (id, { token }) => {
  return fetch(`${postsHost}/${id}/like`, {
    method: "POST",
    headers: {
      Authorization: token,
    }
  })
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
    }
    return response.json();
  })
    .catch((error) => {
      alert('Вы не авторизованы!')
      throw error;
    });

};

export const getDislike = (id, { token }) => {
  return fetch(`${postsHost}/${id}/dislike`, {
    method: "POST",
    headers: {
      Authorization: token,
    }
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Ошибка при удалении лайка:", error);
      alert('Что-то пошло не так, попробуйте позже.')
      throw error;
    });
};

export function getPostsWithToken() {
  const token = getToken();
  return fetch(postsHost, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
      if (response.status === 401) {
        throw new Error("Нет авторизации");
      }

      return response.json();
    })
    .then((data) => {
      return data.posts;
    });
}