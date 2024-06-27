"use client"

import Link from "next/link";
import React, { useState,  } from 'react';

export const Attendance = () => {
    return(
        
        <div>

            <div className="h-[90vh] overflow-y-scroll p-12 inline-block w-full relative bg-neutral-100">
                <h1 className="font-serif text-4xl pb-3 border-b-2 border-black w-80">Lista de Asistencia</h1><br/><br/>

                <div className=" flex w-96 h-52 rounded-lg overflow-hidden shadow-lg bg-white border-2 border-gray-300 relative mb-4 p-4 ">
                <div className="z-50 justify-end space-y-3">

                <div className="space-y-2 flex">
                  <span className="font-serif text-lg">Institución</span>
                  <div className="rounded-lg border-solid border-2 text-custom-blue ml-10 ">
                  <input type="text" name="nameProject" placeholder="Centro al que pertenece" className="bg-neutral-300 "/>
                  </div>
                </div>

                <div className="space-y-2 flex">
                  <span className="font-serif text-lg">Responsable</span>
                  <div className="rounded-lg border-solid border-2 text-custom-blue ml-10 ">
                  <input type="text" name="nameProject" placeholder="Responsable" className="bg-neutral-300 "/>
                  </div>
                </div>

                <div className="space-y-2 flex">
                  <span className="font-serif text-lg">Fecha</span>
                  <div className="rounded-lg border-solid border-2 text-custom-blue ml-10 ">
                  <input type="text" name="nameProject" placeholder="Fecha" className="bg-neutral-300 "/>
                  </div>
                </div>
                

                <div className="space-y-2 flex">
                  <span className="font-serif text-lg">Materia</span>
                  <div className="rounded-lg border-solid border-2 text-custom-blue ml-10 ">
                  <input type="text" name="nameProject" placeholder="Materia" className="bg-neutral-300 "/>
                  </div>
                </div>

              </div>
            </div>
            </div>
        </div>
    )
    };