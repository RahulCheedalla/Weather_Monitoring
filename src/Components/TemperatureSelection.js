import React from "react";
import { useState } from "react";

export default function TemperatureSelection({setTemperature}) {
    const [temperatureUnit, setTemperatureUnit] = useState("Celsius");
    const handleUnitChange = (event) => {
        setTemperatureUnit(event.target.value);
        setTemperature(event.target.value);
    };

    return (
        <div className="p-8 border border-blue-800 shadow-lg mt-6 mr-6 flex flex-col w-[30%]">
            <h2 className="text-xl font-bold mb-4 text-blue-600">Temperature Unit:</h2>
            <div className="flex space-x-6">
                <label className="flex items-center">
                    <input
                        type="radio"
                        name="temperatureUnit"
                        value="Celsius"
                        checked={temperatureUnit === "Celsius"}
                        onChange={handleUnitChange}
                        className="form-radio h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2 text-blue-600 font-bold">Celsius</span>
                </label>

                <label className="flex items-center">
                    <input
                        type="radio"
                        name="temperatureUnit"
                        value="Kelvin"
                        checked={temperatureUnit === "Kelvin"}
                        onChange={handleUnitChange}
                        className="form-radio h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2 text-blue-600 font-bold">Kelvin</span>
                </label>
            </div>  
        </div>
    );
}