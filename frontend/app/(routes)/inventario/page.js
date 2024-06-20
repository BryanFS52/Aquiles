'use client'

import { Header } from "../../components/header";
import { Sidebar } from "../../components/sidebar";
import { CiSearch } from "react-icons/ci";
import { IoAddSharp } from "react-icons/io5";
import React, { useState } from 'react';
import Link from "next/link";


export default function Inventario () {
  const [selectedOption, setSelectedOption] = useState('10');

    return(
    <div className="min-h-screen grid grid-cols-1 xl:grid-cols-6">
      <Sidebar/>
    <div className="xl:col-span-5 ">
      <Header/>
    <div className="h-[90vh] overflow-y-scroll p-12 text-custom-blue bg-gray-200">
        <div className="bg-white border border-gray-400 flex-col 2 rounded-xl ">
          <div className="relative p-6 flex justify-between">
              <CiSearch className="absolute left-7 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input type="text" placeholder="Buscador" className="border rounded-sm pl-10 p-2" />
                <Link href="/productregister" className="bg-sena-blue hover:bg-custom-blues w-20 flex justify-center items-center rounded-xl border">
                  <IoAddSharp/>
                </Link>
              <div className="space-x-2 ">
                <span>{selectedOption}</span>
                  <select name="select" className="w-4" onChange={(e) => setSelectedOption(e.target.value)}>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="6">6</option>
                      <option value="7">7</option>
                      <option value="8">8</option>
                      <option value="9">9</option>
                      <option value="10">10</option>
                  </select>
                <span>Entradas por página</span>
              </div>

          </div>

          <div className="hidden md:grid grid-cols-1 md:grid-cols-6 gap-4 p-4 border">
            <h5>ID</h5>
            <h5>Lamina</h5>
            <h5>Producto</h5>
            <h5>Estado</h5>
            <h5>Fecha</h5>
            <h5>Valor</h5>
          </div>
          <div className=" ">
            <div className="">
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center mb-4 bg-secondary-900 p-4 rounded-xl">
                <div>
                  <h5 className="md:hidden text-white font-bold mb-8">ID</h5>
                  <span>#25546</span>
                </div>
              <div>
                  <h5 className="md:hidden text-white font-bold mb-2">Lamina</h5>
                  <span>#25546</span>
                </div>
                <div>
                  <h5 className="md:hidden text-white font-bold mb-2">Producto</h5>
                  <span>telefono</span>
                </div>
                <div className="">
                  <span className="bg-yellow-500/10 text-yellow-500 rounded-xl ">Reparacion</span>
                </div>
                <div>
                  <h5 className="md:hidden text-white font-bold mb-2">Producto</h5>
                  <span>07/07/2024</span>
                </div>
                <div>
                  <h5 className="md:hidden text-white font-bold mb-2">Producto</h5>
                  <span>8885.456</span>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  </div>
  </div>

    );
}