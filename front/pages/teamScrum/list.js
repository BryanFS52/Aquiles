import React, { useState } from "react";
import Image from "next/image";
import styles from "../../resources/styles/teamScrum.css";
import iconoap from "../../resources/img/aprendices.png";
import iconoasi from "../../resources/img/asistencia.png";
import iconopro from "../../resources/img/proyecto.png";
import iconolog from "../../resources/img/logo.png";
import iconote from "../../resources/img/teams.png";
import iconofi from "../../resources/img/ficha.png";
import iconoprog from "../../resources/img/programa.png";
import iconosalida from "../../resources/img/salir.png";
import iconoconf from "../../resources/img/config.png";



const ListaProject = () => {
  const [activeItem, setActiveItem] = useState(null);

  const handleClick = (item) => {
    setActiveItem(item);
  };

  return (
    <div>
      <nav className="menu">
        <div className="menu-content">
          <Image
            src={iconolog}
            alt="Imagen de Proyectos Formativos"
            width={35}
            height={35}
          />

          <label>PROYECTOS FORMATIVOS (C.S.F.)</label>
        </div>

        <ul>            
            <li>
              <div className="menu-content">
                <Image
                  src={iconofi}
                  alt="Ficha"
                  width={35}
                  height={35}
                />

                <label className="textMenu">Fichas</label>
              </div>
            </li>
            <li>
              <div className="menu-content">
                <Image
                  src={iconoprog}
                  alt="Programa"
                  width={35}
                  height={35}
                />

                <label className="textMenu">Programas</label>
              </div>
            </li>
            <li>
              <div className="menu-content">
                <Image
                  src={iconoasi}
                  alt="Asistencia"
                  width={35}
                  height={35}
                />

                <label>Asistencia</label>
              </div>
            </li>
            <li>
              <div className="menu-content">
                <Image
                  src={iconote}
                  alt="Teams"
                  width={35}
                  height={35}
                />

                <label>Teams</label>
              </div>
            </li>
            <li>
              <div className="menu-content">
                <Image
                  src={iconoap}
                  alt="Aprendices"
                  width={35}
                  height={35}
                />

                <label>Aprendices</label>
              </div>
            </li>
            <li>
              <div className="menu-content">
                <Image
                  src={iconopro}
                  alt="Proyectos"
                  width={35}
                  height={35}
                />

                <label>Proyectos</label>
              </div>
            </li>
            <div className="menu-final">
              <li>
                <div className="menu-content">
                  <Image
                    src={iconosalida}
                    alt="Salir"
                    width={35}
                    height={35}
                  />

                  <label>Salir</label>
                </div>
              </li>
              <li className="menu-config">
                <div className="menu-content">
                  <Image
                    src={iconoconf}
                    alt="Configuraciones"
                    width={35}
                    height={35}
                  />

                  <label>Configuraciones</label>
                </div>
              </li>
            </div>
        </ul>
      </nav>
    </div>
  );
};

export default ListaProject;
