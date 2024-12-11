const express = require('express');
const bodyParser = require('body-parser');
const { GoogleSpreadsheet } = require('google-spreadsheet');

const app = express();
const PORT = 3000;

// Настройка Google Таблицы
const doc = new GoogleSpreadsheet('1uDUQQND0ZZU2iy2l5KhVg5PFNPhFFKjayY_ffuSywXc');
const creds = require('./service-account-key.json');

app.use(bodyParser.json());
app.use(express.static('../frontend')); // Статика для фронтенда

// Авторизация в Google Таблицах
async function authorize() {
    await doc.useServiceAccountAuth(creds);
    await doc.loadInfo();
}

// Маршруты

// Создание новой корзины
app.post('/create-cart', async (req, res) => {
    const { name, password } = req.body;
    if (!name || !password) return res.status(400).json({ error: 'Name and password required' });

    await authorize();
    const sheet = doc.sheetsByTitle['Carts'];
    const id = Date.now().toString(); // Генерация уникального ID
    await sheet.addRow({ id, name, password });
    res.json({ id, name });
});

// Вход в корзину
app.post('/get-cart', async (req, res) => {
    const { id, password } = req.body;
    if (!id || !password) return res.status(400).json({ error: 'ID and password required' });

    await authorize();
    const sheet = doc.sheetsByTitle['Carts'];
    const rows = await sheet.getRows();
    const cart = rows.find(row => row.id === id && row.password === password);

    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    res.json({ id: cart.id, name: cart.name });
});

// Сохранение изменений в корзине
app.post('/save-cart', async (req, res) => {
    const { id, items } = req.body;
    if (!id || !items) return res.status(400).json({ error: 'ID and items required' });

    await authorize();
    const sheet = doc.sheetsByTitle['Items'];
    const rows = await sheet.getRows();
    rows.forEach(row => {
        if (row.cartId === id) row.del();
    });

    for (const item of items) {
        await sheet.addRow({ cartId: id, ...item });
    }

    res.json({ success: true });
});

// Удаление корзины
app.post('/delete-cart', async (req, res) => {
    const { id, password } = req.body;
    if (!id || !password) return res.status(400).json({ error: 'ID and password required' });

    await authorize();
    const sheet = doc.sheetsByTitle['Carts'];
    const rows = await sheet.getRows();
    const cartIndex = rows.findIndex(row => row.id === id && row.password === password);

    if (cartIndex === -1) return res.status(404).json({ error: 'Cart not found' });

    await rows[cartIndex].del();
    res.json({ success: true });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});