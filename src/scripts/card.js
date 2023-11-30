// Эта функция создает элемент карточки на основе предоставленных данных карточки и обратных вызовов для действий удаления, лайка и открытия изображения.
export function createCard(cardData, deleteCallback, likeCallback, openImageCallback) {
  const cardTemplate = document.querySelector('#card-template');
  const cardElement = cardTemplate.content.querySelector('.card').cloneNode(true);
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const cardDeleteButton = cardElement.querySelector('.card__delete-button');
  const cardLikeButton = cardElement.querySelector('.card__like-button');

  // Устанавливаем источник изображения и атрибут alt на основе предоставленных данных карточки
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;

  // Устанавливаем текстовое содержимое заголовка карточки на основе предоставленных данных карточки
  cardTitle.textContent = cardData.name;

  // Добавляем слушатель событий на кнопку удаления для вызова обратного вызова удаления при клике
  cardDeleteButton.addEventListener('click', function () {
    deleteCallback(cardElement);
  });

  // Добавляем слушатель событий на кнопку лайка для вызова обратного вызова лайка при клике
  cardLikeButton.addEventListener('click', function () {
    likeCallback(cardLikeButton);
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

// Эта функция переключает класс 'card__like-button_is-active' на предоставленном элементе кнопки лайка
export function likeCard(likeButton) {
    likeButton.classList.toggle('card__like-button_is-active');
}
