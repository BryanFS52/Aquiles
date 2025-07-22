"use client"

import React, { useState, useMemo } from "react"
import { X, Users, Crown, Code, Database, GitBranch } from "lucide-react"
import { TeamsScrum, Student, Profile } from "@graphql/generated"

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    children: React.ReactNode
}

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="fixed inset-0" onClick={onClose} />
            <div className="relative bg-white rounded-xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
                {children}
            </div>
        </div>
    )
}

// Nodo de la jerarquía
const HierarchyNode = ({
    member,
    role,
    isManager = false,
    level = 0
}: {
    member: Student
    role: string
    isManager?: boolean
    level?: number
}) => {
    const roleConfig = {
        'Managment': {
            color: 'bg-purple-600',
            borderColor: 'border-purple-600',
            icon: Crown,
            title: 'Manager'
        },
        'Dev Front': {
            color: 'bg-blue-600',
            borderColor: 'border-blue-600',
            icon: Code,
            title: 'Frontend Developer'
        },
        'Dev Back': {
            color: 'bg-green-600',
            borderColor: 'border-green-600',
            icon: Database,
            title: 'Backend Developer'
        }
    }

    const config = roleConfig[role as keyof typeof roleConfig] || {
        color: 'bg-gray-600',
        borderColor: 'border-gray-600',
        icon: Users,
        title: 'Developer'
    }

    const IconComponent = config.icon
    const initials = `${member.person?.name?.[0] || ''}${member.person?.lastname?.[0] || ''}`

    return (
        <div className="flex flex-col items-center">
            {/* Nodo principal */}
            <div className={`relative bg-white rounded-lg p-4 shadow-lg ${config.borderColor} border-2 min-w-[200px] ${isManager ? 'ring-2 ring-yellow-400' : ''}`}>
                <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 ${config.color} rounded-full flex items-center justify-center text-white font-bold`}>
                        {initials}
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 text-sm">
                            {`${member.person?.name || ''} ${member.person?.lastname || ''}`}
                        </h3>
                        <p className="text-xs text-gray-600">{config.title}</p>
                    </div>
                    <div className={`p-2 ${config.color} rounded-lg`}>
                        <IconComponent className="w-4 h-4 text-white" />
                    </div>
                </div>
            </div>
        </div>
    )
}

// Líneas de conexión
const ConnectionLines = ({
    hasManager,
    frontDevsCount,
    backDevsCount
}: {
    hasManager: boolean
    frontDevsCount: number
    backDevsCount: number
}) => {
    if (!hasManager || (frontDevsCount === 0 && backDevsCount === 0)) return null

    return (
        <div className="relative">
            {/* Línea vertical desde manager */}
            <div className="absolute left-1/2 top-0 w-0.5 h-12 bg-gray-400 transform -translate-x-1/2"></div>

            {/* Línea horizontal principal */}
            <div className="absolute left-1/2 top-12 w-80 h-0.5 bg-gray-400 transform -translate-x-1/2"></div>

            {/* Líneas verticales hacia equipos */}
            {frontDevsCount > 0 && (
                <div className="absolute left-1/4 top-12 w-0.5 h-12 bg-gray-400 transform -translate-x-1/2"></div>
            )}
            {backDevsCount > 0 && (
                <div className="absolute right-1/4 top-12 w-0.5 h-12 bg-gray-400 transform translate-x-1/2"></div>
            )}
        </div>
    )
}

// Organigrama jerárquico
const TeamHierarchy = ({ teamData }: { teamData: TeamsScrum }) => {
    const { manager, frontDevs, backDevs } = useMemo(() => {
        const manager = teamData.students?.find((s: Student | null) =>
            s?.profiles?.some((p: Profile | null) => p?.name === "Managment")
        )
        const frontDevs = teamData.students?.filter((s: Student | null) =>
            s?.profiles?.some((p: Profile | null) => p?.name === "Dev Front")
        ) || []
        const backDevs = teamData.students?.filter((s: Student | null) =>
            s?.profiles?.some((p: Profile | null) => p?.name === "Dev Back")
        ) || []

        return { manager, frontDevs, backDevs }
    }, [teamData])

    return (
        <div className="py-8">
            {/* Manager - Nivel superior */}
            {manager && (
                <div className="flex justify-center mb-8">
                    <HierarchyNode member={manager} role="Managment" isManager={true} level={0} />
                </div>
            )}

            {/* Líneas de conexión */}
            <div className="relative mb-8">
                <ConnectionLines
                    hasManager={!!manager}
                    frontDevsCount={frontDevs.length}
                    backDevsCount={backDevs.length}
                />
            </div>

            {/* Desarrolladores - Nivel inferior */}
            {(frontDevs.length > 0 || backDevs.length > 0) && (
                <div className="grid grid-cols-2 gap-16 max-w-4xl mx-auto">
                    {/* Frontend Team */}
                    <div className="space-y-6">
                        <div className="text-center">
                            <h3 className="text-lg font-semibold text-gray-700 flex items-center justify-center space-x-2">
                                <Code className="w-5 h-5 text-blue-600" />
                                <span>Frontend Team</span>
                            </h3>
                        </div>
                        {frontDevs.length > 0 ? (
                            <div className="space-y-4">
                                {frontDevs.map((dev: Student | null, index: number) =>
                                    dev ? (
                                        <div key={dev.id || index} className="flex justify-center">
                                            <HierarchyNode member={dev} role="Dev Front" level={1} />
                                        </div>
                                    ) : null
                                )}
                            </div>
                        ) : (
                            <div className="text-center text-gray-400 italic text-sm">
                                No hay desarrolladores frontend
                            </div>
                        )}
                    </div>

                    {/* Backend Team */}
                    <div className="space-y-6">
                        <div className="text-center">
                            <h3 className="text-lg font-semibold text-gray-700 flex items-center justify-center space-x-2">
                                <Database className="w-5 h-5 text-green-600" />
                                <span>Backend Team</span>
                            </h3>
                        </div>
                        {backDevs.length > 0 ? (
                            <div className="space-y-4">
                                {backDevs.map((dev: Student | null, index: number) =>
                                    dev ? (
                                        <div key={dev.id || index} className="flex justify-center">
                                            <HierarchyNode member={dev} role="Dev Back" level={1} />
                                        </div>
                                    ) : null
                                )}
                            </div>
                        ) : (
                            <div className="text-center text-gray-400 italic text-sm">
                                No hay desarrolladores backend
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Mensaje si no hay miembros */}
            {!manager && frontDevs.length === 0 && backDevs.length === 0 && (
                <div className="text-center py-12">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No hay miembros en el equipo</p>
                </div>
            )}
        </div>
    )
}

interface TeamHistoryModalProps {
    isOpen: boolean
    onClose: () => void
    teamData: TeamsScrum | null
}

export const TeamHistoryModal = ({ isOpen, onClose, teamData }: TeamHistoryModalProps) => {
    if (!teamData) return null

    const teamStats = useMemo(() => {
        const total = teamData.students?.length || 0
        const managers = teamData.students?.filter(s =>
            s?.profiles?.some(p => p?.name === "Managment")
        ).length || 0
        const frontDevs = teamData.students?.filter(s =>
            s?.profiles?.some(p => p?.name === "Dev Front")
        ).length || 0
        const backDevs = teamData.students?.filter(s =>
            s?.profiles?.some(p => p?.name === "Dev Back")
        ).length || 0

        return { total, managers, frontDevs, backDevs }
    }, [teamData])

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            {/* Header */}
            <header className="flex items-center justify-between p-6 border-b bg-gray-50">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-600 rounded-lg">
                        <GitBranch className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Organigrama del Equipo</h2>
                        <p className="text-gray-600">Estructura jerárquica y organización</p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
                >
                    <X className="w-5 h-5" />
                </button>
            </header>

            {/* Stats */}
            <div className="px-6 py-4 bg-white border-b">
                <div className="flex space-x-8">
                    <div className="text-center">
                        <div className="text-sm text-gray-500">Total</div>
                        <div className="text-2xl font-bold text-gray-900">{teamStats.total}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-sm text-gray-500">Managers</div>
                        <div className="text-2xl font-bold text-purple-600">{teamStats.managers}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-sm text-gray-500">Frontend</div>
                        <div className="text-2xl font-bold text-blue-600">{teamStats.frontDevs}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-sm text-gray-500">Backend</div>
                        <div className="text-2xl font-bold text-green-600">{teamStats.backDevs}</div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="p-6 bg-gray-50 max-h-[500px] overflow-y-auto">
                <TeamHierarchy teamData={teamData} />
            </main>
        </Modal>
    )
}