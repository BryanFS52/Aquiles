import React, { useState } from 'react';
import styles from "../../styles/teamScrum.css"

const ListaProject = () => {
  const [activeItem, setActiveItem] = useState(null);

  const handleClick = (item) => {
    setActiveItem(item);
  };

  return (

    <div>
        <h1 className="title">Proyectos</h1>
        
        <br></br><br></br>

    <nav className="menu">
    <div className="inputWrapper">
                    <label htmlFor="nameProject" className="label">Proyectos Formativos (C.S.F)</label>
        </div>
      <ul>
        <ul>
          <a href="/asistencia" onClick={() => handleClick('asistencia')}>Asistencia</a>
        </ul>
        <ul>
          <a href="/teams" onClick={() => handleClick('teams')}>Teams</a>
        </ul>
        <ul>
          <a href="/aprendices" onClick={() => handleClick('aprendices')}>Aprendices</a>
        </ul>
        <ul>
          <a href="/proyectos" onClick={() => handleClick('proyectos')}>Proyectos</a>
        </ul> 
      </ul>
    </nav>
    </div>
  );
};

export default ListaProject;
