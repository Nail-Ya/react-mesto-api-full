const usersRouter = require('express').Router();
const {
  getAllUsers, getUserById, updateUser, updateAvatar, getUserInfo,
} = require('../controllers/users');
const { validateId, validateUserUpdate, validateUserAvatar } = require('../middlewares/requestValidation');

usersRouter.get('/users', getAllUsers);
usersRouter.get('/users/me', getUserInfo);
usersRouter.get('/users/:id', validateId, getUserById);
usersRouter.patch('/users/me', validateUserUpdate, updateUser);
usersRouter.patch('/users/me/avatar', validateUserAvatar, updateAvatar);

module.exports = usersRouter;
