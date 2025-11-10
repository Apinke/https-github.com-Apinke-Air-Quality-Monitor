import React from 'react';
import { UploadCloudIcon } from '../icons/UploadCloudIcon';
import { ServerIcon } from '../icons/ServerIcon';

export const CloudRunVisual: React.FC = () => (
    <div className="flex items-center justify-center w-full">
        <UploadCloudIcon className="w-24 h-24 text-sky-400" />
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 mx-4 text-slate-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
        </svg>
        <ServerIcon className="w-24 h-24 text-sky-500" />
    </div>
);