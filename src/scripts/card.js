import { likeCard } from './api';

// Функция обновления состояния кнопки лайка на карточке
const updateLikeState = (likeButton, isLiked) => {
  likeButton.classList.toggle('card__like-button_is-active', isLiked);
  console.log(`Состояние лайка установлено на ${isLiked ? 'активный' : 'неактивный'}`);
};

// Функция для создания HTML-элемента карточки
export function createCard(cardData, deleteCallback, openImageCallback, currentUser) {
  const cardTemplate = document.querySelector('#card-template');
  const cardElement = cardTemplate.content.querySelector('.card').cloneNode(true);
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const cardDeleteButton = cardElement.querySelector('.card__delete-button');
  const likeButton = cardElement.querySelector('.card__like-button');
  const likeCount = cardElement.querySelector('.card__like-count');

  // Устанавливаем данные карточки
  likeCount.textContent = cardData.likes.length;
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  // Проверка, поставил ли текущий пользователь лайк на данную карточку
  const likedByUser = cardData.likes.some(like => like._id === currentUser._id);
  if (likedByUser) {
    updateLikeState(likeButton, true);
  }

  // Обработчик клика по кнопке лайка
  likeButton.addEventListener('click', async () => {
    try {
      const cardId = cardData && cardData._id;
      if (cardId) {
        const isLiked = !likeButton.classList.contains('card__like-button_is-active');
        const updatedCardData = await likeCard(cardId, !isLiked);
        if (cardData) {
          cardData.likes = updatedCardData.likes;
          likeCount.textContent = cardData.likes.length;
        }

        updateLikeState(likeButton, isLiked);
      } else {
        console.error('Ошибка: ID карточки не определен.');
      }
    } catch (error) {
      console.error('Ошибка при обработке лайка:', error.message);
    }
  });

  // Обработчик клика по изображению карточки
  cardImage.addEventListener('click', () => {
    openImageCallback(cardData);
  });

  // Добавляем условие для отображения/скрытия иконки удаления
  if (currentUser && cardData.owner && cardData.owner._id === currentUser._id) {
    cardDeleteButton.addEventListener('click', async () => {
      try {
        await deleteCallback(cardData._id);
        console.log('Карточка успешно удалена с сервера.');
        cardElement.remove();
      } catch (error) {
        console.error('Ошибка при удалении карточки:', error.message);
      }
    });
  } else {
    cardDeleteButton.style.display = 'none'; // Скрываем иконку удаления
  }

  return cardElement; // Возвращаем созданный HTML-элемент карточки
}
