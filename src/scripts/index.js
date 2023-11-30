// Подключение стилей и необходимых функций из других модулей
import '../pages/index.css';
import { createCard, deleteCard, likeCard } from './card';
import { openPopup, closePopup, handleOverlayClick } from './modal';
import { initialCards } from './cards';

(function () {
  // Получение ссылок на DOM-элементы страницы
  const placesList = document.querySelector('.places__list'); // Список карточек
  const popups = document.querySelectorAll('.popup'); // Все попапы
  const imagePopup = document.querySelector('.popup_type_image'); // Попап изображения
  const editButton = document.querySelector('.profile__edit-button'); // Кнопка редактирования
  const addButton = document.querySelector('.profile__add-button'); // Кнопка добавления
  const editPopup = document.querySelector('.popup_type_edit'); // Попап редактирования
  const newCardPopup = document.querySelector('.popup_type_new-card'); // Попап новой карточки
  const formElement = document.querySelector('.popup_type_edit .popup__form'); // Форма редактирования
  const nameInput = formElement.querySelector('.popup__input_type_name'); // Поле ввода имени
  const jobInput = formElement.querySelector('.popup__input_type_description'); // Поле ввода описания
  const profileTitle = document.querySelector('.profile__title'); // Заголовок профиля
  const profileDescription = document.querySelector('.profile__description'); // Описание профиля
  const imagePopupImage = imagePopup.querySelector('.popup__image'); // Изображение в попапе
  const imagePopupCaption = imagePopup.querySelector('.popup__caption'); // Подпись к изображению
  const addCardForm = document.querySelector('form[name="new-place"]'); // Форма новой карточки
  const cardNameInput = addCardForm.querySelector('.popup__input_type_card-name'); // Поле ввода имени карточки
  const cardLinkInput = addCardForm.querySelector('.popup__input_type_url'); // Поле ввода URL карточки

  editButton.addEventListener('mousedown', openEditPopup); // Открыть редактирование
  addButton.addEventListener('mousedown', openNewCardPopup); // Открыть новую карточку
  formElement.addEventListener('submit', handleFormSubmit); // Сабмит формы
  addCardForm.addEventListener('submit', handleAddCardSubmit); // Сабмит формы добавления карточки
  popups.forEach((popup) => {
    popup.addEventListener('mousedown', (evt) => {
      if (evt.target.classList.contains('popup_opened') || evt.target.classList.contains('popup__close')) {
        closePopup(popup);
      }
    });

    popup.addEventListener('mousedown', (evt) => handleOverlayClick(evt, popup));
  }); // Оверлей и кнопка закрытия

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

  // Функция обработки отправки формы добавления карточки
  function handleAddCardSubmit(evt) {
    evt.preventDefault();

    const cardName = cardNameInput.value;
    const cardLink = cardLinkInput.value;

    const newCardData = {
      name: cardName,
      link: cardLink,
    };

    const newCardElement = createCard(newCardData, deleteCard, likeCard, openImagePopup);

    placesList.prepend(newCardElement);

    addCardForm.reset();
    closePopup(newCardPopup);
  }

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
