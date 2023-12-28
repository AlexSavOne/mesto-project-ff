// Функция отображения ошибки валидации для конкретного поля ввода
const showInputError = (formElement, formInput, errorMessage) => {
  const formError = formElement.querySelector(`.${formInput.id}-error`);

  formInput.classList.add('form__input_type_error');
  formInput.setAttribute('data-error-message', errorMessage);
  formError.textContent = errorMessage;
  formError.classList.add('form__input-error_active');
};

// Функция скрытия ошибки валидации для конкретного поля ввода
const hideInputError = (formElement, formInput) => {
  const formError = formElement.querySelector(`.${formInput.id}-error`);

  formInput.classList.remove('form__input_type_error');
  formError.classList.remove('form__input-error_active');
  formError.textContent = '';
};

// Функция проверки валидности конкретного поля ввода
const isValid = (formElement, formInput) => {
  // Регулярные выражения для валидации
  const allowedCharactersRegex = /^[a-zA-Zа-яА-ЯёЁ\s-]*$/;
  const disallowedDigitsRegex = /\d/;
  const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;

  // Функция отображения ошибки с указанным сообщением
  const showError = (errorMessage) => {
    showInputError(formElement, formInput, errorMessage);
  };

  // Проверка различных условий валидации и вызов showError при несоответствии
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

  // Переключение состояния кнопки сохранения формы
  toggleSaveButtonState(formElement);
};

// Функция установки обработчиков событий для полей ввода формы
export const setEventListeners = (formElement) => {
  const inputList = Array.from(formElement.querySelectorAll('.popup__input'));

  // Функция обработки события ввода в поле ввода
  const handleInput = () => {
    inputList.forEach((formInput) => {
      isValid(formElement, formInput);
    });
    toggleSaveButtonState(formElement);
  };

  // Установка обработчика для каждого поля ввода
  inputList.forEach((formInput) => {
    formInput.addEventListener('input', handleInput);
  });

  // Инициализация состояния кнопки сохранения
  toggleSaveButtonState(formElement);
};

// Функция включения валидации для всех форм на странице
export const enableValidation = () => {
  const formList = Array.from(document.querySelectorAll('.popup__form'));

  // Установка обработчиков событий для каждой формы
  formList.forEach((formElement) => {
    setEventListeners(formElement);
  });
};

// Функция переключения состояния кнопки сохранения в зависимости от валидности формы
const toggleSaveButtonState = (formElement) => {
  const saveButton = formElement.querySelector('.popup__form .popup__button');
  const inputList = Array.from(formElement.querySelectorAll('.popup__input'));
  const containsNumbers = inputList.some((formInput) => formInput.type !== 'url' && /\d/.test(formInput.value));
  const isUrlInputValid = inputList.some((formInput) => formInput.type === 'url' && !formInput.validity.valid);

  saveButton.disabled = !inputList.every((formInput) => formInput.validity.valid) || containsNumbers || isUrlInputValid;
};


// Функция скрытия всех ошибок валидации для конкретной формы
export const hideValidationErrors = (formElement) => {
  const inputList = Array.from(formElement.querySelectorAll('.popup__input'));

  // Скрытие ошибок для каждого поля ввода
  inputList.forEach((formInput) => {
    hideInputError(formElement, formInput);
  });
};
