"use client"

import React from "react";
import { Header } from "../../components/header"; //importaciones del header y del sidebar para hacer el llamado
import { Sidebar } from "../../components/sidebar";
import { Attendance } from "@/app/components/attendance";
import { Table } from "@/app/components/table";


export default function Asistencia () {
    return(
        
        <div className="min-h-screen grid grid-cols-1 xl:grid-cols-6">
              <Sidebar />
            <div className="xl:col-span-5">
                <Header />
            <div>
                <Attendance/>
          </div>
          </div>
                

        </div>
    );
}