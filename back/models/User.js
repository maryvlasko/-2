const mongoose = require('mongoose');

// Определяем структуру пользователя
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },  // Имя пользователя
  email: { type: String, required: true, unique: true }, // Email, должен быть уникальным
  password: { type: String, required: true }, // Зашифрованный пароль
}, { timestamps: true }); // Автоматическое добавление времени создания

module.exports = mongoose.model('User', userSchema);
