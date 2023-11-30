// Функция открытия попапа
export function openPopup(popup) {
  popup.classList.add('popup_is-animated');
  document.addEventListener('keydown', closeByEscape);
  popup.querySelector('.popup__close').addEventListener('mousedown', function () {
    closePopup(popup);
  });
  popup.addEventListener('mousedown', function (event) {
    handleOverlayClick(event, popup);
  });

  setTimeout(() => {
    popup.classList.add('popup_is-opened');
  }, 10);
}


// Функция закрытия попапа
export function closePopup(popup) {
  popup.classList.remove('popup_is-opened');
  document.removeEventListener('keydown', closeByEscape);
}

// Обработчик нажатия клавиши Esc
export function closeByEscape(evt) {
  if (evt.key === 'Escape') {
    const openedPopup = document.querySelector('.popup_is-opened');
    if (openedPopup) {
      closePopup(openedPopup);
    }
  }
}


// Обработчик клика по оверлею
export function handleOverlayClick(event, popup) {
  if (event.target === event.currentTarget) {
    closePopup(popup);
  }
}
