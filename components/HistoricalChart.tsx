import React from 'react';
import { HistoricalDataPoint } from '../types';
import { getAQIConfig } from '../utils/aqiHelper';

interface HistoricalChartProps {
    data: HistoricalDataPoint[];
}

const dayFormatter = new Intl.DateTimeFormat('en-US', { weekday: 'short' });
const getDayAbbreviation = (dateString: string): string => {
    const date = new Date(`${dateString}T12:00:00Z`); // Use noon UTC to avoid timezone shifts
    return dayFormatter.format(date);
};

export const HistoricalChart: React.FC<HistoricalChartProps> = ({ data }) => {
    const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(-7);
    const maxAqi = Math.max(...sortedData.map(d => d.aqi), 150);

    return (
        <div className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-lg w-full border border-slate-700">
            <h3 className="text-md font-semibold text-slate-300 mb-4">7-Day AQI Trend</h3>
            <div className="flex justify-around items-end h-48 space-x-2 text-center">
                {sortedData.map((point) => {
                    const config = getAQIConfig(point.aqi);
                    const barHeight = `${(point.aqi / maxAqi) * 85}%`;

                    return (
                        <div key={point.date} className="flex flex-col justify-end items-center flex-1 h-full">
                            <span className="text-xs font-medium text-slate-200">{point.aqi}</span>
                            <div 
                                className={`w-3/4 rounded-t-md transition-all duration-500 ${config.color}`}
                                style={{ height: barHeight }}
                                title={`${config.label}: ${point.aqi}`}
                            >
                            </div>
                            <span className="text-xs text-slate-400 mt-2">{getDayAbbreviation(point.date)}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
