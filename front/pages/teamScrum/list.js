import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "../../resources/styles/teamScrum.css";
import iconocoinf from "../../resources/img/info.png";
import icononoti from "../../resources/img/noti.png";
import iconoper from "../../resources/img/persona.png";
import Menu from "../../components/menu.js";
import agregar from "../../resources/img/agregar.png";
import iconodes from "../../resources/img/despliegue.png";
import iconobus from "../../resources/img/Busqueda.png";
import iconoapreselecc from "../../resources/img/Apre-seleccionados.png";
import { listTeamsScrum } from "../../src/app/services/teamScrumService";
import CreateTeamScrum from "./create";

const ListProject = () => {
  const [teamsScrum, setTeamsScrum] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); 
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isDesModalOpen, setIsDesModalOpen] = useState(false); 
  const [isProModalOpen, setIsProModalOpen] = useState(false); 
  const [isObModalOpen, setIsObModalOpen] = useState(false); 
  const [isJustModalOpen, setIsJustModalOpen] = useState(false);
  const [isAgregarModalOpen, setIsAgregarModalOpen] = useState(false);
  const [aprendicesSeleccionados, setAprendicesSeleccionados] = useState([]);
  const aprendices = ["Michael Felipe Laiton Chaparro", "laura soto"];
  const [newTeam, setNewTeam] = useState({});

  useEffect(() => {
    listTeamsScrum()
      .then((data) => {
        setTeamsScrum(data);
      })
      .catch((error) => {
        console.error("Error fetching teams scrum:", error);
      });
  }, []);

  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const openInfoModal = () => {
    setIsDesModalOpen(false);
    setIsProModalOpen(false);
    setIsObModalOpen(false);
    setIsJustModalOpen(false);
    setIsInfoModalOpen(true);
  };

  const closeInfoModal = () => {
    setIsInfoModalOpen(false);
  };

  const openDesModal = () => {
    setIsInfoModalOpen(false);
    setIsProModalOpen(false);
    setIsObModalOpen(false);
    setIsJustModalOpen(false);
    setIsDesModalOpen(true);
  };

  const closeDesModal = () => {
    setIsDesModalOpen(false);
  };

  
  const openProModal = () => {
    setIsInfoModalOpen(false);
    setIsDesModalOpen(false);
    setIsObModalOpen(false);
    setIsJustModalOpen(false);
    setIsProModalOpen(true);
  };

  const closeProModal = () => {
    setIsProModalOpen(false);
  };

  
  const openObModal = () => {
    setIsInfoModalOpen(false);
    setIsDesModalOpen(false);
    setIsProModalOpen(false);
    setIsJustModalOpen(false);
    setIsObModalOpen(true);
  };

  const closeObModal = () => {
    setIsObModalOpen(false);
  };

  
  const openJustModal = () => {
    setIsInfoModalOpen(false);
    setIsDesModalOpen(false);
    setIsProModalOpen(false);
    setIsObModalOpen(false);
    setIsJustModalOpen(true);
  };

  const closeJustModal = () => {
    setIsJustModalOpen(false);
  };

  const openAgregarModal = () => {
    setIsAgregarModalOpen(true);
  };

  const closeAgregarModal = () => {
    setIsAgregarModalOpen(false);
  };

  const manejarCambioCheckbox = (aprendiz) => {
    setAprendicesSeleccionados((prev) => {
      if (prev.includes(aprendiz)) {
        return prev.filter((item) => item !== aprendiz);
      } else {
        return [...prev, aprendiz];
      }
    });
  };

  const handleRegister = async () => {
    if (!newTeam.nameProject) {
      alert("Por favor ingresa un nombre de proyecto.");
      return;
    }
    try {
      await createTeamScrum(newTeam);
      listTeamsScrum().then((data) => {
        setTeamsScrum(data);
      });
      setNewTeam({});
      closeAddModal();
    } catch (error) {
      console.error("Error al crear un teamScrum:", error);
    }
  };

  const handleButtonClick = (openModal) => {
    closeInfoModal();
    openModal();
  };

  return (
    <div className="header">
      <header>
        <div className="container">
          <div className="left"></div>
          <div className="right">
            <button className="notification-button">
              <Image src={icononoti} alt="Ficha" width={30} height={30} />
              <span className="notification-count">1</span>
              <span className="bell-icon"></span>
            </button>

            <div className="profile">
              <span>juan</span>
              <Image src={iconoper} alt="Ficha" width={45} height={30} />
            </div>
            <aside>
              <button className="despliegue">
                <Image src={iconodes} alt="Ficha" width={30} height={20} />
              </button>
            </aside>
          </div>
        </div>
      </header>

      <div className="principal">
        <h1 className="title-team">Teams Scrums</h1>

        <div>
          <Menu />

          <div>
            <button className="button-agregar" onClick={openAddModal}>
              <Image src={agregar} alt="agregar" width={25} height={18} />
            </button>
          </div>

          <div className="card-general">
            <div className="card-group">
              {teamsScrum.map((team) => (
                <div key={team.team_scrum_id} className="card">
                  <div className="card-body">
                    <div className="container-principio">
                      <label>Nombre Proyecto</label>
                      <a href="#" className="item-button" onClick={openInfoModal}>
                        Ver más
                      </a>
                    </div>
                    <br />
                    <div className="container-medio">
                      <label>{team.nameProject}</label>
                    </div>
                    <br />
                    <div className="container-princ">
                      <label>Team Numero</label>
                    </div>
                    <br />
                    <div className="container-medio">
                      <label>{team.team_scrum_id}</label>
                    </div>
                    <br />
                    <div className="container-princ">
                      <label>Agregar Informacion</label>
                      <div>
                        <button className="custom-button" onClick={openAgregarModal}>
                          <Image src={iconocoinf} alt="" width={20} height={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {isAddModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={closeAddModal}>&times;</span>
              <CreateTeamScrum closeModal={closeAddModal}/>
            </div>
          </div>
        )}

        {isInfoModalOpen && (
          <div className="modal-complete">
            <div className="caja-buttons">
              <div className="caja-button-info">
                <button className="button-info" onClick={() => handleButtonClick(openInfoModal)}>Informacion</button>
              </div>
              <div className="caja-button-des">
                <button className="button-des" onClick={() => handleButtonClick(openDesModal)}>Descripcion</button>
              </div>
              <div className="caja-button-prom">
                <button className="button-prom" onClick={() => handleButtonClick(openProModal)}>Problematica</button>
              </div>
              <div className="caja-button-ob">
                <button className="button-obj" onClick={() => handleButtonClick(openObModal)}>Objetivos</button>
              </div>
              <div className="caja-button-just">
                <button className="button-just" onClick={() => handleButtonClick(openJustModal)}>Justificacion</button>
              </div>
            </div>

            <div className="modal-number2">
              <div className="modal-contentnumber">
                <div className="title-model-2">
                  <h2>Información del Team</h2>
                </div>
                <div className="caption-2">
                  <p>Nombre del Team</p>
                </div>

                <input className="caja-text-2"
                  placeholder=""
                  value={newTeam.nameProject || ""}
                  onChange={(e) =>
                    setNewTeam({ ...newTeam, nameProject: e.target.value })
                  }
                />
                <div className="new-text">
                  <p>Integrantes</p>
                </div>
                  
                <table className="table-model">
                  <thead>
                    <tr>
                      <th className="text-table">Numero Doc</th>
                      <th className="text-table">Nombre Completo</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1259775065</td>
                      <td>Harold Samuel Moreno Perraga</td>
                    </tr> 
                    <tr>
                      <td>6548481451</td>
                      <td>Michael Felipe Laiton Chaparro</td>
                    </tr>             
                  </tbody>
                </table>

                <div className="buttons">
                  <button className="button-edit" onClick={handleRegister}>Editar Información</button>
                  <button className="button-close" onClick={closeInfoModal}>Cerrar</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {isDesModalOpen && (
          <div className="modal-complete">
            <div className="caja-buttons">
              <div className="caja-button-info">
                <button className="button-info" onClick={() => handleButtonClick(openInfoModal)}>Informacion</button>
              </div>
              <div className="caja-button-des">
                <button className="button-des" onClick={() => handleButtonClick(openDesModal)}>Descripcion</button>
              </div>
              <div className="caja-button-prom">
                <button className="button-prom" onClick={() => handleButtonClick(openProModal)}>Problematica</button>
              </div>
              <div className="caja-button-ob">
                <button className="button-obj" onClick={() => handleButtonClick(openObModal)}>Objetivos</button>
              </div>
              <div className="caja-button-just">
                <button className="button-just" onClick={() => handleButtonClick(openJustModal)}>Justificacion</button>
              </div>
            </div>

            <div className="modal-number2">
              <div className="modal-contentnumber">
                <div className="title-model-2">
                  <h2>Descripción</h2>
                </div>
                <div className="caption-2">
                  <p>Descripción del Proyecto</p>
                </div>
                <input className="caja-text-modal-3" placeholder="" value=""/>

                <div className="buttons-modal">
                  <button className="button-edit" onClick={handleRegister}>Editar Información</button>
                  <button className="button-close" onClick={closeDesModal}>Cerrar</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {isProModalOpen && (
          <div className="modal-complete">
            <div className="caja-buttons">
              <div className="caja-button-info">
                <button className="button-info" onClick={() => handleButtonClick(openInfoModal)}>Informacion</button>
              </div>
              <div className="caja-button-des">
                <button className="button-des" onClick={() => handleButtonClick(openDesModal)}>Descripcion</button>
              </div>
              <div className="caja-button-prom">
                <button className="button-prom" onClick={() => handleButtonClick(openProModal)}>Problematica</button>
              </div>
              <div className="caja-button-ob">
                <button className="button-obj" onClick={() => handleButtonClick(openObModal)}>Objetivos</button>
              </div>
              <div className="caja-button-just">
                <button className="button-just" onClick={() => handleButtonClick(openJustModal)}>Justificacion</button>
              </div>
            </div>

            <div className="modal-number2">
              <div className="modal-contentnumber">
                <div className="title-model-2">
                  <h2>Problematica</h2>
                </div>
                <div className="caption-2">
                  <p>Problematica del Proyecto</p>
                </div>
                <input className="caja-text-modal" placeholder="" value=""/>

                <div className="buttons-modal">
                  <button className="button-edit" onClick={handleRegister}>Editar Información</button>
                  <button className="button-close" onClick={closeProModal}>Cerrar</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {isObModalOpen && (
          <div className="modal-complete">
            <div className="caja-buttons">
              <div className="caja-button-info">
                <button className="button-info" onClick={() => handleButtonClick(openInfoModal)}>Informacion</button>
              </div>
              <div className="caja-button-des">
                <button className="button-des" onClick={() => handleButtonClick(openDesModal)}>Descripcion</button>
              </div>
              <div className="caja-button-prom">
                <button className="button-prom" onClick={() => handleButtonClick(openProModal)}>Problematica</button>
              </div>
              <div className="caja-button-ob">
                <button className="button-obj" onClick={() => handleButtonClick(openObModal)}>Objetivos</button>
              </div>
              <div className="caja-button-just">
                <button className="button-just" onClick={() => handleButtonClick(openJustModal)}>Justificacion</button>
              </div>
            </div>

            <div className="modal-number2">
              <div className="modal-contentnumber">
                <div className="title-model-2">
                  <h2>Objetivos</h2>
                </div>
                <div className="caption-2">
                  <p>Objetivos del Proyecto</p>
                </div>
                <input className="caja-text-modal" placeholder="" value=""/>

                <div className="buttons-modal">
                  <button className="button-edit" onClick={handleRegister}>Editar Información</button>
                  <button className="button-close" onClick={closeObModal}>Cerrar</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {isJustModalOpen && (
          <div className="modal-complete">
            <div className="caja-buttons">
              <div className="caja-button-info">
                <button className="button-info" onClick={() => handleButtonClick(openInfoModal)}>Informacion</button>
              </div>
              <div className="caja-button-des">
                <button className="button-des" onClick={() => handleButtonClick(openDesModal)}>Descripcion</button>
              </div>
              <div className="caja-button-prom">
                <button className="button-prom" onClick={() => handleButtonClick(openProModal)}>Problematica</button>
              </div>
              <div className="caja-button-ob">
                <button className="button-obj" onClick={() => handleButtonClick(openObModal)}>Objetivos</button>
              </div>
              <div className="caja-button-just">
                <button className="button-just" onClick={() => handleButtonClick(openJustModal)}>Justificacion</button>
              </div>
            </div>

            <div className="modal-number2">
              <div className="modal-contentnumber">
                <div className="title-model-2">
                  <h2>Justificación</h2>
                </div>
                <div className="caption-2">
                  <p>Justificación del Proyecto</p>
                </div>
                <input className="caja-text-modal" placeholder="" value=""/>

                <div className="buttons-modal">
                  <button className="button-edit" onClick={handleRegister}>Editar Información</button>
                  <button className="button-close" onClick={closeJustModal}>Cerrar</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {isAgregarModalOpen && (
          <div className="modal-team">
            <div className="modal-teams">
              <div className="modal-3">
                <div className="model-title3">
                  <h2>Creación del Team</h2>
                </div>
                <div className="caption-3">
                  <p>Aprendices</p>
                </div>
                
                <div className="modal3-content3">
                <div className="item1">
                    <input type="text" className="search-bar" placeholder="Filtrar Aprendices"/>
                    <div className="checkbox-list">
                    {aprendices.map((aprendiz, index) => (
                            <label key={index}>
                              <span className="text-modal3">{aprendiz}</span>
                              <input
                                type="checkbox"
                                checked={aprendicesSeleccionados.includes(aprendiz)}
                                onChange={() => manejarCambioCheckbox(aprendiz)}
                              />
                            </label>
                          ))}
                    </div>
                  </div>

                  <div className="modal3card">
                  <div className="card-modal3">
                  {aprendicesSeleccionados.map((aprendiz, index) => (
                            <React.Fragment key={index}>
                  <Image src={iconoapreselecc} alt="" width={20} height={20} />
                  <label className="text-card-modal3">{aprendiz}</label>
                            </React.Fragment>
                          ))}
                  </div>
                  </div>
                
                <div className="descripcion-seccion">
                        <textarea className="descripcion" placeholder="Descripción"></textarea>
                        <textarea className="problematica" placeholder="Problemática"></textarea>
                        <textarea className="justificacion" placeholder="Justificación"></textarea>
                        <textarea className="objectivo" placeholder="Objetivo"></textarea>
                      </div>
                    </div>

                <div className="buttons">
                  <button className="button-close-modal3" onClick={closeAgregarModal}>Cancelar</button>
                  <button className="button-edit-modal3" onClick={handleRegister}>Crear</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListProject;
