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
import {
  listTeamsScrum,
  createTeamScrum,
} from "../../src/app/services/teamScrumService";

const ListaProject = () => {
  const [teamsScrum, setTeamsScrum] = useState([]);
  const [newTeam, setNewTeam] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleRegister = async () => {
    try {
      await createTeamScrum(newTeam);
      listTeamsScrum().then((data) => {
        setTeamsScrum(data);
      });
    } catch (error) {
      console.error("Error creating team scrum:", error);
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
            <button className="button-agregar" onClick={handleModalOpen}>
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
                        <button className="custom-button">
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

        {isModalOpen && (
          <div className="modal-complete">
            <div className="modal">
              <div className="modal-content">
                <div className="title-model">
                  <h2>Nuevo Proyecto</h2>
                </div>
                <div className="caption">
                  <p>Nombre del proyecto</p>
                </div>
                <br></br>

                <input
                  className="caja-text"
                  value={newTeam.nameProject || ""}
                  onChange={(e) =>
                    setNewTeam({ ...newTeam, nameProject: e.target.value })
                  }
                />

                <br></br>
                <br></br>
                <br></br>
                <div className="buttons">
                  <button className="button-cancel" onClick={handleModalClose}>
                    Cancelar
                  </button>
                  <button className="button-registrer" onClick={handleRegister}>
                    Registrar
                  </button>
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
