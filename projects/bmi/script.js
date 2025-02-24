const express = require('express');
const path = require('path');

const router = express.Router();

router.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'projects', 'bmi', 'index.html'));
});

router.post('/calculate', (req, res) => {
    const { weight, height } = req.body;
    const bmi = weight / (height * height);
    let category;

    if (bmi < 18.5) {
        category = "Underweight";
    } else if (bmi < 24.9) {
        category = 'Normal weight';
    } else if (bmi < 29.9){
        category = 'Overweight';
    } else{
        category = 'Obese';    
    };

    res.json({ bmi, category });
});

module.exports = router;