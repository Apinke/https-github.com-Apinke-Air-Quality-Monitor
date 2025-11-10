import React from 'react';
import { KeyIcon } from '../icons/KeyIcon';

export const ApiKeyVisual: React.FC = () => (
    <div className="relative flex items-center justify-center w-36 h-36">
        <div className="absolute inset-0 border-2 border-dashed border-slate-600 rounded-full animate-spin [animation-duration:10s]"></div>
        <KeyIcon className="w-20 h-20 text-sky-400" />
    </div>
);