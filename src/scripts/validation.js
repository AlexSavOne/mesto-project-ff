const showInputError = (formElement, formInput, errorMessage) => {
  const formError = formElement.querySelector(`.${formInput.id}-error`);

  formInput.classList.add('form__input_type_error');
  formInput.setAttribute('data-error-message', errorMessage);
  formError.textContent = errorMessage;
  formError.classList.add('form__input-error_active');
};

const hideInputError = (formElement, formInput) => {

  const formError = formElement.querySelector(`.${formInput.id}-error`);

  formInput.classList.remove('form__input_type_error');
  formError.classList.remove('form__input-error_active');
  formError.textContent = '';
};

const isValid = (formElement, formInput) => {
  const allowedCharactersRegex = /^[a-zA-Zа-яА-ЯёЁ\s-]*$/;
  const disallowedDigitsRegex = /\d/;
  const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;

  const showError = (errorMessage) => {
    showInputError(formElement, formInput, errorMessage);
  };

  if (formInput.validity.valueMissing) {
    showError('Вы пропустили это поле.');
  } else if (formInput.type === 'url' && !urlRegex.test(formInput.value)) {
    showError('Введите адрес сайта.');
  } else if (formInput.type !== 'url' && (!allowedCharactersRegex.test(formInput.value) || disallowedDigitsRegex.test(formInput.value))) {
    showError('Пожалуйста, используйте только буквы, дефис и пробелы, без цифр.');
  } else if (formInput.type !== 'url' && formInput.validity.tooShort) {
    showError(formInput.validationMessage);
  } else {
    hideInputError(formElement, formInput);
  }

  toggleSaveButtonState(formElement);
};

export const setEventListeners = (formElement) => {
  const inputList = Array.from(formElement.querySelectorAll('.popup__input'));

  const handleInput = () => {
    inputList.forEach((formInput) => {
      isValid(formElement, formInput);
    });
    toggleSaveButtonState(formElement);
  };

  inputList.forEach((formInput) => {
    formInput.addEventListener('input', handleInput);
  });

  toggleSaveButtonState(formElement);
};

export const enableValidation = () => {
  const formList = Array.from(document.querySelectorAll('.popup__form'));

  formList.forEach((formElement) => {
    setEventListeners(formElement);
  });
};

const toggleSaveButtonState = (formElement) => {
  const saveButton = formElement.querySelector('.popup__form .popup__button');
  const inputList = Array.from(formElement.querySelectorAll('.popup__input'));
  const isFormValid = inputList.every((formInput) => formInput.validity.valid);

  saveButton.disabled = !isFormValid;
};


export const hideValidationErrors = (formElement) => {
  const inputList = Array.from(formElement.querySelectorAll('.popup__input'));

  inputList.forEach((formInput) => {
    hideInputError(formElement, formInput);
  });
};
