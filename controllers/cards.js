const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');

const getCards = (req, res, next) => {
  Card.find({})

    .then((cards) => {
      res
        .status(200)
        .send(cards);
    })

    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })

    .then((card) => {
      res
        .status(200)
        .send(card);
    })

    .catch((error) => {
      if (error.name === 'ValidationError') {
        throw new BadRequestError(`Введены невалидные данные: ${error.message}`);
      }
    })

    .catch(next);
};

const removeCard = (req, res, next) => {
  Card.findById(req.params.id)

    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Недостаточно прав для выполнения операции');
      }

      Card.findByIdAndRemove(req.params.id)
        .then((cardForRemove) => {
          res
            .status(200)
            .send(cardForRemove);
        })

        .catch(next);
    })

    .catch((error) => {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenError('Недостаточно прав для выполнения операции');
      }

      throw new NotFoundError('На сервере нет карточки с таким id');
    })

    .catch(next);
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )

    .then((userIdWhoLike) => {
      if (userIdWhoLike === null) {
        throw new NotFoundError('На сервере нет карточки с таким id');
      }

      res.send(userIdWhoLike);
    })

    .catch(() => {
      throw new NotFoundError('На сервере нет карточки с таким id');
    })

    .catch(next);
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )

    .then((userIdWhoDislike) => {
      if (userIdWhoDislike === null) {
        throw new NotFoundError('На сервере нет карточки с таким id');
      }

      res.send(userIdWhoDislike);
    })

    .catch(() => {
      throw new NotFoundError('На сервере нет карточки с таким id');
    })

    .catch(next);
};

module.exports = {
  getCards,
  createCard,
  removeCard,
  likeCard,
  dislikeCard,
};
