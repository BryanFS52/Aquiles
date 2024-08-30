import React from 'react';

const ModalVerMas = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className='flex flex-col my-6 items-center'>
      
        <span className='font-serif text-black-700'>Nombre del Team</span>
        <div className="rounded-lg border-solid border-2 text-custom-blue ">
                      <input type="text" name="document" placeholder='Nombre del Team' className='text-base text-gray-950 p-1 shadow-lg' />
                  </div><br/><br/>
      <span className='font-serif text-black-700'>Integrantes</span>
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="py-2 align-middle inline-block min-w-full">
            <div className="overflow-hidden border border-gray-300 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Num Doc
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre Completo
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">12345678</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">Juan Pérez</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default ModalVerMas;