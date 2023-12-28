// Подключение стилей и необходимых функций из других модулей
import '../pages/index.css';
import * as api from './api';
import { fetchUserData } from './api';
import { updateProfileData as updateProfile } from './api';
import { createCard, deleteCard, likeCard } from './card';
import { openPopup, closePopup, handleOverlayClick } from './modal';
import { initialCards } from './cards';
import { enableValidation, hideValidationErrors, setEventListeners } from './validation';


// Переменные для токена и идентификатора группы
const token = '59782435-3fd9-495a-94ec-e14973df2cd5';
const cohortId = 'wff-cohort-3';

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

  // Вызов функций при взаимодействии пользователя
  editButton.addEventListener('mousedown', async () => {
    await fetchUserData();
    openEditPopup();
  });
  addButton.addEventListener('mousedown', openNewCardPopup); // Открыть новую карточку
  formElement.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    const newName = nameInput.value;
    const newDescription = jobInput.value;

    try {
      await updateProfile(newName, newDescription);
      // Получение обновленных данных пользователя
      const userData = await fetchUserData();

      // Обновление DOM с новыми данными пользователя
      profileTitle.textContent = userData.name;
      profileDescription.textContent = userData.about;

      // Закрытие попапа редактирования
      closePopup(editPopup);
    } catch (error) {
      console.error('Ошибка при обновлении профиля:', error.message);
    }
  });
  addCardForm.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    const cardName = cardNameInput.value;
    const cardLink = cardLinkInput.value;

    try {
      // Добавим вызов функции addNewCard и обработку ошибок
      const newCardData = await api.addNewCard(cardName, cardLink);

      // Создаем карточку с использованием данных, полученных после успешного добавления
      const newCardElement = createCard(newCardData, deleteCard, likeCard, openImagePopup);

      // Вставляем новую карточку в начало списка
      placesList.prepend(newCardElement);

      addCardForm.reset();
      hideValidationErrors(addCardForm);
      closePopup(newCardPopup);
    } catch (error) {
      console.error('Ошибка при добавлении новой карточки:', error.message);
      // Добавьте обработку ошибок, например, отображение пользователю сообщения об ошибке
    }
  });
  // Загрузка данных пользователя и карточек при загрузке страницы
  Promise.all([api.fetchUserData(), api.getInitialCards()])
    .then(([userData, cardsData]) => {
      console.log(userData, cardsData);
      renderCards(cardsData);

      // Добавим обработчики лайков для карточек из initialCards
      cardsData.forEach(cardData => {
        const cardElement = placesList.querySelector(`[data-id="${cardData._id}"]`);
        if (cardElement) {
          const likeButton = cardElement.querySelector('.card__like-button');
          likeButton.addEventListener('click', () => likeCard(likeButton, cardData._id, false));

        }
      });
    });


  popups.forEach((popup) => {
    popup.addEventListener('mousedown', (evt) => {
      if (evt.target.classList.contains('popup_opened') || evt.target.classList.contains('popup__close')) {
        closePopup(popup);
      }
    });

    popup.addEventListener('mousedown', (evt) => handleOverlayClick(evt, popup));
  }); // Оверлей и кнопка закрытия

  enableValidation({
    formSelector: '.popup__form',
    inputSelector: '.popup__input',
    submitButtonSelector: '.popup__button',
    inactiveButtonClass: 'popup__button_disabled',
    inputErrorClass: 'popup__input_type_error',
    errorClass: 'popup__error_visible'
  });


  // Функция открытия попапа для редактирования профиля
  function openEditPopup() {
    hideValidationErrors(formElement);

    nameInput.value = profileTitle.textContent;
    jobInput.value = profileDescription.textContent;

    setEventListeners(formElement);

    openPopup(editPopup);
  }

  // Функция открытия попапа для добавления новой карточки
  function openNewCardPopup() {
    addCardForm.reset();
    hideValidationErrors(addCardForm);
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
    hideValidationErrors(addCardForm);
    closePopup(newCardPopup);
  }

  // Функция отрисовки карточек на странице
  function renderCards(cards) {
    cards.forEach(function (cardData) {
      const isOwn = cardData.owner && cardData.owner._id === '59782435-3fd9-495a-94ec-e14973df2cd5';
      const cardElement = createCard(cardData, deleteCard, likeCard, openImagePopup, isOwn);
      placesList.appendChild(cardElement);
    });
  }

  // Отрисовка карточек при загрузке страницы
  renderCards(initialCards);

})();
