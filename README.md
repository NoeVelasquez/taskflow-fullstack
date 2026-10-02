# 🚀 TaskFlow — Fullstack Project & Task Management System
**Evaluación Final — Módulo 7 (React)**

Aplicación web integral para la administración de proyectos y tareas, desarrollada como evaluación final del Módulo 7. Integra un Frontend reactivo construido con **React 19 + Vite 6 + Context API** y un Backend REST API construido con **Express 5 + Sequelize + PostgreSQL + JWT**.

---

## 📋 Tabla de Contenidos
1. [Estructura del Proyecto](#-estructura-del-proyecto)
2. [Requisitos Mínimos Implementados](#-requisitos-mínimos-implementados)
3. [Conceptos de React Aplicados](#-conceptos-de-react-aplicados)
4. [Requisitos Previos](#-requisitos-previos)
5. [Instalación y Puesta en Marcha](#-instalación-y-puesta-en-marcha)
   - [1. Backend (API REST)](#1-backend-api-rest)
   - [2. Frontend (React)](#2-frontend-react)
6. [Endpoints Principales de la API](#-endpoints-principales-de-la-api)
7. [Despliegue y Base de Datos en la Nube (Opcional)](#-despliegue-y-base-de-datos-en-la-nube-opcional)

---

## 📂 Estructura del Proyecto

```text
taskflow-fullstack/
├── backend/                  # API REST (Express, Sequelize, PostgreSQL, JWT, Swagger)
│   ├── src/
│   │   ├── config/           # Conexión DB y configuración de entorno
│   │   ├── controllers/      # Controladores de auth, proyectos y tareas
│   │   ├── middlewares/      # Validación, autenticación JWT y manejo de errores
│   │   ├── models/           # Modelos Sequelize (User, Project, Task)
│   │   ├── routes/           # Enrutadores Express
│   │   └── server.js         # Entry point del servidor backend
│   ├── .env.example          # Plantilla de variables de entorno del backend
│   ├── package.json
│   └── README.md
├── frontend/                 # Single Page Application (React 19, Vite 6, Context API)
│   ├── src/
│   │   ├── api/              # Cliente Axios e interceptores JWT
│   │   ├── components/       # Componentes modulares (Auth, Projects, Tasks, Dashboard)
│   │   ├── context/          # Context API (AuthContext, ProjectContext, ToastContext)
│   │   ├── pages/            # Vistas principales (Dashboard, Projects, Tasks)
│   │   ├── styles/           # Design System Vanilla CSS
│   │   ├── App.jsx           # Enrutamiento condicional y vistas
│   │   └── main.jsx          # Entry point y Providers
│   ├── .env.example          # Plantilla de variables de entorno del frontend
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
├── .gitignore                # Reglas de exclusión para node_modules y .env
├── sync-and-push.ps1         # Script de sincronización automática desde carpetas locales
└── README.md                 # Documentación global del proyecto
```

---

## ✨ Requisitos Mínimos Implementados

- 🔐 **Autenticación Completa**: Registro e inicio de sesión con encriptación bcrypt y tokens JWT.
- 📊 **Dashboard y Métricas**: KPIs de proyectos activos, tareas pendientes, tareas completadas y barra porcentual de cumplimiento general.
- 📁 **CRUD de Proyectos**: Creación, listado filtrable por texto/estado, edición modal y eliminación segura con confirmación.
- ✅ **CRUD de Tareas y Estados**: Creación vinculada a proyectos, edición, eliminación y conmutación de estado (completada/pendiente) con cálculo automático de avance.
- 📋 **Vistas Duales de Tareas**: Vista Lista tradicional y Tablero interactivo tipo Kanban (*Por Hacer* y *Completadas*).
- 🌐 **Consumo Directo de API REST**: Integración completa con Axios, interceptor de cabeceras Bearer Authorization y manejo centralizado de expiración de sesión (HTTP 401).

---

## ⚛️ Conceptos de React Aplicados

| Concepto | Implementación en TaskFlow |
| :--- | :--- |
| **Componentes Funcionales** | Arquitectura 100% modular y limpia. |
| **Props y Desestructuración** | Paso unidireccional y tipado consistente de datos y callbacks. |
| **`useState`** | Control reactivo de estados locales (modales, filtros, inputs, modo de vista). |
| **`useEffect`** | Sincronización asíncrona con la API, health check y listeners. |
| **Context API** | Separación en `AuthContext`, `ProjectContext` y `ToastContext`. |
| **Formularios Reactivos** | Validación campo por campo con feedback visual y prevención de doble submit. |
| **Consumo de APIs** | Módulos `authApi`, `projectApi`, `taskApi` y `healthApi` con Axios. |
| **Renderizado Condicional** | Toggle Login/Dashboard, alternancia Lista/Kanban, y *Empty States*. |
| **Manejo de Carga y Errores** | Spinners, toasts flotantes contextuales y badge de conexión en vivo (*Live Health Status*). |

---

## ⚙️ Requisitos Previos

- **Node.js**: Versión 18 o superior (`node -v`).
- **PostgreSQL**: Servidor local o base de datos PostgreSQL en la nube (ej. Neon Database).

---

## 🛠️ Instalación y Puesta en Marcha

### 1. Backend (API REST)

1. Abre una terminal y navega a la carpeta `backend`:
   ```bash
   cd backend
   npm install
   ```

2. Configura las variables de entorno en un archivo `.env` (basado en `.env.example`):
   ```env
   PORT=3000
   NODE_ENV=development
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=taskflow_db
   DB_USER=postgres
   DB_PASSWORD=tu_password
   JWT_SECRET=super_secret_jwt_key_taskflow_2026
   JWT_EXPIRES_IN=1d
   LOG_LEVEL=info
   ```

3. Inicia el servidor backend en modo desarrollo:
   ```bash
   npm run dev
   ```
   > 🌐 **Backend API:** `http://localhost:3000/api`  
   > 📑 **Documentación Swagger:** `http://localhost:3000/api-docs`

---

### 2. Frontend (React)

1. Abre una segunda terminal y navega a la carpeta `frontend`:
   ```bash
   cd frontend
   npm install
   ```

2. Configura el archivo `.env` con la URL de la API:
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```

3. Inicia el servidor de desarrollo de Vite:
   ```bash
   npm run dev
   ```
   > 💻 **Frontend Web App:** `http://localhost:5173`

---

## 📡 Endpoints Principales de la API

- `GET /api/health`: Estado de salud de la API.
- `POST /api/auth/register`: Registro de nuevos usuarios.
- `POST /api/auth/login`: Inicio de sesión y generación de token JWT.
- `GET /api/auth/me`: Verificación de perfil y token activo.
- `GET /api/projects`: Listar proyectos del usuario autenticado.
- `POST /api/projects`: Crear nuevo proyecto.
- `PUT /api/projects/:id`: Actualizar datos/estado de un proyecto.
- `DELETE /api/projects/:id`: Eliminar un proyecto.
- `GET /api/tasks`: Listar tareas del usuario (con soporte para filtro `?projectId=`).
- `POST /api/tasks`: Crear una nueva tarea.
- `PATCH /api/tasks/:id`: Actualizar estado/datos de una tarea.
- `DELETE /api/tasks/:id`: Eliminar una tarea.

---

## ☁️ Despliegue y Base de Datos en la Nube (Opcional)

- **Base de Datos:** [Neon Database (PostgreSQL Cloud)](https://neon.tech)
- **Despliegue Backend:** [Render (Web Service)](https://render.com)
- **Despliegue Frontend:** [Render / Vercel (Static Web App)](https://vercel.com)
