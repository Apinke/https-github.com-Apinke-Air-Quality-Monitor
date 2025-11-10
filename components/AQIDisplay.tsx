import React from 'react';
import { AQI_LEVELS_CONFIG, UNKNOWN_AQI_CONFIG } from '../constants';
import { AirQualityData } from '../types';

interface AQIDisplayProps {
    data: AirQualityData;
}

export const AQIDisplay: React.FC<AQIDisplayProps> = ({ data }) => {
    const config = AQI_LEVELS_CONFIG[data.aqiLevel] ?? UNKNOWN_AQI_CONFIG;
    const textClass = data.aqiLevel === 'Moderate' ? 'text-black' : 'text-white';

    return (
        <div className="flex flex-col items-center space-y-4">
            <p className="text-2xl font-medium text-slate-200">{data.city}</p>
            <div className={`relative w-48 h-48 rounded-full flex flex-col items-center justify-center ${config.color} shadow-2xl transition-all duration-500`}>
                <span className={`text-6xl font-bold ${textClass}`}>{data.aqi}</span>
                <span className={`text-lg font-medium ${textClass}`}>AQI</span>
            </div>
            <p className={`text-2xl font-semibold ${config.textColor}`}>
                {config.label}
            </p>
        </div>
    );
};
