"use client"

import type React from "react"
import { useMemo, useEffect, useCallback, useState } from "react"
import { X, Users } from "lucide-react"

// ==================== TYPES ====================
interface TeamMember {
    id: number
    name: string
    role: string
    avatar: string
    email: string
}

interface TeamData {
    current: {
        scrumMaster: TeamMember
        productOwner: TeamMember
        developers: TeamMember[]
    }
}

const useTeamData = (): TeamData => {
    return useMemo(
        () => ({
            current: {
                scrumMaster: {
                    id: 1,
                    name: "María González",
                    role: "Scrum Master",
                    avatar: "MG",
                    email: "maria.gonzalez@empresa.com",
                },
                productOwner: {
                    id: 2,
                    name: "Carlos Rodríguez",
                    role: "Product Owner",
                    avatar: "CR",
                    email: "carlos.rodriguez@empresa.com",
                },
                developers: [
                    {
                        id: 3,
                        name: "Ana López",
                        role: "Frontend Developer",
                        avatar: "AL",
                        email: "ana.lopez@empresa.com",
                    },
                    {
                        id: 4,
                        name: "David Martín",
                        role: "Backend Developer",
                        avatar: "DM",
                        email: "david.martin@empresa.com",
                    },
                    {
                        id: 5,
                        name: "Laura Sánchez",
                        role: "QA Tester",
                        avatar: "LS",
                        email: "laura.sanchez@empresa.com",
                    },
                ],
            },
        }),
        [],
    )
}

// Custom Modal Component
interface ModalProps {
    isOpen: boolean
    onClose: () => void
    children: React.ReactNode
}

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose()
        }
        if (isOpen) {
            document.addEventListener("keydown", handleEscape)
            document.body.style.overflow = "hidden"
        }
        return () => {
            document.removeEventListener("keydown", handleEscape)
            document.body.style.overflow = "unset"
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="fixed inset-0" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {children}
            </div>
        </div>
    )
}

interface OrgNodeProps {
    member: TeamMember
    level: "top" | "middle" | "bottom"
    animationDelay?: number
}

const OrgNode = ({ member, level, animationDelay = 0 }: OrgNodeProps) => {
    const [isVisible, setIsVisible] = useState(false)
    const [showDetails, setShowDetails] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true)
        }, animationDelay)
        return () => clearTimeout(timer)
    }, [animationDelay])

    const levelStyles = {
        top: "w-56 h-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg",
        middle: "w-48 h-18 bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md",
        bottom: "w-40 h-16 bg-gradient-to-r from-slate-500 to-slate-600 text-white shadow-sm"
    }

    return (
        <div className="relative">
            {/* Vertical Connection Line */}
            {level !== "top" && (
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 w-0.5 h-12 bg-slate-300"></div>
            )}

            {/* Main Node */}
            <div
                className={`${levelStyles[level]} rounded-lg flex flex-col justify-center items-center p-4 cursor-pointer transition-all duration-500 hover:scale-105 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    }`}
                onMouseEnter={() => setShowDetails(true)}
                onMouseLeave={() => setShowDetails(false)}
            >
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold">
                        {member.avatar}
                    </div>
                    <div className="text-left">
                        <div className="font-semibold text-sm">{member.name}</div>
                        <div className="text-xs opacity-90">{member.role}</div>
                    </div>
                </div>
            </div>

            {/* Details Tooltip */}
            {showDetails && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white rounded-lg shadow-xl p-3 border border-gray-200 z-20 w-56 transition-all duration-200">
                    <div className="text-sm font-semibold text-gray-800 mb-1">{member.name}</div>
                    <div className="text-xs text-gray-600 mb-2">{member.role}</div>
                    <div className="text-xs text-gray-500">{member.email}</div>
                </div>
            )}
        </div>
    )
}

interface HierarchyLevelProps {
    title: string
    children: React.ReactNode
    showConnections?: boolean
}

const HierarchyLevel = ({ title, children, showConnections = false }: HierarchyLevelProps) => {
    return (
        <div className="mb-16">
            <div className="text-center mb-8">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
                <div className="w-20 h-0.5 bg-gray-300 mx-auto"></div>
            </div>

            <div className="flex justify-center items-start gap-12">
                {children}
            </div>

            {/* Connection Lines Down */}
            {showConnections && (
                <div className="flex justify-center mt-8">
                    <div className="w-0.5 h-8 bg-slate-300"></div>
                </div>
            )}
        </div>
    )
}

// Branch Lines Component
const BranchLines = ({ count }: { count: number }) => {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true)
        }, 1000)
        return () => clearTimeout(timer)
    }, [])

    return (
        <div className={`flex justify-center mb-8 transition-all duration-500 ${isVisible ? "opacity-100" : "opacity-0"}`}>
            <div className="relative">
                {/* Main vertical line */}
                <div className="w-0.5 h-8 bg-slate-300 mx-auto"></div>
                {/* Horizontal distribution line */}
                <div className="w-64 h-0.5 bg-slate-300 absolute top-8 left-1/2 transform -translate-x-1/2"></div>
                {/* Individual branch lines */}
                <div className="flex justify-between w-64 absolute top-8 left-1/2 transform -translate-x-1/2">
                    {Array.from({ length: count }).map((_, index) => (
                        <div key={index} className="w-0.5 h-8 bg-slate-300"></div>
                    ))}
                </div>
            </div>
        </div>
    )
}

interface TeamDiagramModalProps {
    isOpen: boolean
    onClose: () => void
}

export const TeamHistoryModal = ({ isOpen, onClose }: TeamDiagramModalProps) => {
    const teamData = useTeamData()
    const { scrumMaster, productOwner, developers } = teamData.current

    const handleClose = useCallback(() => {
        onClose()
    }, [onClose])

    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
            {/* Header */}
            <header className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-slate-50 to-gray-50">
                <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl shadow-lg">
                        <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Organigrama del Equipo</h2>
                        <p className="text-gray-600">Estructura jerárquica del equipo de desarrollo</p>
                    </div>
                </div>
                <button
                    onClick={handleClose}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all duration-200"
                >
                    <X className="w-6 h-6" />
                </button>
            </header>

            {/* Organizational Chart */}
            <main className="flex-1 overflow-auto bg-gradient-to-b from-white to-gray-50 p-12">
                <div className="max-w-4xl mx-auto">

                    {/* Top Level - Scrum Master */}
                    <HierarchyLevel title="Facilitador del Proceso">
                        <OrgNode
                            member={scrumMaster}
                            level="top"
                            animationDelay={300}
                        />
                    </HierarchyLevel>

                    {/* Middle Level - Product Owner */}
                    <HierarchyLevel title="Propietario del Producto">
                        <OrgNode
                            member={productOwner}
                            level="middle"
                            animationDelay={600}
                        />
                    </HierarchyLevel>

                    {/* Branch Lines */}
                    <BranchLines count={developers.length} />

                    {/* Bottom Level - Development Team */}
                    <HierarchyLevel title="Equipo de Desarrollo">
                        {developers.map((developer, index) => (
                            <OrgNode
                                key={developer.id}
                                member={developer}
                                level="bottom"
                                animationDelay={1200 + index * 150}
                            />
                        ))}
                    </HierarchyLevel>

                    {/* Summary Statistics */}
                    <div className="mt-16 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Resumen del Equipo</h3>
                        <div className="grid grid-cols-4 gap-6 text-center">
                            <div className="p-4 bg-blue-50 rounded-lg">
                                <div className="text-2xl font-bold text-blue-600">1</div>
                                <div className="text-sm text-gray-600">Scrum Master</div>
                            </div>
                            <div className="p-4 bg-purple-50 rounded-lg">
                                <div className="text-2xl font-bold text-purple-600">1</div>
                                <div className="text-sm text-gray-600">Product Owner</div>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-lg">
                                <div className="text-2xl font-bold text-slate-600">{developers.length}</div>
                                <div className="text-sm text-gray-600">Desarrolladores</div>
                            </div>
                            <div className="p-4 bg-green-50 rounded-lg">
                                <div className="text-2xl font-bold text-green-600">{developers.length + 2}</div>
                                <div className="text-sm text-gray-600">Total</div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </Modal>
    )
}