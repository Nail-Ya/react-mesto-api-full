const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const ConflictError = require('../errors/ConflictError');

const { NODE_ENV, JWT_SECRET } = process.env;

const getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res
        .status(200)
        .send({ data: users });
    })
    .catch(next);
};

const getUserById = (req, res, next) => {
  User.findById(req.params.id)
    .then((userById) => {
      if (userById === null) {
        throw new NotFoundError('Пользователя нет в базе данных');
      }
      res
        .status(200)
        .send({ data: userById });
    })

    .catch(() => {
      throw new NotFoundError('Пользователя нет в базе данных');
    })

    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    })

      .then((user) => {
        res
          .status(200)
          .send({ data: user });
      })

      .catch((error) => {
        if (error.name === 'ValidationError') {
          throw new BadRequestError('Введены невалидные данные');
        }

        if (error.name === 'MongoError' || error.code === 11000) {
          throw new ConflictError('Пользователь с такой электронной почтой уже зарегистрирован');
        }
      }))

    .catch(next);
};

const updateUser = (req, res, next) => {
  const { name, about, avatar } = req.body;

  User.findByIdAndUpdate(req.user._id,
    { name, about, avatar },
    {
      new: true,
      runValidators: true,
    })

    .then((updatedUser) => {
      if (updatedUser === null) {
        throw new NotFoundError('Пользователя нет в базе данных');
      }
      res
        .status(200)
        .send({ data: updatedUser });
    })

    .catch((error) => {
      if (error instanceof NotFoundError) {
        throw new NotFoundError('Пользователя нет в базе данных');
      }
      throw new BadRequestError('Введены невалидные данные');
    })

    .catch(next);
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    })

    .then((updatedUserAvatar) => {
      if (updatedUserAvatar === null) {
        throw new NotFoundError('Пользователя нет в базе данных');
      }
      res
        .status(200)
        .send({ data: updatedUserAvatar });
    })

    .catch((error) => {
      if (error instanceof NotFoundError) {
        throw new NotFoundError('Пользователя нет в базе данных');
      }

      throw new BadRequestError('Введены невалидные данные');
    })

    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res

        // .cookie('jwt', token, {
        //   maxAge: 3600000 * 24 * 7,
        //   httpOnly: true,
        //   sameSite: true,
        // })

        .send({ token });
    })

    .catch(() => {
      throw new UnauthorizedError('Произошла ошибка: вы не вошли в приложение');
    })

    .catch(next);
};

const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((userById) => {
      if (userById === null) {
        throw new NotFoundError('Пользователя нет в базе данных');
      }
      res
        .status(200)
        .send({ data: { _id: userById._id, email: userById.email } });
    })

    .catch(() => {
      throw new NotFoundError('Пользователя нет в базе данных');
    })

    .catch(next);
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
  login,
  getUserInfo,
};
