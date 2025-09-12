import React from 'react';
import { motion } from 'framer-motion';
import { FaRegListAlt } from 'react-icons/fa';
import { JustificationFormProps } from './types';
import JustificationFormComponent from '@components/features/justifications/justificationForm';

interface JustificationFormModalProps extends JustificationFormProps {
    formRef?: React.RefObject<HTMLDivElement>;
}

export const JustificationFormModal: React.FC<JustificationFormModalProps> = ({
    form,
    justificationTypesData,
    loadingJustificationTypes,
    loadingJustification,
    onSave,
    onCancel,
    onInputChange,
    onTextInputChange,
    onNumericInputChange,
    onFileChange,
    onUpdateJustificationTypeId,
    fileRef,
    fileInputRefPrev,
    formRef,
}) => {
    return (
        <motion.div
            ref={formRef}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="bg-white rounded-xl shadow-2xl p-6 border border-gray-100 dark:border-dark-border dark:bg-dark-card dark:text-dark-text"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <div className="bg-gradient-to-r dark:from-shadowBlue dark:to-darkBlue from-primary to-lime-500 p-3 rounded-full shadow-lg">
                        <FaRegListAlt className="text-2xl text-white" />
                    </div>
                    <div className="ml-4">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-dark-text">
                            Formulario de Justificación
                        </h2>
                        <p className="text-gray-600 dark:text-dark-textSecondary text-sm">
                            Completa los datos para justificar tu ausencia
                        </p>
                    </div>
                </div>
                <button
                    onClick={onCancel}
                    className="text-gray-400 dark:hover:text-gray-100 hover:text-gray-600 text-2xl transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-full"
                >
                    ×
                </button>
            </div>

            <div className="mt-6">
                <JustificationFormComponent
                    form={form}
                    justificationTypesData={justificationTypesData}
                    loadingJustificationTypes={loadingJustificationTypes}
                    loadingJustification={loadingJustification}
                    handleSave={onSave}
                    handleCancel={onCancel}
                    handleInputChange={onInputChange}
                    handleTextInputChange={onTextInputChange}
                    handleNumericInputChange={onNumericInputChange}
                    handleFileChange={onFileChange}
                    updateJustificationTypeId={onUpdateJustificationTypeId}
                    fileRef={fileRef}
                    fileInputRefPrev={fileInputRefPrev}
                />
            </div>
        </motion.div>
    );
};
