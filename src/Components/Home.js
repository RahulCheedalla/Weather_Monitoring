import React, { useEffect, useState } from "react";
import Header from "./Header";
import IntervalSlider from "./IntervalSlider";
import TemperatureSelection from "./TemperatureSelection";
import TemperatureThresholdSlider from "./TemperatureThresholdSlider";
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, Tooltip, Legend, TimeScale } from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';

ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, Legend, TimeScale);

export default function Home() {

    const [weatherData, setWeatherData] = useState({});
    const [dailyData, setDailyData] = useState({});
    const [dailySummaryData, setDailySummaryData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [interval, setIntervalState] = useState(5);
    const [temperature, setTemperature] = useState("Celsius");
    const [temperatureThreshold, setTemperatureThreshold] = useState({});
    const [alerts, setAlerts] = useState(false);
    const [alertArray, setAlertArray] = useState([]);

    const cityCoordinates = {
        "Delhi": { lat: 28.7041, lon: 77.1025 },
        "Mumbai": { lat: 19.0760, lon: 72.8777 },
        "Chennai": { lat: 13.0827, lon: 80.2707 },
        "Bangalore": { lat: 12.9716, lon: 77.5946 },
        "Kolkata": { lat: 22.5726, lon: 88.3639 },
        "Hyderabad": { lat: 17.3850, lon: 78.4867 }
    };

    const apiKey = process.env.REACT_APP_WEATHER_API_KEY;

    useEffect(() => {

        function calculateDailyWeatherSummary(dailyData, city) {
            if (!dailyData[city]) {
                return {};
            }

            const cityData = dailyData[city];
            const timestamps = Object.keys(cityData); 

            let totalTemp = 0;
            let maxTemp = -Infinity;
            let minTemp = Infinity;
            const weatherConditions = {};

            timestamps.forEach(timestamp => {
                const weatherInfo = cityData[timestamp];
                const temperature = weatherInfo.main.temp;
                const weatherCondition = weatherInfo.weather[0].main;

                totalTemp += temperature;

                if (temperature > maxTemp) {
                    maxTemp = temperature;
                }

                if (temperature < minTemp) {
                    minTemp = temperature;
                }

                if (weatherConditions[weatherCondition]) {
                    weatherConditions[weatherCondition]++;
                } else {
                    weatherConditions[weatherCondition] = 1;
                }
            });

            const averageTemp = totalTemp / timestamps.length;

            let dominantWeatherCondition = null;
            let maxCount = 0;
            for (const condition in weatherConditions) {
                if (weatherConditions[condition] > maxCount) {
                    maxCount = weatherConditions[condition];
                    dominantWeatherCondition = condition;
                }
            }

            return {
                averageTemperature: averageTemp.toFixed(2),
                maxTemperature: maxTemp.toFixed(2),
                minTemperature: minTemp.toFixed(2),
                dominantWeatherCondition, 
            };
        }

        const fetchWeatherForCity = async (city, lat, lon) => {
            try {
                const response = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
                );
                if (!response.ok) {
                    throw new Error(`Failed to fetch weather data for ${city}`);
                }
                const data = await response.json();
                setWeatherData(prevData => ({
                    ...prevData,
                    [city]: data
                }));

                const timestamp = new Date();

                setDailyData(prevData => {
                    const updatedDailyData = {
                        ...prevData,
                        [city]: {
                            ...prevData[city],
                            [timestamp]: data
                        }
                    };

                    setDailySummaryData(prevSummary => ({
                        ...prevSummary,
                        [city]: calculateDailyWeatherSummary(updatedDailyData, city)
                    }));

                    return updatedDailyData;
                });

            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        const fetchWeatherForAllCities = () => {
            setLoading(true);
            Object.keys(cityCoordinates).forEach(city => {
                const { lat, lon } = cityCoordinates[city];
                fetchWeatherForCity(city, lat, lon);
            });
        };

        fetchWeatherForAllCities();

        const intervalId = setInterval(() => {
            fetchWeatherForAllCities();
        }, interval * 60 * 1000);

        return () => clearInterval(intervalId);  
    }, [apiKey, interval]);

    useEffect(() => {
        const checkThresholds = () => {
            const alertArray = Object.keys(weatherData).filter(city => {
                if (weatherData[city]) {
                    const cityTemperature = temperature == "Celsius" ? weatherData[city].main.temp : (weatherData[city].main.temp + 273.15).toFixed(2);
    
                    if(cityTemperature > temperatureThreshold.max || cityTemperature < temperatureThreshold.min) {
                        alert("Temperature Threshold Exceeded for City: " + city);
                        return true;
                    }
                    else
                        return false;
                }
                return false;
            }).map(city => ({
                name: city,
                temperature: weatherData[city].main.temp
            }));
            setAlertArray(alertArray);
        };
    
        checkThresholds();
    
    }, [temperatureThreshold, weatherData, dailyData]);

    return (
        <div>
            <Header/>
            <div className="flex justify-center space-x-3">
                <IntervalSlider setValue = {setIntervalState}/>
                <TemperatureThresholdSlider setValue = {setTemperatureThreshold} temperatureUnit = {temperature}/>
                <TemperatureSelection setTemperature={setTemperature}/>
            </div>
            
            <div className="p-8">
                {loading && <p className="text-center">Loading...</p>}
                {error && <p className="text-center text-red-500">Error: {error}</p>}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.keys(cityCoordinates).map(city => (
                        <div
                            key={city}
                            className="border border-gray-300 rounded-lg shadow-lg p-6 bg-white hover:bg-gray-100 transition-all duration-300"
                        >
                            <h2 className="text-xl font-semibold mb-2 text-gray-800">{city}</h2>
                            {weatherData[city] ? (
                                <div>
                                    <p className="text-gray-600">
                                        <strong>Weather:</strong> {weatherData[city].weather[0].description}
                                    </p>
                                    <p className="text-gray-600">
                                        <strong>Temperature:</strong>
                                        {
                                            temperature === "Celsius" ? 
                                                ` ${weatherData[city].main.temp.toFixed(2)} °C` 
                                            : temperature === "Kelvin" ? 
                                                ` ${(weatherData[city].main.temp + 273.15).toFixed(2)} K` 
                                            : null
                                        }
                                    </p>
                                    <p className="text-gray-600">
                                        <strong>Feels Like:</strong>
                                        {
                                            temperature === "Celsius" ? 
                                                ` ${weatherData[city].main.feels_like.toFixed(2)} °C` 
                                            : temperature === "Kelvin" ? 
                                                ` ${(weatherData[city].main.feels_like + 273.15).toFixed(2)} K` 
                                            : null
                                        }
                                    </p>
                                    <p className="text-gray-600">
                                        <strong>Unix Timestamp:</strong> {weatherData[city].dt}
                                    </p>
                                </div>
                            ) : (
                                <p className="text-gray-500">No data available</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex justify-center space-x-3 mb-6">
                <button
                        onClick={()=>{setAlerts(!alerts)}}
                        className="bg-blue-600 text-white py-2 px-4 rounded shadow hover:bg-blue-700 transition"
                >
                        Toggle Alerts
                </button>
            </div>
            {alerts && (
                <div className="bg-blue-600 text-white text-center p-4 rounded mb-6 w-fit flex flex-col mx-auto">
                    {alertArray.length > 0 ? (
                        <div>
                            {alertArray.map((cityWeather, index) => (
                                <div key={index} className="flex justify-between p-2 border-b border-white space-x-4">
                                    <span>{cityWeather.name}</span>
                                    <span>{cityWeather.temperature} °C</span>
                                    <span>{(cityWeather.temperature + 273.15).toFixed(2)} K</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No Alerts</p>
                    )}
                </div>
            )}
            
            <div className="flex justify-center space-x-3">
                <h1 className="text-center text-3xl font-semibold mb-2 text-blue-600 border border-blue-800 shadow-lg pl-12 pr-12 pt-6 pb-6 bg-blue-200">Daily Weather Summary</h1>
            </div>
            <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.keys(cityCoordinates).map(city => {
                        return (
                            <div
                                key={city}
                                className="border border-gray-300 rounded-lg shadow-lg p-6 bg-white hover:bg-gray-100 transition-all duration-300"
                            >
                                <h2 className="text-xl font-semibold mb-2 text-gray-800">{city}</h2>
                                {dailySummaryData[city] && (
                                    <div>
                                        <p className="text-gray-600">
                                            <strong>Average Temperature:</strong> 
                                            {
                                                temperature == "Celsius" 
                                                ? ` ${dailySummaryData[city].averageTemperature} °C`
                                                : ` ${(parseFloat(dailySummaryData[city].averageTemperature) + 273.15).toFixed(2)} K`
                                            }
                                        </p>
                                        <p className="text-gray-600">
                                            <strong>Max Temperature:</strong>
                                            {
                                                temperature == "Celsius" 
                                                ? ` ${dailySummaryData[city].maxTemperature} °C`
                                                : ` ${(parseFloat(dailySummaryData[city].maxTemperature) + 273.15).toFixed(2)} K`
                                            }
                                        </p>
                                        <p className="text-gray-600">
                                            <strong>Min Temperature:</strong>
                                            {
                                                temperature == "Celsius" 
                                                ? ` ${dailySummaryData[city].minTemperature} °C`
                                                : ` ${(parseFloat(dailySummaryData[city].minTemperature) + 273.15).toFixed(2)} K`
                                            }
                                        </p>
                                        <p className="text-gray-600">
                                            <strong>Dominant Weather Condition:</strong> {dailySummaryData[city].dominantWeatherCondition}
                                        </p>

                                        <div className="mt-4">
                                        <Line
                                        data={{
                                            datasets: [
                                                {
                                                    label: 'Temperature',
                                                    data: Object.keys(dailyData[city]).map(timestamp => ({
                                                        x: new Date(timestamp),
                                                        y: dailyData[city][timestamp].main.temp
                                                    })),
                                                    borderColor: 'rgba(75,192,192,1)',
                                                    backgroundColor: 'rgba(75,192,192,0.2)',
                                                    fill: true
                                                }
                                            ]
                                        }}
                                        options={{
                                            scales: {
                                                x: {
                                                    type: 'time', 
                                                    time: {
                                                        unit: 'second',
                                                        displayFormats: {
                                                            second: 'HH:mm:ss'
                                                        }
                                                    },
                                                    title: {
                                                        display: true,
                                                        text: 'Time (HH:mm:ss)'
                                                    }
                                                },
                                                y: {
                                                    title: {
                                                        display: true,
                                                        text: 'Temperature (°C)'
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
