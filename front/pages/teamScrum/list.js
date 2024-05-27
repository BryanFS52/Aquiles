import React, { useState } from "react";
import Image from "next/image";
import styles from "../../resources/styles/teamScrum.css";
import iconocoinf from "../../resources/img/info.png";
import icononoti from "../../resources/img/noti.png";
import iconoper from "../../resources/img/persona.png";
import Menu from "../../components/menu.js";

const ListaProject = () => {
  const [activeItem, setActiveItem] = useState(null);

  const handleClick = (item) => {
    setActiveItem(item);
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
              <Image src={iconoper} alt="Ficha" width={30} height={30} />
              <span className="profile-name">Sebastian Rivera</span>
            </div>
          </div>
        </div>
      </header>

      <div className="principal">
        <h1 className="title-team">Teams Scrums</h1>

        <div>
          <Menu />

          <div className="card-general">
            <div class="card">
              <div class="card-body">
                <div class="container-principio">
                  <label>Nombre Proyecto</label>
                  <a href="#" class="item-button">
                    Ver más
                  </a>
                </div>
                <br></br>
                <div class="container-medio">
                  <label>Desarrollo de la Aplicación Movil</label>
                </div>
                <br></br>
                <div class="container-princ">
                  <label>Team Numero</label>
                </div>
                <br></br>
                <div class="container-medio">
                  <label>Equipo 5</label>
                </div>
                <br></br>
                <div class="container-princ">
                  <label>Agregar Informacion</label>
                  <div>
                    <button class="custom-button">
                      <Image src={iconocoinf} alt="" width={20} height={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="card">
              <div class="card-body">
                <div class="container-principio">
                  <label>Nombre Proyecto</label>
                  <a href="#" class="item-button">
                    Ver más
                  </a>
                </div>
                <br></br>
                <div class="container-medio">
                  <label>Desarrollo de la Aplicación Movil</label>
                </div>
                <br></br>
                <div class="container-princ">
                  <label>Team Numero</label>
                </div>
                <br></br>
                <div class="container-medio">
                  <label>Equipo 5</label>
                </div>
                <br></br>
                <div class="container-princ">
                  <label>Agregar Informacion</label>
                  <div>
                    <button class="custom-button">
                      <Image src={iconocoinf} alt="" width={20} height={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="card">
              <div class="card-body">
                <div class="container-principio">
                  <label>Nombre Proyecto</label>
                  <a href="#" class="item-button">
                    Ver más
                  </a>
                </div>
                <br></br>
                <div class="container-medio">
                  <label>Desarrollo de la Aplicación Movil</label>
                </div>
                <br></br>
                <div class="container-princ">
                  <label>Team Numero</label>
                </div>
                <br></br>
                <div class="container-medio">
                  <label>Equipo 5</label>
                </div>
                <br></br>
                <div class="container-princ">
                  <label>Agregar Informacion</label>
                  <div>
                    <button class="custom-button">
                      <Image src={iconocoinf} alt="" width={20} height={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card-general">
            <div class="card">
              <div class="card-body">
                <div class="container-principio">
                  <label>Nombre Proyecto</label>
                  <a href="#" class="item-button">
                    Ver más
                  </a>
                </div>
                <br></br>
                <div class="container-medio">
                  <label>Desarrollo de la Aplicación Movil</label>
                </div>
                <br></br>
                <div class="container-princ">
                  <label>Team Numero</label>
                </div>
                <br></br>
                <div class="container-medio">
                  <label>Equipo 5</label>
                </div>
                <br></br>
                <div class="container-princ">
                  <label>Agregar Informacion</label>
                  <div>
                    <button class="custom-button">
                      <Image src={iconocoinf} alt="" width={20} height={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="card">
              <div class="card-body">
                <div class="container-principio">
                  <label>Nombre Proyecto</label>
                  <a href="#" class="item-button">
                    Ver más
                  </a>
                </div>
                <br></br>
                <div class="container-medio">
                  <label>Desarrollo de la Aplicación Movil</label>
                </div>
                <br></br>
                <div class="container-princ">
                  <label>Team Numero</label>
                </div>
                <br></br>
                <div class="container-medio">
                  <label>Equipo 5</label>
                </div>
                <br></br>
                <div class="container-princ">
                  <label>Agregar Informacion</label>
                  <div>
                    <button class="custom-button">
                      <Image src={iconocoinf} alt="" width={20} height={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="card">
              <div class="card-body">
                <div class="container-principio">
                  <label>Nombre Proyecto</label>
                  <a href="#" class="item-button">
                    Ver más
                  </a>
                </div>
                <br></br>
                <div class="container-medio">
                  <label>Desarrollo de la Aplicación Movil</label>
                </div>
                <br></br>
                <div class="container-princ">
                  <label>Team Numero</label>
                </div>
                <br></br>
                <div class="container-medio">
                  <label>Equipo 5</label>
                </div>
                <br></br>
                <div class="container-princ">
                  <label>Agregar Informacion</label>
                  <div>
                    <button class="custom-button">
                      <Image src={iconocoinf} alt="" width={20} height={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListaProject;
