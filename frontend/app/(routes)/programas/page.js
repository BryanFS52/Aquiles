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
                  <span className="font-serif text-xl font-medium ">Analisis y Desarrollo de software</span>
                  <p className="text-black-700 text-sm pt-2">El programa educativo tiene como objetivo formar profesionales expertos en diseñar, construir y mantener sistemas de información.</p>
                </div>
              </div>
              <FaComputer className="z-50 text-5xl text-white ml-auto w-40" />
             <div className="absolute top-0 right-0 w-0 h-0 border-t-[130px] border-t-cyan-900 border-l-[240px] border-l-transparent -z-1"></div>  {/* Linea color azul que hace la division del triangulo */}
            </div>

            <div className=" flex w-96 h-52 rounded-lg overflow-hidden shadow-lg bg-zinc-200 relative mb-4 p-4 ">
              <div className=" z-50 justify-end p-4  space-y-4">
                <div className="space-y-2">
                  <span className="font-serif text-xl font-medium ">Gestion Empresarial </span>
                  <p className="text-black-700 text-sm pt-6">El programa educativo enseña a coordinar y apoyar todas las áreas de las empresas, así como a desarrollar ideas que puedan convertirse en negocios sostenibles.</p>
                </div>
              </div>
              <AiOutlineStock className="z-50 text-5xl text-white ml-auto w-40" />
              <div className="absolute top-0 right-0 w-0 h-0 border-t-[130px] border-t-cyan-900 border-l-[240px] border-l-transparent -z-1"></div>
            </div>

            <div className=" flex w-96 h-52 rounded-lg overflow-hidden shadow-lg bg-zinc-200 relative mb-4 p-4 ">
              <div className=" z-50 justify-end p-4  space-y-4">
                <div className="space-y-2">
                  <span className="font-serif text-xl font-medium ">Gestión bancaria y de entidades financieras </span>
                  <p className="text-black-700 text-sm pt-2">El programa enseña a analizar el mercado, evaluar inversiones y tomar decisiones estratégicas para maximizar rendimientos financieros.</p>
                </div>
              </div>
              <GiTakeMyMoney className="z-50 text-5xl text-white ml-auto w-40" />
              <div className="absolute top-0 right-0 w-0 h-0 border-t-[130px] border-t-cyan-900 border-l-[240px] border-l-transparent -z-1"></div>
            </div>

            <div className=" flex w-96 h-52 rounded-lg overflow-hidden shadow-lg bg-zinc-200 relative mb-4 p-4 ">
              <div className=" z-50 justify-end p-4  space-y-4">
                <div className="space-y-2">
                  <span className="font-serif text-xl font-medium">Servicios Comerciales Financieros </span>
                  <p className="text-black-700 text-sm pt-2">El programa está especializado en la administración, desarrollo y mantenimiento de contabilidad y asesoria financiera de estos servicios. </p>
                </div>
              </div>
              <BsPersonRolodex className="z-50 text-5xl text-white ml-auto w-40" />

              <div className="absolute top-0 right-0 w-0 h-0 border-t-[130px] border-t-cyan-900 border-l-[240px] border-l-transparent -z-1"></div>
            </div>

            <div className=" flex w-96 h-52 rounded-lg overflow-hidden shadow-lg bg-zinc-200 relative mb-4 p-4 ">
              <div className=" z-50 justify-end p-4  space-y-4">
                <div className="space-y-2">
                  <span className="font-serif text-xl font-medium">Nomina y Prestaciones Sociales</span>
                  <p className="text-black-700 text-sm pt-1">El programa enseña a hacer nóminas de empleados, cubriendo salarios, prestaciones sociales y retenciones según la ley vigente, para todo tipo de empresas.</p>
                </div>
              </div>
              <SlCalculator className="z-50 text-5xl text-white ml-auto w-40" />
              <div className="absolute top-0 right-0 w-0 h-0 border-t-[130px] border-t-cyan-900 border-l-[240px] border-l-transparent -z-1"></div>
            </div>

            <div className=" flex w-96 h-52 rounded-lg overflow-hidden shadow-lg bg-zinc-200 relative mb-4 p-4 ">
              <div className=" z-50 justify-end p-4  space-y-4">
                <div className="space-y-2">
                  <span className="font-serif text-xl font-medium ">Asistencia Administrativa</span>
                  <p className="text-black-700 text-sm pt-3">El programa ofrece capacitación en servicio al cliente, desarrollando habilidades que promueven el desarrollo socioeconómico y tecnológico en su entorno.</p>
                </div>
              </div>
              <FaPeopleRoof className="z-50 text-5xl text-white ml-auto w-40" />
              <div className="absolute top-0 right-0 w-0 h-0 border-t-[130px] border-t-cyan-900 border-l-[240px] border-l-transparent -z-1"></div>
            </div>

            <div className=" flex w-96 h-52 rounded-lg overflow-hidden shadow-lg bg-zinc-200 relative mb-4 p-4 ">
              <div className=" z-50 justify-end p-4  space-y-4">
                <div className="space-y-2">
                  <span className="font-serif text-2xl font-medium ">Soporte de Infraestructura de Tic</span>
                  <p className="text-black-700 text-sm pt-3">El programa educativo tiene como objetivo brindar un conjunto amplio y sólido de habilidades en tecnologías de la información y la comunicación.</p>
                </div>
              </div>
              <GrUserSettings  className="z-50 text-5xl text-white ml-auto w-40" />
              <div className="absolute top-0 right-0 w-0 h-0 border-t-[130px] border-t-cyan-900 border-l-[240px] border-l-transparent -z-1"></div>
            </div>

            <div className=" flex w-96 h-52 rounded-lg overflow-hidden shadow-lg bg-zinc-200 relative mb-4 p-4 ">
              <div className=" z-50 justify-end p-4  space-y-4">
                <div className="space-y-2">
                  <span className="font-serif text-xl font-medium ">Bilingüismo</span>
                  <p className="text-black-700 text-sm pt-3">El Programa de Bilingüismo prepara a trabajadores en una segunda lengua para mejorar la competitividad y calidad del servicio de las empresas a nivel mundial.</p>
                </div>
              </div>
              <LiaLanguageSolid   className="z-50 text-5xl text-white ml-auto w-40" />
              <div className="absolute top-0 right-0 w-0 h-0 border-t-[130px] border-t-cyan-900 border-l-[240px] border-l-transparent -z-1"></div>
            </div>

            <div className=" flex w-96 h-52 rounded-lg overflow-hidden shadow-lg bg-zinc-200 relative mb-4 p-4 ">
              <div className=" z-50 justify-end p-4  space-y-4">
                <div className="space-y-2">
                  <span className="font-serif text-xl font-medium ">Gestión del desarrollo Humano</span>
                  <p className="text-black-700 text-sm pt-3">El programa capacita para liderar la gestión del talento humano y desarrollar sistemas de recursos humanos integrales en diversas industrias.</p>
                </div>
              </div>
              <FaPeopleCarry   className="z-50 text-5xl text-white ml-auto w-40" />
              <div className="absolute top-0 right-0 w-0 h-0 border-t-[130px] border-t-cyan-900 border-l-[240px] border-l-transparent -z-1"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
