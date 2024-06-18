import styles from "../../resources/styles/login.css"
import tipoDoc from "../../resources/img/iconoTD.png"
import numDoc from "../../resources/img/iconoNumDoc.png"
import contra from "../../resources/img/iconoContraseña.png"

const Login = () => {

  return (
    <div className="fondo-login">
      <div className="cont-login">
        <div className="conten1">
          <h1 className="titulo-TDA">TDA</h1>
          <p className="text-infor">Transformando el futuro con las nuevas habilidades del SENA.</p>
        </div>
        <div className="form-section">
          <h1 className="titulo-login">Inicia Sesión</h1>
          <p className="text-bienv">¡Bienvenido de vuelta! Por favor, inicia sesión para acceder a tu cuenta.</p>
          <form className="form-login">
            <div className="caja-input-login">
              <div className="input-container">
                <img src={tipoDoc.src} className="input-icon" alt="icono" />
                <select className="input-login-selec">
                  <option value="" disabled selected>Tipo de documento</option>
                  <option value="TI">Tarjeta de Identidad</option>
                  <option value="CC">Cédula de Ciudadanía</option>
                </select>
              </div>
            </div>
            <div className="caja-input-login">
              <div className="input-container">
                <img src={numDoc.src} className="input-icon" alt="icono" />
                <input className="input-login" placeholder="Número de documento" />
              </div>
            </div>
            <div className="caja-input-login">
              <div className="input-container">
                <img src={contra.src} className="input-icon" alt="icono" />
                <input className="input-login" type="password" placeholder="Contraseña" />
              </div>
            </div>
            <div className="caja-recordar">
              <input type="checkbox"/>
              <label>Recordar</label>
              <a href="#" className="link-olvidaste">¿Olvidaste tu contraseña?</a>
            </div>
            <div className="caja-button-login">
              <button type="submit" className="button-login">Iniciar Sesion</button>
            </div>
          </form>
        </div>
      </div>
      <div className="conten2">
        <p>¡Únete a la comunidad educativa del SENA y <br></br> 
          potencia tu futuro! Regístrate ahora para <br></br> 
          acceder a una amplia gama de programas de <br></br> 
          formación y oportunidades de crecimiento <br></br> 
          profesional. </p>
      </div>
      <div className="conten3">
        <p className="text-tda-1">TDA</p>
        <p className="text-tda-2">Potenciando la asistencia</p>
      </div>
    </div>
    );
}

export default Login;