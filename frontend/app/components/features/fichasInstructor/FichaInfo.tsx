'use client';

import React from 'react';
import { FichaInfoProps } from './types';

export const FichaInfo: React.FC<FichaInfoProps> = ({ label, value }) => {
    if (!value && value !== 0) return null;

    return (
        <div>
            <p className="text-black dark:text-white font-semibold">{label}</p>
            <p className="text-gray-700 dark:text-gray-300">{value}</p>
        </div>
    );
};

export default FichaInfo;