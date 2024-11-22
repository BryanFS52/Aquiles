# Aquiles - Sistema de Gestión de Asistencia y Seguimiento para Proyectos de Aprendices

## Descripción

Aquiles es un sistema de gestión de asistencia y seguimiento de proyectos formativos. Está diseñado para facilitar la administración de fichas de aprendices, la asignación de instructores y jueces, el manejo de justificaciones de inasistencia, la generación de reportes, y la gestión de roles y usuarios.

El sistema está compuesto por un frontend desarrollado con **Next.js**, **React**, y **Tailwind CSS**, mientras que el backend está construido con **Java** y **Spring Boot**. La comunicación entre ambos se realiza mediante APIs REST.

## Funcionalidades

### Principales módulos:
- **Fichas de Aprendices:** Visualización y gestión de las fichas de los aprendices, incluyendo asignación de instructores.
- **Asistencia:** Registro, actualización y seguimiento de la asistencia de los aprendices, con notificaciones automáticas a través de correos electrónicos.
- **Scrum Teams:** Administración y visualización de equipos Scrum con la posibilidad de agregar nuevos equipos.
- **Justificaciones:** Manejo de excusas y justificativos de inasistencia.
- **Sustentaciones:** Asignación de jueces para sustentaciones y gestión de procesos relacionados.
- **Roles y permisos:** Gestión de usuarios y roles consumidos desde el proyecto **Olimpo**.
- **Generación de reportes:** Descarga de reportes en formato PDF.

## Requisitos del sistema

### Backend
- **Java 17+**
- **Spring Boot**
- **Base de datos relacional** (ej. MySQL, PostgreSQL)
- **Gradle** para la gestión de dependencias

### Frontend
- **Node.js 18+**
- **Next.js**
- **React**
- **Tailwind CSS**
- **Axios** para las solicitudes HTTP al backend
- **react-toastify** para la gestión de notificaciones

## Configuración del entorno

### Backend (Spring Boot)

1. Configurar el archivo `application.properties` o `application.yml` con los detalles de la base de datos y el servidor de correos electrónicos:
    ```properties
    spring.datasource.url=jdbc:mysql://localhost:5432/aquiles
    spring.datasource.username=tu-usuario / postgres
    spring.datasource.password=tu-contraseña / fabrica2024*

    spring.mail.host=smtp.gmail.com
    spring.mail.port=587
    spring.mail.username=tu-correo@gmail.com / fosnotreply@gmail.com
    spring.mail.password=tu-contraseña / blquyaiclscdoufe
    ```

2. Ejecutar la aplicación: 
    ```bash
    ./gradlew bootRun
    ```

### Frontend (Next.js)

1. Clonar el repositorio del frontend: 
    ```bash
    git clone https://github.com/senaFactory/aquilesApp.git
    ```

2. Instalar las dependencias:
    ```bash
    npm install
    ```
3. Instalar las dependencias:
    ```bash
    npm install --legacy-peer-deps
    ```

4. Configurar las variables de entorno en el archivo `.env.local` para conectar con el backend:
    ```bash
    NEXT_PUBLIC_API_URL=http://localhost:8080/api
    ```

5. Ejecutar la aplicación:
    ```bash
    npm run dev
    ```

## Estructura del proyecto

### Backend
- **/aquilesApp/src/main/java/com/aquiles/**: Código fuente del backend en Java.
  - **EmailService.java**: Servicio para el envío de correos electrónicos.
  - **TrainersRepository.java**: Repositorio para gestionar los entrenadores.
  - **QRCodeGenerator.java**: Generación de códigos QR para asistencia.
  - **PersonsController.java, PersonsService.java, PersonsRepository.java**: Clases para la gestión de personas.
  - **SheetController.java, SheetService.java**: Clases para la gestión de fichas.

### Frontend
- **/frontend/src/**: Código fuente del frontend en Next.js.
  - **EmailService.js**: Servicio para enviar correos electrónicos.
  - **PDFService.js**: Servicio para descargar reportes en formato PDF.
  - **attendanceService.js**: Servicio para actualizar la asistencia de los aprendices.
  - **formularioRegistro.js**: Formulario para registrar nuevos aprendices.
  - **FichasCoordinator.js**: Página para gestionar la asignación de instructores a las fichas.
  - **ModalQR.js**: Componente para mostrar el código QR generado.

## API Endpoints

### Backend

#### Autenticación y Roles
- `GET /api/roles`: Obtiene los roles de usuario (simulados con Mockoon).

#### Asistencia
- `POST /api/attendance/update`: Actualiza la asistencia de un aprendiz.

#### Notificaciones
- `GET /api/send-notification`: Envía un correo electrónico con las notificaciones.

#### Reportes
- `GET /pdf/report`: Descarga un reporte en PDF.

## Uso de Mockoon para simular APIs

Aquiles utiliza **Mockoon** para simular el consumo de roles desde el proyecto **Olimpo**. Puedes configurar Mockoon con el siguiente endpoint para simular los roles:

 ```json
{
  "endpoint": "/api/roles",
  "method": "GET",
  "status": 200,
  "response": {
    "roles": ["ADMIN", "COORDINATOR", "INSTRUCTOR", "LEARNER"]
  }
 ```
  
## Agradecimientos
Queremos agradecer a todos los desarrolladores, instructores y aprendices que han colaborado en este proyecto, aportando ideas y feedback constante. Su contribución ha sido fundamental para el desarrollo de Aquiles.

## Contribuciones
Este es un proyecto en constante evolución, por lo que cualquier aportación es bienvenida. Si encuentras errores, tienes sugerencias o deseas colaborar en nuevas funcionalidades, no dudes en abrir un issue o enviar un pull request. ¡Tu ayuda es siempre apreciada!
