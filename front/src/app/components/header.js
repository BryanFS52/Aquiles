"use client"

import Image from "next/image";




export const Header = () => {

  return (
    <div className="header">
      <header>
        <div className="container">
          <div className="left"></div>
          <div className="right">
            <button className="notification-button">
              <Image src="/" alt="Ficha" width={30} height={30} />
              <span className="notification-count">1</span>
              <span className="bell-icon"></span>
            </button>

            <div className="profile">
              <span>juan</span>
              <Image src="/" alt="Ficha" width={45} height={30} />
            </div>
            <aside>
              <button className="despliegue">
                <Image src="/" alt="Ficha" width={30} height={20} />
              </button>
            </aside>
          </div>
        </div>
      </header>
    </div>
  );
};
