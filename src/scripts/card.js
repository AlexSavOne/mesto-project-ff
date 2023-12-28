import * as api from './api';

const currentUser = {
  token: '59782435-3fd9-495a-94ec-e14973df2cd5',
  cohortId: 'wff-cohort-3',
};

export function createCard(cardData, deleteCallback, likeCallback, openImageCallback) {
  const cardTemplate = document.querySelector('#card-template');
  const cardElement = cardTemplate.content.querySelector('.card').cloneNode(true);
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const cardDeleteButton = cardElement.querySelector('.card__delete-button');
  const cardLikeButton = cardElement.querySelector('.card__like-button');
  const likeCount = cardElement.querySelector('.card__like-count');

  // Устанавливаем источник изображения и атрибут alt на основе предоставленных данных карточки
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  // Устанавливаем текстовое содержимое заголовка карточки на основе предоставленных данных карточки
  cardTitle.textContent = cardData.name;
  likeCount.textContent = Array.isArray(cardData.likes) ? cardData.likes.length : 0;

  // Добавляем слушатель событий на кнопку удаления для вызова обратного вызова удаления при клике
  cardDeleteButton.addEventListener('click', function () {
    deleteCallback(cardElement);
  });

  // Добавляем слушатель событий на кнопку лайка для вызова обратного вызова лайка при клике
  cardLikeButton.addEventListener('click', function () {
    const cardId = cardData && cardData._id; // Получаем id карточки
    if (cardId) {
      const userLikes = cardData.likes || [];
      likeCallback(cardLikeButton, cardId, userLikes.some((like) => like._id === currentUser.token));
    } else {
      console.error('Ошибка: ID карточки не определен.');
    }
  });

  // Добавляем слушатель событий на изображение карточки для вызова обратного вызова открытия изображения при клике
  cardImage.addEventListener('click', function () {
    openImageCallback(cardData);
  });

  // Возвращаем созданный элемент карточки
  return cardElement;
}

// Эта функция удаляет предоставленный элемент карточки из DOM
export function deleteCard(cardElement) {
  cardElement.remove();
}

export const likeCard = async (likeButton, cardId, isLiked) => {
  const url = `https://nomoreparties.co/v1/${currentUser.cohortId}/cards/${cardId}/likes`;


  try {
    const response = await fetch(url, {
      method: isLiked ? 'DELETE' : 'PUT',
      headers: {
        authorization: currentUser.token,
      },
    });

    if (!response.ok) {
      throw new Error(`Ошибка запроса: ${response.status}`);
    }

    const data = await response.json();

    likeButton.classList.toggle('card__like-button_is-active', isLiked);
    const likeCount = likeButton.closest('.card').querySelector('.card__like-count');
    likeCount.textContent = data.likes.length;
  } catch (error) {
    console.error('Ошибка при выполнении запроса:', error.message);
    throw error;
  }
};

