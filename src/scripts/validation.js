// Функция переключения состояния кнопки сохранения в зависимости от валидности формы
const toggleSaveButtonState = (saveButton, inputList) => {
  saveButton.disabled = !inputList.every((formInput) => formInput.validity.valid);
};

// Функция отображения ошибки валидации для конкретного поля ввода
const showInputError = (profileForm, formInput, errorMessage) => {
  const formError = profileForm.querySelector(`.${formInput.id}-error`);

  formInput.classList.add('form__input_type_error');
  formInput.setAttribute('data-error-message', errorMessage);
  formError.textContent = errorMessage;
  formError.classList.add('form__input-error_active');
};

// Функция скрытия ошибки валидации для конкретного поля ввода
const hideInputError = (profileForm, formInput) => {
  const formError = profileForm.querySelector(`.${formInput.id}-error`);

  formInput.classList.remove('form__input_type_error');
  formError.classList.remove('form__input-error_active');
  formError.textContent = '';
};

// Функция проверки валидности конкретного поля ввода
const isValid = (profileForm, formInput) => {
  if (formInput.validity.patternMismatch) {
    formInput.setCustomValidity(formInput.dataset.errorMessage);
  } else {
    formInput.setCustomValidity('');
  }

  if (!formInput.validity.valid) {
    showInputError(profileForm, formInput, formInput.validationMessage);
  } else {
    hideInputError(profileForm, formInput);
  }
};

// Функция установки обработчиков событий для полей ввода формы
export const setEventListeners = (profileForm, validationConfig) => {
  const inputList = Array.from(profileForm.querySelectorAll(validationConfig.inputSelector));
  const saveButton = profileForm.querySelector(validationConfig.submitButtonSelector);

  inputList.forEach((formInput) => {
    formInput.addEventListener('input', () => {
      isValid(profileForm, formInput);
      toggleSaveButtonState(saveButton, inputList);
    });
  });
};

// Функция включения валидации для формы с заданными параметрами
export const enableValidation = (validationConfig) => {
  const formList = Array.from(document.querySelectorAll(validationConfig.formSelector));

  formList.forEach((profileForm) => {
    setEventListeners(profileForm, validationConfig);
  });
};

// Функция очистки состояния валидации для конкретной формы
export const clearValidation = (profileForm, validationConfig) => {
  const inputList = Array.from(profileForm.querySelectorAll(validationConfig.inputSelector));
  const saveButton = profileForm.querySelector(validationConfig.submitButtonSelector);

  inputList.forEach((formInput) => {
    hideInputError(profileForm, formInput);
  });

  profileForm.reset();
  toggleSaveButtonState(saveButton, inputList);
};

// Настройка валидации для форм, используя переданные параметры
enableValidation({
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible',
  urlRegex: /^(ftp|http|https):\/\/[^ "]+$/,
  allowedCharactersRegex: /^[a-zA-Zа-яА-ЯёЁ\s-]*$/,
  disallowedDigitsRegex: /\d/,
});
