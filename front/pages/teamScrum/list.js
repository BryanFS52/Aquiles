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
        <th>Nombre proyecto</th>
        <th>Gestion Aprendices</th>
        <th>Descripcion</th>
        <th>Ficha</th>
        <th>Editar/ Eliminacion de Proyectos</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Hermes</td>
        <td>5 aprendices</td>
        <td>proyecto educativo</td>
        <td>545451</td>
        <td>
          <button className="edit">
        <Image src="/resource/img/editar.png" alt="Editar/ Eliminacion de Proyectos" width={20} height={20} />
        </button>
        <button className="delete">
        <Image src="/resource/img/delete.png" alt="Eliminar/ Eliminacion de Proyectos" width={20} height={20} />
        </button>
        </td>
      </tr>
      <tr>
        <td>Olimpo</td>
        <td>2 aprendices</td>
        <td>proyecto institucional</td>
        <td>2564542</td>
        <td>
          <button className="edit">
        <Image src="/resource/img/editar.png" alt="Editar/ Eliminacion de Proyectos" width={20} height={20} />
        </button>
        <button className="delete">
        <Image src="/resource/img/delete.png" alt="Eliminar/ Eliminacion de Proyectos" width={20} height={20} />
        </button>
        </td>
      </tr>

      <tr>
    <td>Inventario</td>
    <td>10 aprendices</td>
    <td>proyecto </td>
    <td>18578</td>
    <td>
      <button className="edit">
    <Image src="/resource/img/editar.png" alt="Editar/ Eliminacion de Proyectos" width={20} height={20} />
    </button>
    <button className="delete">
    <Image src="/resource/img/delete.png" alt="Eliminar/ Eliminacion de Proyectos" width={20} height={20} />
    </button>
    </td>
  </tr>

  <tr>
    <td>Novedades</td>
    <td>4 aprendices</td>
    <td>proyecto sena</td>
    <td>1213545</td>
    <td>
      <button className="edit">
    <Image src="/resource/img/editar.png" alt="Editar/ Eliminacion de Proyectos" width={20} height={20} />
    </button>
    <button className="delete">
    <Image src="/resource/img/delete.png" alt="Eliminar/ Eliminacion de Proyectos" width={20} height={20} />
    </button>
    </td>
  </tr>

  <tr>
    <td>Olimpo</td>
    <td>8 aprendices</td>
    <td>proyecto principal</td>
    <td>5667452</td>
    <td>
      <button className="edit">
    <Image src="/resource/img/editar.png" alt="Editar/ Eliminacion de Proyectos" width={20} height={20} />
    </button>
    <button className="delete">
    <Image src="/resource/img/delete.png" alt="Eliminar/ Eliminacion de Proyectos" width={20} height={20} />
    </button>
    </td>
  </tr>

  <tr>
    <td>Inventario</td>
    <td>6 aprendices</td>
    <td>Invntario de almacen</td>
    <td>9826541</td>
    <td>
      <button className="edit">
    <Image src="/resource/img/editar.png" alt="Editar/ Eliminacion de Proyectos" width={20} height={20} />
    </button>
    <button className="delete">
    <Image src="/resource/img/delete.png" alt="Eliminar/ Eliminacion de Proyectos" width={20} height={20} />
    </button>
    </td>
  </tr>
    </tbody>
  </table>
}
      
      </div>

      
    </div>
  );
};


export default ListaProject;