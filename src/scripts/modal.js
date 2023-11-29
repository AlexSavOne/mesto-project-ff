// Функция открытия попапа

export function openPopup(popup) {
  popup.classList.add('popup_is-opened', 'popup_is-animated');
  document.addEventListener('keydown', handleEscPress);
  popup.querySelector('.popup__close').addEventListener('click', function () {
    closePopup(popup);
  });
  popup.addEventListener('click', function (event) {
    handleOverlayClick(event, popup);
  });
}

// Функция закрытия попапа
export function closePopup(popup) {
  popup.classList.remove('popup_is-opened');
  document.removeEventListener('keydown', handleEscPress);
}

// Обработчик нажатия клавиши Esc
export function handleEscPress(event, ...popups) {
  if (event.key === 'Escape') {
    popups.forEach(closePopup);
  }
}

// Обработчик клика по оверлею
export function handleOverlayClick(event, popup) {
  if (event.target === event.currentTarget) {
    closePopup(popup);
  }
}
