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
  const aprendices = ["Michael Felipe Laiton Chaparro", "laura soto", "Juan Felipe Orozco Bermudez", "Lina Maria Soto Ruiz"];
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
            <div className="modal-number2">
              <div className="caja-buttons">
                <button className="button-info" onClick={() => handleButtonClick(openInfoModal)}>Informacion</button>
                <button className="button-des" onClick={() => handleButtonClick(openDesModal)}>Descripcion</button>
                <button className="button-prom" onClick={() => handleButtonClick(openProModal)}>Problematica</button>
                <button className="button-obj" onClick={() => handleButtonClick(openObModal)}>Objetivos</button>
                <button className="button-just" onClick={() => handleButtonClick(openJustModal)}>Justificacion</button>
              </div>

              <div className="modal-contentnumber">
                <div className="title-model-2">
                  <h2>Información del Team</h2>
                </div>
                <div className="caption-2">
                  <p>Nombre del Team</p>
                </div>
                <div className="caja-text-2">
                  {/*<input className="text-2"
                    placeholder=""
                    value={newTeam.nameProject || ""}
                    onChange={(e) =>
                      setNewTeam({ ...newTeam, nameProject: e.target.value })
                    }
                  />*/}
                  <p className="text-2">AquilesApp</p>
                </div>
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
            <div className="modal-number2">
              <div className="caja-buttons">
                <button className="button-info" onClick={() => handleButtonClick(openInfoModal)}>Informacion</button>
                <button className="button-des" onClick={() => handleButtonClick(openDesModal)}>Descripcion</button>
                <button className="button-prom" onClick={() => handleButtonClick(openProModal)}>Problematica</button>
                <button className="button-obj" onClick={() => handleButtonClick(openObModal)}>Objetivos</button>
                <button className="button-just" onClick={() => handleButtonClick(openJustModal)}>Justificacion</button>
              </div>

              <div className="modal-contentnumber">
                <div className="title-model-2">
                  <h2>Descripción</h2>
                </div>
                <div className="caption-2">
                  <p>Descripción del Proyecto</p>
                </div>
                <div className="caja-text-modal-3"> 
                  {/*<input className="text-modal-3" placeholder="" value=""/>*/}
                  <p className="text-modal-3">
                    Desarrollo de la Aplicación Móvil de Gestión de Asistencia" tiene como objetivo crear una solución integral para el seguimiento y la gestión de la asistencia
                    en instituciones educativas y empresas.
                    Esta aplicación proporcionará a los usuarios una plataforma fácil de usar para registrar, monitorear y analizar la asistencia de estudiantes y empleados en 
                    tiempo real.
                  </p>
                </div>

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
            <div className="modal-number2">
              <div className="caja-buttons">
                <button className="button-info" onClick={() => handleButtonClick(openInfoModal)}>Informacion</button>
                <button className="button-des" onClick={() => handleButtonClick(openDesModal)}>Descripcion</button>
                <button className="button-prom" onClick={() => handleButtonClick(openProModal)}>Problematica</button>
                <button className="button-obj" onClick={() => handleButtonClick(openObModal)}>Objetivos</button>
                <button className="button-just" onClick={() => handleButtonClick(openJustModal)}>Justificacion</button>
              </div>

              <div className="modal-contentnumber">
                <div className="title-model-2">
                  <h2>Problematica</h2>
                </div>
                <div className="caption-2">
                  <p>Problematica del Proyecto</p>
                </div>
                <div className="caja-text-modal">
                  {/*<input className="text-modal" placeholder="" value=""/>*/}
                  <p className="text-modal">
                    La gestión tradicional de la asistencia en instituciones educativas y empresas presenta varios desafíos y limitaciones que impactan negativamente en la eficiencia, precisión y efectividad del proceso. A continuación, se detallan las principales problemáticas que el proyecto "Desarrollo de la Aplicación Móvil de Gestión de Asistencia" pretende abordar: <br></br>
                    1. Errores Humanos: El registro manual de la asistencia, ya sea en hojas de papel o mediante sistemas arcaicos, es propenso a errores humanos. Estos errores pueden incluir omisiones, registros incorrectos o duplicados, lo que afecta la precisión de los datos y dificulta la toma de decisiones informadas.<br></br>
                    2. Pérdida de Tiempo: Los métodos tradicionales de registro y seguimiento de asistencia son lentos y laboriosos, requiriendo una inversión considerable de tiempo por parte de maestros, administradores y empleados. Este tiempo podría aprovecharse mejor en actividades educativas o productivas.
                  </p>
                </div>
                
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
            <div className="modal-number2">
              <div className="caja-buttons">
                <button className="button-info" onClick={() => handleButtonClick(openInfoModal)}>Informacion</button>
                <button className="button-des" onClick={() => handleButtonClick(openDesModal)}>Descripcion</button>
                <button className="button-prom" onClick={() => handleButtonClick(openProModal)}>Problematica</button>
                <button className="button-obj" onClick={() => handleButtonClick(openObModal)}>Objetivos</button>
                <button className="button-just" onClick={() => handleButtonClick(openJustModal)}>Justificacion</button>
              </div>

              <div className="modal-contentnumber">
                <div className="title-model-2">
                  <h2>Objetivos</h2>
                </div>
                <div className="caption-2">
                  <p>Objetivos del Proyecto</p>
                </div>
                <div className="caja-text-modal">
                  {/*<input className="text-modal" placeholder="" value=""/>*/}
                  <p className="text-modal">
                    El proyecto "Desarrollo de la Aplicación Móvil de Gestión de Asistencia" propone una solución digital integral para abordar las problemáticas identificadas en la gestión tradicional de la asistencia. La aplicación móvil proporcionará una plataforma moderna y eficiente que optimizará el proceso de registro, seguimiento y análisis de la asistencia. A continuación, se detallan las características clave de la solución: <br></br>
                    1. Automatización del Registro de Asistencia: La aplicación permitirá registrar la asistencia de manera rápida y precisa mediante el uso de tecnologías avanzadas como códigos QR, tarjetas NFC y entradas manuales. Esto reducirá significativamente los errores humanos y el tiempo necesario para el registro.<br></br>
                    2. Accesibilidad en Tiempo Real: Los datos de asistencia estarán disponibles en tiempo real, permitiendo a los usuarios autorizados acceder y compartir información de manera instantánea desde cualquier lugar y en cualquier momento. Esto mejorará la transparencia y la comunicación entre estudiantes, empleados, padres y administradores.
                  </p>
                </div>

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
            <div className="modal-number2">
              <div className="caja-buttons">
                <button className="button-info" onClick={() => handleButtonClick(openInfoModal)}>Informacion</button>
                <button className="button-des" onClick={() => handleButtonClick(openDesModal)}>Descripcion</button>
                <button className="button-prom" onClick={() => handleButtonClick(openProModal)}>Problematica</button>
                <button className="button-obj" onClick={() => handleButtonClick(openObModal)}>Objetivos</button>
                <button className="button-just" onClick={() => handleButtonClick(openJustModal)}>Justificacion</button>
              </div>
              
              <div className="modal-contentnumber">
                <div className="title-model-2">
                  <h2>Justificación</h2>
                </div>
                <div className="caption-2">
                  <p>Justificación del Proyecto</p>
                </div>
                <div className="caja-text-modal">
                  {/*<input className="text-modal" placeholder="" value=""/>*/}
                  <p className="text-modal">
                    Características del Proyecto:<br></br>
                    1. Interfaz de Usuario Intuitiva: La aplicación contará con un diseño limpio y fácil de navegar, permitiendo a los usuarios registrar la asistencia con unos pocos toques. La interfaz será compatible con dispositivos iOS y Android.<br></br>
                    2. Funcionalidad de Registro Rápido: Los usuarios podrán registrar la asistencia mediante diversas opciones, como códigos QR, tarjetas NFC, o introducción manual de datos. Esto garantizará flexibilidad y rapidez en el proceso de registro.<br></br>
                    3. Gestión de Usuarios: La aplicación permitirá la creación y gestión de perfiles para estudiantes, empleados, maestros y administradores, con diferentes niveles de acceso y permisos.<br></br>
                    4. Notificaciones y Recordatorios: Se implementarán notificaciones automáticas para alertar a los usuarios sobre ausencias, retardos y eventos importantes, ayudando a mantener una comunicación efectiva entre todas las partes involucradas.
                  </p>
                </div>

                <div className="buttons-modal">
                  <button className="button-edit" onClick={handleRegister}>Editar Información</button>
                  <button className="button-close" onClick={closeJustModal}>Cerrar</button>
                </div>
              </div>
            </div>
          </div>
        )}



        {isAgregarModalOpen && (

          // sombra azul
           <div className="modal-team">

            {/* fondo blanco modal */}
            <div className="modal-teams">

              {/* SOMBRA GRIS */}
              <div className="modal-3">                

                <div className="model-title3">
                  <h2>Creación del Team</h2>
                </div>

                {/* div general */}
                                                       
                <div className="caption-3"> 
                    <p>Aprendices</p> 
                </div> 

                <div className="modal3-content3">

                  <div>
                
                <div className="card-aprendiz">

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

                  </div>

                  </div>

                 
                  <div className="card-gris-modal">

                  <div className="titulo-seleccionados">

                    <p>Aprendices Seleccionados</p>

                    </div>

                  <div className="modal3card">  {/* tarjeta gris para la descripcion */}
                    <div className="image-modal3card">
                    </div>

                  <div className="card-modal3">

                  {aprendicesSeleccionados.map((aprendiz, index) => (

                        <React.Fragment key={index}>

                  <label className="text-card-modal3">{aprendiz}</label>
                            </React.Fragment>
                          ))}

                                <div className="card-gris-modal-2">

                                <div className="title-descripcion-modal3">
                                    <p>Descripcion</p>
                                </div>

                                <div className="tarjeta-descripcion-modal3">
                                </div>


                                <div className="title-justificacion-modal3">
                                    <p>Justificacion</p>
                                </div>

                                <div className="tarjeta-justificacion-modal3">
                                </div>
                                </div> 

                  </div>       

                  </div>

                  <div className="title-problmatica">
                      <p>Problematica</p>
                  </div>

                  <div className="tarjeta">
                  </div> 
                  </div> 
                  </div>
                  
               
                {/* div general */}
                  
                <div className="title-objetivo">
                      <p>objetivo</p>
                  </div>

                  <div className="tarjeta-object">
                    <div className="text-object">
                      <p>Objetivo</p>
                    </div>
                  </div>

                <div className="buttons">
                  <button className="button-close-modal3" onClick={closeAgregarModal}>Cancelar</button>
                  <button className="button-edit-modal3" onClick={handleRegister}>Crear</button>
                </div>

              </div>
              {/* SOMBRA GRIS */}

            </div>
            {/* fondo blanco modal */}

          </div>
          // sombra azul
        )}



      </div>
    </div>
  );
};

export default ListProject;
