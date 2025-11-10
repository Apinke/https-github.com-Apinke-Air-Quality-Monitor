export enum AQILevel {
  Good = "Good",
  Moderate = "Moderate",
  UnhealthyForSensitiveGroups = "Unhealthy for Sensitive Groups",
  Unhealthy = "Unhealthy",
  VeryUnhealthy = "Very Unhealthy",
  Hazardous = "Hazardous",
}

export interface AirQualityData {
  aqi: number;
  city: string;
  dominantPollutant: string;
  aqiLevel: AQILevel;
  healthRecommendations: {
    generalPublic: string;
    sensitiveGroups: string;
  };
}

export interface HistoricalDataPoint {
  date: string; // YYYY-MM-DD
  aqi: number;
}
