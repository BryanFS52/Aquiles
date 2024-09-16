import React from 'react';

const ChecklistAprendices = () => {

    return (
        <div className="container w-2/3 ml-52">
                <table className="min-w-full divide-y divide-gray-200 border border-gray-200 table-auto">
                <thead className="bg-sky-950">
                  
                    <tr>
                        
                        <th className="px-4 py-3 w-20 border-2 border-gray-300 bg-sky-950 text-sm font-semibold text-white">Trimestre</th>
                        <th className="px-4 w-20 border-2 border-gray-300 bg-sky-950 text-sm font-semibold text-white text-center">Team</th>
                        <th className="px-4 w-52 border-2 border-gray-300 bg-sky-950 text-sm font-semibold text-white">Item</th>
                        <th className="px-4 w-10 border-2 border-gray-300 bg-sky-950 text-sm font-semibold text-white">SI</th>
                        <th className="px-4 w-10 border-2 border-gray-300 bg-sky-950 text-sm font-semibold text-white">NO</th>
                        <th className="px-4 w-52 border-2 border-gray-300 bg-sky-950 text-sm font-semibold text-white">Observaciones</th>
                    </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-300">

                        <tr>
                        <td className="px-8 py-10 border-2 border-gray-300 text-sm text-center">3° Trimestre</td>
                        <td className="px-2 py-8 border-2 border-gray-300 text-sm text-center">5</td>
                        <td className="px-4 py-3 border-2 border-gray-300 text-sm">Formato de sustentación de Proyectos (según modelo entregado por la Coordinación)</td>
                        <td className="px-4 py-3 border-2 border-gray-300 text-sm text-center">X</td>
                        <td className="px-4 py-3 border-2 border-gray-300 text-sm text-center">X</td>
                        <td className="px-4 py-3 border-2 border-gray-300 text-sm text-center">Mejorar en la intefaz de usuario</td>
                    </tr>

                    <tr>
                        <td className="px-4 py-3 border-2 border-gray-300 text-sm text-center">3° Trimestre</td>
                        <td className="px-2 border-2 border-gray-300 text-sm text-center">6</td>
                        <td className="px-4 py-3 border-2 border-gray-300 text-sm">Formato de sustentación de Proyectos (según modelo entregado por la Coordinación)</td>
                        <td className="px-4 py-3 border-2 border-gray-300 text-sm text-center">X</td>
                        <td className="px-4 py-3 border-2 border-gray-300 text-sm text-center">X</td>
                        <td className="px-4 py-3 border-2 border-gray-300 text-sm text-center">Mejorar en la intefaz de usuario</td>
                    </tr>
                </tbody>
                </table>
        </div>

    )
};
export default ChecklistAprendices