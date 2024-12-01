const bcrypt = require('bcryptjs'); // Библиотека для шифрования паролей
const User = require('../models/User'); // Модель пользователя

exports.register = async (req, res) => {
  try {
    // Получаем данные от клиента
    const { email, password, name } = req.body;

    // Проверяем, переданы ли все данные
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Шифруем пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создаем пользователя
    const newUser = new User({
      email,
      password: hashedPassword,
      name,
    });

    // Сохраняем в базу
    await newUser.save();

    // Отправляем успешный ответ
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to register user' });
  }
};
