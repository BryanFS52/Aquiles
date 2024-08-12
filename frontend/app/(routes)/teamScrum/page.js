"use client"

import React from "react";
import { Header } from "../../components/header"; //importaciones del header y del sidebar para hacer el llamado
import { Sidebaraprendiz } from "../../components/sidebaraprendiz";
import Image from 'next/image';
import aquiles from "../../../public/img/aquiles.jpg";
import { IoPersonCircleSharp } from "react-icons/io5";

export default function TeamScrum() {
    return (
      <div className="min-h-screen grid grid-cols-1 xl:grid-cols-6">
        <Sidebaraprendiz />
        <div className="xl:col-span-5">
          <Header />

          <div className="h-[90vh] overflow-y-scroll p-12 inline-block w-full">
          <h1 className="text-[#0e324d] text-2xl sm:text-3xl lg:text-4xl pb-3 border-b-2 border-gray-400 w-full sm:w-3/4 lg:w-1/2 mb-6 lg:mb-12 font-inter font-semibold">Teams Scrums</h1>

          <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-md border-2 border-gray-200 flex">
      <div className="w-1/2 pr-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-16 h-16 relative">
              <Image src={aquiles} alt="Team Logo" className="rounded-full w-36 h-16" />
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-serif text-green-500">Team Scrum</h1>
              <h2 className="text-xl text-gray-600 font-serif">Aquiles</h2>
            </div>
          </div>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-bold">Número del Equipo</h3>
          <p className="text-gray-700">Team 5</p>
          <h3 className="text-lg font-bold pt-8">Aprendices</h3>
          <ul>
           {['Santiago Gómez Rodríguez', 'María González López', 'Juan Carlos López García', 'Carolina Gutiérrez Ramírez'].map((name, index) => (
              <li key={index} className="flex items-center mb-2 pt-2">
                <div className="w-6 h-6 bg-gray-300 rounded-full mr-2">
                <IoPersonCircleSharp className="w-6 h-6"/>
                </div>
                <p>{name}</p>
              </li>
            ))} 
          </ul>
        </div>
      </div>

    </div>
    </div>
    </div>
    </div>
    );
}