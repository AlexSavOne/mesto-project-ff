export function openPopup(popup) {
  popup.classList.add('popup_is-animated');
  document.addEventListener('keydown', closeByEscape);

  setTimeout(() => popup.classList.add('popup_is-opened'), 10);
}

export function closePopup(popup) {
  popup.classList.remove('popup_is-opened');
  document.removeEventListener('keydown', closeByEscape);
}

export function closeByEscape(evt) {
  if (evt.key === 'Escape') {
    const openedPopup = document.querySelector('.popup_is-opened');
    if (openedPopup) closePopup(openedPopup);
  }
}

export function handleOverlayClick(event) {
  if (event.target === event.currentTarget || event.target.classList.contains('popup__close')) {
    closePopup(event.currentTarget);
  }
}
