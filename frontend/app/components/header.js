import Link from "next/link";
import { IoNotificationsOutline } from "react-icons/io5";
import { RiCheckboxBlankCircleFill } from "react-icons/ri";

export const Header = () => {
    return (

        <header className='h-[7vh] md:h-[9vh] mx-auto flex items-center justify-end px-5 lg:py-5 lg:px-4 border bg-slate-100'>
        <div>
            <ul className="">
                <li className='h-8 w-8 flex items-center justify-center rounded-full bg-white hover:bg-gray-800'>
                    <a href="#" className='text-gray-400 text-xl'>
                        {""}
                        <IoNotificationsOutline/>
                    </a>
                </li>
            </ul>
        </div> 
                        <Link href='/perfil' className='flex items-center gap-2 py-3 px-4 hover:bg-gray-500 rounded-xl transition-colors'> 
                            <div className="flex flex-col">
                                <span className="text-end">Usuario</span>
                                <span className="text-xs">Aprendices</span>
                            </div>
                            
                            <img src="https://img.freepik.com/foto-gratis/joven-bella-mujer-pie-sobre-pared-blanca_114579-90514.jpg" 
                            className='w-10 h-10 object-cover rounded-full'/>
                    </Link>
            </header>
    );
};