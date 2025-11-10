import { GoogleGenAI, Type } from "@google/genai";
import { AirQualityData, AQILevel, HistoricalDataPoint } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const airQualitySchema = {
  type: Type.OBJECT,
  properties: {
    aqi: { type: Type.INTEGER, description: "The Air Quality Index (AQI) value, as a number between 0 and 500." },
    city: { type: Type.STRING, description: "The city or area for the provided air quality data." },
    dominantPollutant: { type: Type.STRING, description: "The main pollutant affecting the air quality (e.g., PM2.5, O3, NO2, SO2, CO)." },
    aqiLevel: {
      type: Type.STRING,
      enum: Object.values(AQILevel),
      description: `The AQI category name. Must be one of: '${Object.values(AQILevel).join("', '")}'.`
    },
    healthRecommendations: {
      type: Type.OBJECT,
      properties: {
        generalPublic: { type: Type.STRING, description: "Health advice for the general population, written in a clear and concise manner." },
        sensitiveGroups: { type: Type.STRING, description: "Specific health advice for sensitive groups like children, elderly, or people with respiratory issues, written in a clear and concise manner." }
      },
      required: ["generalPublic", "sensitiveGroups"]
    },
  },
  required: ["aqi", "city", "dominantPollutant", "aqiLevel", "healthRecommendations"],
};

const historicalAirQualitySchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            date: { type: Type.STRING, description: "The date for the data point in YYYY-MM-DD format." },
            aqi: { type: Type.INTEGER, description: "The average Air Quality Index (AQI) value for that day." },
        },
        required: ["date", "aqi"],
    },
};

export const getAirQualityData = async (lat: number, lon: number): Promise<AirQualityData> => {
    try {
        const prompt = `
        Analyze the current air quality for the location at latitude ${lat} and longitude ${lon}.
        Provide a JSON response adhering to the specified schema.
        - The 'city' should be the nearest major city or recognizable area.
        - The 'aqiLevel' must be one of the exact strings provided in the schema description.
        - Health recommendations should be practical and easy to understand for a general audience.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: airQualitySchema,
                temperature: 0.2,
            },
        });

        const jsonString = response.text.trim();
        const data = JSON.parse(jsonString);

        if (!Object.values(AQILevel).includes(data.aqiLevel)) {
            console.warn(`API returned an unexpected AQI level: ${data.aqiLevel}.`);
            // We can proceed but the UI might show 'Unknown'.
        }

        return data as AirQualityData;
    } catch (error) {
        console.error("Error fetching air quality data from Gemini:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to get air quality data: ${error.message}`);
        }
        throw new Error("An unknown error occurred while fetching air quality data.");
    }
};

export const getHistoricalAirQualityData = async (lat: number, lon: number): Promise<HistoricalDataPoint[]> => {
    try {
        const prompt = `
        Generate a plausible 7-day air quality history for the location at latitude ${lat} and longitude ${lon}.
        The history should end on today's date. Provide a JSON response adhering to the specified schema,
        which is an array of 7 objects. Each object must have a 'date' (in YYYY-MM-DD format) and an 'aqi' value.
        The data should show some realistic daily fluctuation and be sorted in chronological order.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: historicalAirQualitySchema,
                temperature: 0.5,
            },
        });

        const jsonString = response.text.trim();
        const data = JSON.parse(jsonString) as HistoricalDataPoint[];

        if (!Array.isArray(data) || data.length === 0) {
            throw new Error("API returned invalid historical data format.");
        }
        
        return data.slice(-7);

    } catch (error) {
        console.error("Error fetching historical air quality data from Gemini:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to get historical air quality data: ${error.message}`);
        }
        throw new Error("An unknown error occurred while fetching historical air quality data.");
    }
};
