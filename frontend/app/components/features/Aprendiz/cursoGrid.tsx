import { GiTakeMyMoney } from "react-icons/gi";


const CursoGrid = () => {
    return (
        <div className="flex w-full xl:w-96 h-52 rounded-lg overflow-hidden shadow-lg bg-zinc-200 relative p-4">
            <div className="z-50 space-y-2">
                <span className="font-inter text-lg">Nombre del curso:</span>
                <p className="font-inter text-black-700 text-sm">Gestión empresarial</p>
                <span className="font-inter text-lg">Modalidad:</span>
                <p className="font-inter text-black-700 text-sm">Presencial</p>
            </div>
            <GiTakeMyMoney className="z-50 text-5xl text-white ml-auto w-20 xl:w-40" />
            <div className="absolute top-0 right-0 w-0 h-0 border-t-[100px] xl:border-t-[130px] border-t-cyan-900 border-l-[150px] xl:border-l-[240px] border-l-transparent -z-1"></div>
        </div>
    );
}

export default CursoGrid;