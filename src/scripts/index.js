// Подключение стилей и необходимых функций из других модулей
import '../pages/index.css';
import * as api from './api';
import { fetchUserData, updateProfileData, deleteCard } from './api';
import { createCard, likeCard } from './card';
import { openPopup, closePopup, handleOverlayClick } from './modal';
import { enableValidation, hideValidationErrors, setEventListeners } from './validation';

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
  const profileImage = document.querySelector('.profile__img'); // Изображение профиля
  const avatarPopup = document.querySelector('.popup_type_avatar'); // Попап редактирования аватарки
  const avatarForm = document.querySelector('form[name="edit-avatar"]'); // Форма редактирования аватарки
  const avatarInput = avatarForm.querySelector('.popup__input_type_avatar'); // Поле ввода URL аватарки
  const profileImageWrapper = document.querySelector('.profile__image');

  // Обработчик клика по изображению профиля для открытия попапа смены аватарки
  profileImageWrapper.addEventListener('click', () => {
    // Очистка поля ввода URL аватара при открытии попапа
    avatarInput.value = '';

    openPopup(avatarPopup);
  });

  // Установка начального значения изображения профиля из localStorage
  document.addEventListener('DOMContentLoaded', () => {
    try {
      const storedAvatarUrl = localStorage.getItem('avatarUrl');
      if (storedAvatarUrl) {
        profileImage.src = storedAvatarUrl;
      }
    } catch (error) {
      console.error('Ошибка при доступе к localStorage:', error.message);
      throw error;
    }
  });

  // Обработчик клика по кнопке редактирования профиля
  editButton.addEventListener('click', async () => {
    try {
      const userData = await fetchUserData();
      openEditPopup(userData);
    } catch (error) {
      console.error('Ошибка при получении данных пользователя:', error.message);
    }
  });

  // Обработчик клика по кнопке добавления новой карточки
  addButton.addEventListener('click', async () => {
    try {
      const userData = await fetchUserData();
      await openNewCardPopup(createCard, deleteCard, userData);
    } catch (error) {
      console.error('Ошибка при получении данных пользователя:', error.message);
    }
  });

  // Обработчик события отправки формы редактирования аватара
  avatarForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const newAvatarUrl = avatarInput.value;
    const saveButton = avatarForm.querySelector('.button.popup__button.popup__button_disabled');
    const originalButtonText = saveButton.textContent;

    // Обновление текста кнопки на период выполнения запроса
    saveButton.textContent = 'Сохранение...';

    try {
      const updatedUserData = await api.updateAvatar(newAvatarUrl);
      localStorage.setItem('avatarUrl', updatedUserData.avatar);

      // Обновление данных профиля и изображения профиля на странице
      profileTitle.textContent = updatedUserData.name;
      profileDescription.textContent = updatedUserData.about;
      profileImage.src = updatedUserData.avatar;

      avatarForm.reset();
      hideValidationErrors(avatarForm);
      closePopup(avatarPopup);
    } catch (error) {
      console.error('Ошибка при обновлении аватарки:', error.message);
    } finally {
      // Проверка валидации перед восстановлением текста кнопки
      if (avatarForm.checkValidity()) {
        // Восстановление текста кнопки после выполнения запроса
        saveButton.textContent = originalButtonText;
      } else {
        // Если форма не проходит валидацию, кнопка остается неактивной
        saveButton.textContent = originalButtonText;
        saveButton.setAttribute('disabled', true);
      }
    }
  });


  // Обработчик события отправки формы редактирования профиля
  formElement.addEventListener('submit', async (evt) => {
    evt.preventDefault();

    // Получение ссылки на кнопку сохранения
    const saveButton = document.querySelector('.button.popup__button.popup__button_disabled');

    // Изменение текста кнопки на период выполнения запроса
    saveButton.textContent = 'Сохранение...';

    const newName = nameInput.value;
    const newDescription = jobInput.value;

    try {
      await updateProfileData(newName, newDescription);

      // Получение обновленных данных пользователя
      const userData = await fetchUserData();

      // Обновление DOM с новыми данными пользователя
      profileTitle.textContent = userData.name;
      profileDescription.textContent = userData.about;

      // Закрытие попапа редактирования
      closePopup(editPopup);
    } catch (error) {
      console.error('Ошибка при обновлении профиля:', error.message);
    } finally {
      // Восстановление текста кнопки после выполнения запроса
      saveButton.textContent = 'Сохранить';
    }
  });

  // Обработчик события отправки формы добавления новой карточки
  addCardForm.addEventListener('submit', async (evt) => {
    evt.preventDefault();

    // Получение ссылки на кнопку сохранения
    const saveButton = addCardForm.querySelector('.button.popup__button.popup__button_disabled');

    // Сохранение оригинального текста кнопки
    const originalButtonText = saveButton.textContent;

    // Изменение текста кнопки на период выполнения запроса
    saveButton.textContent = 'Сохранение...';

    const cardName = cardNameInput.value;
    const cardLink = cardLinkInput.value;

    try {
      const userData = await fetchUserData();
      const cardData = await api.addNewCard(cardName, cardLink);

      // Создание новой карточки с учетом владельца
      const isOwn = cardData.owner && cardData.owner._id === userData._id;
      const newCardElement = createCard(cardData, (cardId, cardElement) => deleteCardHandler(cardId, cardElement), likeCard, openImagePopup, isOwn);

      // Вставка новой карточки в начало списка
      placesList.prepend(newCardElement);

      addCardForm.reset();
      hideValidationErrors(addCardForm);
      closePopup(newCardPopup);

      // Проверка валидации перед восстановлением текста кнопки
      if (addCardForm.checkValidity()) {
        // Восстановление текста кнопки после выполнения запроса
        saveButton.textContent = originalButtonText;
      } else {
        // Если форма не проходит валидацию, кнопка остается неактивной
        saveButton.textContent = originalButtonText;
        saveButton.setAttribute('disabled', true);
      }
    } catch (error) {
      console.error('Ошибка при добавлении новой карточки:', error.message);

      // В случае ошибки восстановление текста кнопки
      saveButton.textContent = originalButtonText;
    }
  });

  // Загрузка данных пользователя и карточек при загрузке страницы
  Promise.all([api.fetchUserData(), api.getInitialCards()])
    .then(([userData, cardsData]) => {
      console.log(userData, cardsData);

      // Обновление данных профиля только один раз
      profileTitle.textContent = userData.name;
      profileDescription.textContent = userData.about;

      // Очистка списка карточек перед отрисовкой новых
      placesList.textContent = '';

      cardsData.forEach(cardData => {
        const isOwn = cardData.owner && cardData.owner._id === userData._id;
        const newCardElement = createCard(cardData, (cardId, cardElement) => deleteCardHandler(cardId, cardElement), likeCard, openImagePopup, isOwn);

        // Добавление новой карточки в список
        placesList.appendChild(newCardElement);
      });
    })
    .catch(error => console.error('Ошибка при загрузке данных:', error));

  // Оверлей и кнопка закрытия для каждого попапа
  popups.forEach((popup) => {
    popup.addEventListener('mousedown', (evt) => {
      if (evt.target.classList.contains('popup_opened') || evt.target.classList.contains('popup__close')) {
        closePopup(popup);
      }
    });

    // Добавление обработчика оверлея для каждого попапа
    popup.addEventListener('mousedown', (evt) => handleOverlayClick(evt, popup));
  });

  // Инициализация валидации форм на странице
  enableValidation({
    formSelector: '.popup__form',
    inputSelector: '.popup__input',
    submitButtonSelector: '.popup__button',
    inactiveButtonClass: 'popup__button_disabled',
    inputErrorClass: 'popup__input_type_error',
    errorClass: 'popup__error_visible'
  });

  // Обработчик удаления карточки
  async function deleteCardHandler(cardId) {
    try {
      await api.deleteCard(cardId);
      console.log(`Карточка с ID ${cardId} успешно удалена с сервера.`);
      removeCardFromDOM(cardId);
    } catch (error) {
      console.error(`Ошибка при удалении карточки с ID ${cardId}:`, error.message);
    }
  }

  // Удаление карточки из DOM
  function removeCardFromDOM(cardId) {
    const cardElement = document.getElementById(cardId);
    if (cardElement) {
      cardElement.remove();
    }
  }

  // Функция открытия попапа для редактирования профиля
  async function openEditPopup(userData) {
    hideValidationErrors(formElement);

    try {
      // Заполнение полей формы текущими данными пользователя
      nameInput.value = userData.name;
      jobInput.value = userData.about;

      setEventListeners(formElement);

      openPopup(editPopup);
    } catch (error) {
      console.error('Ошибка при получении данных пользователя:', error.message);
    }
  }

  // Функция открытия попапа для добавления новой карточки
  function openNewCardPopup(createCardCallback, deleteCardCallback) {
    addCardForm.reset();
    hideValidationErrors(addCardForm);
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
