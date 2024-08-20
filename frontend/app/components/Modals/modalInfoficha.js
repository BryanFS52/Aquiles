"use client";
import React, { useState } from "react";

const ModalInfoficha = ({ isOpen, onClose }) => {
	// se crea los eventos de cerrar y abri el modal

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
			{/* Fondo opaco gris */}
			<div className="fixed inset-0 bg-cyan-900 opacity-35"></div>

			<div className="relative w-full max-w-3xl mx-auto my-12 bg-white rounded-lg shadow-lg">
				<div className="p-5">
					<div className="flex justify-center items-center">
						<h1 className="text-2xl font-serif border-b-2 border-black">
							Información de la Ficha
						</h1>
					</div>

					<div className="mt-5">
						<div className="mb-4 md:flex md:space-x-4 grid-cols-3">
							<div className="flex-1 mb-4 md:mb-0">
								<label className="font-serif text-lg mb-1 block">Ficha</label>
								<input
									type="text"
									placeholder="Seleccionar Ficha"
									className="rounded-md bg-white border-gray-300 shadow-md border-2 w-full md:w-56 px-3 py-2"
								/>
							</div>
							<div className="flex-1 mb-4 md:mb-0">
								<label className="font-serif text-lg mb-1 block">Jornada</label>
								<input
									type="text"
									placeholder="Seleccionar Jornada"
									className="rounded-md bg-white border-gray-300 shadow-md border-2 w-full md:w-56 px-3 py-2"
								/>
							</div>

							<div className="flex-1">
								<label className="font-serif text-lg mb-1 block">Fase</label>
								<input
									type="text"
									placeholder="Seleccionar Fase"
									className="rounded-md bg-white border-gray-300 shadow-md border-2 w-full md:w-56 px-3 py-2"
								/>
							</div>
						</div>

						<div className="mb-4 md:flex md:space-x-4 grid-cols-3">
							<div className="flex-1">
								<label className="font-serif text-lg mb-1 block">
									Instructor Tecnico
								</label>
								<input
									type="text"
									placeholder="Instructor Tecnico"
									className="rounded-md bg-white border-gray-300 shadow-md border-2 w-full md:w-56 px-3 py-2"
								/>
							</div>
							<div className="flex-1 mb-4 md:mb-0">
								<label className="font-serif text-lg mb-1 block">Fecha</label>
								<input
									type="text"
									placeholder="Seleccionar Fecha"
									className="rounded-md bg-white border-gray-300 shadow-md border-2 w-full md:w-56 px-3 py-2"
								/>
							</div>

							<div className="flex-1">
								<label className="font-serif text-lg mb-1 block">
									Componente
								</label>
								<input
									type="text"
									placeholder="Seleccionar"
									className="rounded-md bg-white border-gray-300 shadow-md border-2 w-full md:w-56 px-3 py-2"
								/>
							</div>
						</div>

						<div className="mb-4 md:flex md:space-x-4 ml-56">
							<div className="flex-1 mb-4 md:mb-0 ml-7">
								<label className="font-serif text-lg mb-1 block">
									Instructor
								</label>
								<input
									type="text"
									placeholder="Seleccione el Instructor"
									className="rounded-md bg-white border-gray-300 shadow-md border-2 w-full md:w-56 px-3 py-2"
								/>
							</div>
						</div>
					</div>

					<div className="flex justify-end mt-5">
						<button
							className="hover:bg-gray-500 rounded-md transition-colors bg-custom-blue px-4 py-2 border text-white w-44 h-10" //En la linea de abajo se hace el llamado al evento de cerrar el modal
							onClick={onClose}
						>
							Cerrar Ventana
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ModalInfoficha;