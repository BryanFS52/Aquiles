'use client'

import React, { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUserGroup, faUserTie, faBriefcase, faBuilding, faClock } from "@fortawesome/free-solid-svg-icons"
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
        <div className="group relative bg-white dark:bg-shadowBlue rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-lightGray dark:border-grayText">
            {/* Degradado decorativo */}
            <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-primary/10 to-lightGreen/10 dark:from-secondary/10 dark:to-darkBlue/10 rounded-bl-full -z-0"></div>

            {/* Contenido principal */}
            <div className="relative p-4 sm:p-6 z-10">
                <div className="flex items-start gap-3 sm:gap-4">
                    {/* Avatar */}
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-gradient-to-br from-primary/20 to-lightGreen/20 dark:from-secondary/20 dark:to-darkBlue/20 flex-shrink-0 border-2 border-primary/30 dark:border-secondary/30">
                        <Image
                            src={avatarUrl}
                            alt={instructor.name}
                            layout="fill"
                            objectFit="cover"
                        />
                    </div>

                    {/* Información del instructor */}
                    <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-bold text-primary dark:text-white mb-1 truncate">
                            {instructor.name}
                        </h3>
                        
                        <div className="space-y-1.5 sm:space-y-2">
                            <div className="flex items-center gap-2 text-xs sm:text-sm text-grayText dark:text-gray-200">
                                <FontAwesomeIcon icon={faUserTie} className="text-primary dark:text-white flex-shrink-0" />
                                <span className="truncate">{instructor.specialty}</span>
                            </div>
                            
                            <div className="flex items-center gap-2 text-xs sm:text-sm text-grayText dark:text-gray-200">
                                <FontAwesomeIcon icon={faBuilding} className="text-primary dark:text-white flex-shrink-0" />
                                <span className="truncate">{instructor.centers}</span>
                            </div>
                            
                            <div className="flex items-center gap-2 text-xs sm:text-sm text-grayText dark:text-gray-200">
                                <FontAwesomeIcon icon={faClock} className="text-primary dark:text-white flex-shrink-0" />
                                <span className="truncate">{instructor.modalidad}</span>
                            </div>
                            
                            <div className="flex items-center gap-2 text-xs sm:text-sm text-grayText dark:text-gray-200">
                                <FontAwesomeIcon icon={faBriefcase} className="text-primary dark:text-white flex-shrink-0" />
                                <span className="truncate">{instructor.contractTime}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Botones de acción */}
            <div className="grid grid-cols-2 border-t border-lightGray dark:border-grayText">
                <button
                    onClick={() => setShowModal(true)}
                    className="py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-primary dark:text-secondary hover:bg-primary/5 dark:hover:bg-secondary/5 transition-colors active:scale-95 flex items-center justify-center gap-2"
                >
                    <FontAwesomeIcon icon={faUserTie} />
                    <span>Más info</span>
                </button>
                <button
                    onClick={() => setShowModalFichas(true)}
                    className="py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-primary dark:text-secondary hover:bg-primary/5 dark:hover:bg-secondary/5 transition-colors active:scale-95 border-l border-lightGray dark:border-grayText flex items-center justify-center gap-2"
                >
                    <FontAwesomeIcon icon={faUserGroup} />
                    <span>Fichas ({instructor.fichas.length})</span>
                </button>
            </div>

            {showModal && (
                <Modal onClose={() => setShowModal(false)}>
                    <div className="space-y-3">
                        <h4 className="text-lg sm:text-xl font-bold text-primary dark:text-white mb-4">
                            Información del instructor
                        </h4>
                        <div className="space-y-2">
                            <p className="text-sm sm:text-base text-grayText dark:text-white">
                                <strong className="text-primary dark:text-white">Contrato:</strong> {instructor.contractTime}
                            </p>
                            <p className="text-sm sm:text-base text-grayText dark:text-white">
                                <strong className="text-primary dark:text-white">Modalidad:</strong> {instructor.modalidad}
                            </p>
                            <p className="text-sm sm:text-base text-grayText dark:text-white">
                                <strong className="text-primary dark:text-white">Especialidad:</strong> {instructor.specialty}
                            </p>
                            <p className="text-sm sm:text-base text-grayText dark:text-white">
                                <strong className="text-primary dark:text-white">Centros:</strong> {instructor.centers}
                            </p>
                        </div>
                    </div>
                </Modal>
            )}
            {showModalFichas && (
                <Modal onClose={() => setShowModalFichas(false)}>
                    <h4 className="text-lg sm:text-xl font-bold text-primary dark:text-white mb-4">
                        Fichas asignadas
                    </h4>
                    {instructor.fichas.length === 0 ? (
                        <div className="text-center py-6">
                            <FontAwesomeIcon icon={faUserGroup} className="text-4xl text-grayText/30 dark:text-white/30 mb-3" />
                            <p className="text-sm text-grayText dark:text-white">No hay fichas asignadas</p>
                        </div>
                    ) : (
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {instructor.fichas.map((f, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-3 p-3 bg-lightGray/30 dark:bg-grayText/10 rounded-lg hover:bg-lightGray/50 dark:hover:bg-grayText/20 transition-colors"
                                >
                                    <FontAwesomeIcon icon={faUserGroup} className="text-primary dark:text-white flex-shrink-0" />
                                    <span className="text-xs sm:text-sm text-grayText dark:text-white flex-1">
                                        {f.ficha}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </Modal>
            )}
        </div>
    )
}

export default InstructorCard;