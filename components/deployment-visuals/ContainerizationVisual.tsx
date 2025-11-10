import React from 'react';
import { DockerIcon } from '../icons/DockerIcon';
import { CodeBracketIcon } from '../icons/CodeBracketIcon';

export const ContainerizationVisual: React.FC = () => (
    <div className="flex items-center justify-center w-full">
        <CodeBracketIcon className="w-20 h-20 text-slate-500" />
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 mx-4 text-slate-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
        </svg>
        <DockerIcon className="w-24 h-24 text-sky-500" />
    </div>
);