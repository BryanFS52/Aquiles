'use client'

import React, { useState } from "react"
import PageTitle from "@components/UI/pageTitle"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUserGroup, faArrowLeft, faCheckCircle } from "@fortawesome/free-solid-svg-icons"

// Simulación de datos
const instructor = {
    name: 'Lucía María Pérez Gonzales',
    specialty: 'Desarrollo Web',
    contractTime: '1 año',
    centers: 'Centro de Tecnología, Sede Principal',
    modalidad: 'Presencial',
    fichas: [
        { ficha: "2892271" },
        { ficha: "2892272" }
    ]
}

const teamScrums = {
    "2892271": [
        { id: 1, name: "Team Alpha" },
        { id: 2, name: "Team Beta" }
    ],
    "2892272": [
        { id: 3, name: "Team Gamma" }
    ]
}

const checklistItems = [
    { id: 1, label: "Entrega de actividades a tiempo" },
    { id: 2, label: "Participación en clase" },
    { id: 3, label: "Trabajo en equipo" },
    { id: 4, label: "Respeto por los compañeros" }
]

export default function ListaChequeoInstructorPasoAPaso() {
    const [step, setStep] = useState(1)
    const [selectedFicha, setSelectedFicha] = useState(null)
    const [selectedTeam, setSelectedTeam] = useState(null)
    const [checklist, setChecklist] = useState({})
    const [submitted, setSubmitted] = useState(false)

    // Paso 1: Selección de ficha
    const renderFichaStep = () => (
        <div className="max-w-xl mx-auto bg-white dark:bg-[#0b1f33] rounded-lg shadow-md p-6">
            <PageTitle>Selecciona la ficha</PageTitle>
            <ul className="pl-5 list-disc">
                {instructor.fichas.map((f, i) => (
                    <li key={i} className="mb-4">
                        <button
                            className={`w-full text-left py-2 px-4 rounded-lg border border-[#00324d] dark:border-[#40b003] bg-gray-100 dark:bg-gray-700 hover:bg-green-200 transition-colors ${selectedFicha === f.ficha ? 'bg-green-300 dark:bg-green-800 font-bold' : ''}`}
                            onClick={() => { setSelectedFicha(f.ficha); setStep(2); }}
                        >
                            <FontAwesomeIcon icon={faUserGroup} className="mr-2" /> Ficha {f.ficha}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )

    // Paso 2: Selección de team scrum
    const renderTeamStep = () => (
        <div className="max-w-xl mx-auto bg-white dark:bg-[#0b1f33] rounded-lg shadow-md p-6">
            <button onClick={() => setStep(1)} className="mb-4 text-[#00324d] dark:text-[#40b003] hover:underline flex items-center"><FontAwesomeIcon icon={faArrowLeft} className="mr-2" /> Volver a fichas</button>
            <PageTitle>Selecciona el Team Scrum</PageTitle>
            <ul className="pl-5 list-disc">
                {(teamScrums[selectedFicha] || []).map(team => (
                    <li key={team.id} className="mb-4">
                        <button
                            className={`w-full text-left py-2 px-4 rounded-lg border border-[#00324d] dark:border-[#40b003] bg-gray-100 dark:bg-gray-700 hover:bg-green-200 transition-colors ${selectedTeam === team.id ? 'bg-green-300 dark:bg-green-800 font-bold' : ''}`}
                            onClick={() => { setSelectedTeam(team.id); setStep(3); }}
                        >
                            <FontAwesomeIcon icon={faUserGroup} className="mr-2" /> {team.name}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )

    // Paso 3: Evaluación de lista de chequeo
    const renderChecklistStep = () => (
        <div className="max-w-xl mx-auto bg-white dark:bg-[#0b1f33] rounded-lg shadow-md p-6">
            <button onClick={() => setStep(2)} className="mb-4 text-[#00324d] dark:text-[#40b003] hover:underline flex items-center"><FontAwesomeIcon icon={faArrowLeft} className="mr-2" /> Volver a teams</button>
            <PageTitle>Lista de Chequeo</PageTitle>
            <form onSubmit={e => { e.preventDefault(); setSubmitted(true); }}>
                <ul className="mb-6">
                    {checklistItems.map(item => (
                        <li key={item.id} className="flex items-center mb-4">
                            <label className="flex-1 text-gray-700 dark:text-gray-300">
                                {item.label}
                            </label>
                            <input
                                type="checkbox"
                                checked={!!checklist[item.id]}
                                onChange={e => setChecklist({ ...checklist, [item.id]: e.target.checked })}
                                className="ml-4 w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                            />
                        </li>
                    ))}
                </ul>
                <button
                    type="submit"
                    className="w-full py-2 px-4 bg-[#00324d] text-white rounded hover:bg-[#40b003] transition-colors"
                >
                    Guardar evaluación
                </button>
            </form>
            {submitted && (
                <div className="mt-6 text-green-700 dark:text-green-400 flex items-center">
                    <FontAwesomeIcon icon={faCheckCircle} className="mr-2" /> Evaluación guardada correctamente.
                </div>
            )}
        </div>
    )

    // Render principal
    return (
        <div className="xl:col-span-5">
            <main className="p-6 min-h-screen bg-gray-50 dark:bg-[#071426]">
                {step === 1 && renderFichaStep()}
                {step === 2 && renderTeamStep()}
                {step === 3 && renderChecklistStep()}
            </main>
        </div>
    )
}
