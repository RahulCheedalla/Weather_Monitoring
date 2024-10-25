import React from "react";
import { useState, useEffect } from "react";

export default function TemperatureThresholdSlider({setValue, temperatureUnit}) {

    const [minSliderValue, setMinSliderValue] = useState(20);  
    const [maxSliderValue, setMaxSliderValue] = useState(40);

    const handleMinSliderChange = (event) => {
        setMinSliderValue(event.target.value);
        setValue(
            {
                "min": minSliderValue,
                "max": maxSliderValue,
                "unit": temperatureUnit
            }
        );
        console.log(minSliderValue, maxSliderValue, temperatureUnit);
    };

    const handleMaxSliderChange = (event) => {
        setMaxSliderValue(event.target.value);
        setValue(
            {
                "min": minSliderValue,
                "max": maxSliderValue,
                "unit": temperatureUnit
            }
        );
        console.log(minSliderValue, maxSliderValue, temperatureUnit);
    };

    const handleSubmit = () => {
        if(minSliderValue > maxSliderValue)
            alert("Invalid Threshold");
        else {
            setValue(
                {
                    "min": minSliderValue,
                    "max": maxSliderValue,
                    "unit": temperatureUnit
                }
            );
            alert("Threshold Applied");
            console.log(minSliderValue, maxSliderValue, temperatureUnit);
        }
    };

    useEffect(() => {
        
        if (temperatureUnit === "Celsius") {
            setMinSliderValue(20);
            setMaxSliderValue(40);
        } else {
            setMinSliderValue(293.15);
            setMaxSliderValue(313.15);
        }
        setValue(
            {
                "min": minSliderValue,
                "max": maxSliderValue,
                "unit": temperatureUnit
            }
        );

    }, [temperatureUnit, setValue]);

    return (
        <div className="p-8 border border-blue-800 shadow-lg mt-6 ml-6 flex flex-col w-[30%]">
            <h1 className="text-xl font-bold text-blue-600 mb-4">Temperature Threshold Settings:</h1>
            <div className="flex justify-between items-center space-x-6">
                <div className="flex flex-col space-y-3">
                    <div className="flex space-x-6">
                        <h1 className="text-m font-bold text-blue-600">Minimum:
                            {temperatureUnit === "Celsius" ? ` (°C)` : ` (K)`}
                        </h1>
                        <input
                            type="text"
                            min={temperatureUnit === "Celsius" ? 0 : 273.15}
                            max={maxSliderValue}
                            value={minSliderValue}
                            onChange={handleMinSliderChange}
                            className="w-[40%] text-m font-bold text-blue-600 pl-2 border border-blue-800 shadow-lg rounded"
                        />
                    </div>
                    <div className="flex space-x-6">
                        <h1 className="text-m font-bold text-blue-600">Maximum:
                            {temperatureUnit === "Celsius" ? `(°C)` : `(K)`}
                        </h1>
                        <input
                            type="text"
                            min={minSliderValue}
                            max={temperatureUnit === "Celsius" ? 60 : (60 + 273.15).toFixed(2)}
                            value={maxSliderValue}
                            onChange={handleMaxSliderChange}
                            className="w-[40%] text-m font-bold text-blue-600 pl-2 border border-blue-800 shadow-lg rounded"
                        />
                    </div>
                </div>
                <button
                    onClick={handleSubmit}
                    className="bg-blue-600 text-white py-2 px-4 rounded shadow hover:bg-blue-700 transition"
                >
                    Apply
                </button>
            </div>
        </div>
    );
}