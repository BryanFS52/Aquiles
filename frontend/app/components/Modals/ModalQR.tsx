"use client";

import React, { useEffect, useState, useCallback } from "react";
import { BsQrCode } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@redux/store";
import { generateQrCode } from "@redux/slices/generateQrSlice";
import { sendEmailNotification } from "@redux/slices/sendEmailSlice";
import { getAttendanceEmailTemplate, getAttendanceEmailSubject } from "@templates/attendanceQrTemplate";
import Image from "next/image";
import Modal from "@components/UI/Modal";

interface ModalQRProps {
    isOpen: boolean;
    onClose: () => void;
}

const ModalQR: React.FC<ModalQRProps> = ({ isOpen, onClose }) => {
    const [timer, setTimer] = useState(900);
    const [isMobile, setIsMobile] = useState(false);
    const [imageError, setImageError] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { data, loading, error } = useSelector((state: RootState) => state.generateQr);
    const { loading: emailLoading, error: emailError } = useSelector((state: RootState) => state.sendEmail);
    const { selectedForAttendance } = useSelector((state: RootState) => state.studySheet);
    const [showModal, setShowModal] = useState(false);

    // Detectar si es móvil
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Extraer información de estudiantes (email y studentId)
    const getStudentsData = () => {
        if (!selectedForAttendance?.studentStudySheets) return [];

        return selectedForAttendance.studentStudySheets
            .filter((studentSheet: any) => {
                // Solo incluir estudiantes activos/en formación
                const stateName = studentSheet?.studentStudySheetState?.name;
                return stateName === "Activo" || stateName === "En formacion";
            })
            .map((studentSheet: any) => ({
                email: studentSheet?.student?.person?.email,
                studentId: studentSheet?.student?.id
            }))
            .filter((student: any) => student.email && student.email.trim() !== "" && student.studentId); // Filtrar datos válidos
    };

    const handleClose = useCallback(() => {
        setShowModal(false);
        setTimeout(() => {
            onClose();
            setTimer(900);
        }, 300);
    }, [onClose]);

    useEffect(() => {
        if (!isOpen) return;

        setShowModal(true);
        setImageError(false); // Reset error state

        // Generar QR con manejo de errores mejorado
        const generateQR = async () => {
            try {
                console.log('🔄 Iniciando generación de QR...');
                const result = await dispatch(generateQrCode({}));

                if (generateQrCode.fulfilled.match(result)) {
                    console.log('✅ QR generado exitosamente:', result.payload);
                } else if (generateQrCode.rejected.match(result)) {
                    console.error('❌ Error en generateQrCode:', result.payload);
                    const errorMsg = result.payload?.message || 'Error desconocido al generar QR';
                    toast.error(`Error al generar QR: ${errorMsg}`);
                }
            } catch (error) {
                console.error('💥 Error inesperado generando QR:', error);
                toast.error('Error inesperado al generar el código QR. Verifica tu conexión.');
            }
        };

        generateQR();

        // Timer
        const interval = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    // Llamar directamente en lugar de usar handleClose para evitar dependencias
                    setShowModal(false);
                    setTimeout(() => {
                        onClose();
                        setTimer(900);
                    }, 300);
                    router.push("./AprendicesList");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isOpen, dispatch, router, onClose]);

    // Función para enviar correo de asistencia con GraphQL
    const sendAttendanceEmail = async () => {
        if (!data?.sessionId) {
            toast.error("No hay sesión QR generada.");
            return;
        }

        const studentsData = getStudentsData();

        if (studentsData.length === 0) {
            toast.error("No hay estudiantes con datos válidos en esta ficha.");
            return;
        }

        try {
            const expirationTime = new Date(Date.now() + timer * 1000).toLocaleString('es-ES', {
                timeZone: 'America/Bogota',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            
            // Usar el tunnel de Cloudflare en lugar de window.location.origin
            const baseUrl = ' https://voted-mile-planners-handmade.trycloudflare.com';
            
            // Obtener competenceQuarterId del contexto actual
            // Primero intentar desde la URL actual
            const urlParams = new URLSearchParams(window.location.search);
            let competenceQuarterId = urlParams.get('competenceId') || urlParams.get('competenceQuarterId') || '1';
            
            console.log('🎯 CompetenceQuarterId obtenido:', competenceQuarterId, {
                fromUrl: urlParams.get('competenceId') || urlParams.get('competenceQuarterId'),
                final: competenceQuarterId
            });

            // Generar URLs completas para los logos
            const logoInstitution = `${baseUrl}/img/LogoAquiles.png`;
            const logoSena = `${baseUrl}/img/logo_Sena.png`;

            // Enviar correo a todos los estudiantes
            let successCount = 0;
            let errorCount = 0;

            const emailPromises = studentsData.map(async (student: { email: string; studentId: string }) => {
                try {
                    // Generar URL de asistencia personalizada con todos los parámetros necesarios
                    const personalizedAttendanceUrl = `${baseUrl}/dashboard/FormularioQRAsistencia?sessionId=${data.sessionId}&token=${btoa(data.sessionId + ':' + Date.now())}&studentId=${student.studentId}&email=${encodeURIComponent(student.email)}&competenceQuarterId=${competenceQuarterId}`;

                    console.log('🔗 URL personalizada generada:', personalizedAttendanceUrl);

                    const htmlContent = getAttendanceEmailTemplate({
                        attendanceUrl: personalizedAttendanceUrl, // URL personalizada con todos los parámetros
                        sessionId: data.sessionId || '',
                        expirationTime,
                        defaultLogoInstitution: logoInstitution,
                        defaultLogoSena: logoSena
                    });

                    const emailRequest = {
                        email: student.email,
                        subject: getAttendanceEmailSubject(),
                        htmlContent: htmlContent
                    };

                    const result = await dispatch(sendEmailNotification({ emailRequest }));

                    if (sendEmailNotification.fulfilled.match(result)) {
                        successCount++;
                        console.log(`✅ Correo enviado exitosamente a: ${student.email} (StudentID: ${student.studentId})`);
                    } else {
                        errorCount++;
                        console.error(`❌ Error enviando correo a: ${student.email}`, result.payload);
                    }
                } catch (error) {
                    errorCount++;
                    console.error(`❌ Error inesperado enviando correo a: ${student.email}`, error);
                }
            });

            // Esperar a que todos los correos se procesen
            await Promise.all(emailPromises);

            // Mostrar resultado final
            if (successCount > 0 && errorCount === 0) {
                toast.success(`Correos de asistencia enviados exitosamente a ${successCount} estudiantes.`);
            } else if (successCount > 0 && errorCount > 0) {
                toast.warning(`Correos enviados a ${successCount} estudiantes. ${errorCount} fallaron.`);
            } else {
                toast.error(`Error al enviar todos los correos (${errorCount} fallidos).`);
            }

        } catch (error) {
            console.error("Error general al enviar correos:", error);
            toast.error("Error inesperado al enviar los correos.");
        }
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Código QR Para la Toma de Asistencia" size="lg">
            <div className={`flex flex-col items-center ${isMobile ? 'px-3' : 'px-4 sm:px-6'}`}>
                {/* QR Code Container - Solo optimizado para móviles */}
                <div className={`${isMobile ? 'w-48 h-48 mb-3 p-2' : 'w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 mb-4 sm:mb-6 p-3'} flex items-center justify-center bg-white rounded-lg shadow-sm mx-auto`}>
                    {loading ? (
                        <div className="flex flex-col items-center space-y-2">
                            <div className={`animate-spin rounded-full ${isMobile ? 'h-6 w-6' : 'h-8 w-8 sm:h-12 sm:w-12'} border-b-2 border-blue-600`}></div>
                            <span className={`${isMobile ? 'text-xs' : 'text-xs sm:text-sm'} text-gray-600`}>Generando QR...</span>
                        </div>
                    ) : error ? (
                        <div className={`flex flex-col items-center ${isMobile ? 'space-y-2' : 'space-y-3'} text-center text-red-600`}>
                            <BsQrCode className={`${isMobile ? 'w-12 h-12' : 'w-16 h-16'}`} />
                            <div className="text-xs">
                                <p className="font-medium">Error al generar QR</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {error.code}: {error.message}
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    console.log('🔄 Reintentando generación de QR...');
                                    dispatch(generateQrCode({}));
                                }}
                                className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full hover:bg-red-200"
                            >
                                Reintentar
                            </button>
                        </div>
                    ) : data?.qrCodeBase64 ? (
                        <div className="w-full h-full flex items-center justify-center">
                            {!imageError ? (
                                <Image
                                    src={`data:image/png;base64,${data.qrCodeBase64}`}
                                    alt="QR Code"
                                    width={isMobile ? 160 : 300}
                                    height={isMobile ? 160 : 300}
                                    className="max-w-full max-h-full object-contain rounded-md"
                                    priority={!isMobile}
                                    unoptimized
                                    quality={isMobile ? 85 : 100}
                                    style={{
                                        width: 'auto',
                                        height: 'auto',
                                        maxWidth: isMobile ? '140px' : '100%',
                                        maxHeight: isMobile ? '140px' : '100%'
                                    }}
                                    onError={(e) => {
                                        console.error('Error loading QR image:', e);
                                        setImageError(true);
                                        if (isMobile) {
                                            toast.error('Error al cargar QR en móvil. Reintentando...');
                                            // Reintentar en móviles
                                            setTimeout(() => {
                                                setImageError(false);
                                            }, 2000);
                                        } else {
                                            toast.error('Error al cargar el código QR');
                                        }
                                    }}
                                    onLoad={() => {
                                        console.log('QR Code loaded successfully');
                                        setImageError(false);
                                    }}
                                />
                            ) : (
                                // Fallback para cuando falla la imagen
                                <div className={`flex flex-col items-center ${isMobile ? 'space-y-2' : 'space-y-3'} text-center`}>
                                    <BsQrCode className={`${isMobile ? 'w-12 h-12' : 'w-16 h-16'} text-blue-600`} />
                                    <div className="text-xs text-gray-600">
                                        <p>QR generado</p>
                                        <p className="text-xs text-blue-600 mt-1">
                                            ID: {data.sessionId?.substring(0, 8)}...
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setImageError(false)}
                                        className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full"
                                    >
                                        Reintentar
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center space-y-2 text-gray-500">
                            <BsQrCode className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12 sm:w-16 sm:h-16'}`} />
                            <span className={`${isMobile ? 'text-xs' : 'text-xs sm:text-sm'} text-center`}>Sin código QR</span>
                        </div>
                    )}
                </div>

                {/* Timer Section - Mantener normal en PC, compacto en móviles */}
                <div className={`w-full ${isMobile ? 'max-w-xs mb-3' : 'max-w-sm mb-4 sm:mb-6'}`}>
                    <h3 className={`${isMobile ? 'text-sm mb-2' : 'text-base sm:text-lg mb-3'} font-medium text-center text-gray-700 dark:text-gray-300`}>
                        Duración del QR
                    </h3>
                    <div className={`bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl ${isMobile ? 'p-3' : 'p-4'} text-center border border-blue-100 dark:border-blue-800`}>
                        <span className={`${isMobile ? 'text-2xl' : 'text-3xl sm:text-4xl'} font-bold text-blue-700 dark:text-blue-300 font-mono`}>
                            {formatTime(timer)}
                        </span>
                        <p className={`text-xs ${isMobile ? 'mt-0.5' : 'sm:text-sm mt-1'} text-blue-600 dark:text-blue-400`}>
                            El código expirará automáticamente
                        </p>
                    </div>
                </div>

                {/* Action Buttons - Centrados */}
                <div className={`flex ${isMobile ? 'flex-col gap-3' : 'flex-row gap-4'} justify-center items-center w-full`}>
                    <button
                        className={`bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold ${isMobile ? 'px-6 py-3 text-sm min-h-[48px] w-44' : 'px-6 py-3 min-h-[48px] w-40'} rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center`}
                        onClick={handleClose}
                    >
                        Cerrar
                    </button>
                    <button
                        className={`bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold ${isMobile ? 'px-6 py-3 text-sm min-h-[48px] w-44' : 'px-6 py-3 min-h-[48px] w-40'} rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 ${(loading || emailLoading || !data?.sessionId)
                                ? 'opacity-50 cursor-not-allowed hover:transform-none'
                                : ''
                            }`}
                        onClick={sendAttendanceEmail}
                        disabled={loading || emailLoading || !data?.sessionId}
                    >
                        {emailLoading ? (
                            <>
                                <div className={`animate-spin rounded-full ${isMobile ? 'h-3 w-3' : 'h-4 w-4'} border-b-2 border-white`}></div>
                                <span>Enviando...</span>
                            </>
                        ) : (
                            "Enviar Correo"
                        )}
                    </button>
                </div>

                {/* Error Messages - Normales en PC, compactos en móviles */}
                {error && (
                    <div className={`${isMobile ? 'mt-3' : 'mt-4'} p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg w-full ${isMobile ? 'max-w-xs' : 'max-w-sm'}`}>
                        <span className={`text-red-600 dark:text-red-400 ${isMobile ? 'text-xs' : 'text-sm'} text-center block`}>
                            {error.message}
                        </span>
                    </div>
                )}
                {emailError && (
                    <div className={`${isMobile ? 'mt-2' : 'mt-2'} p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg w-full ${isMobile ? 'max-w-xs' : 'max-w-sm'}`}>
                        <span className={`text-red-600 dark:text-red-400 ${isMobile ? 'text-xs' : 'text-sm'} text-center block`}>
                            Error enviando correo: {emailError.message}
                        </span>
                    </div>
                )}

                {/* Session Info - Solo para debug */}
                {data?.sessionId && (
                    <div className={`${isMobile ? 'mt-3' : 'mt-4'} p-2 bg-gray-50 dark:bg-gray-800 rounded text-xs text-gray-500 dark:text-gray-400 text-center ${isMobile ? 'max-w-xs' : 'max-w-sm'}`}>
                        ID: {data.sessionId.substring(0, 8)}...
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default ModalQR;