import React, { useState } from "react";

export default function IntervalSlider({setValue}) {
    
    const [sliderValue, setSliderValue] = useState(5);  

    const handleSliderChange = (event) => {
        setSliderValue(event.target.value);
        setValue(event.target.value);
    };

    return (
        <div className="p-8 border border-blue-800 shadow-lg mt-6 ml-6 flex flex-col w-[30%]">
            <h1 className="text-xl font-bold text-blue-600 mb-4">Update Interval (Minutes): {sliderValue}</h1>
            <div>
                <input
                    type="range"
                    min="1"
                    max="10"
                    value={sliderValue}
                    onChange={handleSliderChange}
                    className="w-full"
                />
            </div>
        </div>
    );
}
