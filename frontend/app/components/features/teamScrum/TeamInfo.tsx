'use client';

import React from 'react';

interface TeamInfoProps {
    label: string;
    value?: string | number | null;
}

export const TeamInfo: React.FC<TeamInfoProps> = ({ label, value }) => {
    return (
        <div className="bg-gray-50 dark:bg-shadowBlue/50 rounded-lg p-3 mb-3">
            <div className="flex items-center space-x-2 mb-1">
                <div className="w-2 h-2 bg-primary dark:bg-darkBlue rounded-full"></div>
                <span className="text-xs font-medium text-grayText dark:text-white uppercase tracking-wide">
                    {label}
                </span>
            </div>
            <p className="text-sm text-black dark:text-white bg-white dark:bg-shadowBlue px-2 py-1 rounded">
                {value || 'Sin información'}
            </p>
        </div>
    );
};
