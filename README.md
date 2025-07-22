# 🏛️ Aquiles - Sistema de Gestión de Asistencia y Seguimiento para Proyectos de Aprendices

Aquiles es un microservicio de gestión de asistencia y seguimiento de proyectos formativos, diseñado para facilitar la administración de fichas de aprendices, la asignación de instructores y jueces, el manejo de justificaciones de inasistencia, la generación de reportes, y la gestión de roles y usuarios.

El sistema está compuesto por un frontend desarrollado con **Next.js**, **React**, **Redux**, **TypeScript** y **Tailwind CSS**, mientras que el backend está construido con **Java** y **Spring Boot**. La comunicación entre los microservicios se realiza mediante APIs **GraphQL** usando **DGS** y **Apollo Gateway**.

## 📋 Tabla de Contenidos

- [Arquitectura de Microservicios](#arquitectura-de-microservicios)
- [Tecnologías](#tecnologías)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación](#instalación)
- [Uso](#uso)
- [Características](#características)
- [GraphQL API](#graphql-api)
- [Base de Datos](#base-de-datos)
- [Desarrollo](#desarrollo)
- [Integración con Apollo Gateway](#integración-con-apollo-gateway)

## 🏗️ Arquitectura de Microservicios

**Aquiles** es un microservicio especializado en gestión de asistencia y seguimiento de proyectos formativos que forma parte de un ecosistema más amplio de microservicios educativos del SENA. La comunicación entre microservicios se realiza a través de **Chaos (Apollo Gateway)** que actúa como un SuperGraph unificado para todas las consultas GraphQL.

### Arquitectura del Sistema
```
Chaos (Apollo Gateway - SuperGraph)
    ├── Olympo (Administración Central)        # Centraliza información
    ├── Cerberos (Seguridad y Autenticación)   # JWT y permisos
    ├── Aquiles (Gestión de Asistencia)        # Este microservicio
    ├── Themis (Novedades de Formación)        # Programas SENA
    ├── Keiros (Horarios y Ambientes)          # Gestión de espacios
    ├── Hermes (Carnetización)                 # Control de acceso
    └── Apolo (Inventarios)                    # Centro de servicios financiero
```

### Estructura del Microservicio
```
aquilesApp/
├── frontend/           # Aplicación Next.js (React)
├── aquilesApi/         # Microservicio GraphQL (Spring Boot + DGS)
└── package.json        # Configuración del monorepo
```

## 🚀 Tecnologías

### Frontend (`frontend/`)

#### Framework y Core
- **Next.js 15.3.3** - Framework React con SSR/SSG
- **React 18.3.1** - Biblioteca de UI
- **TypeScript 5** - Tipado estático
- **Tailwind CSS 3.4.1** - Framework de CSS utilitario

#### Estado y Datos
- **Redux Toolkit 2.8.2** - Gestión de estado global
- **Apollo Client 3.13.6** - Cliente GraphQL con soporte para Apollo Gateway
- **GraphQL Codegen** - Generación automática de tipos TypeScript

#### UI y Componentes
- **Framer Motion 12.6.3** - Animaciones
- **Headless UI 2.1.1** - Componentes accesibles
- **FontAwesome** - Iconografía
- **Lucide React** - Iconos modernos
- **React Icons** - Biblioteca de iconos

#### Funcionalidades Específicas
- **React Webcam 7.2.0** - Captura de cámara
- **JSQr 1.4.0** - Lectura de códigos QR
- **React Calendar 5.0.0** - Calendario
- **React DatePicker 8.3.0** - Selector de fechas
- **Schedule-X** - Calendario avanzado de eventos
- **React Toastify** - Notificaciones

#### Herramientas de Desarrollo
- **ESLint** - Linter de código
- **PostCSS** - Procesador de CSS
- **Autoprefixer** - Prefijos CSS automáticos

### Backend (`aquilesApi/`)

#### Framework y Core
- **Spring Boot 3.3.4** - Framework Java
- **Java 17** - Lenguaje de programación
- **Gradle** - Herramienta de construcción

#### Base de Datos y Persistencia
- **Spring Data JPA** - ORM y acceso a datos
- **PostgreSQL** - Base de datos relacional
- **Hibernate** - Implementación JPA

#### APIs y Comunicación
- **Netflix DGS 10.1.2** - Framework GraphQL para Spring Boot
- **GraphQL Java Extended Scalars** - Tipos escalares adicionales
- **Spring Security** - Autenticación y autorización
- **Apollo Gateway Integration** - Integración con Chaos (SuperGraph)

#### Funcionalidades Específicas
- **Spring Mail** - Envío de correos electrónicos
- **Google ZXing 3.5.0** - Generación de códigos QR
- **Apache POI 5.2.3** - Generación de reportes Excel
- **Apache PDFBox 2.0.28** - Generación de reportes PDF
- **ModelMapper 3.2.0** - Mapeo de objetos
- **Lombok** - Reducción de código boilerplate

#### Herramientas de Desarrollo
- **Spring Boot DevTools** - Herramientas de desarrollo
- **Spring Boot Test** - Testing
- **JUnit Platform** - Framework de testing

## 📁 Estructura del Proyecto

### Frontend
```
frontend/
├── app/
│   ├── (routes)/
│   │   └── dashboard/           # Rutas del dashboard
│   ├── components/
│   │   ├── features/           # Componentes de funcionalidades
│   │   ├── Modals/            # Componentes modales
│   │   └── UI/                # Componentes de interfaz
│   ├── context/               # Contextos de React
│   ├── graphql/               # Queries y mutaciones GraphQL
│   ├── redux/                 # Estado global
│   ├── services/              # Servicios API
│   └── types/                 # Definiciones de tipos
├── public/                    # Archivos estáticos
└── templates/                 # Plantillas de notificaciones
```

### Backend
```
aquilesApi/
├── src/
│   ├── main/
│   │   ├── java/com/          # Código fuente Java
│   │   └── resources/         # Configuración y recursos
│   └── test/                  # Tests
├── build/                     # Archivos compilados
└── gradle/                    # Configuración Gradle
```

## 🛠️ Instalación

### Prerrequisitos
- **Node.js** (versión 18 o superior)
- **Java 17**
- **PostgreSQL**
- **Git**

### Configuración

1. **Clonar el repositorio**
```bash
git clone https://github.com/senaFactory/aquilesApp.git
cd aquilesApp
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar la base de datos**
   - Crear una base de datos PostgreSQL llamada `DB_Aquiles`
   - Actualizar las credenciales en `aquilesApi/src/main/resources/application.yml`

4. **Configurar variables de entorno**
   - Configurar SMTP para envío de correos
   - Actualizar URLs de API según el entorno

## 🚀 Uso

### Desarrollo

**Ejecutar ambas aplicaciones simultáneamente:**
```bash
npm run dev
```

**Ejecutar solo el frontend:**
```bash
npm run start:frontend
```

**Ejecutar solo el backend:**
```bash
npm run start:aquilesApi
```

### URLs de Desarrollo
- **Frontend:** http://localhost:3000
- **Microservicio Aquiles:** http://localhost:8081/graphql
- **Chaos (Apollo Gateway):** http://localhost:4000/graphql (SuperGraph principal)
- **GraphQL Playground:** Disponible en Chaos para explorar el schema federado completo

## ✨ Características

### Gestión de Asistencia
- ✅ Control de asistencia mediante códigos QR
- ✅ Captura de cámara para verificación
- ✅ Calendario de eventos y actividades
- ✅ Notificaciones automáticas de ausencias

### Gestión de Aprendices
- ✅ Registro y administración de estudiantes
- ✅ Checklists de seguimiento
- ✅ Reportes de progreso

### Reportes y Documentación
- ✅ Exportación a Excel (XLS/XLSX)
- ✅ Generación de PDFs
- ✅ Reportes personalizables

### Notificaciones
- ✅ Envío de correos electrónicos
- ✅ Plantillas personalizables
- ✅ Notificaciones en tiempo real

### Interfaz de Usuario
- ✅ Diseño responsivo
- ✅ Modo oscuro/claro
- ✅ Animaciones fluidas
- ✅ Componentes accesibles

## 🔌 GraphQL API

### Microservicio Aquiles
- **Endpoint directo:** `http://localhost:8081/graphql`
- **Chaos (Apollo Gateway):** `http://localhost:4000/graphql` (recomendado)
- **Schema:** Generado automáticamente por DGS (Domain Graph Service)
- **Federation:** Compatible con Apollo Federation para integración con el ecosistema SENA
- **Codegen:** Configurado para generar tipos TypeScript automáticamente

## 🗄️ Base de Datos

### PostgreSQL
- **Host:** localhost:5432
- **Base de datos:** DB_Aquiles
- **ORM:** Hibernate/JPA
- **Migraciones:** Automáticas con `ddl-auto: update`

## 👨‍💻 Desarrollo

### Scripts Disponibles

```json
{
  "dev": "Ejecutar frontend y backend en paralelo",
  "start:frontend": "Ejecutar solo el frontend",
  "start:aquilesApi": "Ejecutar solo el backend",
  "codegen": "Generar tipos GraphQL"
}
```

### Estructura de Commits
- Rama principal: `main`
- Rama de desarrollo: `gabrielDev`
- Propietario: `senaFactory`

### Configuración de Desarrollo
- **GraphQL Federation:** Schema compatible con Apollo Federation
- **Hot Reload:** Configurado tanto en frontend como backend
- **GraphQL Codegen:** Configurado para regenerar tipos automáticamente
- **Apollo Client:** Configurado para conectar con Chaos (Apollo Gateway)
- **Microservices Communication:** Comunicación federada entre servicios

## Funcionalidades Principales

### Principales módulos:
- **Fichas de Aprendices:** Visualización y gestión de las fichas de los aprendices, incluyendo asignación de instructores.
- **Asistencia:** Registro, actualización y seguimiento de la asistencia de los aprendices, con notificaciones automáticas a través de correos electrónicos.
- **Scrum Teams:** Administración y visualización de equipos Scrum con la posibilidad de agregar nuevos equipos.
- **Justificaciones:** Manejo de excusas y justificativos de inasistencia.
- **Sustentaciones:** Asignación de jueces para sustentaciones y gestión de procesos relacionados.
- **Roles y permisos:** Gestión de usuarios y roles consumidos desde **Olympo** y autenticación desde **Cerberos**.
- **Generación de reportes:** Descarga de reportes en formato PDF.

## Requisitos del sistema

### Backend
- **Java 17+**
- **Spring Boot**
- **Base de datos relacional** (ej. MySQL, PostgreSQL)
- **Gradle** para la gestión de dependencias

### Frontend
- **Node.js 18+**
- **Next.js 15+**
- **React 18+**
- **Tailwind CSS**
- **Apollo Client** para conexión GraphQL
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
     npm install --legacy-peer-deps
    ```
3. Instalar las dependencias:
    ```bash
    npm install
    ```

4. Configurar las variables de entorno en el archivo `.env.local` para conectar con Chaos (Apollo Gateway):
    ```bash
    NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql
    ```

5. Ejecutar la aplicación:
    ```bash
    npm run dev
    ```

## Estructura del proyecto

### Backend
- **/aquilesApp/src/main/java/com/aquiles/**: Código fuente del backend en Java.
  - **graphql/**: Resolvers y Data Fetchers de GraphQL
  - **services/**: Servicios de lógica de negocio
  - **repositories/**: Repositorios JPA para acceso a datos
  - **entities/**: Entidades JPA
  - **config/**: Configuración de Spring Boot y GraphQL
  - **utils/**: Utilidades como generación de QR y reportes

### Frontend
- **/frontend/app/**: Código fuente del frontend en Next.js.
  - **graphql/**: Queries, mutaciones y tipos GraphQL generados
  - **components/**: Componentes React reutilizables
  - **services/**: Servicios para manejo de lógica de negocio
  - **context/**: Contextos de React para estado global
  - **redux/**: Store de Redux para gestión de estado
  - **types/**: Definiciones de tipos TypeScript

## GraphQL Schema (Microservicio Aquiles)

### Queries Principales
- **fichas**: Obtiene todas las fichas de aprendices
- **aprendices**: Lista de aprendices con filtros
- **asistencias**: Consulta de registros de asistencia
- **reportesAsistencia**: Generación de reportes de asistencia
- **equiposScrum**: Gestión de equipos Scrum

### Mutaciones Principales
- **updateAsistencia**: Actualiza la asistencia de un aprendiz
- **createFicha**: Crea una nueva ficha
- **assignInstructor**: Asigna instructor a una ficha
- **sendNotificationAsistencia**: Envía notificaciones de asistencia por email
- **generateQRAsistencia**: Genera códigos QR para control de asistencia
- **createJustificacion**: Crea justificaciones de inasistencia

### Subscriptions
- **asistenciaUpdated**: Notificaciones en tiempo real de cambios de asistencia
- **notificationSent**: Estado de envío de notificaciones de asistencia

### Tipos Federados
- **User** (extendido desde Olympo): Información de usuarios con datos de asistencia
- **Role** (desde Cerberos): Autenticación JWT y permisos
- **Schedule** (desde Keiros): Integración con horarios y ambientes
- **FormationProgram** (desde Themis): Programas formativos SENA

## 🌐 Integración con Chaos (Apollo Gateway)

### SuperGraph del Ecosistema SENA
Aquiles está diseñado para integrarse perfectamente con **Chaos (Apollo Gateway)**, que actúa como el SuperGraph central del ecosistema de microservicios educativos del SENA, permitiendo que el frontend consuma datos de múltiples microservicios a través de un único endpoint GraphQL.

### Microservicios del Ecosistema SENA
- **Olympo**: Microservicio administrativo central que provee información a todos los demás
- **Cerberos**: Seguridad y autenticación mediante JWT y gestión de permisos
- **Aquiles** (este servicio): Gestión de asistencia y seguimiento de proyectos formativos
- **Themis**: Gestión de novedades a nivel de formación en programas SENA
- **Keiros**: Gestión de horarios y ambientes de formación
- **Hermes**: Sistema de carnetización para control de acceso al edificio
- **Apolo**: Gestión de inventarios del centro de servicios financiero SENA
- **Chaos**: Apollo Gateway que funciona como SuperGraph para comunicación entre microservicios

### Configuración del SuperGraph
```yaml
# Ejemplo de configuración para Chaos (Apollo Gateway)
services:
  - name: olympo
    url: http://localhost:8080/graphql
  - name: cerberos
    url: http://localhost:8082/graphql
  - name: aquiles
    url: http://localhost:8081/graphql
  - name: themis
    url: http://localhost:8083/graphql
  - name: keiros
    url: http://localhost:8084/graphql
  - name: hermes
    url: http://localhost:8085/graphql
  - name: apolo
    url: http://localhost:8086/graphql
```

### Beneficios del SuperGraph
- ✅ **Punto único de entrada** para todo el ecosistema SENA
- ✅ **Composición automática** de esquemas de todos los microservicios
- ✅ **Queries cross-service** entre diferentes dominios educativos
- ✅ **Tipado fuerte** end-to-end en todo el ecosistema
- ✅ **Escalabilidad independiente** de cada microservicio
- ✅ **Seguridad centralizada** a través de Cerberos
- ✅ **Administración unificada** desde Olympo

## 🤝 Contribución
Queremos agradecer a todos los desarrolladores, instructores y aprendices que han colaborado en este proyecto, aportando ideas y feedback constante. Su contribución ha sido fundamental para el desarrollo de Aquiles.

## Contribuciones
Este es un proyecto en constante evolución, por lo que cualquier aportación es bienvenida. Si encuentras errores, tienes sugerencias o deseas colaborar en nuevas funcionalidades, no dudes en abrir un issue o enviar un pull request. ¡Tu ayuda es siempre apreciada!