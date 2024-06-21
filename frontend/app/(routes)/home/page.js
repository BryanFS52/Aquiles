import Link from "next/link";
import { Header } from "../../components/header";
import { Sidebar } from "../../components/sidebar";
import { MdAddCircle } from "react-icons/md";
import { FaTrashAlt } from "react-icons/fa";
import { MdAdd } from "react-icons/md";

export default function Home() {
	return (
		<div className="min-h-screen grid grid-cols-1 xl:grid-cols-6">
			<Sidebar />
			<div className="xl:col-span-5">
				<Header />

				<div className="h-[90vh] overflow-y-scroll p-12 inline-block w-full relative">
					<h1 className="font-serif text-4xl pb-3 border-b-2 border-gray-400 w-1/2">
						Teams Scrums{" "}
					</h1>
					<br />

					<li className="h-9 w-14 flex items-center justify-center border-2 rounded-lg bg-cyan-900 hover:bg-green-600 ml-auto">
						<a href="#">
							{""}
							<MdAdd className="w-8 h-8" />
						</a>
					</li>

					<div className="w-1/3 h-56 rounded-lg overflow-hidden shadow-lg bg-zinc-200 relative">
					<div className="absolute top-0 right-0 w-0 h-0 border-t-[130px] border-t-cyan-900 border-l-[240px] border-l-transparent -z-1"></div>
						
						<div className="px-6 py-4">
							<div className="flex ">
								<span className="font-serif text-xl mb-2">Nombre del Proyecto</span>
								<button className="relative z-20 ml-auto text-white"> Ver Más</button>
							</div>

							<p className="text-black-700 text-base text-xs">
								Desarrollo de la Aplicación Móvil
							</p>
							
							<br />
							<div className="font-serif text-xl mb-2">Team Número</div>
							<p className="text-black-700 text-base text-xs">Equipo 5</p>
							<br />
							<div className="font-serif text-xl mb-2 flex">
								Agregar Información

                
								<Link href="/home" className="ml-2">
									<MdAddCircle className="inline-block text-2xl text-cyan-900" />
								</Link>
								<Link href="/home" className="ml-2 ml-auto">
									<FaTrashAlt className="inline-block text-2xl text-cyan-900" />
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
