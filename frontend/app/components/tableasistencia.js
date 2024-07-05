'use client'

import Link from 'next/link';
import React, { useState,  } from 'react';

export const Listaasistencia = () =>{
    return(
        <div>
            <table className="min-w-full text-left table-auto bg-white">
            <thead>
                <tr>
                    <th className="px-4 py-3 border-2 border-gray-200 bg-gray-100 text-sm font-semibold text-gray-700">Número de Documento</th>
                    <th className="px-4 py-3 border-2 border-gray-200 bg-gray-100 text-sm font-semibold text-gray-700">Nombres y Apellidos</th>

                    
                </tr>
            </thead>
            </table>
        </div>
    )
}


