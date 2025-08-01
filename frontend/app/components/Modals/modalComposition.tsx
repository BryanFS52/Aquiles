"use client"

import React, { useState, useMemo } from "react"
import { X, Users, Crown, Code, Database, GitBranch, ChevronDown, User } from "lucide-react"
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

// Función para obtener colores de perfil
const getProfileColor = (profileName: string) => {
    switch (profileName) {
        case 'Managment': return 'bg-purple-100 text-purple-800 border-purple-200'
        case 'Dev Front': return 'bg-blue-100 text-blue-800 border-blue-200'
        case 'Dev Back': return 'bg-green-100 text-green-800 border-green-200'
        default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
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

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full px-3 py-2 text-sm bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
                <span className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-blue-600" />
                    <span className="text-blue-700 font-medium">
                        Ver roles disponibles
                    </span>
                </span>
                <ChevronDown className={`w-4 h-4 text-blue-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

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
                                        <div className={`w-3 h-3 rounded-full ${profile.name === 'Managment' ? 'bg-purple-500' :
                                            profile.name === 'Dev Front' ? 'bg-blue-500' :
                                                profile.name === 'Dev Back' ? 'bg-green-500' : 'bg-gray-500'
                                            }`}></div>
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
    selectedRole
}: {
    member: Student
    role: string
    isManager?: boolean
    level?: number
    profiles?: Profile[]
    onSelectProfile?: (studentId: string, profile: Profile) => void
    selectedRole?: Profile | null
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
            <div className={`relative bg-white rounded-lg p-4 shadow-lg ${config.borderColor} border-2 min-w-[200px] ${isManager ? 'ring-2 ring-yellow-400' : ''} ${selectedRole ? 'cursor-pointer hover:shadow-xl transition-shadow' : ''
                }`}>
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
                                onClick={() => {
                                    if (selectedRole) {
                                        onSelectProfile(member.id!, selectedRole)
                                    } else {
                                        // Mostrar mensaje de que debe seleccionar un rol primero
                                        alert('Por favor, selecciona un rol primero desde el panel izquierdo.')
                                    }
                                }}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${selectedRole
                                    ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                                disabled={!selectedRole}
                            >
                                {selectedRole ? `Asignar ${selectedRole.name}` : 'Selecciona un rol'}
                            </button>

                            {/* Mostrar rol actual si existe */}
                            {member.profiles?.[0] && (
                                <div className="mt-2">
                                    <span className="text-xs text-gray-500">Rol actual:</span>
                                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ml-1 ${getProfileColor(member.profiles[0].name || '')}`}>
                                        <User className="w-3 h-3 mr-1" />
                                        {member.profiles[0].name}
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
    selectedRole
}: {
    teamData: TeamsScrum
    profiles?: Profile[]
    onSelectProfile?: (studentId: string, profile: Profile) => void
    selectedRole?: Profile | null
}) => {
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
                    <HierarchyNode
                        member={manager}
                        role="Managment"
                        isManager={true}
                        level={0}
                        profiles={profiles}
                        onSelectProfile={onSelectProfile}
                        selectedRole={selectedRole}
                    />
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
                                            <HierarchyNode
                                                member={dev}
                                                role="Dev Front"
                                                level={1}
                                                profiles={profiles}
                                                onSelectProfile={onSelectProfile}
                                                selectedRole={selectedRole}
                                            />
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
                                            <HierarchyNode
                                                member={dev}
                                                role="Dev Back"
                                                level={1}
                                                profiles={profiles}
                                                onSelectProfile={onSelectProfile}
                                                selectedRole={selectedRole}
                                            />
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

interface ModalCompositionProps {
    isOpen: boolean
    onClose: () => void
    teamData: TeamsScrum | null
    onSelectProfile?: (studentId: string, profile: Profile) => void
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

    const teamStats = useMemo(() => {
        if (!teamData) return { total: 0, managers: 0, frontDevs: 0, backDevs: 0 }

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

            {/* Perfiles Disponibles */}
            {profiles.length > 0 && (
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
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${profile.name === 'Managment'
                                    ? 'bg-purple-100 text-purple-800 border-purple-200'
                                    : profile.name === 'Dev Front'
                                        ? 'bg-blue-100 text-blue-800 border-blue-200'
                                        : profile.name === 'Dev Back'
                                            ? 'bg-green-100 text-green-800 border-green-200'
                                            : 'bg-gray-100 text-gray-800 border-gray-200'
                                    }`}
                            >
                                <div className={`w-2 h-2 rounded-full mr-2 ${profile.name === 'Managment' ? 'bg-purple-500' :
                                    profile.name === 'Dev Front' ? 'bg-blue-500' :
                                        profile.name === 'Dev Back' ? 'bg-green-500' : 'bg-gray-500'
                                    }`}></div>
                                {profile.name}
                                <span className="ml-2 text-xs opacity-75">({profile.description})</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="p-6 bg-gray-50 max-h-[500px] overflow-y-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Panel de Roles Disponibles */}
                    <div className="lg:col-span-1 bg-white rounded-lg p-4 shadow-sm border">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                            <User className="w-5 h-5 text-blue-600" />
                            <span>Roles Disponibles</span>
                        </h3>

                        <div className="space-y-3">
                            {profiles.map((profile) => (
                                <div
                                    key={profile.id}
                                    onClick={() => setSelectedRole(profile)}
                                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${selectedRole?.id === profile.id
                                        ? 'border-solid shadow-lg ring-2 ring-offset-2'
                                        : 'border-dashed'
                                        } ${profile.name === 'Managment'
                                            ? `border-purple-300 bg-purple-50 hover:bg-purple-100 ${selectedRole?.id === profile.id ? 'ring-purple-500' : ''}`
                                            : profile.name === 'Dev Front'
                                                ? `border-blue-300 bg-blue-50 hover:bg-blue-100 ${selectedRole?.id === profile.id ? 'ring-blue-500' : ''}`
                                                : profile.name === 'Dev Back'
                                                    ? `border-green-300 bg-green-50 hover:bg-green-100 ${selectedRole?.id === profile.id ? 'ring-green-500' : ''}`
                                                    : `border-gray-300 bg-gray-50 hover:bg-gray-100 ${selectedRole?.id === profile.id ? 'ring-gray-500' : ''}`
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className={`w-4 h-4 rounded-full ${profile.name === 'Managment' ? 'bg-purple-500' :
                                                profile.name === 'Dev Front' ? 'bg-blue-500' :
                                                    profile.name === 'Dev Back' ? 'bg-green-500' : 'bg-gray-500'
                                                }`}></div>
                                            <div>
                                                <h4 className="font-semibold text-gray-800">{profile.name}</h4>
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
                            ))}
                        </div>

                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
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
                            onSelectProfile={onSelectProfile}
                            selectedRole={selectedRole}
                        />
                    </div>
                </div>
            </main>
        </Modal>
    )
}
