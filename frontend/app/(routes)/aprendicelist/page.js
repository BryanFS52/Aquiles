"use client";

import React, { useState, useEffect } from "react";
import { Header } from "../../components/header";
import { Sidebar } from "../../components/Sidebar";
import { PiStudentFill } from "react-icons/pi";
import { ImMail4 } from "react-icons/im";
import ModalCorreo from "../../components/Modals/modalCorreo";
import { sendEmailAbsence } from "../../services/emailService";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { getAllApprentices } from "../../services/apprenticeService"; // Importa el servicio

export default function AprendicesList() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [students, setStudents] = useState([]); // Inicializa la lista de estudiantes

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const studentsData = await getAllApprentices(); // Obtén la lista de aprendices del servicio
                setStudents(studentsData);
            } catch (error) {
                console.error('Error al obtener la lista de aprendices:', error);
            }
        };

        fetchStudents();
    }, []);

    const toggleModal = (student) => {
        setSelectedStudent(student);
        setIsModalOpen(!isModalOpen);
    };

    const handleSendEmail = async () => {
        if (!selectedStudent) return;

        const { email, studentName, date } = selectedStudent;

        try {
            await sendEmailAbsence(email, studentName, date);
            toast.success("Correo enviado con éxito");
        } catch (error) {
            console.error("Error al enviar el correo:", error);
            toast.error("Hubo un error al enviar el correo");
        } finally {
            setIsModalOpen(false);
        }
    };   

    const totalStudents = students.length;
    const presentStudents = students.filter(student => student.isPresent).length;
    const absentStudents = students.filter(student => !student.isPresent).length;

    const handleSaveAttendance = async () => {
        try {
            const attendanceData = students.map(student => ({
                documentNumber: student.documentNumber,
                isPresent: student.isPresent,
                date: student.date,
            }));
            
            // Llama a la función para guardar la asistencia aquí (actualizarAttendance debe estar definida en otro lugar)
            await updateAttendance(attendanceData);
            toast.success('Asistencia guardada correctamente');
        } catch (error) {
            console.error('Error al guardar la asistencia:', error);
            toast.error('Hubo un error al guardar la asistencia');
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 xl:grid-cols-6">
            <Sidebar />
            <div className="xl:col-span-5">
                <Header />
                <div className="h-[90vh] overflow-y-scroll p-12 bg-neutral-100 space-y-5">
                    <h1 className="text-[#0e324d] text-2xl sm:text-3xl lg:text-4xl pb-3 border-b-2 border-gray-400 w-full sm:w-3/4 lg:w-1/2 mb-6 lg:mb-12 font-inter font-semibold">Lista de Asistencia</h1>
                    <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-4 sm:space-y-0 items-center justify-center">
                        <div className="flex w-full sm:w-1/3 lg:w-1/4 h-48 rounded-lg overflow-hidden shadow-lg bg-white border-2 border-gray-300 p-4">
                            <div className="z-50 justify-end space-y-3">
                                <PiStudentFill className="w-9 h-9 text-stone-600 ml-6" /><br />
                                <div>
                                    <span className="text-[#0e324d] font-inter font-semibold text-5xl ml-6">{totalStudents}</span><br /><br />
                                    <span className="font-inter font-medium text-lg ">Aprendices de la ficha</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex w-full sm:w-1/3 lg:w-1/4 h-48 rounded-lg overflow-hidden shadow-lg bg-white border-2 border-gray-300 p-4">
                            <div className="z-50 justify-end space-y-3">
                                <PiStudentFill className="w-9 h-9 text-stone-600 ml-6" /><br />
                                <div>
                                    <span className="text-5xl font-inter font-normal ml-6">{presentStudents}</span><br /><br />
                                    <span className="font-inter font-normal text-lg ">Aprendices en clase</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex w-full sm:w-1/3 lg:w-1/4 h-48 rounded-lg overflow-hidden shadow-lg bg-white border-2 border-gray-300 p-4">
                            <div className="z-50 justify-end space-y-3">
                                <PiStudentFill className="w-9 h-9 text-stone-600 ml-6" /><br />
                                <div>
                                    <span className="text-5xl font-inter font-normal ml-6">{absentStudents}</span><br /><br />
                                    <span className="font-inter font-normal text-lg ">Aprendices que fallaron</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <ModalCorreo isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSendEmail={handleSendEmail} />
                    <div className="flex w-full md:w-1/2 h-auto rounded-lg overflow-hidden shadow-lg bg-white border-2 border-gray-300 relative mt-8 p-4 mx-auto">
                        <div className="z-50 justify-end space-y-3"></div>
                        <div className="overflow-x-auto w-full">
                            <table className="w-full text-center">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2 border-2 border-gray-200 bg-gray-100 text-sm font-semibold text-gray-700">Número de Documento</th>
                                        <th className="px-4 py-2 border-2 border-gray-200 bg-gray-100 text-sm font-semibold text-gray-700">Nombres y Apellidos</th>
                                        <th className="px-4 py-2 border-2 border-gray-200 bg-gray-100 text-sm font-semibold text-gray-700">Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.map((student, index) => (
                                        <tr key={index}>
                                            <td className="px-4 py-2 border-2 border-gray-200 text-sm text-gray-700">
                                                {student.documentNumber}
                                            </td>
                                            <td className="px-4 py-2 border-2 border-gray-200 text-sm text-gray-700">
                                                {student.fullName}
                                            </td>
                                            <td className={`px-4 py-2 border-2 border-gray-200 text-sm ${student.isPresent ? 'text-green-600' : 'text-red-600'} font-semibold`}>
                                                {student.isPresent ? '✓' : 'X'}
                                            </td>
                                            <td className="cursor-pointer">
                                                {!student.isPresent && (
                                                    <ImMail4
                                                        className="w-6 h-6 ml-2"
                                                        onClick={() => toggleModal({ email: student.email, studentName: student.fullName, date: student.date })}
                                                    />
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="flex justify-end mt-6">
                                <button type="button" onClick={handleSaveAttendance} className="text-white font-inter font-normal h-11 w-44 rounded-lg text-sm px-5 bg-custom-blue dark:hover:bg-custom-blue flex items-center">
                                    Guardar Asistencia
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
                <ToastContainer />
            </div>
        </div>
    );
}
