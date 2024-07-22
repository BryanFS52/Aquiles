"use client"

import React from "react";
import { Header } from "@/app/components/header"; //importaciones del header y del sidebar para hacer el llamado
import { Sidebar } from "@/app/components/sidebar";
import EndAttendance from "../../components/EndAttendance";


export default function EndAttendancePage () {
    return(
        
        <div className="min-h-screen grid grid-cols-1 xl:grid-cols-6">
              <Sidebar/>
            <div className="xl:col-span-5">
                <Header />
            <div>
                <EndAttendance/>
          </div>
          </div>

        </div>
    );
}


