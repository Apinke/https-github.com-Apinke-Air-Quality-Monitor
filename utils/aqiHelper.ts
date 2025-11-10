import { AQI_LEVELS_CONFIG, UNKNOWN_AQI_CONFIG } from '../constants';
import { AQILevel } from '../types';

export const getAQIConfig = (aqi: number) => {
    if (aqi >= 0 && aqi <= 50) return AQI_LEVELS_CONFIG[AQILevel.Good];
    if (aqi >= 51 && aqi <= 100) return AQI_LEVELS_CONFIG[AQILevel.Moderate];
    if (aqi >= 101 && aqi <= 150) return AQI_LEVELS_CONFIG[AQILevel.UnhealthyForSensitiveGroups];
    if (aqi >= 151 && aqi <= 200) return AQI_LEVELS_CONFIG[AQILevel.Unhealthy];
    if (aqi >= 201 && aqi <= 300) return AQI_LEVELS_CONFIG[AQILevel.VeryUnhealthy];
    if (aqi >= 301) return AQI_LEVELS_CONFIG[AQILevel.Hazardous];
    return UNKNOWN_AQI_CONFIG;
};
