// Подключаем библиотеки
const express = require('express'); // Библиотека для создания сервера
const mongoose = require('mongoose'); // Библиотека для работы с MongoDB
require('dotenv').config(); // Для чтения .env файла

const app = express(); // Создаем сервер

// Подключаемся к MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Чтобы сервер понимал JSON
app.use(express.json());

// Роут для регистрации
const authController = require('./controllers/authController');
app.post('/api/register', authController.register);

// Запускаем сервер
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
