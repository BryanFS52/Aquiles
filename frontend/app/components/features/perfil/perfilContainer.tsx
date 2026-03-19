'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { HiCamera, HiUser, HiMail, HiOfficeBuilding, HiPencil, HiCheck, HiX, HiExclamationCircle } from 'react-icons/hi';
import Image from "next/image";
import PageTitle from "@components/UI/pageTitle";
import axios from 'axios';

// Interfaces para tipado
interface ProfileData {
    nombres: string;
    apellidos: string;
    correo: string;
    centro: string;
    documento: string;
    telefono: string;
    fechaNacimiento: string;
    programa: string;
    foto?: string;
}

interface ProfileFieldProps {
    label: string;
    name: keyof ProfileData;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    type?: string;
    icon?: React.ComponentType<{ className?: string }>;
    error?: string;
    disabled?: boolean;
    required?: boolean;
}

interface AlertProps {
    type: 'success' | 'error';
    message: string;
    onClose?: () => void;
}

interface ValidationErrors {
    [key: string]: string;
}

interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
}

interface SectionCardProps {
    title: string;
    description: string;
    children: React.ReactNode;
}

// Componente reutilizable para campos
const ProfileField: React.FC<ProfileFieldProps> = ({
    label,
    name,
    value,
    onChange,
    placeholder = "",
    type = "text",
    icon: Icon,
    error,
    disabled = false,
    required = false
}) => (
    <div className="space-y-1 sm:space-y-2">
        <label htmlFor={name} className="flex items-center text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
            {Icon && <Icon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-gray-500 dark:text-gray-400" />}
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg border-2 transition-all duration-200 
                ${error
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200 dark:border-red-400 dark:focus:border-red-400'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200 dark:border-gray-600 dark:focus:border-blue-400'
                } 
                ${disabled
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400'
                    : 'bg-white text-gray-900 hover:border-gray-400 dark:bg-gray-700 dark:text-gray-100 dark:hover:border-gray-500'
                }
                focus:outline-none focus:ring-2 placeholder-gray-400 dark:placeholder-gray-500`}
        />
        {error && (
            <p className="text-xs sm:text-sm text-red-600 dark:text-red-400 flex items-center">
                <HiExclamationCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                {error}
            </p>
        )}
    </div>
);

// Componente de alerta
const Alert: React.FC<AlertProps> = ({ type, message, onClose }) => {
    const bgColor = type === 'success'
        ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700'
        : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-700';
    const textColor = type === 'success'
        ? 'text-green-800 dark:text-green-300'
        : 'text-red-800 dark:text-red-300';
    const iconColor = type === 'success'
        ? 'text-green-600 dark:text-green-400'
        : 'text-red-600 dark:text-red-400';

    return (
        <div className={`${bgColor} border rounded-lg p-4 mb-6`}>
            <div className="flex items-start">
                <div className={`${iconColor} mr-3 mt-0.5`}>
                    {type === 'success' ? (
                        <HiCheck className="w-5 h-5" />
                    ) : (
                        <HiExclamationCircle className="w-5 h-5" />
                    )}
                </div>
                <div className="flex-1">
                    <p className={`text-sm ${textColor}`}>{message}</p>
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className={`${textColor} hover:opacity-70 ml-2`}
                        aria-label="Cerrar alerta"
                    >
                        <HiX className="w-5 h-5" />
                    </button>
                )}
            </div>
        </div>
    );
};

const SectionCard: React.FC<SectionCardProps> = ({ title, description, children }) => (
    <section className="rounded-2xl border border-gray-200/80 bg-white/90 p-5 shadow-sm backdrop-blur-sm transition-all duration-300 dark:border-gray-700 dark:bg-gray-800/80 sm:p-6">
        <div className="mb-5 flex items-start justify-between gap-4 border-b border-gray-200 pb-3 dark:border-gray-700">
            <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 sm:text-lg">{title}</h3>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 sm:text-sm">{description}</p>
            </div>
        </div>
        {children}
    </section>
);

const PerfilContainer: React.FC = () => {
    const [profileData, setProfileData] = useState<ProfileData>({
        nombres: '',
        apellidos: '',
        correo: '',
        centro: '',
        documento: '',
        telefono: '',
        fechaNacimiento: '',
        programa: ''
    });

    const [originalData, setOriginalData] = useState<ProfileData>({
        nombres: '',
        apellidos: '',
        correo: '',
        centro: '',
        documento: '',
        telefono: '',
        fechaNacimiento: '',
        programa: ''
    });
    
    const [profileImage, setProfileImage] = useState<string>('');
    const [originalProfileImage, setOriginalProfileImage] = useState<string>('');
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLoadingData, setIsLoadingData] = useState<boolean>(true);
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [hasChanges, setHasChanges] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const fullName = `${profileData.nombres} ${profileData.apellidos}`.trim() || 'Usuario';
    const profileCompletion = [
        profileData.nombres,
        profileData.apellidos,
        profileData.correo,
        profileData.documento,
        profileData.telefono,
        profileData.centro,
        profileData.programa,
        profileData.fechaNacimiento,
    ].filter((value) => value?.trim()).length;
    const completionPercentage = Math.round((profileCompletion / 8) * 100);

    const showAlert = useCallback((message: string, type: 'success' | 'error' = 'error') => {
        setAlert({ message, type });
        setTimeout(() => setAlert(null), 5000);
    }, []);

    const loadProfileData = useCallback(async () => {
        try {
            setIsLoadingData(true);
            const response = await axios.get<ApiResponse<ProfileData>>('/api/profile');
            if (response.data?.success && response.data.data) {
                const data = response.data.data;
                setProfileData(data);
                setOriginalData(data);
                const savedProfileImage = data.foto || '';
                setProfileImage(savedProfileImage);
                setOriginalProfileImage(savedProfileImage);
            }
        } catch (error) {
            console.error('Error cargando perfil:', error);
            showAlert('Error al cargar los datos del perfil', 'error');
        } finally {
            setIsLoadingData(false);
        }
    }, [showAlert]);

    useEffect(() => {
        loadProfileData();
    }, [loadProfileData]);

    useEffect(() => {
        const hasDataChanged = JSON.stringify(profileData) !== JSON.stringify(originalData);
        const hasImageChanged = profileImage !== originalProfileImage;
        setHasChanges(hasDataChanged || hasImageChanged);
    }, [profileData, originalData, profileImage, originalProfileImage]);

    const validateForm = (): boolean => {
        const newErrors: ValidationErrors = {};

        if (!profileData.nombres?.trim()) {
            newErrors.nombres = 'Los nombres son requeridos';
        } else if (profileData.nombres.length < 2) {
            newErrors.nombres = 'Los nombres deben tener al menos 2 caracteres';
        }

        if (!profileData.apellidos?.trim()) {
            newErrors.apellidos = 'Los apellidos son requeridos';
        } else if (profileData.apellidos.length < 2) {
            newErrors.apellidos = 'Los apellidos deben tener al menos 2 caracteres';
        }

        if (!profileData.correo?.trim()) {
            newErrors.correo = 'El correo es requerido';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.correo)) {
            newErrors.correo = 'Ingresa un correo válido';
        }

        if (profileData.telefono && !/^\d{10}$/.test(profileData.telefono.replace(/\s/g, ''))) {
            newErrors.telefono = 'El teléfono debe tener 10 dígitos';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                showAlert('La imagen debe ser menor a 5MB', 'error');
                return;
            }
            if (!file.type.startsWith('image/')) {
                showAlert('Solo se permiten archivos de imagen', 'error');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target?.result) {
                    setProfileImage(e.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
        setErrors({});
    };

    const handleCancel = () => {
        setProfileData(originalData);
        setProfileImage(originalProfileImage);
        setIsEditing(false);
        setErrors({});
        setHasChanges(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSave = async () => {
        if (!validateForm()) {
            showAlert('Por favor, corrige los errores en el formulario', 'error');
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.put<ApiResponse>('/api/profile', {
                ...profileData,
                foto: profileImage || null
            });

            if (response.data?.success) {
                setOriginalData(profileData);
                setOriginalProfileImage(profileImage);
                setIsEditing(false);
                setHasChanges(false);
                showAlert('Perfil actualizado exitosamente', 'success');
            } else {
                throw new Error(response.data?.message || 'Error al actualizar');
            }
        } catch (error: any) {
            console.error('Error actualizando perfil:', error);
            showAlert(
                error.response?.data?.message || 'Error al actualizar el perfil. Intenta nuevamente.',
                'error'
            );
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoadingData) {
        return (
            <div className="space-y-4 sm:space-y-6 px-2 sm:px-4 lg:px-0">
                <PageTitle>Perfil</PageTitle>
                <div className="animate-pulse">
                    <div className="flex flex-col lg:flex-row items-start space-y-4 sm:space-y-6 lg:space-y-0 lg:space-x-6 xl:space-x-8">
                        <div className="w-32 h-32 sm:w-48 sm:h-48 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto lg:mx-0"></div>
                        <div className="flex-1 space-y-3 sm:space-y-4 w-full">
                            <div className="h-3 sm:h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
                            <div className="h-8 sm:h-10 bg-gray-300 dark:bg-gray-600 rounded"></div>
                            <div className="h-8 sm:h-10 bg-gray-300 dark:bg-gray-600 rounded"></div>
                            <div className="h-8 sm:h-10 bg-gray-300 dark:bg-gray-600 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4 sm:space-y-6 px-2 sm:px-4 lg:px-0">
            <PageTitle>Mi Perfil</PageTitle>

            {alert && (
                <Alert
                    type={alert.type}
                    message={alert.message}
                    onClose={() => setAlert(null)}
                />
            )}

            <div className="overflow-hidden rounded-3xl border border-gray-300/50 bg-gradient-to-br from-white via-white to-gray-50 shadow-lg dark:border-gray-600/50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
                <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:p-8">
                    <div className="flex flex-col gap-5 md:flex-row md:items-center">
                        <div className="relative mx-auto md:mx-0">
                            <div className="relative group">
                                {profileImage ? (
                                    <Image
                                        src={profileImage}
                                        alt="Foto de perfil"
                                        width={200}
                                        height={200}
                                        className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-xl dark:border-gray-800 sm:h-36 sm:w-36 lg:h-40 lg:w-40"
                                    />
                                ) : (
                                    <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-[#eef9e8] to-[#dff1d1] shadow-xl dark:border-gray-800 dark:from-gray-800 dark:to-gray-700 sm:h-36 sm:w-36 lg:h-40 lg:w-40">
                                        <HiUser className="h-12 w-12 text-[#5cb800] dark:text-[#8fd400] sm:h-16 sm:w-16" />
                                    </div>
                                )}
                                {isEditing && (
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute inset-0 flex items-center justify-center rounded-full bg-black/45 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                                    >
                                        <HiCamera className="h-6 w-6 text-white sm:h-8 sm:w-8" />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="min-w-0 flex-1 text-center md:text-left">
                            <h1 className="mt-3 text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
                                {fullName}
                            </h1>
                            <p className="mt-2 max-w-2xl text-sm text-gray-600 dark:text-gray-300 sm:text-base">
                                Administra tu información personal, académica y de contacto desde un solo lugar.
                            </p>

                            <div className="mt-4 grid gap-3 sm:grid-cols-3">
                                <div className="rounded-2xl border border-white/70 bg-white/80 p-3 shadow-sm dark:border-gray-700 dark:bg-gray-800/80">
                                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Correo</p>
                                    <p className="mt-1 truncate text-sm font-semibold text-gray-900 dark:text-white">{profileData.correo || 'Sin registrar'}</p>
                                </div>
                                <div className="rounded-2xl border border-white/70 bg-white/80 p-3 shadow-sm dark:border-gray-700 dark:bg-gray-800/80">
                                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Documento</p>
                                    <p className="mt-1 truncate text-sm font-semibold text-gray-900 dark:text-white">{profileData.documento || 'Sin registrar'}</p>
                                </div>
                                <div className="rounded-2xl border border-white/70 bg-white/80 p-3 shadow-sm dark:border-gray-700 dark:bg-gray-800/80">
                                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Perfil completo</p>
                                    <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">{completionPercentage}%</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-stretch gap-3 lg:min-w-[240px]">
                        <div className="rounded-2xl border border-white/70 bg-white/85 p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800/85">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Estado del perfil</p>
                                    <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                                        {hasChanges ? 'Con cambios pendientes' : 'Actualizado'}
                                    </p>
                                </div>
                                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${hasChanges ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'}`}>
                                    {hasChanges ? 'Pendiente' : 'OK'}
                                </span>
                            </div>
                            <div className="mt-4">
                                <div className="mb-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                    <span>Completitud</span>
                                    <span>{completionPercentage}%</span>
                                </div>
                                <div className="h-2.5 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-[#5cb800] to-[#8fd400] transition-all duration-300"
                                        style={{ width: `${completionPercentage}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
                            {!isEditing ? (
                                <button
                                    onClick={handleEdit}
                                    className="flex-1 sm:flex-none flex items-center justify-center rounded-xl border border-[#5cb800]/20 bg-white px-4 py-2.5 text-sm font-medium text-[#2d6a00] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#f3ffe8] dark:border-[#8fd400]/20 dark:bg-gray-800 dark:text-[#b7f56b] dark:hover:bg-gray-700"
                                >
                                    <HiPencil className="mr-2 h-4 w-4" />
                                    Editar perfil
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={handleCancel}
                                        disabled={isLoading}
                                        className="flex-1 sm:flex-none flex items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 shadow-sm transition-all duration-200 hover:bg-gray-100 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                                    >
                                        <HiX className="mr-2 h-4 w-4" />
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={isLoading || !hasChanges}
                                        className="flex-1 sm:flex-none flex items-center justify-center rounded-xl border border-[#5cb800] bg-gradient-to-r from-[#5cb800] to-[#78ca1c] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {isLoading ? (
                                            <>
                                                <svg className="-ml-1 mr-2 h-4 w-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Guardando
                                            </>
                                        ) : (
                                            <>
                                                <HiCheck className="mr-2 h-4 w-4" />
                                                Guardar cambios
                                            </>
                                        )}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
            />

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
                <div className="space-y-6">
                    <SectionCard
                        title="Datos personales"
                        description="Mantén actualizada tu información principal y de contacto."
                    >
                        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
                            <ProfileField
                                label="Nombres"
                                name="nombres"
                                value={profileData.nombres}
                                onChange={handleInputChange}
                                placeholder="Ingresa tus nombres"
                                icon={HiUser}
                                disabled={!isEditing}
                                required
                                error={errors.nombres}
                            />
                            <ProfileField
                                label="Apellidos"
                                name="apellidos"
                                value={profileData.apellidos}
                                onChange={handleInputChange}
                                placeholder="Ingresa tus apellidos"
                                icon={HiUser}
                                disabled={!isEditing}
                                required
                                error={errors.apellidos}
                            />
                            <ProfileField
                                label="Correo Electrónico"
                                name="correo"
                                type="email"
                                value={profileData.correo}
                                onChange={handleInputChange}
                                placeholder="correo@ejemplo.com"
                                icon={HiMail}
                                disabled={!isEditing}
                                required
                                error={errors.correo}
                            />
                            <ProfileField
                                label="Teléfono"
                                name="telefono"
                                value={profileData.telefono}
                                onChange={handleInputChange}
                                placeholder="3001234567"
                                disabled={!isEditing}
                                error={errors.telefono}
                            />
                            <ProfileField
                                label="Documento"
                                name="documento"
                                value={profileData.documento}
                                onChange={handleInputChange}
                                placeholder="Número de documento"
                                disabled={true}
                            />
                            <ProfileField
                                label="Fecha de Nacimiento"
                                name="fechaNacimiento"
                                type="date"
                                value={profileData.fechaNacimiento}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                            />
                        </div>
                    </SectionCard>

                    <SectionCard
                        title="Información académica"
                        description="Visualiza los datos institucionales asociados a tu cuenta."
                    >
                        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
                            <ProfileField
                                label="Centro de Formación"
                                name="centro"
                                value={profileData.centro}
                                onChange={handleInputChange}
                                placeholder="Nombre del centro"
                                icon={HiOfficeBuilding}
                                disabled={!isEditing}
                            />
                            <ProfileField
                                label="Programa de Formación"
                                name="programa"
                                value={profileData.programa}
                                onChange={handleInputChange}
                                placeholder="Programa formativo"
                                disabled={!isEditing}
                            />
                        </div>
                    </SectionCard>
                </div>

                <div className="space-y-6">
                    <section className="rounded-2xl border border-gray-200/80 bg-white/90 p-5 shadow-sm backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/80 sm:p-6">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 sm:text-lg">Resumen del perfil</h3>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
                            Vista rápida de tus datos más importantes.
                        </p>

                        <div className="mt-5 space-y-3">
                            <div className="rounded-2xl bg-gray-50 p-4 dark:bg-gray-900/60">
                                <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Nombre completo</p>
                                <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">{fullName}</p>
                            </div>
                            <div className="rounded-2xl bg-gray-50 p-4 dark:bg-gray-900/60">
                                <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Centro</p>
                                <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">{profileData.centro || 'Sin registrar'}</p>
                            </div>
                            <div className="rounded-2xl bg-gray-50 p-4 dark:bg-gray-900/60">
                                <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Programa</p>
                                <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">{profileData.programa || 'Sin registrar'}</p>
                            </div>
                            <div className="rounded-2xl bg-gray-50 p-4 dark:bg-gray-900/60">
                                <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Teléfono</p>
                                <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">{profileData.telefono || 'Sin registrar'}</p>
                            </div>
                        </div>

                        {isEditing && (
                            <div className="mt-5 rounded-2xl border border-dashed border-[#5cb800]/35 bg-[#f7fff0] p-4 text-center dark:border-[#8fd400]/25 dark:bg-[#8fd400]/5">
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="inline-flex items-center justify-center rounded-xl bg-[#5cb800] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#4da000]"
                                >
                                    <HiCamera className="mr-2 h-4 w-4" />
                                    Actualizar foto
                                </button>
                                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">JPG, PNG o GIF de máximo 5MB.</p>
                            </div>
                        )}
                    </section>
                </div>
            </div>

            {/* Información adicional */}
            {hasChanges && isEditing && (
                <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-4 shadow-sm dark:border-yellow-700 dark:bg-yellow-900/20">
                    <p className="text-xs sm:text-sm text-yellow-800 dark:text-yellow-300">
                        Tienes cambios sin guardar. No olvides hacer clic en &quot;Guardar cambios&quot; para confirmar las modificaciones.
                    </p>
                </div>
            )}
        </div>
    );
}

export default PerfilContainer;