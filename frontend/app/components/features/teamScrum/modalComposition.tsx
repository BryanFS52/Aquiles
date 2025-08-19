"use client"

import React, { useState, useMemo, useEffect } from "react"
import { X, Users, Crown, Code, Database, GitBranch, ChevronDown, User } from "lucide-react"
import { TeamsScrum, Student, Profile } from "@graphql/generated"

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    children: React.ReactNode
}

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
    useEffect(() => {
        if (isOpen) {
            // Bloquear scroll del body cuando el modal está abierto
            document.body.style.overflow = 'hidden'
            document.body.style.paddingRight = '15px' // Compensar scrollbar
        } else {
            // Restaurar scroll del body cuando el modal se cierra
            document.body.style.overflow = 'unset'
            document.body.style.paddingRight = '0px'
        }

        // Cleanup cuando el componente se desmonta
        return () => {
            document.body.style.overflow = 'unset'
            document.body.style.paddingRight = '0px'
        }
    }, [isOpen])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="fixed inset-0" onClick={onClose} />
            <div className="relative bg-white rounded-xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {children}
            </div>
        </div>
    )
}

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
            { bg: 'bg-gray-600', border: 'border-gray-600', icon: Crown, title: 'Manager' },
            { bg: 'bg-slate-600', border: 'border-slate-600', icon: Code, title: 'Frontend Developer' },
            { bg: 'bg-zinc-600', border: 'border-zinc-600', icon: Database, title: 'Backend Developer' },
            { bg: 'bg-neutral-600', border: 'border-neutral-600', icon: User, title: 'Scrum Master' },
            { bg: 'bg-stone-600', border: 'border-stone-600', icon: Users, title: 'Product Owner' },
            { bg: 'bg-gray-700', border: 'border-gray-700', icon: User, title: 'Team Member' },
            { bg: 'bg-slate-700', border: 'border-slate-700', icon: User, title: 'Designer' },
            { bg: 'bg-zinc-700', border: 'border-zinc-700', icon: User, title: 'QA Tester' },
            { bg: 'bg-neutral-700', border: 'border-neutral-700', icon: User, title: 'DevOps' },
            { bg: 'bg-stone-700', border: 'border-stone-700', icon: User, title: 'Analyst' },
            { bg: 'bg-gray-500', border: 'border-gray-500', icon: User, title: 'Developer' },
            { bg: 'bg-slate-500', border: 'border-slate-500', icon: User, title: 'Consultant' },
            { bg: 'bg-zinc-500', border: 'border-zinc-500', icon: User, title: 'Specialist' },
            { bg: 'bg-neutral-500', border: 'border-neutral-500', icon: User, title: 'Lead' },
            { bg: 'bg-stone-500', border: 'border-stone-500', icon: User, title: 'Junior' },
            { bg: 'bg-gray-800', border: 'border-gray-800', icon: User, title: 'Senior' },
            { bg: 'bg-gray-600', border: 'border-gray-600', icon: User, title: 'Sin Rol Asignado' }
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
        <div className="flex flex-col items-center">
            {/* Nodo principal */}
            <div className={`relative bg-white rounded-lg p-4 shadow-lg ${config.border} border-2 min-w-[200px] ${isManager ? 'ring-2 ring-yellow-400' : ''} ${selectedRole ? 'cursor-pointer hover:shadow-xl transition-shadow' : ''
                }`}>
                <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 ${config.bg} rounded-full flex items-center justify-center text-white font-bold`}>
                        {initials}
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 text-sm">
                            {`${member.person?.name || ''} ${member.person?.lastname || ''}`}
                        </h3>
                        <p className="text-xs text-gray-600 truncate" title={role}>
                            {role.length > 25 ? `${role.substring(0, 25)}...` : role}
                        </p>
                    </div>
                    <div className={`p-2 ${config.bg} rounded-lg`}>
                        <RoleIcon className="w-4 h-4 text-white" />
                    </div>
                </div>

                {/* Indicador de que se puede hacer clic */}
                {selectedRole && (
                    <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold animate-pulse">
                        !
                    </div>
                )}

                {/* Botón de asignación de rol */}
                {profiles.length > 0 && onSelectProfile && member.id && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="text-center">
                            <button
                                onClick={async () => {
                                    if (selectedRole) {
                                        await onSelectProfile(member.id!, selectedRole)
                                    } else {
                                        // Mostrar mensaje de que debe seleccionar un rol primero
                                        alert('Por favor, selecciona un rol primero desde el panel izquierdo.')
                                    }
                                }}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${selectedRole && !isAssigning
                                    ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                                disabled={!selectedRole || isAssigning}
                            >
                                {isAssigning ? (
                                    <div className="flex items-center space-x-2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        <span>Asignando...</span>
                                    </div>
                                ) : selectedRole ? (
                                    `Asignar ${selectedRole.name}`
                                ) : (
                                    'Selecciona un rol'
                                )}
                            </button>

                            {/* Mostrar rol actual si existe */}
                            {(member as any).assignedProfile && (member as any).assignedProfile !== "Sin Rol" && (
                                <div className="mt-2">
                                    <span className="text-xs text-gray-500">Rol actual:</span>
                                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ml-1 ${getProfileColor((member as any).assignedProfile || '')}`}>
                                        <User className="w-3 h-3 mr-1" />
                                        {(member as any).assignedProfile}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
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
        <div className="pt-8">
            {/* Todos los miembros del equipo (incluyendo sin roles) */}
            {studentsWithRole && studentsWithRole.length > 0 && (
                <div className="mt-0 border-t border-gray-200 pt-6">
                    <div className="text-center mb-6">
                        <h3 className="text-lg font-semibold text-gray-700 flex items-center justify-center space-x-2">
                            <Users className="w-5 h-5 text-gray-600" />
                            <span>Todos los Miembros del Equipo</span>
                            <span className="bg-gray-200 text-gray-800 text-xs font-semibold px-2 py-1 rounded-full">
                                {studentsWithRole.length}
                            </span>
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                            Incluyendo miembros sin roles asignados
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
                        {studentsWithRole.map((student: any, index: number) =>
                            student ? (
                                <div key={student.id || index} className="flex justify-center">
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
                <div className="text-center py-12">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No hay miembros en el equipo</p>
                    <p className="text-sm text-gray-400 mt-2">
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
        <Modal isOpen={isOpen} onClose={onClose}>
            {/* Header */}
            <header className="flex items-center justify-between p-6 border-b bg-gray-50">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-lime-500 rounded-lg">
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
                        <div className="text-sm text-gray-500">Con Roles</div>
                        <div className="text-2xl font-bold text-green-600">{teamStats.withRoles}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-sm text-gray-500">Sin Roles</div>
                        <div className="text-2xl font-bold text-red-600">{teamStats.withoutRoles}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-sm text-gray-500">Roles Únicos</div>
                        <div className="text-2xl font-bold text-blue-600">{teamStats.uniqueRoles}</div>
                    </div>
                </div>
            </div>

            {/* Perfiles Disponibles */}
            {profiles.length > 0 ? (
                <div className="px-6 py-3 bg-blue-50 border-b">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                            <User className="w-4 h-4 text-blue-600" />
                            <span>Roles Disponibles para Asignar</span>
                        </h3>
                        <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                            {profiles.length} opciones
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {profiles.map((profile) => (
                            <div
                                key={profile.id}
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getProfileColor(profile.name || '')}`}
                            >
                                <div className={`w-2 h-2 rounded-full mr-2 ${getProfileDotColor(profile.name || '')}`}></div>
                                {profile.name}
                                <span className="ml-2 text-xs opacity-75">({profile.description})</span>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="px-6 py-3 bg-yellow-50 border-b">
                    <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm font-semibold text-yellow-700">Sin perfiles disponibles</span>
                    </div>
                    <p className="text-xs text-yellow-600 mt-1">
                        No hay perfiles configurados para la metodología de proceso seleccionada en este equipo.
                    </p>
                </div>
            )}

            {/* Main Content */}
            <main className="px-6 pt-6 bg-gray-50 flex-1 overflow-y-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Panel de Roles Disponibles */}
                    <div className="lg:col-span-1 bg-white rounded-lg p-2 shadow-sm border h-fit">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                            <User className="w-5 h-5 text-blue-600" />
                            <span>Roles Disponibles</span>
                        </h3>

                        <div className="space-y-2">
                            {profiles.map((profile) => {
                                const profileColors = generateProfileColors(profile.name || '')
                                return (
                                    <div
                                        key={profile.id}
                                        onClick={() => setSelectedRole(profile)}
                                        className={`p-3 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${selectedRole?.id === profile.id
                                            ? `border-solid shadow-lg ring-2 ring-offset-2 ring-opacity-50`
                                            : 'border-dashed'
                                            } ${profileColors.bg} hover:opacity-90 ${selectedRole?.id === profile.id ? `ring-2 ring-offset-2` : ''
                                            }`}
                                        style={{
                                            borderColor: selectedRole?.id === profile.id ? profileColors.dot.replace('bg-', '#') : undefined
                                        }}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className={`w-4 h-4 rounded-full ${getProfileDotColor(profile.name || '')}`}></div>
                                                <div>
                                                    <h4 className={`font-semibold ${profileColors.text}`}>{profile.name}</h4>
                                                    <p className="text-xs text-gray-600">{profile.description}</p>
                                                </div>
                                            </div>
                                            {selectedRole?.id === profile.id && (
                                                <div className="text-green-600">
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                            {selectedRole ? (
                                <p className="text-sm text-blue-700">
                                    <strong>Rol seleccionado:</strong> {selectedRole.name}<br />
                                    <span className="text-xs">Ahora haz clic en un miembro del equipo para asignárselo.</span>
                                </p>
                            ) : (
                                <p className="text-sm text-blue-700">
                                    <strong>Instrucciones:</strong> Selecciona un rol y luego haz clic en un miembro del equipo para asignárselo.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Panel de Miembros del Equipo */}
                    <div className="lg:col-span-2">
                        <TeamHierarchy
                            teamData={teamData}
                            profiles={profiles}
                            onSelectProfile={handleProfileAssignment}
                            selectedRole={selectedRole}
                            assigningProfile={assigningProfile}
                        />
                    </div>
                </div>
            </main>
        </Modal>
    )
}
