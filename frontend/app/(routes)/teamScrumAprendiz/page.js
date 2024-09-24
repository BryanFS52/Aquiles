"use client"

import React from "react";
import { Header } from "../../components/header"; //importaciones del header y del sidebar para hacer el llamado
import { Sidebaraprendiz } from "../../components/sidebaraprendiz";
import Image from 'next/image';
import aquiles from "../../../public/img/aquiles.jpg";
import { CgProfile } from "react-icons/cg";

export default function TeamScrum() {
        return (
          <div className="min-h-screen grid grid-cols-1 xl:grid-cols-6">
            <Sidebaraprendiz />
            <div className="xl:col-span-5">
              <Header />

              <div className="h-[90vh] overflow-y-scroll p-12 inline-block w-full">
              <h1 className="text-[#0e324d] text-2xl sm:text-3xl lg:text-4xl pb-3 border-b-2 border-gray-400 w-full sm:w-3/4 lg:w-1/2 mb-6 lg:mb-12 font-inter font-semibold">Mi Team Scrums</h1>
              <div className="w-[29%] h-44 mx-auto bg-white p-6 ml-2 rounded-lg shadow-md border-2 border-gray-200 flex">
                  <div className="flex items-center">
                  <div className="flex items-center">
                  <div className="w-36 h-36 relative overflow-hidden mr-4">
                    <Image src={aquiles} alt="Team Logo" className="rounded-full object-cover w-full h-full" />
                  </div>
                </div>
                <div className="ml-4">
                  <h1 className="text-2xl font-inter font-semibold text-center text-green-500"> Aquiles Team</h1>
                </div>
                </div>
      </div>
    </div>
  </div>
</div>
    );
}