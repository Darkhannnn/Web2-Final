const express = require('express');
const qr = require('qr-image');
const fs = require('fs');
const path = require('path');

const router = express.Router();

const qrFolderPath = path.join(process.cwd(), 'public', 'images');
if (!fs.existsSync(qrFolderPath)) fs.mkdirSync(qrFolderPath, { recursive: true });

router.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'projects', 'qr-code', 'index.html'));
});

router.post('/generate', (req, res) => {
    const { link } = req.body;
    if (!link) return res.status(400).json({ error: 'Insert URL' });

    const qrFilename = `qr_${Date.now()}.png`;
    const qrPath = path.join(qrFolderPath, qrFilename);

    const qrCode = qr.image(link, { type: 'png' });
    qrCode.pipe(fs.createWriteStream(qrPath));

    res.json({ qrUrl: `/images/${qrFilename}` });
});


module.exports = router;