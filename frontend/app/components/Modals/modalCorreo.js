import React from "react";

const ModalCorreo = ({ isOpen, onClose, onSendEmail }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-custom-blue bg-opacity-50">
                <div className="bg-white w-1/4 h-72 border-2 border-gray-400 rounded-lg">
                    <h2 className="text-2xl mb-4 text-center pt-9 font-medium">¿Está Seguro de enviar el Correo Electrónico?</h2>
                    <button
                        onClick={onClose}
                        className="ml-14 text-white font-semibold text-xl font-inter h-14 w-36 rounded-lg px-5 my-6 bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-600 border-2 border-red-700">
                        NO
                    </button>

                    <button
                        onClick={onSendEmail}
                        className="ml-14 text-white font-semibold font-inter h-14 w-36 rounded-lg text-xl px-5 my-6 bg-green-600 dark:hover:bg-green-600 dark:focus:ring-green-400 border-2 border-green-700">
                        SI
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalCorreo;