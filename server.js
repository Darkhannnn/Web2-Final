const express = require('express');

const qrRouter = require('./projects/qr-code/script.js');
const bmiRouter = require('./projects/bmi/script.js');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.use('/qr-code', qrRouter);
app.use('/bmi', bmiRouter);

app.get('/', (req, res) => {
    res.sendFile(process.cwd() + '/public/index.html');
});

app.listen(PORT, () => {
    console.log(`✅ Server is running at http://localhost:${PORT}`);
});
