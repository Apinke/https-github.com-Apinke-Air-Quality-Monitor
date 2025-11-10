import React from 'react';

interface DetailsCardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
}

export const DetailsCard: React.FC<DetailsCardProps> = ({ title, value, icon }) => {
    return (
        <div className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-lg w-full flex items-start space-x-4 border border-slate-700">
            <div className="flex-shrink-0 text-sky-400 mt-1">
                {icon}
            </div>
            <div>
                <h3 className="text-md font-semibold text-slate-300">{title}</h3>
                <p className="text-slate-100 text-base">{value}</p>
            </div>
        </div>
    );
};
