import { Header } from "../../components/header";
import { Sidebar } from "../../components/sidebar";

export default function Home () {
    return(
    <div className="min-h-screen grid grid-cols-1 xl:grid-cols-6">
      <Sidebar/>
    <div className="xl:col-span-5 ">
      <Header/>
    <div className="h-[90vh] overflow-y-scroll p-12">
        <h1>
              hoola santiago 
          </h1>
      </div>
    </div>
  </div>

    );
}