"use client"

import Image from "next/image";
import { IoPersonSharp } from "react-icons/io5";

import Link from "next/link";
import styles from "../../../public/styles/teamScrum.css"
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
                    Programas
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
