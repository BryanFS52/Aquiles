import React from 'react';
import { ToastContainer, toast } from "react-toastify"; 
import 'react-toastify/dist/ReactToastify.css';

const CheckListTable = () => {
    return (
        <div className="container w-2/3 ml-52">
        <table className="min-w-full divide-y divide-gray-200 border border-gray-200 table-auto">
        <thead className="bg-sky-950">
          
            <tr>
                
                <th className="px-4 py-3 w-20 border-2 border-gray-300 bg-sky-950 text-sm font-semibold text-white">Item</th>
                <th className="px-4 w-96 border-2 border-gray-300 bg-sky-950 text-sm font-semibold text-white text-center">Indicadores</th>
                <th className="px-4 w-20 border-2 border-gray-300 bg-sky-950 text-sm font-semibold text-white">Si</th>
                <th className="px-4 w-20 border-2 border-gray-300 bg-sky-950 text-sm font-semibold text-white">No</th>
                <th className="px-4 border-2 border-gray-300 bg-sky-950 text-sm font-semibold text-white">Observaciones</th>

                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-300">
                <tr>
                <td className="px-4 py-3 border-2 border-gray-300 text-sm text-center">1</td>
                <td className="px-2 border-2 border-gray-300 text-sm text-center">El software evidencia autenticación y manejo dinámico de roles.</td>
                <td className="px-4 py-3 border-2 border-gray-300 text-sm">
                <ul className="list-none">
                    <li className="flex items-center">
                    <input type="checkbox" id="item1" className="mr-2 ml-4 transform scale-150 custom-checkbox" />
                    </li>
                </ul>
                </td>
                <td className="px-4 py-3 border-2 border-gray-300 text-sm">
                <ul className="list-none">
                    <li className="flex items-center">
                    <input type="checkbox" id="item2" className="mr-2 ml-4 transform scale-150 custom-checkboxred" />
                    </li>
                </ul>
                </td>
                <td className="px-4 py-3 border-2 border-gray-300 text-sm"><span className="text-red-500 font-bold"></span></td>
            </tr>

            <tr>
                <td className="px-4 py-3 border-2 border-gray-300 text-sm text-center">1</td>
                <td className="px-2 border-2 border-gray-300 text-sm text-center">El software evidencia autenticación y manejo dinámico de roles.</td>
                <td className="px-4 py-3 border-2 border-gray-300 text-sm">
                <ul className="list-none">
                    <li className="flex items-center">
                    <input type="checkbox" id="item1" className="mr-2 ml-4 transform scale-150 custom-checkbox" />
                    </li>
                </ul>
                </td>
                <td className="px-4 py-3 border-2 border-gray-300 text-sm">
                <ul className="list-none">
                    <li className="flex items-center">
                    <input type="checkbox" id="item2" className="mr-2 ml-4 transform scale-150 custom-checkboxred" />
                    </li>
                </ul>
                </td>
                <td className="px-4 py-3 border-2 border-gray-300 text-sm"><span className="text-red-500 font-bold"></span></td>
            </tr>

            <tr>
                <td className="px-4 py-3 border-2 border-gray-300 text-sm text-center">1</td>
                <td className="px-2 border-2 border-gray-300 text-sm text-center">El software evidencia autenticación y manejo dinámico de roles.</td>
                <td className="px-4 py-3 border-2 border-gray-300 text-sm">
                <ul className="list-none">
                    <li className="flex items-center">
                    <input type="checkbox" id="item1" className="mr-2 ml-4 transform scale-150 custom-checkbox" />
                    </li>
                </ul>
                </td>
                <td className="px-4 py-3 border-2 border-gray-300 text-sm">
                <ul className="list-none">
                    <li className="flex items-center">
                    <input type="checkbox" id="item2" className="mr-2 ml-4 transform scale-150 custom-checkboxred" />
                    </li>
                </ul>
                </td>
                <td className="px-4 py-3 border-2 border-gray-300 text-sm"><span className="text-red-500 font-bold"></span></td>
                                    
            </tr>
        </tbody>
        </table>
    </div>
    );
};

export default CheckListTable;
