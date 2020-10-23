const { celebrate, Joi, CelebrateError } = require('celebrate');
const validator = require('validator');

// схема валидации данных для различных запросов

// схема валидации ссылки
const urlValidation = (value) => {
  if (!validator.isURL(value)) {
    throw new CelebrateError('Введена невалидная ссылка');
  }
  return value;
};

// схема валидации карточки
const validateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().custom(urlValidation).required(),
  }),
});

// схема валидации id
const validateId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().length(24).hex(),
  }),
});

// схема валидации пользователя при его создании
const validateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(5).pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
  }).unknown(true),
});

// схема валидации данных пользователя при обновлении
const validateUserUpdate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(20),
  }),
});

// схема валидации ссылки при обновлении аватара пользователя
const validateUserAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().custom(urlValidation).required(),
  }),
});

// схема валидации при входе пользователя в приложение
const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(5),
  }),
});

module.exports = {
  validateCard,
  validateId,
  validateUser,
  validateUserUpdate,
  validateUserAvatar,
  validateLogin,
};
