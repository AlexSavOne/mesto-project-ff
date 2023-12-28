// Конфигурация API, содержащая базовый URL и заголовки для запросов
const config = {
  baseUrl: 'https://nomoreparties.co/v1/wff-cohort-3',
  headers: {
    authorization: '59782435-3fd9-495a-94ec-e14973df2cd5',
    'Content-Type': 'application/json',
  },
};

// Функция для выполнения запросов к API
export const fetchApi = async (url, method, body) => {
  try {
    // Выполняем запрос с использованием fetch
    const response = await fetch(`${config.baseUrl}${url}`, {
      method,
      headers: config.headers,
      body: JSON.stringify(body),
    });

    // Обработка ошибок HTTP
    if (!response.ok) {
      console.error(`Ошибка запроса: ${response.status}`);
      const responseBody = await response.text();
      console.error(`Тело ответа: ${responseBody}`);
      throw new Error(`Ошибка запроса: ${response.status}`);
    }

    // Возвращаем JSON-данные в случае успешного запроса
    return response.json();
  } catch (error) {
    console.error('Произошла ошибка:', error.message);
    throw error;
  }
};

// Функция для получения данных пользователя
export const fetchUserData = async () => {
  try {
    const userData = await fetchApi('/users/me', 'GET');
    console.log('Данные пользователя:', userData);
    return userData;
  } catch (error) {
    console.error('Произошла ошибка при получении данных пользователя:', error.message);
    throw error;
  }
};

// Функция для обновления данных профиля пользователя
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

// Функция для получения начальных карточек
export const getInitialCards = async () => {
  try {
    const response = await fetchApi('/cards', 'GET');
    return response;
  } catch (error) {
    console.error('Произошла ошибка при получении карточек:', error.message);
    throw error;
  }
};

// Функция для добавления новой карточки
export const addNewCard = async (name, link) => {
  try {
    return await fetchApi('/cards', 'POST', { name, link });
  } catch (error) {
    console.error('Произошла ошибка при добавлении новой карточки:', error.message);
    throw error;
  }
};

// Функция для удаления карточки по её ID
export const deleteCard = async (cardId) => {
  try {
    const response = await fetchApi(`/cards/${cardId}`, 'DELETE');
    if (!response.ok) {
      throw new Error(`Ошибка запроса: ${response.status}`);
    }

    console.log(`Карточка с ID ${cardId} успешно удалена с сервера.`);

    return response.json();
  } catch (error) {
    console.error(`Произошла ошибка при удалении карточки с ID ${cardId}:`, error.message);
    throw error;
  }
};

// Функция для постановки/снятия лайка с карточки
export const likeCardRequest = async (cardId, isLiked) => {
  const method = isLiked ? 'DELETE' : 'PUT';
  try {
    const response = await fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
      method: method,
      headers: config.headers,
    });

    if (!response.ok) {
      throw new Error(`Ошибка запроса: ${response.status}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Произошла ошибка при обработке лайка:', error.message);
    throw error;
  }
};

// Функция для обновления аватарки пользователя
export const updateAvatar = async (avatarUrl) => {
  try {
    const result = await fetchApi('/users/me/avatar', 'PATCH', { avatar: avatarUrl });
    console.log('Результат обновления аватарки:', result);

    // Получаем обновленные данные пользователя после обновления аватарки
    const updatedUserData = await fetchUserData();
    return updatedUserData;
  } catch (error) {
    console.error('Ошибка при обновлении аватарки:', error.message);
    throw error;
  }
};
