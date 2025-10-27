'use client'

import React, { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUserGroup } from "@fortawesome/free-solid-svg-icons"
import Modal from "@components/Modals/InstructoresCooredinadorModal"
import Image from "next/image"

interface Ficha {
    ficha: string;
}

export interface Instructor {
    name: string;
    specialty: string;
    contractTime: string;
    centers: string;
    modalidad: string;
    fichas: Ficha[];
}

interface InstructorCardProps {
    instructor: Instructor;
}

const InstructorCard: React.FC<InstructorCardProps> = ({ instructor }) => {
    const [showModal, setShowModal] = useState<boolean>(false)
    const [showModalFichas, setShowModalFichas] = useState<boolean>(false)

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

export default InstructorCard;