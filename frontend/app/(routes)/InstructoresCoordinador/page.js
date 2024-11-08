'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Sidebarcoordinador } from '@/components/SidebarCoordinador'
import { HeaderCoordinador } from '@/components/HeaderCoordinador'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserGroup } from '@fortawesome/free-solid-svg-icons'

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                {children}
                <button
                    onClick={onClose}
                    className="mt-4 px-4 py-2 bg-[#00324d] text-white rounded hover:bg-[#40b003] transition-colors duration-300"
                >
                    Cerrar
                </button>
            </div>
        </div>
    )
}

const InstructorCard = ({ instructor }) => {
    const [showModal, setShowModal] = useState(false)
    const [showModalFichas, setShowModalFichas] = useState(false)

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
            <div className="p-4 flex-grow">
                <div className="flex items-start">
                    <Image
                        src={instructor.image}
                        alt={instructor.name}
                        width={80}
                        height={80}
                        className="rounded-full mr-4"
                    />
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-[#00324d]">{instructor.name}</h3>
                        <p className="text-sm text-green-600">{instructor.specialty}</p>
                        <p className="text-sm text-gray-600">{instructor.centers}</p>
                        
                    </div>
                </div>
            </div>
            <div className="grid-cols-2">
                <button
                    onClick={() => setShowModal(true)}
                    className="w-1/2 py-2 text-[#00324d] hover:text-[#40b003] transition-colors duration-300 bg-gray-100 hover:bg-gray-200 mt-auto"
                >
                    Más información
                </button>
                <button
                    onClick={() => setShowModalFichas(true)}
                    className="w-1/2 py-2 text-[#00324d] hover:text-[#228B22] transition-colors duration-300 bg-green-300 hover:bg-green-200 mt-auto"
                >
                    Fichas asignadas
                </button>
            </div>
            
            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                <p className="text-sm"><span className="text-lg font-semibold">Tiempo de contrato:</span> {instructor.contractTime}</p>
                <p className="text-sm"><span className="text-lg font-semibold">Modalidad:</span> {instructor.modalidad}</p>
            </Modal>

            <Modal isOpen={showModalFichas} onClose={() => setShowModalFichas(false)}>
                <h4 className="text-lg font-semibold mb-2">Fichas asignadas</h4>
                <ul className="list-none pl-5">
                    {instructor.fichas.map((ficha, index) => (
                        <li key={index} className="text-sm text-gray-700"><FontAwesomeIcon icon={faUserGroup} /> {ficha.ficha}</li>
                    ))}
                </ul>
            </Modal>
        </div>
    )
}

export default function InstructoresCoordinador() {
    const instructors = [
        {
            name: 'Lucía Maria Pérez Gonzales',
            image: '/img/aquiles.jpg',
            specialty: 'Desarrollo Web',
            contractTime: '1 año',
            centers: 'Centro de Tecnología, Sede Principal',
            modalidad: 'Presencial',
            fichas: [
                { ficha: "2892271" },
                { ficha: "2892272" },
                { ficha: "2892273" },
                { ficha: "2892274" }
            ]
        },
        {
            name: 'Carlos Rodríguez',
            image: '/img/aquiles.jpg',
            specialty: 'Inteligencia Artificial',
            assignedGroups: 2,
            contractTime: '2 años',
            centers: 'Centro de Innovación, Sede Secundaria',
            modalidad: 'Presencial',
            fichas: [
                { ficha: "2892273" },
                { ficha: "2892275" }
            ]
        },
        {
            name: 'Juan Pérez',
            image: '/img/aquiles.jpg',
            specialty: 'Desarrollo Móvil',
            assignedGroups: 3,
            contractTime: '3 años',
            centers: 'Centro de Servicios Financieros, Sede Este',
            modalidad: 'Presencial',
            fichas: [{ ficha: "2892289" }]
        },
        {
            name: 'Ana Martínez',
            image: '/img/aquiles.jpg',
            specialty: 'Diseño UX/UI',
            assignedGroups: 4,
            contractTime: '1.5 años',
            centers: 'Centro de Servicios Financieros, Sede Principal',
            modalidad: 'Virtual',
            fichas: [
                { ficha: "2892212" },
                { ficha: "2892274" },
                { ficha: "2891274" }
            ]
        },
        {
            name: 'Juan Pérez',
            image: '/img/aquiles.jpg',
            specialty: 'Desarrollo Móvil',
            assignedGroups: 3,
            contractTime: '3 años',
            centers: 'Centro de Servicios Financieros, Sede Este',
            modalidad: 'Presencial',
            fichas: [{ ficha: "2892270" }]
        }
    ]

    return (
        <div className="min-h-screen grid grid-cols-1 xl:grid-cols-6">
            <Sidebarcoordinador />
            <div className="xl:col-span-5">
                <HeaderCoordinador />
                <main className="container mx-auto p-6">
                    <h1 className="text-3xl font-bold text-[#00324d] mb-6">Instructores</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {instructors.map((instructor, index) => (
                            <InstructorCard key={index} instructor={instructor} />
                        ))}
                    </div>
                </main>
            </div>
        </div>
    )
}
