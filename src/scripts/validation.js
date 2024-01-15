// Функция переключения состояния кнопки сохранения в зависимости от валидности формы
const toggleSaveButtonState = (saveButton, inputList) => {
  saveButton.disabled = !inputList.every((formInput) => formInput.validity.valid);
};

// Функция отображения ошибки валидации для конкретного поля ввода
const showInputError = (form, formInput, errorMessage, validationConfig) => {
  const formError = form.querySelector(`.${formInput.id}-error`);

  formInput.classList.add(validationConfig.inputErrorClass);
  formError.textContent = errorMessage;
  formError.classList.add(validationConfig.errorClass);
};

// Функция скрытия ошибки валидации для конкретного поля ввода
const hideInputError = (form, formInput, validationConfig) => {
  const formError = form.querySelector(`.${formInput.id}-error`);

  formInput.classList.remove(validationConfig.inputErrorClass);
  formError.classList.remove(validationConfig.errorClass);
  formError.textContent = '';
};

// Функция проверки валидности конкретного поля ввода
const isValid = (form, formInput, validationConfig) => {
  if (formInput.validity.patternMismatch) {
    formInput.setCustomValidity(formInput.dataset.errorMessage);
  } else {
    formInput.setCustomValidity('');
  }

  if (!formInput.validity.valid) {
    showInputError(form, formInput, formInput.validationMessage, validationConfig);
  } else {
    hideInputError(form, formInput, validationConfig);
  }
};

// Функция установки обработчиков событий для полей ввода формы
const setEventListeners = (form, validationConfig) => {
  const inputList = Array.from(form.querySelectorAll(validationConfig.inputSelector));
  const saveButton = form.querySelector(validationConfig.submitButtonSelector);

  inputList.forEach((formInput) => {
    formInput.addEventListener('input', () => {
      isValid(form, formInput, validationConfig);
      toggleSaveButtonState(saveButton, inputList);
    });
  });
};

// Функция включения валидации для формы с заданными параметрами
export const enableValidation = (validationConfig) => {
  const formList = Array.from(document.querySelectorAll(validationConfig.formSelector));

  formList.forEach((form) => {
    setEventListeners(form, validationConfig);
  });
};

// Функция очистки состояния валидации для конкретной формы
export const clearValidation = (form, validationConfig) => {
  const inputList = Array.from(form.querySelectorAll(validationConfig.inputSelector));
  const saveButton = form.querySelector(validationConfig.submitButtonSelector);

  inputList.forEach((formInput) => {
    hideInputError(form, formInput, validationConfig);
  });

  form.reset();
  toggleSaveButtonState(saveButton, inputList);
};
