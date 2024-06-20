import Link from "next/link";
import { Header } from "../../components/header";
import { Sidebar } from "../../components/sidebar";
import { MdAdd } from "react-icons/md";
import { GoChecklist } from "react-icons/go";

export default function Home () {
    return(
    <div className="min-h-screen grid grid-cols-1 xl:grid-cols-6">
      <Sidebar/>
    <div className="xl:col-span-5 ">
      <Header/>

    <div className="h-[90vh] overflow-y-scroll p-12 inline-block w-full">
        <h1 className="font-serif text-4xl pb-3 border-b-2 border-gray-400 w-1/2">Teams Scrums </h1>
        <br/>
        
        <li className="h-9 w-14 flex items-center justify-center border-2 rounded-lg bg-cyan-950 hover:bg-green-600  ml-auto">
                    <a href="#">
                        {""}
                        <MdAdd className="w-8 h-8"/>
                    </a>
        </li>

        <div class="w-1/3 h-56 rounded-lg overflow-hidden shadow-lg bg-zinc-200 ">
        <div class="px-6 py-4">
          <div class="font-serif text-xl mb-2">Nombre del Proyecto</div>
              <p class="text-black-700 text-base text-xs">Desarrollo de la Aplicación Móvil</p><br/>
              <div class="font-serif text-xl mb-2">Team Número</div>
              <p class="text-black-700 text-base text-xs">Equipo 5</p><br/>
              <div class="font-serif text-xl mb-2 flexbox">Agregar Información
              <Link href="/home" className="ml-2">
              <GoChecklist className="inline-block text-xl"/>
              </Link>
              </div>
          </div>  
          </div>
      </div>
    </div>
  </div>

    );
}