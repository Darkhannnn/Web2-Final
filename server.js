const express = require('express');
const fetch = require('node-fetch');
const axios = require('axios');

const qrRouter = require('./projects/qr-code/script.js');
const bmiRouter = require('./projects/bmi/script.js');
const wheatherApiRouter = require('./projects/weather_api/script.js');
const nodemailerrRouter = require('./projects/nodemailerr/script.js');
const crudRouter = require('./projects/crud/script.js');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.use('/qr-code', qrRouter);
app.use('/bmi', bmiRouter);
app.use('/weather_api', wheatherApiRouter);
app.use('/nodemailerr', nodemailerrRouter);
app.use('/crud', crudRouter);

app.get('/', (req, res) => {
    res.sendFile(process.cwd() + '/public/index.html');
});

app.get('/api/location', async (req, res) => {
    try {
        const response = await fetch('https://ipinfo.io/json?token=4253b9504d917b');
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch location data' });
    }
});

app.get('/api/weather', async (req, res) => {
    const weatherApiKey = '42067bd2cca6f36f6d2dcd9f11fec8aa';
    const googleApiKey = 'AIzaSyDIG2IhTZZ6itxcMbZHW9Y_t46A_0iVeKE';

    const city = req.query.city;
    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}&units=metric`;
    const airQualityApiUrl = `https://airquality.googleapis.com/v1/currentConditions:lookup?key=${googleApiKey}`;
    // console.log("------------------------------------------------------------------------------------------------------------")
    try {
        const weatherResponse = await axios.get(weatherApiUrl);
        // console.log('Weather:', weatherResponse.data);

        const requestBody = {
            location: {
                latitude: weatherResponse.data.coord.lat,
                longitude: weatherResponse.data.coord.lon,
            },
        };

        let airQualityData = {
            airQuality: 'N/A',
            airCategory: 'N/A',
            dominantPollutant: 'N/A',
        };

        try {
            const airQualityResponse = await axios.post(airQualityApiUrl, requestBody, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            // console.log('Air Quality:', airQualityResponse.data);

            if (airQualityResponse.data && airQualityResponse.data.indexes && airQualityResponse.data.indexes[0]) {
                airQualityData = {
                    airQuality: airQualityResponse.data.indexes[0].aqi,
                    airCategory: airQualityResponse.data.indexes[0].category,
                    dominantPollutant: airQualityResponse.data.indexes[0].dominantPollutant,
                };
            }
        } catch (airQualityError) {
            console.warn('Air Quality data not available for this location.');
        }

        res.json({
            temperature: weatherResponse.data.main.temp,
            description: weatherResponse.data.weather[0].description,
            icon: weatherResponse.data.weather[0].icon,
            coordinates: weatherResponse.data.coord,
            feels_like: weatherResponse.data.main.feels_like,
            humidity: weatherResponse.data.main.humidity,
            pressure: weatherResponse.data.main.pressure,
            wind_speed: weatherResponse.data.wind.speed,
            country: weatherResponse.data.sys.country,
            rainVolume: weatherResponse.data.rain ? weatherResponse.data.rain['3h'] : 0,
            ...airQualityData,
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data' });
        console.error(error);
    };
});

app.listen(PORT, () => {
    console.log(`✅ Server is running at http://localhost:${PORT}`);
});
