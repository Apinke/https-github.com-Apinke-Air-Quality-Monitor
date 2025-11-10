import React from 'react';
import { CheckCircleIcon } from '../icons/CheckCircleIcon';

export const SuccessVisual: React.FC = () => (
    <div className="flex flex-col items-center justify-center text-center">
        <CheckCircleIcon className="w-24 h-24 text-green-400 mb-4" />
        <p className="text-green-300 font-semibold">Service is live!</p>
        <a 
          href="https://air-quality-monitor-app.run.app" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-sm text-sky-400 hover:underline break-all"
        >
            https://air-quality-monitor-app.run.app
        </a>
    </div>
);