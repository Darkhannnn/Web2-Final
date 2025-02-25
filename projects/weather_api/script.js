const express = require('express');
const axios = require('axios');
const path = require('path');

const router = express.Router();
const weatherApiKey = '42067bd2cca6f36f6d2dcd9f11fec8aa';
const googleApiKey = 'AIzaSyDIG2IhTZZ6itxcMbZHW9Y_t46A_0iVeKE';

router.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'projects', 'weather_api', 'index.html'));
});

router.get('/weather_api', async (req, res) => {
    const city = req.query.city;
    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}&units=metric`;
    // const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=Astana&appid=42067bd2cca6f36f6d2dcd9f11fec8aa&units=metric`;
    const airQualityApiUrl = `https://airquality.googleapis.com/v1/currentConditions:lookup?key=${googleApiKey}`;
    console.log("------------------------------------------------------------------------------------------------------------")
    try {
        const weatherResponse = await axios.get(weatherApiUrl);
        console.log('Weather:', weatherResponse.data);

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
            console.log('Air Quality:', airQualityResponse.data);

            if (airQualityResponse.data && airQualityResponse.data.indexes && airQualityResponse.data.indexes[0]) {
                airQualityData = {
                    airQuality: airQualityResponse.data.indexes[0].aqi,
                    airCategory: airQualityResponse.data.indexes[0].category,
                    dominantPollutant: airQualityResponse.data.indexes[0].dominantPollutant,
                };
            }
        } catch (airQualityError) {
            // console.warn('Air Quality data not available for this location.');
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
    };
});

module.exports = router;