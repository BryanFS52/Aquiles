import Link from "next/link";
import { IoNotifications } from "react-icons/io5";


export const Header = () => {
    return (

        <header className='h-[7vh] md:h-[10vh] mx-auto flex items-center justify-between px-5 lg:py-5 lg:px-4 border border-gray-100'>
                <nav className='space-x-6 sm: p-8 flex sm:text-xl'>
                    <Link href="/" className="inline-block relative transition-colors duration-300 hover:before:w-full">
                        <span className="before:absolute before:left-0 before:-bottom-2 before:w-0 before:h-0.5 before:bg-custom-blue before:rounded-full before:transition-all before:duration-300 hover:before:w-full">Discover</span>
                    </Link>
                    <Link href="/1" className="inline-block relative transition-colors duration-300 hover:before:w-full">
                        <span className="before:absolute before:left-0 before:-bottom-2 before:w-0 before:h-0.5 before:bg-custom-blue before:rounded-full before:transition-all before:duration-300 hover:before:w-full">Arrive</span>
                    </Link>
                    <Link href="#" className="inline-block relative transition-colors duration-300 hover:before:w-full">
                        <span className="before:absolute before:left-0 before:-bottom-2 before:w-0 before:h-0.5 before:bg-custom-blue before:rounded-full before:transition-all before:duration-300 hover:before:w-full">Fantasma</span>
                    </Link>
                </nav>
                <div>
                <ul className="px-8">
                    <li className='text-2xl rounded-full bg-gray-300 hover:bg-gray-400'>
                        <a href="#" className='text-sena-blue'>
                            {""}
                            <IoNotifications/>
                        </a>
                    </li>
                </ul>
            </div>
            </header>
    );
};