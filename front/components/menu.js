import Image from "next/image";
import styles from "../resources/styles/teamScrum.css";
import iconoap from "../resources/img/aprendices.png";
import iconoasi from "../resources/img/asistencia.png";
import iconopro from "../resources/img/proyecto.png";
import iconolog from "../resources/img/logo.png";
import iconote from "../resources/img/teams.png";
import iconofi from "../resources/img/ficha.png";
import iconoprog from "../resources/img/programa.png";
import iconosalida from "../resources/img/salir.png";
import iconoconf from "../resources/img/config.png";

const Menu = () => {

  return (
    
    <div className="header">
      <div className="principal">
        <div>
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
                    <div>
                      <button class="custom-button">
                        <Image
                          src={iconofi}
                          alt="Ficha"
                          width={35}
                          height={35}
                        />
                      </button>
                    </div>
                    <label className="textMenu">Fichas</label>
                  </div>
                </li>

                <li>
                  <div className="menu-content">
                    <div>
                      <button class="custom-button">
                        <Image
                          src={iconoprog}
                          alt="Ficha"
                          width={35}
                          height={35}
                        />
                      </button>
                    </div>

                    <label className="textMenu">Programas</label>
                  </div>
                </li>
                <li>
                  <div className="menu-content">
                    <div>
                      <button class="custom-button">
                        <Image
                          src={iconoasi}
                          alt="Ficha"
                          width={35}
                          height={35}
                        />
                      </button>
                    </div>

                    <label>Asistencia</label>
                  </div>
                </li>
                <li>
                  <div className="menu-content">
                    <div>
                      <button class="custom-button">
                        <Image
                          src={iconote}
                          alt="Ficha"
                          width={35}
                          height={35}
                        />
                      </button>
                    </div>

                    <label>Teams</label>
                  </div>
                </li>

                <li>
                  <div className="menu-content">
                    <div>
                      <button class="custom-button">
                        <Image
                          src={iconoap}
                          alt="Ficha"
                          width={35}
                          height={35}
                        />
                      </button>
                    </div>

                    <label>Aprendices</label>
                  </div>
                </li>

                <li>
                  <div className="menu-content">
                    <div>
                      <button class="custom-button">
                        <Image
                          src={iconopro}
                          alt="Ficha"
                          width={35}
                          height={35}
                        />
                      </button>
                    </div>

                    <label>Proyectos</label>
                  </div>
                </li>
                <div className="menu-final">
                  <li>
                    <div className="menu-content">
                      <div>
                        <button class="custom-button">
                          <Image
                            src={iconosalida}
                            alt="Ficha"
                            width={35}
                            height={35}
                          />
                        </button>
                      </div>

                      <label>Salir</label>
                    </div>
                  </li>

                  <li className="menu-config">
                    <div>
                      <button class="custom-button">
                        <Image
                          src={iconoconf}
                          alt="Ficha"
                          width={35}
                          height={35}
                        />
                      </button>
                    </div>
                    <div className="menu-content">
                      <label>Configuraciones</label>
                    </div>
                  </li>
                </div>
              </ul>
            </nav>
          </div>

          
        </div>
      </div>
    </div>
  );
};

export default Menu;
