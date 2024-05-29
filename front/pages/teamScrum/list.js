import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import styles from "../../resources/styles/teamScrum.css";
import iconocoinf from "../../resources/img/info.png";
import icononoti from "../../resources/img/noti.png";
import iconoper from "../../resources/img/persona.png";
import Menu from "../../components/menu.js";
import agregar from "../../resources/img/agregar.png";
import iconodes from "../../resources/img/despliegue.png";
import {listTeamsScrum,createTeamScrum} from "../../src/app/services/teamScrumService";

const ListaProject = () => {
  const [teamsScrum, setTeamsScrum] = useState([]);
  const [newTeam, setNewTeam] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [infoModalOpen, setinfoModalOpen] = useState(false);

  useEffect(() => {
    listTeamsScrum()
      .then((data) => {
        setTeamsScrum(data);
        console.log(teamsScrum);
      })
      .catch((error) => {
        console.error("Error fetching teams scrum:", error);
      });
  }, []);

  // modal2
  const handleModalOpeninfo = () => {
    setIsModalOpen(true);
  };
  const handleModalCloseinfo = () => {
    setIsModalOpen(false);
  };

  // ....//

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

      handleModalClose();
    } catch (error) {
      console.error("Error al crear un teamScrum:", error);
    }
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
            <button className="button-agregar" >
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
                      <a href="#" className="item-button">
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
                        <button className="custom-button" onClick={handleModalOpeninfo}>
                          <Image
                            src={iconocoinf}
                            alt=""
                            width={20}
                            height={20}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 2 modal */}
        {isModalOpen && (
          <div className="modal-complete">
            <div className="modal-number2">
              <div className="modal-contentnumber">
                <div className="title-model-2">
                  <h2>Información del Team</h2>
                </div>
                <div className="caption-2">
                  <p>Nombre del Team</p>
                </div>
                <br></br>

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
                  <br></br><br></br>
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

                <br></br><br></br><br></br><br></br><br></br>
                <div className="buttons">
                  <button className="button-edit" onClick={handleRegister}>Editar Informacion</button>
                  <button className="button-close" onClick={handleModalCloseinfo}>Cerrar</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListaProject;
