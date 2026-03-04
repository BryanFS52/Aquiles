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
    
    const [profileImage, setProfileImage] = useState<string>("https://img.freepik.com/foto-gratis/joven-bella-mujer-pie-sobre-pared-blanca_114579-90514.jpg");
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLoadingData, setIsLoadingData] = useState<boolean>(true);
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [hasChanges, setHasChanges] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

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
                if (data.foto) setProfileImage(data.foto);
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
        setHasChanges(hasDataChanged);
    }, [profileData, originalData]);

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
                    setHasChanges(true);
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
        setIsEditing(false);
        setErrors({});
        setHasChanges(false);
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
                foto: profileImage !== "https://img.freepik.com/foto-gratis/joven-bella-mujer-pie-sobre-pared-blanca_114579-90514.jpg" ? profileImage : null
            });

            if (response.data?.success) {
                setOriginalData(profileData);
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

            {/* Header con botones de acción */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">Información del Perfil</h1>
                <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
                    {!isEditing ? (
                        <button
                            onClick={handleEdit}
                            className="flex-1 sm:flex-none flex items-center justify-center px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors duration-200 dark:text-blue-400 dark:bg-blue-900/20 dark:border-blue-700 dark:hover:bg-blue-900/30"
                        >
                            <HiPencil className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                            Editar
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={handleCancel}
                                disabled={isLoading}
                                className="flex-1 sm:flex-none flex items-center justify-center px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600"
                            >
                                <HiX className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                                Cancelar
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isLoading || !hasChanges}
                                className="flex-1 sm:flex-none flex items-center justify-center px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-3 w-3 sm:h-4 sm:w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Guardando...
                                    </>
                                ) : (
                                    <>
                                        <HiCheck className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                                        Guardar
                                    </>
                                )}
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="flex flex-col xl:flex-row items-start space-y-6 sm:space-y-8 xl:space-y-0 xl:space-x-8 lg:space-x-12">
                {/* Sección de foto */}
                <div className="flex flex-col items-center space-y-3 sm:space-y-4 w-full xl:w-auto mx-auto xl:mx-0">
                    <div className="relative group">
                        <Image
                            src={profileImage}
                            alt="Foto de perfil"
                            width={200}
                            height={200}
                            className="rounded-full object-cover border-4 border-gray-200 dark:border-gray-600 shadow-lg w-32 h-32 sm:w-48 sm:h-48 md:w-52 md:h-52 lg:w-56 lg:h-56"
                        />
                        {isEditing && (
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            >
                                <HiCamera className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                            </button>
                        )}
                    </div>
                    {isEditing && (
                        <div className="text-center">
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium dark:text-blue-400 dark:hover:text-blue-300"
                            >
                                Cambiar foto
                            </button>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                JPG, PNG o GIF (máx. 5MB)
                            </p>
                        </div>
                    )}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                    />
                </div>

                {/* Formulario */}
                <div className="flex-1 space-y-6 sm:space-y-8 w-full min-w-0">
                    {/* Datos Personales */}
                    <div>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6 pb-2 border-b border-gray-200 dark:border-gray-600">
                            Datos Personales
                        </h3>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
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
                                disabled={true} // El documento nunca debe ser editable
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
                    </div>

                    {/* Información Académica */}
                    <div>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6 pb-2 border-b border-gray-200 dark:border-gray-600">
                            Información Académica
                        </h3>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
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
                    </div>
                </div>
            </div>

            {/* Información adicional */}
            {hasChanges && isEditing && (
                <div className="p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-lg dark:bg-yellow-900/20 dark:border-yellow-700">
                    <p className="text-xs sm:text-sm text-yellow-800 dark:text-yellow-300">
                        Tienes cambios sin guardar. No olvides hacer clic en &quot;Guardar Cambios&quot; para confirmar las modificaciones.
                    </p>
                </div>
            )}
        </div>
    );
}

export default PerfilContainer;