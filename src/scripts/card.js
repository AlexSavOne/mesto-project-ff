// Объект, представляющий текущего пользователя
const currentUser = {
  token: '59782435-3fd9-495a-94ec-e14973df2cd5',
  cohortId: 'wff-cohort-3',
};

// Функция для создания HTML-элемента карточки
export function createCard(cardData, deleteCallback, likeCallback, openImageCallback, isOwn) {
  // Получаем шаблон карточки и клонируем его
  const cardTemplate = document.querySelector('#card-template');
  const cardElement = cardTemplate.content.querySelector('.card').cloneNode(true);

  // Получаем элементы карточки
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const cardDeleteButton = cardElement.querySelector('.card__delete-button');
  const cardLikeButton = cardElement.querySelector('.card__like-button');
  const likeCount = cardElement.querySelector('.card__like-count');

  // Устанавливаем данные карточки
  likeCount.textContent = Array.isArray(cardData.likes) ? cardData.likes.length : 0;
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  // Функция для обновления состояния лайка
  const updateLikeState = (newLikeState) => {
    if (likeCount && cardLikeButton) {
      let currentLikeCount = parseInt(likeCount.textContent, 10);

      if (newLikeState || currentLikeCount > 0) {
        likeCount.textContent = newLikeState ? currentLikeCount + 1 : currentLikeCount - 1;
      }

      cardLikeButton.classList.toggle('card__like-button_is-active', newLikeState);
    }

    // Обновляем состояние лайка в локальном хранилище
    updateLikeStateInLocalStorage(cardData._id, newLikeState);
  };

  // Инициализируем состояние лайка из локального хранилища
  updateLikeState(getLikeStateFromLocalStorage(cardData._id));

  // Обработчик события клика по кнопке лайка
  cardLikeButton.addEventListener('click', async function () {
    const cardId = cardData && cardData._id;
    if (cardId) {
      try {
        const newLikeState = !cardLikeButton.classList.contains('card__like-button_is-active');
        await likeCallback(cardLikeButton, cardId, newLikeState);
        updateLikeState(newLikeState);
      } catch (error) {
        console.error('Ошибка при обработке лайка:', error.message);
      }
    } else {
      console.error('Ошибка: ID карточки не определен.');
    }
  });

  // Обработчик события клика по изображению карточки
  cardImage.addEventListener('click', function () {
    openImageCallback(cardData);
  });

  // Добавляем условие для отображения/скрытия иконки удаления
  if (isOwn) {
    cardDeleteButton.addEventListener('click', function () {
      deleteCallback(cardData._id, cardElement);
      cardElement.remove();
    });
  } else {
    cardDeleteButton.style.display = 'none'; // Скрываем иконку удаления
  }

  return cardElement; // Возвращаем созданный HTML-элемент карточки
}

// Функция для выполнения запроса на постановку/снятие лайка с карточки
export const likeCard = async (likeButton, cardId, isLiked) => {
  try {
    const method = isLiked ? 'DELETE' : 'PUT';

    // Выполняем запрос к API для постановки/снятия лайка
    const response = await fetch(`https://nomoreparties.co/v1/${currentUser.cohortId}/cards/likes/${cardId}`, {
      method: method,
      headers: {
        authorization: currentUser.token,
        'Content-Type': 'application/json',
      },
    });

    // Обработка ошибок HTTP
    if (!response.ok) {
      throw new Error(`Ошибка запроса: ${response.status}`);
    }

    // Получаем данные из ответа и обновляем состояние лайка
    const data = await response.json();
    updateLikeCountAndState(likeButton, data.likes.length, !isLiked);

  } catch (error) {
    console.error('Ошибка при выполнении запроса:', error.message);
    throw error;
  }
};

// Функция для получения состояния лайка из локального хранилища
function getLikeStateFromLocalStorage(cardId) {
  const likeState = localStorage.getItem(`likeState_${cardId}`);
  return likeState === 'true';
}

// Функция для обновления состояния лайка в локальном хранилище
function updateLikeStateInLocalStorage(cardId, isLiked) {
  localStorage.setItem(`likeState_${cardId}`, JSON.stringify(isLiked));
}

// Функция для обновления счетчика лайков и состояния кнопки лайка
function updateLikeCountAndState(likeButton, newLikeCount, newLikeState) {
  const likeCount = likeButton.closest('.card').querySelector('.card__like-count');
  likeCount.textContent = newLikeCount;
  likeButton.classList.toggle('card__like-button_is-active', newLikeState);
}
