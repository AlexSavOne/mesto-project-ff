import '../pages/index.css';
import { createCard, deleteCard, likeCard, initialCards } from '../scripts/cards';
// import { openPopup, closePopup } from './modal';

(function () {
  const placesList = document.querySelector('.places__list');
  const imagePopup = document.querySelector('.popup_type_image');
  const editButton = document.querySelector('.profile__edit-button');
  const addButton = document.querySelector('.profile__add-button');
  const editPopup = document.querySelector('.popup_type_edit');
  const newCardPopup = document.querySelector('.popup_type_new-card');
  const closeEditPopupButton = editPopup.querySelector('.popup__close');
  const closeNewCardPopupButton = newCardPopup.querySelector('.popup__close');
  const formElement = document.forms['edit-profile'];
  const nameInput = formElement.querySelector('.popup__input_type_name');
  const jobInput = formElement.querySelector('.popup__input_type_description');
  const profileTitle = document.querySelector('.profile__title');
  const profileDescription = document.querySelector('.profile__description');

  function openPopup(popup) {
    popup.classList.add('popup_is-opened', 'popup_is-animated');
    document.addEventListener('keydown', handleEscPress);
    popup.querySelector('.popup__close').addEventListener('click', function () {
      closePopup(popup);
    });
    popup.addEventListener('click', function (event) {
      handleOverlayClick(event, popup);
    });

  }

  function closePopup(popup) {
    popup.classList.remove('popup_is-opened');
    document.removeEventListener('keydown', handleEscPress);
  }

  function handleEscPress(event) {
    if (event.key === 'Escape') {
      closePopup(editPopup);
      closePopup(newCardPopup);
      closePopup(imagePopup);
    }
  }

  function handleOverlayClick(event, popup) {
    if (event.target === event.currentTarget) {
      closePopup(popup);
    }
  }

  function openEditPopup() {
    nameInput.value = profileTitle.textContent;
    jobInput.value = profileDescription.textContent;

    openPopup(editPopup);
  }

  function openNewCardPopup() {
    openPopup(newCardPopup);
  }

  function openImagePopup(cardData) {
    const imagePopupImage = imagePopup.querySelector('.popup__image');
    const imagePopupCaption = imagePopup.querySelector('.popup__caption');

    imagePopupImage.src = cardData.link;
    imagePopupImage.alt = cardData.name;
    imagePopupCaption.textContent = cardData.name;

    openPopup(imagePopup);
  }

  function handleFormSubmit(evt) {
    evt.preventDefault();

    // Обновить значения на странице
    profileTitle.textContent = nameInput.value;
    profileDescription.textContent = jobInput.value;

    // Закрыть попап
    closePopup(editPopup);
  }

  editButton.addEventListener('click', openEditPopup);
  addButton.addEventListener('click', openNewCardPopup);
  closeEditPopupButton.addEventListener('click', () => closePopup(editPopup));
  closeNewCardPopupButton.addEventListener('click', () => closePopup(newCardPopup));
  editPopup.addEventListener('click', (event) => handleOverlayClick(event, editPopup));
  newCardPopup.addEventListener('click', (event) => handleOverlayClick(event, newCardPopup));

  // Прикрепляем обработчик к форме
  formElement.addEventListener('submit', handleFormSubmit);

  const addCardForm = document.forms['new-place'];
  const cardNameInput = addCardForm.querySelector('.popup__input_type_card-name');
  const cardLinkInput = addCardForm.querySelector('.popup__input_type_url');

  function handleLikeButtonClick(cardElement) {
    const likeButton = cardElement.querySelector('.card__like-button');
    likeButton.classList.toggle('card__like-button_is-active');
  }

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

  addCardForm.addEventListener('submit', handleAddCardSubmit);

  function renderCards(cards) {
    cards.forEach(function (cardData) {
      const cardElement = createCard(cardData, deleteCard, likeCard, openImagePopup);
      placesList.appendChild(cardElement);
    });
  }

  renderCards(initialCards);
})();
