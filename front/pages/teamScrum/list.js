import React, { useState } from "react";
import Image from "next/image";
import styles from "../../styles/teamScrum.css";


const ListaProject = () => {
  const [activeItem, setActiveItem] = useState(null);

  const handleClick = (item) => {
    setActiveItem(item);
  };

  const imageSrc = "/resource/img/logo.png"; 
  

  const menuItems = [
    { name: "Asistencia",
      href: "/asistencia",
      imageSrc: "/resource/img/asistencia.png"
    },


    { name: "Teams",
    href: "/teams",
    imageSrc: "/resource/img/teams.png"
  },

    { name: "Aprendices",
      href: "/aprendices",
      imageSrc: "/resource/img/aprendices.png"
    },

    { name: "Proyectos",
      href: "/proyectos",
      imageSrc:"/resource/img/proyecto.png"
    },
    
  ];

  return (
    <div>

      <nav className="menu">
        <div className="menu-content">
          <Image src={imageSrc} alt="Imagen de Proyectos Formativos" width={35} height={35} />

          <label htmlFor="nameProject">Proyectos Formativos (C.S.F.)</label>

        </div>

        <div className="flex-container">
          <div className="inputWrapper"></div>
        </div>

        <div className="inputWrapper"></div>
        <br></br>

        <ul>
          {menuItems.map((item) => (
            <li key={item.name}>
              <a href={item.href} onClick={() => handleClick(item.name)}>
              <img src={item.imageSrc} alt={item.name} width={20} height={20} /> 
                {item.name}
              </a>
            </li>
          ))}
        </ul>  
      </nav>

      
      <div className="container1">
          
      {
  
  <table>
    <thead>
      <tr>
        <th>Nombre</th>
        <th>Apellido</th>
        <th>Edad</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Juan</td>
        <td>Perez</td>
        <td>30</td>
      </tr>
      <tr>
        <td>Maria</td>
        <td>Garcia</td>
        <td>25</td>
      </tr>
    </tbody>
  </table>
}
      
      </div>

      
    </div>
  );
};


export default ListaProject;