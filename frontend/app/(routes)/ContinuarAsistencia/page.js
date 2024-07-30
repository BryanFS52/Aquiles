"use client"

import React from "react";
import { Header } from "../../components/header"; //importaciones del header y del sidebar para hacer el llamado
import { Sidebar } from "../../components/sidebar";
import AttendanceList from "../../components/EndAttendance";


export default function AttendanceList () {
    return(
        
        <div className="min-h-screen grid grid-cols-1 xl:grid-cols-6">
              <Sidebar />
            <div className="xl:col-span-5">
                <Header />
            <div>
                <AttendanceList/>
          </div>
          </div>
                

        </div>
    );
}


