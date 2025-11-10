import React from 'react';

export const ServerIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5 text-sky-400" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 17.25v-.228a4.5 4.5 0 00-.12-1.03l-2.268-9.64a3.375 3.375 0 00-3.285-2.602H7.923a3.375 3.375 0 00-3.285 2.602l-2.268 9.64a4.5 4.5 0 00-.12 1.03v.228m15.459 0a2.25 2.25 0 01-2.25 2.25h-10.5a2.25 2.25 0 01-2.25-2.25m15 0v.228a2.25 2.25 0 002.25 2.25h.934l-.543-2.32a2.25 2.25 0 00-2.064-1.63H4.25a2.25 2.25 0 00-2.064 1.63l-.543 2.32h.934a2.25 2.25 0 002.25-2.25v-.228" />
    </svg>
);