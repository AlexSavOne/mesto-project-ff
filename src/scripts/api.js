const config = {
  baseUrl: 'https://nomoreparties.co/v1/wff-cohort-3', // Замените на ваш реальный baseUrl
  headers: {
    authorization: '59782435-3fd9-495a-94ec-e14973df2cd5', // Замените на ваш реальный токен
    'Content-Type': 'application/json'
  }
}

export const fetchApi = async (url, method, body) => {
  try {
    const response = await fetch(`${config.baseUrl}${url}`, {
      method,
      headers: config.headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Ошибка запроса: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('Произошла ошибка:', error.message);
    throw error;
  }
};

export const getInitialCards = async () => {
  try {
    return await fetchApi('/cards', 'GET');
  } catch (error) {
    console.error('Произошла ошибка при получении карточек:', error.message);
    throw error;
  }
};

export const fetchUserData = async () => {
  try {
    return await fetchApi('/users/me', 'GET');
  } catch (error) {
    console.error('Произошла ошибка при получении данных пользователя:', error.message);
    throw error;
  }
};

export const updateProfileData = async (name, about) => {
  try {
    console.log('Обновление профиля с данными:', name, about);
    const result = await fetchApi('/users/me', 'PATCH', { name, about });
    console.log('Результат обновления профиля:', result);
    return result;
  } catch (error) {
    console.error('Ошибка при обновлении профиля:', error.message);
    throw error;
  }
};



export const addNewCard = async (name, link) => {
  try {
    return await fetchApi('/cards', 'POST', { name, link });
  } catch (error) {
    console.error('Произошла ошибка при добавлении новой карточки:', error.message);
    throw error;
  }
};

export const likeCardRequest = async (cardId, isLiked) => {
  const method = isLiked ? 'DELETE' : 'PUT';
  try {
    return await fetchApi(`/cards/likes/${cardId}`, method);
  } catch (error) {
    console.error('Произошла ошибка при обработке лайка:', error.message);
    throw error;
  }
};
