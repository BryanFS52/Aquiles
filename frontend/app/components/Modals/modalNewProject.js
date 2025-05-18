"use client";
import React, { useState, useEffect } from "react";

const ModalNewProject = ({ isOpen, onClose, onCreate }) => {
  const [teamData, setTeamData] = useState({ nameProject: "", members: [] });
  const [inputError, setInputError] = useState(false);
  const [modalTransition, setModalTransition] = useState(false);
  const [memberInput, setMemberInput] = useState("");

  useEffect(() => {
    if (isOpen) {
      setModalTransition(true);
    } else {
      setModalTransition(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setTeamData({ nameProject: "", members: [] });
      setInputError(false);
      setMemberInput("");
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTeamData({ ...teamData, [name]: value });
    setInputError(false);
  };

  // Funciones para manejo del input de miembros tipo tags
  const addMember = () => {
    const newMember = memberInput.trim();
    if (newMember && !teamData.members.includes(newMember)) {
      setTeamData({ ...teamData, members: [...teamData.members, newMember] });
    }
    setMemberInput("");
  };

  const removeMember = (member) => {
    setTeamData({
      ...teamData,
      members: teamData.members.filter((m) => m !== member),
    });
  };

  const handleMemberKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addMember();
    }
  };

  const handleCreateTeam = () => {
    if (!teamData.nameProject) {
      setInputError(true);
      return;
    }
    onCreate(teamData);
    handleClose();
  };

  const handleClose = () => {
    setModalTransition(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      <div className="fixed inset-0 bg-black opacity-20"></div>
      <div
        className={`relative md:w-2/6 max-w-3xl mx-auto my-12 bg-white rounded-lg shadow-lg transition-transform
          ${modalTransition ? "scale-100 opacity-100" : "scale-50 opacity-0"}
        `}
      >
        <div className="p-6 w-full">
          <div className="flex justify-center items-center">
            <h1 className="text-[#0e324d] font-inter font-bold text-2xl flex">
              Nuevo Proyecto
            </h1>
          </div>
          <div className="flex flex-col justify-center items-center w-full space-y-6 mt-6">
            {/* Nombre del proyecto */}
            <div className="w-full">
              <label className="block text-gray-700 font-semibold mb-2">
                Nombre del Proyecto
              </label>
              <input
                type="text"
                name="nameProject"
                placeholder="Escribe aquí"
                value={teamData.nameProject}
                onChange={handleInputChange}
                className={`w-full rounded-md border-2 px-3 py-2 text-gray-700 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition
                  ${inputError
                    ? "border-red-500 text-red-600 placeholder-red-400"
                    : "border-gray-300"
                  }
                `}
              />
              {inputError && (
                <p className="text-red-500 text-xs mt-1">
                  Este campo es obligatorio.
                </p>
              )}
            </div>

            {/* Input de miembros como tags */}
            <div className="w-full">
              <label className="block text-gray-700 font-semibold mb-2">
                Miembros del Team
              </label>
              <div
                className="flex flex-wrap gap-2 p-2 border-2 rounded-md border-gray-300 focus-within:border-blue-500 transition-colors bg-white min-h-[44px]"
                tabIndex={-1}
              >
                {teamData.members.map((member, idx) => (
                  <div
                    key={idx}
                    className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {member}
                    <button
                      type="button"
                      onClick={() => removeMember(member)}
                      className="ml-2 text-blue-600 hover:text-blue-900 font-bold"
                      aria-label={`Eliminar ${member}`}
                    >
                      &times;
                    </button>
                  </div>
                ))}
                <input
                  type="text"
                  className="flex-grow outline-none text-gray-700 text-sm"
                  placeholder="Escribe y presiona Enter o coma"
                  value={memberInput}
                  onChange={(e) => setMemberInput(e.target.value)}
                  onKeyDown={handleMemberKeyDown}
                />
              </div>
            </div>

            {/* Botones Cancelar y Registrar */}
            <div className="flex justify-center space-x-4 w-full">
              <button
                className={`text-sm hover:bg-red-600 hover:text-white transition-colors duration-300 focus:outline-none rounded-md bg-white px-8 py-3 border border-gray-400 text-black
                  ${modalTransition ? "scale-100 opacity-100" : "scale-75 opacity-0"}
                `}
                onClick={handleClose}
              >
                Cancelar
              </button>
              <button
                className={`text-sm bg-blue-600 hover:bg-blue-800 transition-colors duration-300 focus:outline-none rounded-md px-8 py-3 text-white
    ${modalTransition ? "scale-100 opacity-100" : "scale-75 opacity-0"}
  `}
                onClick={handleCreateTeam}
              >
                Registrar Equipo
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalNewProject;
