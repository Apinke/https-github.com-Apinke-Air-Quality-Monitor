import React from 'react';

export const Header: React.FC = () => {
    return (
        <header className="w-full max-w-4xl mx-auto p-4 md:p-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                Air Quality Monitor
            </h1>
            <p className="mt-2 text-lg text-slate-300">
                Get real-time air quality data powered by Gemini.
            </p>
        </header>
    );
};
