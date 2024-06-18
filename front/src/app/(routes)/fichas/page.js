import { Sidebar } from "@/app/components/sidebar";
import { Header} from "@/app/components/header";

export default function  Fichas () {
    return(
        <div className="grid grid-cols-1 xl:grid-cols-6">
        <Sidebar/>
      <div className="xl:col-span-5 ">
        <Header/>
      <div className="h-[90vh] overflow-y-scroll p-12">
          <h1>
                programas 
          </h1>
        </div>
      </div>
    </div>
    )
}