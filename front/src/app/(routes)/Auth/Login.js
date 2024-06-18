import Input from "@/app/components/ui/input";
import logoWhite from "../../../../public/img/logowhite.png";
import Label from "@/app/components/ui/Label";
import Image from "next/image";
import Link from "next/link"
import { HiMiniIdentification } from "react-icons/hi2";
import { BsPersonCircle } from "react-icons/bs";
import { GiPadlock } from "react-icons/gi";
import { Checkbox } from "@mui/material";

const Login = () => {

  return (
    <main className="h-screen">
    <div className=" bg-white shadow-default h-screen">
      <div className="flex flex-wrap flex-row-reverse items-center h-full">
        <div className=" w-full xl:block xl:w-1/2 h-full bg-cover bg-center flex flex-col items-center justify-between bg-black fondo-login" style={{ backgroundImage: "url('/img/fondo-login.png')" }}>
          <div className="flex justify-end items-center">
              <Image 
                className="w-24"
                src={logoWhite}
                alt="logo"
              />
          </div>
          {/* Se elimina temporalmente el estilo bg-blackOpacity */}
          <div className="rounded-2xl w-full flex items-center justify-center mt-56">
            <p className="text-white text-xl py-8 px-8 mt-96 font-serif">
              ¡Únete a la comunidad educativa del SENA y <br/> 
              potencia tu futuro! Regístrate ahora para <br/>
              acceder a una amplia gama de programas de <br/>
              formación y oportunidades de crecimiento <br/>
              profesional. 
            </p>
            <p className="text-white text-xs mt-auto relative left-28">
              Potenciando la asistencia
            </p>
          </div>
        </div>

        <div className="w-full xl:w-1/2">
          <div className="p-7 sm:p-12.5 xl:px-29 w-3/5 container mx-auto">
            <h2 className=" text-2xl font-bold text-darkBlue dark:text-green sm:text-title-xl2 text-center font-serif">
              TDA
            </h2>
            <p className="my-4 text-darkBlue text-xs text-center">
            Transformando el futuro con las nuevas habilidades del SENA.
            </p>
            <h2 className=" text-2xl font-bold text-darkBlue dark:text-green sm:text-title-xl2 font-serif">
              Inicia Sesión
            </h2>
            <p className="my-4 text-darkBlue w-3/4 font-serif">
            ¡Bienvenido de vuelta! Por favor, inicia sesión para acceder a tu cuenta.
            </p>
          </div>
          <br/>

          <div className="w-full px-7 sm:px-12.5 xl:px-29">
            <form className="w-3/5 container mx-auto">
            {/* Caja de Documento */}
              <div className="mb-6">
                <div className="relative">
                  <select 
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full"
                  type="text"
                  id="numDoc"
                  defaultValue=""
                  >
                  <option value="" disabled hidden>Tipo de Documento</option>
                  <option value="TI">Tarjeta de Identidad</option>
                  <option value="CC">Cédula de Ciudadanía</option>
                  </select>

                  <span className="absolute left-3 top-3">
                  <HiMiniIdentification className="h-5 w-5 text-gray-500" />
                  </span>
                </div>
              </div>
              {/* fin */}

              <div className="mb-6">
                <div className="relative">
                  <input
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full"
                  type="text" id="numDoc"
                  placeholder="Numero de Documento"
                  />

                  <span className="absolute left-3 top-3">
                  <BsPersonCircle className="h-5 w-5 text-gray-500" />
                  </span>

                </div>
              </div>

              <div className="mb-6">
              <div className="relative">
                <input 
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full"
                type="password"
                placeholder="Contraseña" 
                />
                <span className="absolute left-3 top-3 ">
                <GiPadlock className="h-5 w-5 text-gray-500" />
                </span>
              </div>
            </div>
              <Checkbox className="rounded-md"/>
              <span className="ml-2">Recordar</span>

              <div className="mb-5">
                <input
                  type="submit"
                  value="Iniciar Sesion"
                  className="w-full cursor-pointer rounded-lg border border-darkBlue bg-darkBlue p-4 text-white transition hover:bg-opacity-90"
                />
              </div>
            </form>

          </div>
        </div>
      </div>
    </div>
    </main>    
  );
}

export default Login;