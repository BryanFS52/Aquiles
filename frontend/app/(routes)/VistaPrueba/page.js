"use client";

import React, {useState} from "react";
import { Header } from "../../components/header"; //importaciones del header y del sidebar para hacer el llamado
import { downloadReportPDF } from "../../services/PDFService";
import { IoIosArrowDown } from "react-icons/io";
import { Sidebaraprendiz } from "../../components/SidebarAprendiz";
import ChecklistAprendices from "../../components/ChecklistAprendices";
import { Sidebar } from "../../components/SidebarInstructor";


export default function ListaChequeo() {
    
    return (
        <div className="min-h-screen grid grid-cols-1 xl:grid-cols-6">
            <Sidebar />
            <div className="xl:col-span-5">
                <Header />
               
                
           
                   
               
               </div>
            </div>
      );
    };
