// Функция обновления состояния кнопки лайка на карточке
export const updateLikeState = (likeButton, isLiked) => {
  likeButton.classList.toggle('card__like-button_is-active', isLiked);
};

// Функция для создания HTML-элемента карточки
export function createCard(cardData, deleteCallback, openImageCallback, userId, likeCallback) {
  const cardTemplate = document.querySelector('#card-template');
  const cardElement = cardTemplate.content.querySelector('.card').cloneNode(true);
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const cardDeleteButton = cardElement.querySelector('.card__delete-button');
  const likeButton = cardElement.querySelector('.card__like-button');
  const likeCount = cardElement.querySelector('.card__like-count');

  // Устанавливаем данные карточки
  cardElement.id = cardData._id;
  likeCount.textContent = cardData.likes.length;
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  // Проверка, поставил ли текущий пользователь лайк на данную карточку
  const likedByUser = cardData.likes.some(like => like._id === userId);
  if (likedByUser) {
    updateLikeState(likeButton, true);
  }

  likeButton.addEventListener('click', () => likeCallback(cardData, likeButton, likeCount));

  // Обработчик клика по изображению карточки
  cardImage.addEventListener('click', () => {
    openImageCallback(cardData);
  });

  // Добавляем условие для отображения/скрытия иконки удаления
  if (userId && cardData.owner && cardData.owner._id === userId) {
    cardDeleteButton.addEventListener('click', async () => {
      await deleteCallback(cardData._id);
    });
  } else {
    cardDeleteButton.style.display = 'none'; // Скрываем иконку удаления
  }

  return cardElement; // Возвращаем созданный HTML-элемент карточки
}
