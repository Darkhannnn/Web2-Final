const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');

const router = express.Router();

router.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'projects', 'nodemailerr', 'index.html'));
});

router.post('/send', async (req, res) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'smagulovdarhan21@gmail.com',
          pass: 'twhv pwvv spgw mfow'
        }
    });

    const { to, subject, text } = req.body;
    const mailOptions = {
        from: 'smagulovdarhan21@gmail.com',
        to: to,
        subject: subject,
        text: text
    };
    // if (!to || !subject || !text) return res.status(400).json({ error: 'Fill out all fields' });

    try {
        const info = await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: 'Email sent: ' + info.response });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
});

module.exports = router;