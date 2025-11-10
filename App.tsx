import React, { useState, useCallback, useRef } from 'react';
import { getAirQualityData, getHistoricalAirQualityData } from './services/geminiService';
import { AirQualityData, HistoricalDataPoint } from './types';
import { Header } from './components/Header';
import { LoadingSpinner } from './components/LoadingSpinner';
import { AQIDisplay } from './components/AQIDisplay';
import { DetailsCard } from './components/DetailsCard';
import { PollutantIcon } from './components/icons/PollutantIcon';
import { AlertIcon } from './components/icons/AlertIcon';
import { HistoricalChart } from './components/HistoricalChart';
import { DeployGuide } from './components/DeployGuide';
import { MicrophoneIcon } from './components/icons/MicrophoneIcon';
import { GitHubIcon } from './components/icons/GitHubIcon';


// Fix for SpeechRecognition API: Add type definitions for Web Speech API
interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}
interface SpeechRecognitionResult {
  readonly [index: number]: SpeechRecognitionAlternative;
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
}
interface SpeechRecognitionResultList {
  readonly [index: number]: SpeechRecognitionResult;
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
}
interface SpeechRecognitionEvent extends Event {
  readonly results: SpeechRecognitionResultList;
  readonly resultIndex: number;
}
interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
}
interface SpeechRecognition extends EventTarget {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  continuous: boolean;
  start(): void;
  stop(): void;
  onstart: () => void;
  onend: () => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onresult: (event: SpeechRecognitionEvent) => void;
}
declare global {
  interface Window {
    SpeechRecognition: { new(): SpeechRecognition };
    webkitSpeechRecognition: { new(): SpeechRecognition };
  }
}

// Promisify getCurrentPosition for async/await usage
const getGeoLocation = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error("Geolocation is not supported by your browser."));
            return;
        }
        navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
        });
    });
}

// Check for SpeechRecognition API
// Fix: Renamed to avoid conflict with the SpeechRecognition interface type
const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
const isSpeechRecognitionSupported = !!SpeechRecognitionAPI;

const App: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [airQualityData, setAirQualityData] = useState<AirQualityData | null>(null);
    
    const [isHistoricalLoading, setIsHistoricalLoading] = useState<boolean>(false);
    const [historicalError, setHistoricalError] = useState<string | null>(null);
    const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[] | null>(null);

    const [showDeployGuide, setShowDeployGuide] = useState<boolean>(false);
    
    const [isListening, setIsListening] = useState<boolean>(false);
    const [voiceError, setVoiceError] = useState<string | null>(null);
    // Fix: Using the SpeechRecognition interface type which is now correctly resolved
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    

    const handleMeasure = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setAirQualityData(null);
        setIsHistoricalLoading(false);
        setHistoricalError(null);
        setHistoricalData(null);
        setVoiceError(null);

        let lat, lon;
        try {
            const position = await getGeoLocation();
            lat = position.coords.latitude;
            lon = position.coords.longitude;
        } catch (err) {
            if (err instanceof GeolocationPositionError) {
                setError(`Geolocation error: ${err.message}. Please enable location services and try again.`);
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred during geolocation.");
            }
            setIsLoading(false);
            return;
        }

        try {
            const data = await getAirQualityData(lat, lon);
            setAirQualityData(data);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred while fetching current air quality.");
            }
            setIsLoading(false);
            return;
        }
        
        setIsLoading(false);
        setIsHistoricalLoading(true);

        try {
            const history = await getHistoricalAirQualityData(lat, lon);
            setHistoricalData(history);
        } catch (err) {
            if (err instanceof Error) {
                setHistoricalError(err.message);
            } else {
                setHistoricalError("An unknown error occurred while fetching historical data.");
            }
        } finally {
            setIsHistoricalLoading(false);
        }
    }, []);

    const handleVoiceCommand = useCallback(() => {
        if (!isSpeechRecognitionSupported) {
            setVoiceError("Voice recognition is not supported by your browser.");
            return;
        }
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
            return;
        }

        // Fix: Use the renamed constant
        const recognition = new SpeechRecognitionAPI();
        recognitionRef.current = recognition;
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            setIsListening(true);
            setVoiceError(null);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.onerror = (event) => {
            if (event.error === 'no-speech' || event.error === 'audio-capture') {
                setVoiceError("No speech detected. Please try again.");
            } else if (event.error === 'not-allowed') {
                setVoiceError("Microphone access was denied.");
            } else {
                setVoiceError(`Voice error: ${event.error}`);
            }
            setIsListening(false);
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript.toLowerCase().trim();
            if (transcript.includes("check air quality") || transcript.includes("measure now") || transcript.includes("what's the air quality")) {
                handleMeasure();
            } else {
                setVoiceError("Command not recognized. Try 'Check air quality'.");
            }
        };

        recognition.start();

    }, [isListening, handleMeasure]);
    
    const renderContent = () => {
        if (isLoading) {
            return <LoadingSpinner />;
        }
        if (error) {
            return (
                <div className="text-center bg-red-900/50 border border-red-500 p-6 rounded-lg max-w-md w-full">
                    <h3 className="text-xl font-bold text-red-300">An Error Occurred</h3>
                    <p className="mt-2 text-red-200">{error}</p>
                </div>
            );
        }
        if (airQualityData) {
            return (
                <div className="w-full max-w-md mx-auto flex flex-col items-center">
                    <div className="w-full flex flex-col items-center space-y-6">
                        <AQIDisplay data={airQualityData} />
                        <div className="w-full space-y-4">
                            <DetailsCard 
                                title="Dominant Pollutant" 
                                value={airQualityData.dominantPollutant}
                                icon={<PollutantIcon className="w-8 h-8"/>}
                            />
                            <DetailsCard 
                                title="Health Advice (General Public)" 
                                value={airQualityData.healthRecommendations.generalPublic}
                                icon={<AlertIcon className="w-8 h-8"/>}
                            />
                             <DetailsCard 
                                title="Health Advice (Sensitive Groups)" 
                                value={airQualityData.healthRecommendations.sensitiveGroups}
                                icon={<AlertIcon className="w-8 h-8 text-yellow-400"/>}
                            />
                        </div>
                    </div>
                    
                    <div className="w-full mt-6">
                      {isHistoricalLoading && (
                        <div className="flex items-center justify-center bg-slate-800/50 p-4 rounded-lg border border-slate-700 h-[228px]">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-sky-400 mr-3"></div>
                            <span className="text-slate-300">Loading 7-day trend...</span>
                        </div>
                      )}
                      {historicalError && !isHistoricalLoading && (
                        <div className="text-center bg-red-900/50 border border-red-500 p-4 rounded-lg w-full">
                            <h3 className="text-lg font-bold text-red-300">Could not load history</h3>
                            <p className="mt-1 text-sm text-red-200">{historicalError}</p>
                        </div>
                      )}
                      {historicalData && !isHistoricalLoading && !historicalError && (
                          <HistoricalChart data={historicalData} />
                      )}
                    </div>
                </div>
            );
        }
        return (
            <div className="text-center max-w-md">
                <p className="text-xl text-slate-300">Click the button below to get the current air quality for your location.</p>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col font-sans bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black">
            <Header />
            <main className="flex-grow flex flex-col items-center justify-center p-4 transition-all duration-500 pb-36">
                {renderContent()}
            </main>

            {showDeployGuide && <DeployGuide onClose={() => setShowDeployGuide(false)} />}
            
            <footer className="sticky bottom-0 left-0 right-0 p-4 bg-slate-900/80 backdrop-blur-sm border-t border-slate-700/50">
                <div className="max-w-md mx-auto flex flex-col items-center gap-4">
                    {!airQualityData && !isLoading && !error && (
                        <button
                            onClick={handleMeasure}
                            className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-lg text-lg"
                        >
                            Measure Air Quality
                        </button>
                    )}
                    {(airQualityData || isLoading || error) && (
                         <button
                            onClick={handleMeasure}
                            className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-2.5 px-4 rounded-lg transition-colors"
                        >
                            Measure Again
                        </button>
                    )}
                    
                    <div className="w-full flex justify-center items-center gap-8 pt-2">
                        <button onClick={() => setShowDeployGuide(true)} className="text-slate-400 hover:text-white transition-colors text-sm">Deploy Guide</button>
                        
                        <div className="relative">
                            <button 
                                onClick={handleVoiceCommand} 
                                className={`p-3 rounded-full transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse-fast' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
                                aria-label={isListening ? 'Stop listening' : 'Start voice command'}
                            >
                                <MicrophoneIcon className="w-6 h-6"/>
                            </button>
                             {voiceError && <p className="absolute bottom-full mb-2 w-max max-w-xs bg-red-800 text-white text-xs rounded py-1 px-2 left-1/2 -translate-x-1/2">{voiceError}</p>}
                        </div>
                        
                        <a href="https://github.com/google/genai-js" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors text-sm flex items-center gap-1.5">
                            <GitHubIcon className="w-4 h-4" />
                            Source Code
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default App;