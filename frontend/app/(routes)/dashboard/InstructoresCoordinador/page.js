'use client'

import React from "react"
import Image from "next/image"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUserGroup } from "@fortawesome/free-solid-svg-icons"
import PageTitle from "@components/UI/pageTitle"

const InstructorCard = ({ instructor }) => {
    const [showModal, setShowModal] = React.useState(false)
    const [showModalFichas, setShowModalFichas] = React.useState(false)

    const avatarUrl = `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(instructor.name)}`

    return (
        <div className="bg-white dark:bg-[#0b1f33] rounded-lg shadow-md flex flex-col h-full">
            <div className="p-4 flex-grow">
                <div className="flex items-start">
                    <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-200">
                        <Image
                            src={avatarUrl}
                            alt={instructor.name}
                            layout="fill"
                            objectFit="cover"
                        />
                    </div>
                    <div className="flex-1 ml-4">
                        <h3 className="text-lg font-semibold text-[#00324d] dark:text-white">
                            {instructor.name}
                        </h3>
                        <p className="text-sm text-green-600">{instructor.specialty}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{instructor.centers}</p>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 divide-x">
                <button
                    onClick={() => setShowModal(true)}
                    className="py-2 text-[#00324d] hover:text-[#40b003] bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 transition-colors"
                >
                    Más info
                </button>
                <button
                    onClick={() => setShowModalFichas(true)}
                    className="py-2 text-[#00324d] hover:text-[#228B22] bg-green-300 dark:bg-green-800 hover:bg-green-200 transition-colors"
                >
                    Fichas
                </button>
            </div>

            {showModal && (
                <Modal onClose={() => setShowModal(false)}>
                    <p><strong>Contrato:</strong> {instructor.contractTime}</p>
                    <p><strong>Modalidad:</strong> {instructor.modalidad}</p>
                </Modal>
            )}
            {showModalFichas && (
                <Modal onClose={() => setShowModalFichas(false)}>
                    <h4 className="text-lg font-semibold">Fichas asignadas</h4>
                    <ul className="pl-5 list-disc">
                        {instructor.fichas.map((f, i) => (
                            <li key={i} className="text-sm text-gray-700 dark:text-gray-300">
                                <FontAwesomeIcon icon={faUserGroup} /> {f.ficha}
                            </li>
                        ))}
                    </ul>
                </Modal>
            )}
        </div>
    )
}

const Modal = ({ onClose, children }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white dark:bg-[#0b1f33] p-6 rounded-lg shadow-xl max-w-md w-full">
            {children}
            <button
                onClick={onClose}
                className="mt-4 px-4 py-2 bg-[#00324d] text-white rounded hover:bg-[#40b003] transition-colors"
            >
                Cerrar
            </button>
        </div>
    </div>
)

export default function InstructoresCoordinador() {
    const instructors = [
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

    return (
        <div className="xl:col-span-5">
            <main className="p-6">
                <PageTitle>Instructores</PageTitle>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {instructors.map((inst, idx) => (
                        <InstructorCard key={idx} instructor={inst} />
                    ))}
                </div>
            </main>
        </div>
    )
}
