const express = require('express');

const qrRouter = require('./projects/qr-code/script.js');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Подключаем маршруты QR-кода
app.use('/qr-code', qrRouter);

// Главная страница с ссылками на проекты
app.get('/', (req, res) => {
    res.sendFile(process.cwd() + '/public/index.html');
});

app.listen(PORT, () => {
    console.log(`✅ Сервер запущен на http://localhost:${PORT}`);
});
