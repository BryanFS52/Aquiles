import { Sidebar } from "@/app/components/sidebar";
import { Header} from "@/app/components/header";
import Image from "next/image";

export default function  Home () {
    
    return(
    <div className="grid grid-cols-1 xl:grid-cols-6">
      <Sidebar/>
    <div className="xl:col-span-5 ">
      <Header/>
        <div className="h-[90vh] overflow-y-scroll p-12">
            
            <div className="bg-blue-500 w-full">
                fichas
            </div>
      </div>
    </div>
  </div>
    )
}