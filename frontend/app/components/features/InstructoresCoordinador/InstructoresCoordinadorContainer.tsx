'use client'

import React from "react"
import PageTitle from "@components/UI/pageTitle"
import InstructorGrid from "@/components/features/InstructoresCoordinador/InstructorGrid"
import { Instructor } from "@/components/features/InstructoresCoordinador/InstructorCard"

const mockInstructors: Instructor[] = [
    {
        name: 'Lucía María Pérez Gonzales',
        specialty: 'Desarrollo Web',
        contractTime: '1 año',
        centers: 'Centro de Tecnología, Sede Principal',
        modalidad: 'Presencial',
        fichas: [{ ficha: "2892271" }, { ficha: "2892272" }]
    },
    {
        name: 'Carlos Rodríguez',
        specialty: 'Inteligencia Artificial',
        contractTime: '2 años',
        centers: 'Centro de Innovación, Sede Secundaria',
        modalidad: 'Presencial',
        fichas: [{ ficha: "2892273" }, { ficha: "2892275" }]
    },
    {
        name: 'Ana Martínez',
        specialty: 'Diseño UX/UI',
        contractTime: '1.5 años',
        centers: 'Centro de Servicios Financieros, Sede Principal',
        modalidad: 'Virtual',
        fichas: [{ ficha: "2892212" }, { ficha: "2891274" }]
    },
    {
        name: 'Javier Soto',
        specialty: 'Ciberseguridad',
        contractTime: '3 años',
        centers: 'Centro de Tecnología, Sede Norte',
        modalidad: 'Presencial',
        fichas: [{ ficha: "2892299" }]
    },
    {
        name: 'Patricia Rivas',
        specialty: 'Bases de Datos',
        contractTime: '2 años',
        centers: 'Centro de Tecnología, Sede Principal',
        modalidad: 'Virtual',
        fichas: [{ ficha: "2892300" }, { ficha: "2892301" }]
    },
    {
        name: 'Daniel Gómez',
        specialty: 'DevOps',
        contractTime: '2 años',
        centers: 'Centro de Innovación, Sede Secundaria',
        modalidad: 'Virtual',
        fichas: [{ ficha: "2892701" }]
    },
    {
        name: 'Juliana Vargas',
        specialty: 'Movilidad Android',
        contractTime: '1.2 años',
        centers: 'Centro de Servicios Financieros',
        modalidad: 'Virtual',
        fichas: [{ ficha: "2892321" }, { ficha: "2892322" }]
    },
    {
        name: 'Santiago Restrepo',
        specialty: 'Ingeniería de Software',
        contractTime: '2.5 años',
        centers: 'Centro de Tecnología, Sede Sur',
        modalidad: 'Presencial',
        fichas: [{ ficha: "2892501" }]
    },
    {
        name: 'Mariana Duarte',
        specialty: 'Frontend React',
        contractTime: '1 año',
        centers: 'Centro de Tecnología, Sede Principal',
        modalidad: 'Presencial',
        fichas: [{ ficha: "2892601" }, { ficha: "2892602" }]
    },
]

const InstructoresCoordinadorContainer: React.FC = () => {
    return (
        <main className="p-6">
            <PageTitle>Instructores</PageTitle>
            <InstructorGrid instructors={mockInstructors} />
        </main>
    )
}

export default InstructoresCoordinadorContainer;