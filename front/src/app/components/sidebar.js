"use client"
import { FaLaptopCode } from "react-icons/fa";

import Image from "next/image";
import styles from "../../../resources/styles/teamScrum.css";
import iconoap from "../../../resources/img/aprendices.png";
import iconoasi from "../../../resources/img/asistencia.png";
import iconopro from "../../../resources/img/proyecto.png";
import iconolog from "../../../resources/img/logo.png";
import iconote from "../../../resources/img/teams.png";
import iconofi from "../../../resources/img/ficha.png";
import iconoprog from "../../../resources/img/programa.png";
import iconosalida from "../../../resources/img/salir.png";
import iconoconf from "../../../resources/img/config.png";
import { IoPersonSharp } from "react-icons/io5";

import Link from "next/link";
import { BsPersonFillCheck } from "react-icons/bs";
import { HiUserGroup } from "react-icons/hi2";
import { PiStudentFill } from "react-icons/pi";
import { TfiBlackboard } from "react-icons/tfi";
import { IoMdLogOut } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";


export const Sidebar = () => {

  return (
    <div className="principal">
      <nav className="menu">
          <div className="flex items-center justify-between ">
            <Image
              src={iconolog}
              alt="Imagen de Proyectos Formativos"
              width={35}  
              height={35}
            />

            <label  className="text-white font-bold ml-5">PROYECTOS FORMATIVOS (C.S.F.)</label>
          </div>

          <ul>
            <li>
              <div className="menu-content">
                  <Link href="/home" class="custom-button" >
                    <IoPersonSharp /> Fichas
                  </Link>
              </div>
            </li>

            <li>
              <div className="menu-content">
                  <Link href="/fichas" class="custom-button">
                  <FaLaptopCode /> Programas
                  </Link>
              </div>
            </li>
          
            <li>
              <div className="menu-content">
                  <Link href="/" class="custom-button">
                  <BsPersonFillCheck /> Asistencia
                  </Link>


              </div>
            </li>
            <li>
              <div className="menu-content">
                  <Link href="/" class="custom-button">
                  <HiUserGroup /> Teams
                  </Link>
              </div>
            </li>

            <li>
              <div className="menu-content">
                  <Link href="/" class="custom-button">
                  <PiStudentFill /> Aprendices
                  </Link>
              </div>
            </li>

            <li>
              <div className="menu-content">
                  <Link href="/" class="custom-button">
                  <TfiBlackboard /> Proyectos
                  </Link>
              </div>
            </li>

            <div className="menu-final">
              <li>
                <div className="menu-content">
                    <Link href="/" class="custom-button">
                    <IoMdLogOut /> Salir
                    </Link>
                </div>
              </li>

              <li className="menu-config">
                  <Link href="/" class="custom-button">
                  <IoSettingsOutline /> Configuraciones
                  </Link>
                <div className="menu-content">
                
                </div>
              </li>
            </div>
          </ul>
      </nav>
    </div>
  );
};
