# Node.js

Node.js — это среда выполнения JavaScript на стороне сервера, построенная на движке V8 JavaScript от Google Chrome.

## Основы Node.js

Node.js позволяет запускать JavaScript вне браузера, что делает его отличным выбором для создания серверных приложений. 

### Особенности Node.js

- **Асинхронное и событийно-ориентированное программирование**
- **Неблокирующий ввод/вывод**
- **Единый язык программирования на клиенте и сервере**
- **Большая экосистема пакетов (npm)**

## Установка Node.js

Загрузите и установите Node.js с официального сайта: [nodejs.org](https://nodejs.org/)

Проверьте установку:

```bash
node -v
npm -v
```

## Создание простого сервера

```javascript
const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Привет, мир!\n');
});

server.listen(port, hostname, () => {
  console.log(`Сервер запущен по адресу http://${hostname}:${port}/`);
});
```

## Модули в Node.js

Node.js использует систему модулей для организации кода.

### Встроенные модули

```javascript
// Файловая система
const fs = require('fs');

// Чтение файла
fs.readFile('example.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(data);
});

// HTTP модуль
const http = require('http');

// Путь к файлам
const path = require('path');
```

### Создание собственных модулей

**math.js**
```javascript
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

module.exports = {
  add,
  subtract
};
```

**app.js**
```javascript
const math = require('./math');

console.log(math.add(5, 3));      // 8
console.log(math.subtract(5, 3)); // 2
```

## npm (Node Package Manager)

npm — это менеджер пакетов для Node.js, который позволяет устанавливать сторонние библиотеки и инструменты.

### Основные команды npm

```bash
# Инициализация нового проекта
npm init

# Установка пакета
npm install express

# Установка пакета глобально
npm install -g nodemon

# Установка пакета как зависимость разработки
npm install --save-dev jest

# Запуск скрипта из package.json
npm run start
```

### package.json

Файл package.json содержит метаданные о проекте и его зависимостях:

```json
{
  "name": "my-node-app",
  "version": "1.0.0",
  "description": "A sample Node.js application",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.17.1"
  },
  "devDependencies": {
    "nodemon": "^2.0.12",
    "jest": "^27.0.6"
  }
}
```

## Express.js

Express — популярный веб-фреймворк для Node.js, который упрощает создание веб-приложений и API.

```javascript
const express = require('express');
const app = express();
const port = 3000;

// Промежуточное ПО для обработки JSON
app.use(express.json());

// Маршруты
app.get('/', (req, res) => {
  res.send('Главная страница');
});

app.get('/api/users', (req, res) => {
  res.json([
    { id: 1, name: 'Иван' },
    { id: 2, name: 'Мария' }
  ]);
});

app.post('/api/users', (req, res) => {
  const newUser = req.body;
  // Добавление пользователя в БД
  res.status(201).json(newUser);
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
```

## Работа с асинхронным кодом

### Колбэки

```javascript
fs.readFile('file.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Ошибка чтения файла:', err);
    return;
  }
  console.log('Содержимое файла:', data);
});
```

### Промисы

```javascript
const fs = require('fs').promises;

fs.readFile('file.txt', 'utf8')
  .then(data => {
    console.log('Содержимое файла:', data);
  })
  .catch(err => {
    console.error('Ошибка чтения файла:', err);
  });
```

### Async/Await

```javascript
const fs = require('fs').promises;

async function readFileContent() {
  try {
    const data = await fs.readFile('file.txt', 'utf8');
    console.log('Содержимое файла:', data);
  } catch (err) {
    console.error('Ошибка чтения файла:', err);
  }
}

readFileContent();
``` 