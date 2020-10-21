const cardsRouter = require('express').Router();
const {
  getCards, createCard, removeCard, likeCard, dislikeCard,
} = require('../controllers/cards.js');
const { validateCard, validateId } = require('../middlewares/requestValidation');

cardsRouter.get('/cards', getCards);
cardsRouter.post('/cards', validateCard, createCard);
cardsRouter.delete('/cards/:id', validateId, removeCard);
cardsRouter.put('/cards/:id/likes', validateId, likeCard);
cardsRouter.delete('/cards/:id/likes', validateId, dislikeCard);

module.exports = cardsRouter;
