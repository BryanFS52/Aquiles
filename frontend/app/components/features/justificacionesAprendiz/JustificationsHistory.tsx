import React from 'react';
import { motion } from 'framer-motion';
import { JustificationsHistoricalProps } from './types';
import JustificationsHistorical from '@/components/features/JustificacionesAprendiz/justificationsHistorical';

export const JustificationsHistory: React.FC<JustificationsHistoricalProps> = ({
    data,
    loading,
}) => {
    return (
        <motion.div
            key="justification-history"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="bg-white rounded-xl shadow-2xl p-3 sm:p-4 md:p-6 border border-gray-100 dark:border-gray-800 dark:bg-[#002033]"
        >
            <JustificationsHistorical
                data={data}
                loading={loading}
            />
        </motion.div>
    );
};
