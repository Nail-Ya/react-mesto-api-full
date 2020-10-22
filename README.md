# REST API для проекта Mesto


## Стек
* JavaScript
* Node.js
* Express.js
* MongoDB


## Публичный IP-адрес
178.154.233.176


## Домен
https://api.gss.students.nomoreparties.xyz


## Используемые роуты:

```bash
GET /users # возвращает всех пользователей
GET /users/:userId # возвращает пользователя по _id
POST /users # создаёт пользователя
PATCH /users/me # обновляет профиль
PATCH /users/me/avatar # обновляет аватар

GET /cards # возвращает все карточки
POST /cards # создаёт карточку
DELETE /cards/:cardId # удаляет карточку по идентификатору
PUT /cards/:cardId/likes # поставить лайк карточке
DELETE /cards/:cardId/likes # убрать лайк с карточки
```


## Для сборки проекта необходимо выполнить команды:

```bash
npm i # установить все пакеты
npm run start # запускает сервер
npm run dev # запускает сервер с hot-reload
```

## Frontend сервиса
https://github.com/Nail-Ya/react-mesto-auth
