import React, { useState } from "react";

const ModalAddinformation = ({ isOpen, onClose }) => {
	if (!isOpen) return null;

	// Estados para cada campo de entrada
	const [selectedApprentices, setSelectedApprentices] = useState(
		"Michael Felipe Laiton Chaparro"
	);
	const [description, setDescription] = useState("");
	const [problem, setProblem] = useState("");
	const [justification, setJustification] = useState("");
	const [objective, setObjective] = useState("");

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
			<div className="fixed inset-0 bg-cyan-900 opacity-35"></div>
			<div className="relative w-[90%] md:w-[35%] mx-auto my-12 bg-white rounded-lg shadow-lg">
				<div className="p-8 flex flex-col items-center">
					<h2 className="text-xl font-bold mb-4">Creación del Team</h2>

					{/* Campo para Aprendices seleccionados */}
					<div className="w-full mb-4">
						<label className="block text-left mb-1 font-bold">
							
							Aprendices seleccionados
						</label>
						<select
							value={selectedApprentices}
							onChange={(e) => setSelectedApprentices(e.target.value)}
							className="w-full p-2 border rounded"
						>
							<option>Michael Felipe Laiton Chaparro</option>
						</select>
					</div>

					{/* Campo para Descripción */}
					<div className="w-full mb-4">
						<label className="block text-left mb-1 font-bold">
							Descripción
						</label>
						<textarea
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							className="w-full p-2 border rounded"
							placeholder="Esto es una descripción de prueba"
						></textarea>
					</div>

					{/* Campo para Problemática */}
					<div className="w-full mb-4">
						<label className="block text-left mb-1 font-bold">
							Problemática
						</label>
						<textarea
							value={problem}
							onChange={(e) => setProblem(e.target.value)}
							className="w-full p-2 border rounded"
							placeholder="Esto es una problemática de prueba"
						></textarea>
					</div>

					{/* Campo para Justificación */}
					<div className="w-full mb-4">
						<label className="block text-left mb-1 font-bold">
							Justificación
						</label>
						<textarea
							value={justification}
							onChange={(e) => setJustification(e.target.value)}
							className="w-full p-2 border rounded"
							placeholder="Esto es una justificación"
						></textarea>
					</div>

					{/* Campo para Objetivo */}
					<div className="w-full mb-4">
						<label className="block text-left mb-1 font-bold">Objetivo</label>
						<textarea
							value={objective}
							onChange={(e) => setObjective(e.target.value)}
							className="w-full p-2 border rounded"
							placeholder="Este es el objetivo"
						></textarea>
					</div>

					<div className="flex justify-center mt-4">
						<button
							onClick={onClose}
							className="rounded-md px-8 py-4 border bg-custom-blue text-white hover:text-gray-900 hover:bg-gray-300 transition-colors mr-4"
						>
							Cancelar
						</button>
						<button
							onClick={onClose}
							className="hover:bg-gray-500 rounded-md transition-colors bg-custom-blue px-8 py-4 border text-white"
						>
							Crear
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ModalAddinformation;
