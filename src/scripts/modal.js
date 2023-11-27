export function openModal(modal) {
  modal.classList.add('popup_is-opened', 'popup_is-animated');
  document.addEventListener('keydown', handleEscPress);
  modal.querySelector('.popup__close').addEventListener('click', function () {
    closeModal(modal);
  });
  modal.addEventListener('click', function (event) {
    handleOverlayClick(event, modal);
  });
}

export function closeModal(modal) {
  modal.classList.remove('popup_is-opened');
  document.removeEventListener('keydown', handleEscPress);
}

function handleEscPress(event) {
  if (event.key === 'Escape') {
    closeModal(editPopup);
    closeModal(newCardPopup);
    closeModal(imagePopup);
  }
}

function handleOverlayClick(event, modal) {
  if (event.target === event.currentTarget) {
    closeModal(modal);
  }
}
