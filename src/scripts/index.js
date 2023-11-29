// Подключение стилей и необходимых функций из других модулей
import '../pages/index.css';
import { createCard, deleteCard, likeCard } from './card';
import { openPopup, closePopup, handleOverlayClick, handleEscPress } from './modal';
import { initialCards } from './cards';

(function () {
  // Получение ссылок на DOM-элементы страницы
  const placesList = document.querySelector('.places__list');
  const imagePopup = document.querySelector('.popup_type_image');
  const editButton = document.querySelector('.profile__edit-button');
  const addButton = document.querySelector('.profile__add-button');
  const editPopup = document.querySelector('.popup_type_edit');
  const newCardPopup = document.querySelector('.popup_type_new-card');
  const closeEditPopupButton = editPopup.querySelector('.popup__close');
  const closeNewCardPopupButton = newCardPopup.querySelector('.popup__close');
  const formElement = document.querySelector('.popup_type_edit .popup__form');
  const nameInput = formElement.querySelector('.popup__input_type_name');
  const jobInput = formElement.querySelector('.popup__input_type_description');
  const profileTitle = document.querySelector('.profile__title');
  const profileDescription = document.querySelector('.profile__description');

  // Функция открытия попапа для редактирования профиля
  function openEditPopup() {
    nameInput.value = profileTitle.textContent;
    jobInput.value = profileDescription.textContent;

    openPopup(editPopup);
  }

  // Функция открытия попапа для добавления новой карточки
  function openNewCardPopup() {
    openPopup(newCardPopup);
  }

  // Функция открытия попапа с изображением карточки
  function openImagePopup(cardData) {
    const imagePopupImage = imagePopup.querySelector('.popup__image');
    const imagePopupCaption = imagePopup.querySelector('.popup__caption');

    imagePopupImage.src = cardData.link;
    imagePopupImage.alt = cardData.name;
    imagePopupCaption.textContent = cardData.name;

    openPopup(imagePopup);
  }

  // Функция обработки отправки формы редактирования профиля
  function handleFormSubmit(evt) {
    evt.preventDefault();

    profileTitle.textContent = nameInput.value;
    profileDescription.textContent = jobInput.value;

    closePopup(editPopup);
  }

  // Добавление слушателей событий
  editButton.addEventListener('click', openEditPopup); // открыть
  addButton.addEventListener('click', openNewCardPopup);
  closeEditPopupButton.addEventListener('click', () => closePopup(editPopup)); // закрыть
  closeNewCardPopupButton.addEventListener('click', () => closePopup(newCardPopup));
  editPopup.addEventListener('click', (event) => handleOverlayClick(event, editPopup)); // оверлей клик
  newCardPopup.addEventListener('click', (event) => handleOverlayClick(event, newCardPopup));
  formElement.addEventListener('submit', handleFormSubmit); // сабмит
  document.addEventListener('keydown', (event) => handleEscPress(event, editPopup, newCardPopup, imagePopup)); // esc

  // Получение ссылок на элементы формы добавления карточки
  const addCardForm = document.querySelector('form[name="new-place"]');
  const cardNameInput = addCardForm.querySelector('.popup__input_type_card-name');
  const cardLinkInput = addCardForm.querySelector('.popup__input_type_url');

  // Функция обработки клика по кнопке лайк
  function handleLikeButtonClick(cardElement) {
    const likeButton = cardElement.querySelector('.card__like-button');
    likeButton.classList.toggle('card__like-button_is-active');
  }

  // Функция обработки отправки формы добавления карточки
  function handleAddCardSubmit(evt) {
    evt.preventDefault();

    const cardName = cardNameInput.value;
    const cardLink = cardLinkInput.value;

    const newCardData = {
      name: cardName,
      link: cardLink,
    };

    const newCardElement = createCard(newCardData, deleteCard, handleLikeButtonClick);

    placesList.prepend(newCardElement);

    addCardForm.reset();
    closePopup(newCardPopup);
  }

  // Добавление слушателя события отправки формы добавления карточки
  addCardForm.addEventListener('submit', handleAddCardSubmit);

  // Функция отрисовки карточек на странице
  function renderCards(cards) {
    cards.forEach(function (cardData) {
      const cardElement = createCard(cardData, deleteCard, likeCard, openImagePopup);
      placesList.appendChild(cardElement);
    });
  }

  // Отрисовка карточек при загрузке страницы
  renderCards(initialCards);

})();
