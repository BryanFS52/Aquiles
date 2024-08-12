import React from "react";
import { Header } from "../../components/header"; //importaciones del header y del sidebar para hacer el llamado
import { Sidebar } from "../../components/sidebar";
import { FaComputer } from "react-icons/fa6";
import { AiOutlineStock } from "react-icons/ai";
import { GiTakeMyMoney } from "react-icons/gi";
import { BsPersonRolodex } from "react-icons/bs";
import { SlCalculator } from "react-icons/sl";
import { FaPeopleRoof } from "react-icons/fa6";
import { GrUserSettings } from "react-icons/gr";
import { LiaLanguageSolid } from "react-icons/lia";
import { FaPeopleCarry } from "react-icons/fa";

export default function Programas() {
  return (
    <div className="min-h-screen grid grid-cols-1 xl:grid-cols-6">
      <Sidebar />
      <div className="xl:col-span-5">
        <Header />

        <div className="h-[90vh] overflow-y-scroll p-12 inline-block w-full">
          <h1 className="text-4xl pb-3 border-b-2 border-gray-400 w-1/2 mb-12 font-serif"> Estos son los Programas</h1>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 ml-8 py-7 ">
            <div className=" flex w-96 h-52 rounded-lg overflow-hidden shadow-lg bg-zinc-200 relative mb-4 p-4 ">
              <div className=" z-50 justify-end p-4  space-y-4">
                <div className="space-y-2">
                  <span className="text-[#40b003] font-inter font-semibold text-xl">Analisis y Desarrollo <span className="block"> </span>de Software</span>
                  <p className="font-inter font-normal text-black text-sm sm:text-sm pr-5">El programa educativo tiene como objetivo formar profesionales expertos en diseñar, construir y mantener sistemas de información.</p>
                </div>
              </div>
              <FaComputer className="z-50 text-5xl text-white ml-auto w-40" />
             <div className="absolute top-0 right-0 w-0 h-0 border-t-[130px] border-[#0e324d] border-l-[190px] border-l-transparent -z-1"></div>  {/* Linea color azul que hace la division del triangulo */}
            </div>

            <div className=" flex w-96 h-52 rounded-lg overflow-hidden shadow-lg bg-zinc-200 relative mb-4 p-4 ">
              <div className=" z-50 justify-end p-4  space-y-4">
                <div className="space-y-2">
                  <span className="text-[#40b003] font-inter font-semibold text-xl">Gestion Empresarial </span>
                  <p className="font-inter font-normal text-black text-sm sm:text-sm pr-6">El programa educativo enseña a coordinar y apoyar todas las áreas de las empresas, así como a desarrollar ideas que puedan convertirse en negocios sostenibles.</p>
                </div>
              </div>
              <AiOutlineStock className="z-50 text-5xl text-white ml-auto w-40" />
              <div className="absolute top-0 right-0 w-0 h-0 border-t-[130px] border-[#0e324d] border-l-[190px] border-l-transparent -z-1"></div>
            </div>

            <div className=" flex w-96 h-52 rounded-lg overflow-hidden shadow-lg bg-zinc-200 relative mb-4 p-4 ">
              <div className=" z-50 justify-end p-4  space-y-4">
                <div className="space-y-2">
                  <span className="text-[#40b003] font-inter font-semibold text-xl">Gestión bancaria y entidades financieras </span>
                  <p className="font-inter font-normal text-black text-sm sm:text-sm">El programa enseña a analizar el mercado, evaluar inversiones y tomar decisiones estratégicas para maximizar rendimientos financieros.</p>
                </div>
              </div>
              <GiTakeMyMoney className="z-50 text-5xl text-white ml-auto w-40" />
              <div className="absolute top-0 right-0 w-0 h-0 border-t-[130px] border-[#0e324d] border-l-[190px] border-l-transparent -z-1"></div>
            </div>

            <div className=" flex w-96 h-52 rounded-lg overflow-hidden shadow-lg bg-zinc-200 relative mb-4 p-4 ">
              <div className=" z-50 justify-end p-4  space-y-4">
                <div className="space-y-2">
                  <span className="text-[#40b003] font-inter font-semibold text-xl">Servicios Comerciales Financieros </span>
                  <p className="font-inter font-normal text-black text-sm sm:text-sm ">El programa está especializado en la administración, desarrollo y mantenimiento de contabilidad y asesoria financiera de estos servicios. </p>
                </div>
              </div>
              <BsPersonRolodex className="z-50 text-5xl text-white ml-auto w-40" />

              <div className="absolute top-0 right-0 w-0 h-0 border-t-[130px] border-[#0e324d] border-l-[190px] border-l-transparent -z-1"></div>
            </div>

            <div className=" flex w-96 h-52 rounded-lg overflow-hidden shadow-lg bg-zinc-200 relative mb-4 p-4 ">
              <div className=" z-50 justify-end p-4  space-y-4">
                <div className="space-y-2">
                  <span className="text-[#40b003] font-inter font-semibold text-xl">Nomina y Prestaciones Sociales</span>
                  <p className="font-inter font-normal text-black text-sm sm:text-sm">El programa enseña a hacer nóminas de empleados, cubriendo salarios, prestaciones sociales y retenciones según la ley vigente, para todo tipo de empresas.</p>
                </div>
              </div>
              <SlCalculator className="z-50 text-5xl text-white ml-auto w-40" />
              <div className="absolute top-0 right-0 w-0 h-0 border-t-[130px] border-[#0e324d] border-l-[190px] border-l-transparent -z-1"></div>
            </div>

            <div className=" flex w-96 h-52 rounded-lg overflow-hidden shadow-lg bg-zinc-200 relative mb-4 p-4 ">
              <div className=" z-50 justify-end p-4  space-y-4">
                <div className="space-y-2">
                  <span className="text-[#40b003] font-inter font-semibold text-xl">Asistencia <span className="block"> </span>Administrativa</span>
                  <p className="font-inter font-normal text-black text-sm sm:text-sm">El programa ofrece capacitación en servicio al cliente, desarrollando habilidades que promueven el desarrollo socioeconómico y tecnológico en su entorno.</p>
                </div>
              </div>
              <FaPeopleRoof className="z-50 text-5xl text-white ml-auto w-40" />
              <div className="absolute top-0 right-0 w-0 h-0 border-t-[130px] border-[#0e324d] border-l-[190px] border-l-transparent -z-1"></div>
            </div>

            <div className=" flex w-96 h-52 rounded-lg overflow-hidden shadow-lg bg-zinc-200 relative mb-4 p-4 ">
              <div className=" z-50 justify-end p-4  space-y-4">
                <div className="space-y-2">
                  <span className="text-[#40b003] font-inter font-semibold text-xl">Soporte de <span className="block">Infraestructura Tic</span> </span>
                  <p className="font-inter font-normal text-black text-sm sm:text-sm">El programa educativo tiene como objetivo brindar un conjunto amplio y sólido de habilidades en tecnologías de la información y la comunicación.</p>
                </div>
              </div>
              <GrUserSettings  className="z-50 text-5xl text-white ml-auto w-40" />
              <div className="absolute top-0 right-0 w-0 h-0 border-t-[130px] border-[#0e324d] border-l-[190px] border-l-transparent -z-1"></div>
            </div>

            <div className=" flex w-96 h-52 rounded-lg overflow-hidden shadow-lg bg-zinc-200 relative mb-4 p-4 ">
              <div className=" z-50 justify-end p-4  space-y-4">
                <div className="space-y-2">
                  <span className="text-[#40b003] font-inter font-semibold text-xl">Bilingüismo</span>
                  <p className="font-inter font-normal text-black text-sm sm:text-sm pr-5">El Programa de Bilingüismo prepara a trabajadores en una segunda lengua para mejorar la competitividad y calidad del servicio de las empresas a nivel mundial.</p>
                </div>
              </div>
              <LiaLanguageSolid   className="z-50 text-5xl text-white ml-auto w-40" />
              <div className="absolute top-0 right-0 w-0 h-0 border-t-[130px] border-[#0e324d] border-l-[190px] border-l-transparent -z-1"></div>
            </div>

            <div className=" flex w-96 h-52 rounded-lg overflow-hidden shadow-lg bg-zinc-200 relative mb-4 p-4 ">
              <div className=" z-50 justify-end p-4  space-y-4">
                <div className="space-y-2">
                  <span className="text-[#40b003] font-inter font-semibold text-xl">Gestión del desarrollo Humano</span>
                  <p className="font-inter font-normal text-black text-sm sm:text-sm">El programa capacita para liderar la gestión del talento humano y desarrollar sistemas de recursos humanos integrales en diversas industrias.</p>
                </div>
              </div>
              <FaPeopleCarry   className="z-50 text-5xl text-white ml-auto w-40" />
              <div className="absolute top-0 right-0 w-0 h-0 border-t-[130px] border-[#0e324d] border-l-[190px] border-l-transparent -z-1"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}