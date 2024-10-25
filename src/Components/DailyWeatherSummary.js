import React, { useEffect, useState } from "react";

export default function DailyWeatherSummary({ weatherData }) {
    const [dailySummaries, setDailySummaries] = useState([]);

    const aggregateDailyData = (data) => {
        const dailyData = {};

        data.forEach((item) => {
            const date = new Date(item.dt * 1000).toDateString(); 

            if (!dailyData[date]) {
                dailyData[date] = {
                    temperatures: [],
                    conditions: [],
                };
            }

            dailyData[date].temperatures.push(item.main.temp);
            dailyData[date].conditions.push(item.weather[0].main);
        });

        const summaries = Object.keys(dailyData).map((date) => {
            const temps = dailyData[date].temperatures;
            const conditions = dailyData[date].conditions;

            const averageTemp = (temps.reduce((sum, temp) => sum + temp, 0) / temps.length).toFixed(2);
            const maxTemp = Math.max(...temps).toFixed(2);
            const minTemp = Math.min(...temps).toFixed(2);

            const conditionFrequency = {};
            conditions.forEach((condition) => {
                conditionFrequency[condition] = (conditionFrequency[condition] || 0) + 1;
            });
            const dominantCondition = Object.keys(conditionFrequency).reduce((a, b) => 
                conditionFrequency[a] > conditionFrequency[b] ? a : b
            );

            return {
                date,
                averageTemp,
                maxTemp,
                minTemp,
                dominantCondition,
            };
        });

        return summaries;
    };

    useEffect(() => {
        if (weatherData.length > 0) {
            const summaries = aggregateDailyData(weatherData);
            setDailySummaries(summaries);
        }
    }, [weatherData]);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-semibold mb-4">Daily Weather Summary</h1>
            {dailySummaries.length === 0 ? (
                <p>Loading weather data...</p>
            ) : (
                <table className="table-auto w-full">
                    <thead>
                        <tr>
                            <th className="px-4 py-2">Date</th>
                            <th className="px-4 py-2">Average Temp (°C)</th>
                            <th className="px-4 py-2">Max Temp (°C)</th>
                            <th className="px-4 py-2">Min Temp (°C)</th>
                            <th className="px-4 py-2">Dominant Condition</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dailySummaries.map((summary) => (
                            <tr key={summary.date}>
                                <td className="border px-4 py-2">{summary.date}</td>
                                <td className="border px-4 py-2">{summary.averageTemp}</td>
                                <td className="border px-4 py-2">{summary.maxTemp}</td>
                                <td className="border px-4 py-2">{summary.minTemp}</td>
                                <td className="border px-4 py-2">{summary.dominantCondition}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
