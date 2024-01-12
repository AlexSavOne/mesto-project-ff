// Конфигурация API, содержащая базовый URL и заголовки для запросов
const config = {
  baseUrl: 'https://nomoreparties.co/v1/wff-cohort-3',
  headers: {
    authorization: '59782435-3fd9-495a-94ec-e14973df2cd5',
    'Content-Type': 'application/json',
  },
};

// Функция для выполнения запросов к API
const fetchApi = async (url, method, body) => {
  const response = await fetch(`${config.baseUrl}${url}`, {
    method,
    headers: config.headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const responseBody = await response.text();
    console.error(`Ошибка запроса: ${response.status}, Тело ответа: ${responseBody}`);
    throw new Error(`Ошибка запроса: ${response.status}`);
  }

  return response.json();
};

// Функция для обработки ошибок при выполнении API-запросов
const handleApiError = (action, error) => {
  console.error(`Произошла ошибка при ${action}:`, error.message);
  throw error;
};

// Функция для получения данных пользователя
export const fetchUserData = async () => {
  try {
    return await fetchApi('/users/me', 'GET');
  } catch (error) {
    handleApiError('получении данных пользователя', error);
  }
};

// Функция для обновления данных профиля пользователя
export const updateProfileData = async (name, about) => {
  try {
    const result = await fetchApi('/users/me', 'PATCH', { name, about });
    return result;
  } catch (error) {
    handleApiError('обновлении профиля', error);
  }
};

// Функция для получения карточек
export const getInitialCards = async () => {
  try {
    return await fetchApi('/cards', 'GET');
  } catch (error) {
    handleApiError('получении карточек', error);
  }
};

// Функция для добавления новой карточки
export const addNewCard = async (name, link) => {
  try {
    return await fetchApi('/cards', 'POST', { name, link });
  } catch (error) {
    handleApiError('добавлении новой карточки', error);
  }
};

// Функция для удаления карточки по её ID
export const deleteCard = async (cardId) => {
  try {
    await fetchApi(`/cards/${cardId}`, 'DELETE');
  } catch (error) {
    handleApiError(`удалении карточки с ID ${cardId}`, error);
  }
};

// Функция для лайка карточки
export const likeCard = async (cardId, isLiked) => {
  const method = isLiked ? 'DELETE' : 'PUT';
  try {
    const response = await fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
      method,
      headers: config.headers,
    });

    if (!response.ok) {
      throw new Error(`Ошибка запроса: ${response.status}`);
    }

    return await response.json();

  } catch (error) {
    handleApiError('обработке лайка', error);
  }
};

// Функция для обновления аватарки пользователя
export const updateAvatar = async (avatarUrl) => {
  try {
    await fetchApi('/users/me/avatar', 'PATCH', { avatar: avatarUrl });
    const updatedUserData = await fetchUserData();
    return updatedUserData;
  } catch (error) {
    handleApiError('обновлении аватарки', error);
  }
};
