"use client"

import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "../../../resources/styles/teamScrum.css";
import icononoti from "../../../resources/img/noti.png";
import iconoper from "../../../resources/img/persona.png";
import iconodes from "../../../resources/img/despliegue.png";

export const Header = () => {

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
    </div>
  );
};
