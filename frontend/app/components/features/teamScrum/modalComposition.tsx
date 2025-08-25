"use client"

import React, { useState, useMemo, useEffect } from "react"
import { X, Users, Crown, Code, Database, GitBranch, ChevronDown, User, BarChart3, CheckCircle, Clock, Target, TrendingUp, UserCheck, Settings } from "lucide-react"
import { TeamsScrum, Student, Profile } from "@graphql/generated"
import Modal from "@components/UI/Modal"

// Función para generar colores consistentes basados en el nombre del perfil
const generateProfileColors = (profileName: string) => {
    // Lista de colores predefinidos para mayor variabilidad
    const colorPalettes = [
        { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200', dot: 'bg-purple-500' },
        { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200', dot: 'bg-blue-500' },
        { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200', dot: 'bg-green-500' },
        { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200', dot: 'bg-red-500' },
        { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200', dot: 'bg-yellow-500' },
        { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-200', dot: 'bg-indigo-500' },
        { bg: 'bg-pink-100', text: 'text-pink-800', border: 'border-pink-200', dot: 'bg-pink-500' },
        { bg: 'bg-teal-100', text: 'text-teal-800', border: 'border-teal-200', dot: 'bg-teal-500' },
        { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200', dot: 'bg-orange-500' },
        { bg: 'bg-cyan-100', text: 'text-cyan-800', border: 'border-cyan-200', dot: 'bg-cyan-500' },
        { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-200', dot: 'bg-emerald-500' },
        { bg: 'bg-violet-100', text: 'text-violet-800', border: 'border-violet-200', dot: 'bg-violet-500' },
        { bg: 'bg-rose-100', text: 'text-rose-800', border: 'border-rose-200', dot: 'bg-rose-500' },
        { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-200', dot: 'bg-amber-500' },
        { bg: 'bg-lime-100', text: 'text-lime-800', border: 'border-lime-200', dot: 'bg-lime-500' },
        { bg: 'bg-sky-100', text: 'text-sky-800', border: 'border-sky-200', dot: 'bg-sky-500' },
    ]

    // Crear un hash simple del nombre del perfil para consistencia
    let hash = 0
    for (let i = 0; i < profileName.length; i++) {
        const char = profileName.charCodeAt(i)
        hash = ((hash << 5) - hash) + char
        hash = hash & hash // Convertir a 32bit integer
    }

    // Usar el hash para seleccionar un color de la paleta
    const colorIndex = Math.abs(hash) % colorPalettes.length
    return colorPalettes[colorIndex]
}

// Función para obtener colores de perfil (ahora usa colores aleatorios consistentes)
const getProfileColor = (profileName: string) => {
    const colors = generateProfileColors(profileName)
    return `${colors.bg} ${colors.text} ${colors.border}`
}

// Función para obtener el color del punto/dot
const getProfileDotColor = (profileName: string) => {
    const colors = generateProfileColors(profileName)
    return colors.dot
}

// Componente selector de perfiles
const ProfileSelector = ({
    profiles,
    selectedProfile,
    onSelectProfile,
    studentId
}: {
    profiles: Profile[]
    selectedProfile?: Profile | null
    onSelectProfile: (studentId: string, profile: Profile) => void
    studentId: string
}) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="relative mt-3 pt-3 border-t border-gray-200">
            <label className="block text-xs font-medium text-gray-700 mb-2">
                <span className="flex items-center space-x-1">
                    <User className="w-3 h-3" />
                    <span>Roles disponibles:</span>
                    <span className="text-blue-600 text-xs">({profiles.length} opciones)</span>
                </span>
            </label>

            {/* Perfil actual */}
            {selectedProfile && (
                <div className="mb-2">
                    <span className="text-xs text-gray-500">Actual:</span>
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ml-1 ${getProfileColor(selectedProfile.name || '')}`}>
                        <User className="w-3 h-3 mr-1" />
                        {selectedProfile.name}
                    </div>
                </div>
            )}
            {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                    <div className="p-2">
                        <div className="text-xs font-medium text-gray-700 mb-2">Selecciona un rol:</div>
                        <div className="space-y-1">
                            {profiles.map((profile) => (
                                <button
                                    key={profile.id}
                                    onClick={() => {
                                        onSelectProfile(studentId, profile)
                                        setIsOpen(false)
                                    }}
                                    className={`flex items-center justify-between w-full px-3 py-2 text-sm rounded-md transition-colors hover:bg-gray-50 ${selectedProfile?.id === profile.id ? 'bg-blue-50 border border-blue-200' : 'border border-transparent'
                                        }`}
                                >
                                    <div className="flex items-center space-x-2">
                                        <div className={`w-3 h-3 rounded-full ${getProfileDotColor(profile.name || '')}`}></div>
                                        <span className="font-medium">{profile.name}</span>
                                    </div>
                                    <span className="text-xs text-gray-500">{profile.description}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

// Nodo de la jerarquía
const HierarchyNode = ({
    member,
    role,
    isManager = false,
    profiles = [],
    onSelectProfile,
    selectedRole,
    isAssigning = false
}: {
    member: Student
    role: string
    isManager?: boolean
    level?: number
    profiles?: Profile[]
    onSelectProfile?: (studentId: string, profile: Profile) => Promise<void>
    selectedRole?: Profile | null
    isAssigning?: boolean
}) => {
    // Generar colores más diversos para los roles
    const generateRoleColors = (roleName: string) => {
        // Para los miembros del equipo, usar siempre colores grises pero con variaciones
        const grayVariations = [
            { bg: 'bg-gray-600', border: 'border-gray-600', text: 'text-gray-600', icon: Crown, title: 'Manager' },
            { bg: 'bg-slate-600', border: 'border-slate-600', text: 'text-slate-600', icon: Code, title: 'Frontend Developer' },
            { bg: 'bg-zinc-600', border: 'border-zinc-600', text: 'text-zinc-600', icon: Database, title: 'Backend Developer' },
            { bg: 'bg-neutral-600', border: 'border-neutral-600', text: 'text-neutral-600', icon: User, title: 'Scrum Master' },
            { bg: 'bg-stone-600', border: 'border-stone-600', text: 'text-stone-600', icon: Users, title: 'Product Owner' },
            { bg: 'bg-gray-700', border: 'border-gray-700', text: 'text-gray-700', icon: User, title: 'Team Member' },
            { bg: 'bg-slate-700', border: 'border-slate-700', text: 'text-slate-700', icon: User, title: 'Designer' },
            { bg: 'bg-zinc-700', border: 'border-zinc-700', text: 'text-zinc-700', icon: User, title: 'QA Tester' },
            { bg: 'bg-neutral-700', border: 'border-neutral-700', text: 'text-neutral-700', icon: User, title: 'DevOps' },
            { bg: 'bg-stone-700', border: 'border-stone-700', text: 'text-stone-700', icon: User, title: 'Analyst' },
            { bg: 'bg-gray-500', border: 'border-gray-500', text: 'text-gray-500', icon: User, title: 'Developer' },
            { bg: 'bg-slate-500', border: 'border-slate-500', text: 'text-slate-500', icon: User, title: 'Consultant' },
            { bg: 'bg-zinc-500', border: 'border-zinc-500', text: 'text-zinc-500', icon: User, title: 'Specialist' },
            { bg: 'bg-neutral-500', border: 'border-neutral-500', text: 'text-neutral-500', icon: User, title: 'Lead' },
            { bg: 'bg-stone-500', border: 'border-stone-500', text: 'text-stone-500', icon: User, title: 'Junior' },
            { bg: 'bg-gray-800', border: 'border-gray-800', text: 'text-gray-800', icon: User, title: 'Senior' },
            { bg: 'bg-gray-600', border: 'border-gray-600', text: 'text-gray-600', icon: User, title: 'Sin Rol Asignado' }
        ]

        // Crear hash para consistencia
        let hash = 0
        for (let i = 0; i < roleName.length; i++) {
            const char = roleName.charCodeAt(i)
            hash = ((hash << 5) - hash) + char
            hash = hash & hash
        }

        const colorIndex = Math.abs(hash) % grayVariations.length
        return grayVariations[colorIndex]
    }

    // Función para obtener el icono correcto basado en el rol
    const getRoleIcon = (roleName: string) => {
        const roleUpper = roleName.toUpperCase()
        if (roleUpper.includes('MANAGEMENT') || roleUpper.includes('MANAGER')) return Crown
        if (roleUpper.includes('DEV FRONT') || roleUpper.includes('FRONTEND')) return Code
        if (roleUpper.includes('DEV BACK') || roleUpper.includes('BACKEND')) return Database
        if (roleUpper.includes('PRODUCT OWNER')) return Users
        if (roleUpper.includes('SCRUM MASTER')) return User
        return User // Default icon
    }

    const config = generateRoleColors(role)
    const RoleIcon = getRoleIcon(role)
    const initials = `${member.person?.name?.[0] || ''}${member.person?.lastname?.[0] || ''}`

    return (
        <div className="group">
            {/* Tarjeta elegante pero compacta */}
            <div className={`relative bg-white rounded-xl border p-4 shadow-sm hover:shadow-md transition-all duration-300 ${selectedRole ? 'cursor-pointer hover:bg-blue-50/30 hover:border-blue-200' : 'hover:bg-gray-50'
                } ${isManager ? 'border-l-4 border-l-yellow-400 bg-gradient-to-r from-yellow-50/50 to-white' : 'border-gray-200'} w-full max-w-sm mx-auto`}>

                {/* Efecto sutil de fondo */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-100/20 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative">
                    <div className="flex items-center justify-between mb-3">
                        {/* Info del miembro */}
                        <div className="flex items-center space-x-3 flex-1">
                            <div className="relative">
                                <div className={`w-10 h-10 ${config.bg} rounded-xl flex items-center justify-center text-white font-semibold text-xs shadow-md ring-2 ring-white ring-opacity-80`}>
                                    {initials}
                                </div>
                                {isManager && (
                                    <div className="absolute -top-0.5 -right-0.5 bg-yellow-400 rounded-full p-0.5 shadow-sm">
                                        <Crown className="w-2.5 h-2.5 text-yellow-800" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 text-sm truncate">
                                    {`${member.person?.name || ''} ${member.person?.lastname || ''}`}
                                </h4>
                                <div className="flex items-center space-x-1.5 mt-0.5">
                                    <RoleIcon className="w-3 h-3 text-gray-400" />
                                    <p className="text-xs text-gray-600 truncate">
                                        {role}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Status y acciones */}
                        <div className="flex flex-col items-end space-y-1">
                            {selectedRole && (
                                <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse shadow-sm"></div>
                            )}
                            <div className="flex items-center space-x-1">
                                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                                <span className="text-xs text-gray-500">Online</span>
                            </div>
                        </div>
                    </div>

                    {/* Rol actual con estilo mejorado */}
                    {(member as any).assignedProfile && (member as any).assignedProfile !== "Sin Rol" && (
                        <div className="mb-3 p-2.5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100/50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-1.5">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                    <span className="text-xs font-medium text-green-700">Rol Asignado</span>
                                </div>
                                <span className="text-xs font-semibold text-green-800 bg-white/60 px-2 py-0.5 rounded">
                                    {(member as any).assignedProfile}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Botón de asignación elegante */}
                    {profiles.length > 0 && onSelectProfile && member.id && (
                        <button
                            onClick={async () => {
                                if (selectedRole) {
                                    await onSelectProfile(member.id!, selectedRole)
                                } else {
                                    alert('Por favor, selecciona un rol primero.')
                                }
                            }}
                            className={`w-full py-2.5 px-3 text-xs font-medium rounded-lg transition-all duration-300 ${selectedRole && !isAssigning
                                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-sm hover:shadow-md transform hover:-translate-y-0.5'
                                : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                                }`}
                            disabled={!selectedRole || isAssigning}
                        >
                            <div className="flex items-center justify-center space-x-1.5">
                                {isAssigning ? (
                                    <>
                                        <div className="animate-spin rounded-full h-3 w-3 border-b border-white"></div>
                                        <span>Asignando...</span>
                                    </>
                                ) : selectedRole ? (
                                    <>
                                        <UserCheck className="w-3 h-3" />
                                        <span>Asignar {selectedRole.name}</span>
                                    </>
                                ) : (
                                    <>
                                        <Target className="w-3 h-3" />
                                        <span>Selecciona un rol</span>
                                    </>
                                )}
                            </div>
                        </button>
                    )}
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
const TeamHierarchy = ({
    teamData,
    profiles = [],
    onSelectProfile,
    selectedRole,
    assigningProfile
}: {
    teamData: TeamsScrum
    profiles?: Profile[]
    onSelectProfile?: (studentId: string, profile: Profile) => Promise<void>
    selectedRole?: Profile | null
    assigningProfile?: string | null
}) => {
    // Mapear estudiantes con sus roles asignados desde los datos que llegan
    const studentsWithRole = useMemo(() => {
        if (!teamData.students) return []

        // Si memberIds está disponible desde el backend, usar ese mapeo
        if ((teamData as any).memberIds && Array.isArray((teamData as any).memberIds)) {
            const membersMap = new Map<string, string>()

                // Filtrar solo los memberIds que tienen profileId válido (no null)
                ; (teamData as any).memberIds.forEach((m: any) => {
                    if (m.profileId && m.profileId !== null) {
                        membersMap.set(String(m.studentId), m.profileId)
                    }
                })

            return teamData.students.map(student => {
                if (!student) return null

                const assignedProfileId = membersMap.get(String(student.id))
                const assignedProfile = profiles.find(p => p.id === assignedProfileId)

                return {
                    ...student,
                    assignedProfile: assignedProfile ? assignedProfile.name : "Sin Rol"
                }
            }).filter(Boolean)
        }

        // Usar los profiles que vienen directamente en cada estudiante
        return teamData.students.map(student => {
            if (!student) return null

            // Buscar el primer perfil válido (con name no null)
            const validProfile = student.profiles?.find(p => p?.name && p.name !== null)

            return {
                ...student,
                assignedProfile: validProfile?.name || "Sin Rol"
            }
        }).filter(Boolean)
    }, [teamData, profiles])

    return (
        <div className="pt-4">
            {/* Lista compacta de miembros */}
            {studentsWithRole && studentsWithRole.length > 0 && (
                <div className="mt-0 border-t border-gray-200 pt-6">
                    {/* Header compacto */}
                    <div className="mb-6 text-center">
                        <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-gray-50 to-blue-50 px-4 py-3 rounded-xl border border-gray-100 shadow-sm">
                            <div className="p-1.5 bg-blue-100 rounded-lg">
                                <Users className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-base font-semibold text-gray-900">
                                    Miembros del Equipo
                                </h3>
                                <p className="text-xs text-gray-600">
                                    {studentsWithRole.length} personas • Gestiona roles
                                </p>
                            </div>
                            <div className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                {studentsWithRole.length}
                            </div>
                        </div>
                    </div>

                    {/* Grid compacto */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-w-5xl mx-auto">
                        {studentsWithRole.map((student: any, index: number) =>
                            student ? (
                                <div
                                    key={student.id || index}
                                    className="transform transition-all duration-300 hover:scale-[1.02]"
                                    style={{
                                        animationDelay: `${index * 0.1}s`
                                    }}
                                >
                                    <HierarchyNode
                                        member={student}
                                        role={(student as any).assignedProfile}
                                        isManager={student.assignedProfile?.toLowerCase().includes('scrum master') ||
                                            student.assignedProfile?.toLowerCase().includes('management') ||
                                            student.assignedProfile?.toLowerCase().includes('manager')}
                                        level={2}
                                        profiles={profiles}
                                        onSelectProfile={onSelectProfile}
                                        selectedRole={selectedRole}
                                        isAssigning={assigningProfile === student?.id}
                                    />
                                </div>
                            ) : null
                        )}
                    </div>
                </div>
            )}

            {/* Mensaje si no hay miembros */}
            {(!studentsWithRole || studentsWithRole.length === 0) && (
                <div className="text-center py-8 md:py-12">
                    <Users className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-sm md:text-base">No hay miembros en el equipo</p>
                    <p className="text-xs md:text-sm text-gray-400 mt-2">
                        Los datos del equipo no contienen estudiantes o están vacíos
                    </p>
                </div>
            )}
        </div>
    )
}

interface ModalCompositionProps {
    isOpen: boolean
    onClose: () => void
    teamData: TeamsScrum | null
    onSelectProfile?: (studentId: string, profile: Profile) => Promise<void>
    profiles: Profile[]
}

export const ModalComposition = ({
    isOpen,
    onClose,
    teamData,
    onSelectProfile,
    profiles
}: ModalCompositionProps) => {
    const [selectedRole, setSelectedRole] = useState<Profile | null>(null)
    const [assigningProfile, setAssigningProfile] = useState<string | null>(null)

    const teamStats = useMemo(() => {
        if (!teamData) return { total: 0, withRoles: 0, withoutRoles: 0, uniqueRoles: 0 }

        const total = teamData.students?.length || 0

        // Si memberIds está disponible desde el backend, usar ese mapeo
        if ((teamData as any).memberIds) {
            // Contar solo los memberIds que tienen profileId válido (no null)
            const validAssignments = (teamData as any).memberIds.filter((m: any) =>
                m.profileId && m.profileId !== null
            )

            const withRoles = validAssignments.length
            const withoutRoles = total - withRoles

            // Contar roles únicos asignados desde memberIds válidos
            const assignedProfileIds = new Set(
                validAssignments.map((m: any) => m.profileId)
            )
            const uniqueRoles = assignedProfileIds.size

            return { total, withRoles, withoutRoles, uniqueRoles }
        }

        // Usar los profiles que vienen directamente en cada estudiante
        const withRoles = teamData.students?.filter(s => {
            // Contar como "con rol" si tiene al menos un perfil válido (name no null)
            return s?.profiles?.some(p => p?.name && p.name !== null)
        }).length || 0
        const withoutRoles = total - withRoles

        // Contar roles únicos basado en los perfiles válidos de cada estudiante
        const assignedRoles = teamData.students?.map(s => {
            const validProfile = s?.profiles?.find(p => p?.name && p.name !== null)
            return validProfile?.name
        }).filter(Boolean) || []
        const uniqueRoles = new Set(assignedRoles).size

        return { total, withRoles, withoutRoles, uniqueRoles }
    }, [teamData])

    const handleProfileAssignment = async (studentId: string, profile: Profile) => {
        if (!onSelectProfile) return

        setAssigningProfile(studentId)
        try {
            await onSelectProfile(studentId, profile)
        } finally {
            setAssigningProfile(null)
        }
    }

    if (!teamData) return null

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={
                <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-br from-lime-500 to-lime-600 rounded-xl shadow-lg">
                        <GitBranch className="w-6 h-6 text-white drop-shadow-sm" />
                    </div>
                    <div>
                        <span className="text-xl font-bold text-gray-900 tracking-tight">Organigrama del Equipo</span>
                        <p className="text-gray-600 text-sm mt-1 font-medium">Estructura jerárquica y organización</p>
                    </div>
                </div>
            }
            size="xxl"
            className="max-h-[90vh] w-full max-w-5xl mx-auto"
        >
            <div className="max-h-[70vh] overflow-y-auto px-3 py-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {/* Stats con elementos innovadores pero manteniendo colores */}
                <div className="relative overflow-hidden px-6 py-6 bg-gradient-to-r from-white to-gray-50 border border-gray-100 rounded-xl mb-6 shadow-sm">
                    {/* Elementos decorativos sutiles */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gray-100 rounded-full blur-xl opacity-30 animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-blue-50 rounded-full blur-xl opacity-40 animate-bounce"></div>

                    <div className="relative grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="text-center group relative">
                            <div className="absolute inset-0 bg-gray-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-105"></div>
                            <div className="relative">
                                <div className="text-sm text-gray-500 font-medium mb-2 flex items-center justify-center space-x-1">
                                    <Users className="w-4 h-4" />
                                    <span>Total</span>
                                </div>
                                <div className="text-2xl font-bold text-gray-900 transition-transform duration-200 group-hover:scale-110">{teamStats.total}</div>
                                <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                                    <div className="bg-gray-600 h-1 rounded-full transition-all duration-1000" style={{ width: '100%' }}></div>
                                </div>
                            </div>
                        </div>
                        <div className="text-center group relative">
                            <div className="absolute inset-0 bg-green-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-105"></div>
                            <div className="relative">
                                <div className="text-sm text-gray-500 font-medium mb-2 flex items-center justify-center space-x-1">
                                    <CheckCircle className="w-4 h-4" />
                                    <span>Con Roles</span>
                                </div>
                                <div className="text-2xl font-bold text-green-600 transition-transform duration-200 group-hover:scale-110">{teamStats.withRoles}</div>
                                <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                                    <div className="bg-green-600 h-1 rounded-full transition-all duration-1000"
                                        style={{ width: `${teamStats.total > 0 ? (teamStats.withRoles / teamStats.total) * 100 : 0}%` }}></div>
                                </div>
                            </div>
                        </div>
                        <div className="text-center group relative">
                            <div className="absolute inset-0 bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-105"></div>
                            <div className="relative">
                                <div className="text-sm text-gray-500 font-medium mb-2 flex items-center justify-center space-x-1">
                                    <Clock className="w-4 h-4" />
                                    <span>Sin Roles</span>
                                </div>
                                <div className="text-2xl font-bold text-red-600 transition-transform duration-200 group-hover:scale-110">{teamStats.withoutRoles}</div>
                                <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                                    <div className="bg-red-600 h-1 rounded-full transition-all duration-1000"
                                        style={{ width: `${teamStats.total > 0 ? (teamStats.withoutRoles / teamStats.total) * 100 : 0}%` }}></div>
                                </div>
                            </div>
                        </div>
                        <div className="text-center group relative">
                            <div className="absolute inset-0 bg-blue-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-105"></div>
                            <div className="relative">
                                <div className="text-sm text-gray-500 font-medium mb-2 flex items-center justify-center space-x-1">
                                    <Target className="w-4 h-4" />
                                    <span>Roles Únicos</span>
                                </div>
                                <div className="text-2xl font-bold text-blue-600 transition-transform duration-200 group-hover:scale-110">{teamStats.uniqueRoles}</div>
                                <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                                    <div className="bg-blue-600 h-1 rounded-full transition-all duration-1000" style={{ width: '85%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Perfiles Disponibles con elementos innovadores pero manteniendo colores */}
                {profiles.length > 0 ? (
                    <div className="relative overflow-hidden px-6 py-5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl mb-6 shadow-sm">
                        {/* Elementos decorativos sutiles */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100 rounded-full blur-xl opacity-20 animate-pulse"></div>
                        <div className="absolute bottom-0 left-0 w-20 h-20 bg-indigo-100 rounded-full blur-xl opacity-30 animate-bounce"></div>

                        <div className="relative">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
                                <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                                    <div className="relative group">
                                        <div className="absolute inset-0 bg-blue-200 rounded-lg blur opacity-0 group-hover:opacity-50 transition-all duration-300"></div>
                                        <div className="relative p-2 bg-blue-100 rounded-lg transform group-hover:scale-110 transition-all duration-300">
                                            <User className="w-5 h-5 text-blue-600" />
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-base font-semibold text-gray-700 flex items-center space-x-2">
                                            <Settings className="w-4 h-4" />
                                            <span>Roles Disponibles para Asignar</span>
                                        </span>
                                        <p className="text-xs text-gray-500 mt-1">Selecciona y asigna roles a los miembros</p>
                                    </div>
                                </div>
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-blue-200 rounded-full blur opacity-0 group-hover:opacity-50 transition-all duration-300 animate-pulse"></div>
                                    <span className="relative text-xs font-semibold text-blue-700 bg-blue-200 px-3 py-2 rounded-full shadow-sm transform group-hover:scale-105 transition-all duration-300 flex items-center space-x-1">
                                        <TrendingUp className="w-3 h-3" />
                                        <span>{profiles.length} opciones</span>
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3 justify-center">
                                {profiles.map((profile, index) => (
                                    <div
                                        key={profile.id}
                                        className={`group relative transform hover:scale-105 transition-all duration-300 hover:z-10`}
                                        style={{
                                            animationDelay: `${index * 0.1}s`
                                        }}
                                    >
                                        <div className="absolute inset-0 bg-white rounded-xl blur opacity-0 group-hover:opacity-50 transition-all duration-300"></div>
                                        <div className={`relative inline-flex items-center px-4 py-3 rounded-xl text-sm font-medium border border-opacity-20 shadow-sm hover:shadow-lg transition-all duration-200 ${getProfileColor(profile.name || '')}`}>
                                            <div className={`w-3 h-3 rounded-full mr-3 ${getProfileDotColor(profile.name || '')} shadow-sm animate-pulse`}></div>
                                            <span className="truncate max-w-[120px] font-medium">{profile.name}</span>
                                            <span className="ml-3 text-xs opacity-75 hidden md:inline bg-white bg-opacity-50 px-2 py-1 rounded-full">
                                                {profile.description}
                                            </span>

                                            {/* Efecto de brillo sutil */}
                                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/10 to-transparent transform skew-x-12 group-hover:animate-pulse"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="px-6 py-5 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-100 rounded-xl mb-6 shadow-sm">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <User className="w-5 h-5 text-yellow-600" />
                            </div>
                            <div>
                                <span className="text-base font-semibold text-yellow-700">Sin perfiles disponibles</span>
                                <p className="text-sm text-yellow-600 mt-1 font-medium">
                                    No hay perfiles configurados para la metodología de proceso seleccionada en este equipo.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Content */}
                <div className="px-1 py-1">
                    <div className="space-y-8">
                        {/* Panel de Roles Disponibles */}
                        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg border border-gray-100">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md">
                                    <User className="w-6 h-6 text-white drop-shadow-sm" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800 tracking-tight flex items-center space-x-2">
                                        <BarChart3 className="w-5 h-5" />
                                        <span>Roles Disponibles para Asignar</span>
                                    </h3>
                                    <p className="text-sm text-gray-600 font-medium">Selecciona un rol y asígnalo a un miembro</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {profiles.map((profile) => {
                                    const profileColors = generateProfileColors(profile.name || '')
                                    return (
                                        <div
                                            key={profile.id}
                                            onClick={() => setSelectedRole(profile)}
                                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${selectedRole?.id === profile.id
                                                ? `border-solid shadow-xl ring-4 ring-opacity-30 scale-105`
                                                : 'border-dashed hover:border-solid'
                                                } ${profileColors.bg} hover:opacity-95 ${selectedRole?.id === profile.id ? `ring-4 ring-offset-2` : ''
                                                }`}
                                            style={{
                                                borderColor: selectedRole?.id === profile.id ? profileColors.dot.replace('bg-', '#') : undefined
                                            }}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <div className={`w-5 h-5 rounded-full ${getProfileDotColor(profile.name || '')} shadow-md ring-2 ring-white`}></div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className={`font-bold text-sm ${profileColors.text} truncate tracking-tight`}>{profile.name}</h4>
                                                        <p className="text-xs text-gray-600 truncate font-medium mt-1">{profile.description}</p>
                                                    </div>
                                                </div>
                                                {selectedRole?.id === profile.id && (
                                                    <div className="text-green-600 flex-shrink-0 animate-pulse">
                                                        <div className="p-1 bg-green-100 rounded-full">
                                                            <CheckCircle className="w-5 h-5" />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Instrucciones */}
                            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 shadow-sm">
                                {selectedRole ? (
                                    <div className="text-sm text-blue-700 flex items-center space-x-3">
                                        <div className="p-2 bg-green-100 rounded-lg">
                                            <CheckCircle className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="font-bold mb-1 flex items-center space-x-1">
                                                <UserCheck className="w-4 h-4" />
                                                <span>Rol seleccionado: {selectedRole.name}</span>
                                            </p>
                                            <p className="text-xs font-medium">Ahora haz clic en un miembro del equipo para asignárselo.</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-sm text-blue-700 flex items-center space-x-3">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <Settings className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="font-bold mb-1 flex items-center space-x-1">
                                                <Target className="w-4 h-4" />
                                                <span>Instrucciones:</span>
                                            </p>
                                            <p className="text-xs font-medium">Selecciona un rol y luego haz clic en un miembro del equipo para asignárselo.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Panel de Miembros del Equipo */}
                        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg border border-gray-100">
                            <TeamHierarchy
                                teamData={teamData}
                                profiles={profiles}
                                onSelectProfile={handleProfileAssignment}
                                selectedRole={selectedRole}
                                assigningProfile={assigningProfile}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    )
}
