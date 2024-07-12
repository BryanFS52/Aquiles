import React from 'react';

const ModalCorreo = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      {/* Fondo opaco gris */}
      <div className="fixed inset-0 bg-cyan-900 opacity-35"></div>

      <div className="relative w-full max-w-md mx-auto my-12 bg-white rounded-lg shadow-lg">
        <div className="p-5">
          <div className='flex justify-center items-center'>
            <h1 className="text-2xl font-serif font-medium text-center">¿Esta Seguro de enviar el Correo Electronico?</h1>
          </div>
          <div className='flex mt-10 mr-2 space-x-16 justify-center py-7'>
            <button className='bg-red-600 hover:bg-red-600 border-2 border-red-800 text-white text-lg font-medium py-4 px-14 rounded' onClick={onClose} >
              NO
            </button>

            <button className='bg-green-500 hover:bg-green-500 border-2 border-green-700 text-white text-lg font-medium py-4 px-14 rounded'>
              SI
            </button>
            </div>
        </div>
      </div>
    </div>
  );
}

export default ModalCorreo;
