import { AQILevel } from './types';

interface AQIConfig {
  label: string;
  color: string;
  textColor: string;
  range: string;
}

export const AQI_LEVELS_CONFIG: Record<AQILevel, AQIConfig> = {
  [AQILevel.Good]: {
    label: "Good",
    color: "bg-green-500",
    textColor: "text-green-300",
    range: "0-50",
  },
  [AQILevel.Moderate]: {
    label: "Moderate",
    color: "bg-yellow-500",
    textColor: "text-yellow-300",
    range: "51-100",
  },
  [AQILevel.UnhealthyForSensitiveGroups]: {
    label: "Unhealthy for Sensitive Groups",
    color: "bg-orange-500",
    textColor: "text-orange-300",
    range: "101-150",
  },
  [AQILevel.Unhealthy]: {
    label: "Unhealthy",
    color: "bg-red-600",
    textColor: "text-red-400",
    range: "151-200",
  },
  [AQILevel.VeryUnhealthy]: {
    label: "Very Unhealthy",
    color: "bg-purple-600",
    textColor: "text-purple-400",
    range: "201-300",
  },
  [AQILevel.Hazardous]: {
    label: "Hazardous",
    color: "bg-red-800",
    textColor: "text-red-500",
    range: "301+",
  },
};

export const UNKNOWN_AQI_CONFIG: AQIConfig = {
  label: "Unknown",
  color: "bg-gray-600",
  textColor: "text-gray-400",
  range: "N/A",
};
