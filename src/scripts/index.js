// Подключение стилей и необходимых функций из других модулей
import '../pages/index.css';
import * as api from './api';
import { fetchUserData, updateProfileData, deleteCard } from './api';
import { createCard } from './card';
import { openPopup, closePopup, handleOverlayClick } from './modal';
import { enableValidation, clearValidation } from './validation';

(function () {
  let userId; // Идентификатор пользователя

  // Получение ссылок на DOM-элементы страницы
  const placesList = document.querySelector('.places__list'); // Список карточек
  const popups = document.querySelectorAll('.popup'); // Все попапы
  const imagePopup = document.querySelector('.popup_type_image'); // Попап изображения
  const editButton = document.querySelector('.profile__edit-button'); // Кнопка редактирования
  const addButton = document.querySelector('.profile__add-button'); // Кнопка добавления
  const editPopup = document.querySelector('.popup_type_edit'); // Попап редактирования
  const newCardPopup = document.querySelector('.popup_type_new-card'); // Попап новой карточки
  const profileForm = document.querySelector('.popup_type_edit .popup__form'); // Форма редактирования
  const nameInput = profileForm.querySelector('.popup__input_type_name'); // Поле ввода имени
  const jobInput = profileForm.querySelector('.popup__input_type_description'); // Поле ввода описания
  const profileTitle = document.querySelector('.profile__title'); // Заголовок профиля
  const profileDescription = document.querySelector('.profile__description'); // Описание профиля
  const imagePopupImage = imagePopup.querySelector('.popup__image'); // Изображение в попапе
  const imagePopupCaption = imagePopup.querySelector('.popup__caption'); // Подпись к изображению
  const addCardForm = document.querySelector('form[name="new-place"]'); // Форма новой карточки
  const cardNameInput = addCardForm.querySelector('.popup__input_type_card-name'); // Поле ввода имени карточки
  const cardLinkInput = addCardForm.querySelector('.popup__input_type_url'); // Поле ввода URL карточки
  const profileImage = document.querySelector('.profile__img'); // Изображение профиля
  const avatarPopup = document.querySelector('.popup_type_avatar'); // Попап редактирования аватарки
  const avatarForm = document.querySelector('form[name="edit-avatar"]'); // Форма редактирования аватарки
  const avatarInput = avatarForm.querySelector('.popup__input_type_avatar'); // Поле ввода URL аватарки
  const profileImageWrapper = document.querySelector('.profile__image'); // Обертка для аватарки

  // Обработчик события загрузки контента страницы
  document.addEventListener('DOMContentLoaded', async () => {
    try {
      const userData = await fetchUserData();
      console.log('Данные пользователя получены:', userData);

      if (userData && userData._id) {
        userId = userData._id;
        console.log('Идентификатор пользователя установлен:', userId);
      }

      if (userData && userData.avatar) {
        profileImage.src = userData.avatar;
      }

      avatarForm.reset();
      clearValidation(avatarForm, {
        inputSelector: '.popup_type_avatar .popup__input',
        submitButtonSelector: '.popup_type_avatar .popup__button',
        inactiveButtonClass: 'popup__button_disabled',
        inputErrorClass: 'popup__input_type_error',
        errorClass: 'popup__error_visible'
      });
    } catch (error) {
      console.error('Ошибка при получении данных пользователя:', error);
    }
  });


  // Обработчик клика по кнопке редактирования профиля
  editButton.addEventListener('click', () => {
    openEditPopup();
  });

  // Обработчик клика по кнопке добавления новой карточки
  addButton.addEventListener('click', async () => {
    try {
      openNewCardPopup(createCard, deleteCard);
    } catch (error) {
      console.error('Ошибка при открытии новой карточки:', error.message);
    }
  });

  // Обработчик клика по изображению профиля для открытия попапа смены аватарки
  profileImageWrapper.addEventListener('click', () => {
    avatarForm.reset();
    clearValidation(avatarForm, {
      formSelector: '.popup_type_avatar .popup__form',
      inputSelector: '.popup_type_avatar .popup__input',
      submitButtonSelector: '.popup_type_avatar .popup__button',
      inactiveButtonClass: 'popup__button_disabled',
      inputErrorClass: 'popup__input_type_error',
      errorClass: 'popup__error_visible'
    });
    openPopup(avatarPopup);
  });

  // Обработчик события отправки формы редактирования аватара
  avatarForm.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    const newAvatarUrl = avatarInput.value;
    const saveButton = avatarForm.querySelector('.button.popup__button.popup__button_disabled');
    const originalButtonText = saveButton.textContent;
    saveButton.textContent = 'Сохранение...';
    try {
      const updatedUserData = await api.updateAvatar(newAvatarUrl);
      profileTitle.textContent = updatedUserData.name;
      profileDescription.textContent = updatedUserData.about;
      profileImage.src = updatedUserData.avatar;
      avatarForm.reset();
      closePopup(avatarPopup);
    } catch (error) {
      console.error('Ошибка при обновлении аватарки:', error.message);
    } finally {
      saveButton.textContent = originalButtonText;
    }
  });

  // Обработчик события отправки формы редактирования профиля
  profileForm.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    const saveButton = profileForm.querySelector('.button.popup__button.popup__button_disabled');
    const originalButtonText = saveButton.textContent;
    saveButton.textContent = 'Сохранение...';
    try {
      const newName = nameInput.value;
      const newDescription = jobInput.value;
      await updateProfileData(newName, newDescription);
      profileTitle.textContent = newName;
      profileDescription.textContent = newDescription;
      closePopup(editPopup);
    } catch (error) {
      console.error('Ошибка при обновлении профиля:', error.message);
    } finally {
      saveButton.textContent = originalButtonText;
    }
  });

  // Обработчик события отправки формы добавления новой карточки
  addCardForm.addEventListener('submit', async (evt) => {
    evt.preventDefault();

    const saveButton = addCardForm.querySelector('.button.popup__button.popup__button_disabled');
    const originalButtonText = saveButton.textContent;

    try {
      saveButton.textContent = 'Сохранение...';

      // Отправка запроса на сервер для добавления новой карточки
      const cardData = await api.addNewCard(cardNameInput.value, cardLinkInput.value);

      // Создание DOM-элемента карточки и добавление его в список
      const newCardElement = createCard(cardData, deleteCardHandler, openImagePopup, { _id: userId });
      placesList.prepend(newCardElement);

      // Сброс формы и закрытие попапа
      addCardForm.reset();
      closePopup(newCardPopup);
    } catch (error) {
      console.error('Ошибка при добавлении новой карточки:', error.message);
    } finally {
      saveButton.textContent = originalButtonText;
    }
  });

  // Загрузка данных пользователя и карточек при загрузке страницы
  Promise.all([api.fetchUserData(), api.getInitialCards()])
    .then(([userData, cardsData]) => {
      // Обновление информации о текущем пользователе в профиле
      profileTitle.textContent = userData.name;
      profileDescription.textContent = userData.about;

      // Сохранение идентификатора пользователя
      userId = userData._id;

      // Очистка списка карточек перед добавлением новых
      placesList.replaceChildren();

      // Создание DOM-элементов карточек и добавление их в список
      cardsData.forEach(cardData => {
        const newCardElement = createCard(cardData, deleteCardHandler, openImagePopup, userData);
        placesList.appendChild(newCardElement);
      });
    })
    .catch(error => console.error('Ошибка при загрузке данных:', error));

  popups.forEach((popup) => {
    popup.addEventListener('mousedown', handleOverlayClick);
  });

  async function deleteCardHandler(cardId) {
    try {
      await api.deleteCard(cardId);
      removeCardFromDOM(cardId);
    } catch (error) {
      console.error(`Ошибка при удалении карточки с ID ${cardId}:`, error.message);
    }
  }

  // Удаление карточки из DOM
  function removeCardFromDOM(cardId) {
    document.getElementById(cardId)?.remove();
  }

  // Функция открытия редактирования профиля
  function openEditPopup() {
    clearValidation(profileForm, {
      formSelector: '.popup_type_edit .popup__form',
      inputSelector: '.popup_type_edit .popup__input',
      submitButtonSelector: '.popup_type_edit .popup__button',
      inactiveButtonClass: 'popup__button_disabled',
      inputErrorClass: 'popup__input_type_error',
      errorClass: 'popup__error_visible'
    });
    nameInput.value = profileTitle.textContent;
    jobInput.value = profileDescription.textContent;
    enableValidation(profileForm, {
      formSelector: '.popup_type_edit .popup__form',
      inputSelector: '.popup_type_edit .popup__input',
      submitButtonSelector: '.popup_type_edit .popup__button',
      inactiveButtonClass: 'popup__button_disabled',
      inputErrorClass: 'popup__input_type_error',
      errorClass: 'popup__error_visible'
    });
    openPopup(editPopup);
  }

  // Функция открытия добавления новой карточки
  function openNewCardPopup(createCardCallback, deleteCardCallback) {
    addCardForm.reset();
    const validationConfig = {
      formSelector: '.popup_type_new-card .popup__form',
      inputSelector: '.popup_type_new-card .popup__input',
      submitButtonSelector: '.popup_type_new-card .popup__button',
      inactiveButtonClass: 'popup__button_disabled',
      inputErrorClass: 'popup__input_type_error',
      errorClass: 'popup__error_visible'
    };
    clearValidation(addCardForm, validationConfig);
    openPopup(newCardPopup, createCardCallback, deleteCardCallback);
  }

  // Функция открытия попапа с изображением карточки
  function openImagePopup(cardData) {
    imagePopupImage.src = cardData.link;
    imagePopupImage.alt = cardData.name;
    imagePopupCaption.textContent = cardData.name;
    openPopup(imagePopup);
  }
})();
