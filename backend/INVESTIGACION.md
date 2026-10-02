# INVESTIGACIÓN TÉCNICA: PAGINACIÓN Y RELACIONES EN SEQUELIZE

**Autor:** Desarrollador Backend Senior  
**Proyecto:** TaskFlow API  
**Estado:** Propuesta de Diseño e Implementación

---

## 1. Paginación en Sequelize

La paginación es una técnica fundamental en el desarrollo de APIs REST eficientes. Permite dividir un conjunto de datos masivo en segmentos manejables ("páginas"), evitando la sobrecarga en el servidor de base de datos, el consumo excesivo de memoria del proceso Node.js y la latencia en la transferencia de red hacia el cliente.

### 1.1 Explicación Teórica de `limit` y `offset`

En bases de datos relacionales, la paginación a nivel de consulta SQL se implementa típicamente mediante las cláusulas `LIMIT` y `OFFSET`. Sequelize abstrae estas cláusulas como propiedades en sus opciones de consulta:

- **`limit` (Límite):** Define el tamaño de la página, es decir, el número máximo de registros que la consulta debe retornar en el conjunto de resultados.
- **`offset` (Desplazamiento):** Indica el número de registros que se deben saltar antes de comenzar a devolver las filas. Un `offset` de 0 significa que se empieza desde la primera fila; un `offset` de 10 significa que se omiten las primeras 10 filas de la consulta.

### 1.2 Lógica de Obtención de `page` y `limit` desde Query Params

En una API Express, los parámetros de paginación se reciben a través de la cadena de consulta (Query Parameters) en `req.query` (por ejemplo, `GET /api/tasks?page=2&limit=5`). Dado que todos los valores recibidos en `req.query` son cadenas de texto, es crucial validarlos y convertirlos:

1.  **Conversión a Entero:** Se utiliza `parseInt(value, 10)` para asegurar una base decimal y evitar problemas de interpretación numérica.
2.  **Validación y Valores por Defecto:** Se debe verificar que el número resultante sea un entero válido y mayor que cero (`> 0`). Si no lo es (por ejemplo, si es un texto no numérico, un número negativo, o si el parámetro no fue enviado), se asignan valores por defecto:
    - `page` por defecto: `1`
    - `limit` por defecto: `10`

**Implementación lógica en el Controlador:**

```javascript
const page =
  parseInt(req.query.page, 10) > 0 ? parseInt(req.query.page, 10) : 1;
const limit =
  parseInt(req.query.limit, 10) > 0 ? parseInt(req.query.limit, 10) : 10;
```

### 1.3 Demostración de la Fórmula: `offset = (page - 1) * limit`

Para determinar cuántos registros saltar (`offset`) basándonos en la página solicitada (`page`) y el tamaño de la misma (`limit`), se utiliza la siguiente ecuación matemática:

$$\text{offset} = (\text{page} - 1) \times \text{limit}$$

#### Ejemplo Práctico (Páginas con `limit = 10`):

- **Página 1:**  
  $$\text{offset} = (1 - 1) \times 10 = 0 \times 10 = 0$$  
  _Se obtienen los registros del 1 al 10. No se salta ningún registro._
- **Página 2:**  
  $$\text{offset} = (2 - 1) \times 10 = 1 \times 10 = 10$$  
  _Se obtienen los registros del 11 al 20. Se saltan los primeros 10 registros._
- **Página 3:**  
  $$\text{offset} = (3 - 1) \times 10 = 2 \times 10 = 20$$  
  _Se obtienen los registros del 21 al 30. Se saltan los primeros 20 registros._

#### Matriz de Comportamiento de Paginación:

| Página (`page`) | Límite (`limit`) | Operación `(page - 1) * limit` | Desplazamiento (`offset`) | Rango de Filas Obtenido |
| :-------------: | :--------------: | :----------------------------: | :-----------------------: | :---------------------: |
|      **1**      |        5         |         `(1 - 1) * 5`          |           **0**           |       Filas 1 a 5       |
|      **2**      |        5         |         `(2 - 1) * 5`          |           **5**           |      Filas 6 a 10       |
|      **3**      |        5         |         `(3 - 1) * 5`          |          **10**           |      Filas 11 a 15      |
|      **1**      |        10        |         `(1 - 1) * 10`         |           **0**           |      Filas 1 a 10       |
|      **2**      |        10        |         `(2 - 1) * 10`         |          **10**           |      Filas 11 a 20      |

### 1.4 Uso de `findAndCountAll()` para Consultas Eficientes

El método `findAndCountAll()` es un ayudante de Sequelize de alta utilidad que combina dos operaciones de base de datos en una sola ejecución lógica:

1.  Un conteo de filas (`COUNT`) de todos los registros que cumplen con las condiciones del filtro `where` (ignorando las cláusulas `limit` y `offset`).
2.  Una selección (`SELECT`) de las filas correspondientes aplicando el filtro `where`, el ordenamiento (`order`), el `limit` y el `offset`.

**Retorno de `findAndCountAll()`**:
Devuelve un objeto con dos propiedades esenciales:

- `count` (entero): Representa la cantidad total de registros en la base de datos que cumplen el criterio de búsqueda (útil como `totalItems`).
- `rows` (array): Colección de instancias del modelo correspondientes a la página actual de resultados.

### 1.5 Cálculo de `totalPages` con `Math.ceil(totalItems / limit)`

Para informar al cliente sobre la cantidad total de páginas disponibles basadas en el tamaño de página configurado (`limit`), se realiza la división de los elementos totales entre el límite. Como el resultado puede ser decimal, se redondea hacia arriba usando la función matemática `Math.ceil()`:

$$\text{totalPages} = \lceil \frac{\text{totalItems}}{\text{limit}} \rceil$$

**Ejemplo:**

- Si `totalItems = 25` y `limit = 10`:
  $$\text{totalPages} = \text{Math.ceil}(25 / 10) = \text{Math.ceil}(2.5) = 3 \text{ páginas}$$
  - Página 1: 10 ítems (registros 1-10)
  - Página 2: 10 ítems (registros 11-20)
  - Página 3: 5 ítems (registros 21-25)
- Si `totalItems = 0` y `limit = 10`:
  $$\text{totalPages} = \text{Math.ceil}(0 / 10) = \text{Math.ceil}(0) = 0 \text{ páginas}$$

---

## 2. Obtener un Proyecto con sus Tareas (`include`)

La gestión de relaciones en base de datos es clave para la integridad referencial y las consultas estructuradas. Sequelize maneja esto a través del concepto de asociaciones y la carga de relaciones.

### 2.1 Concepto de Eager Loading en Sequelize usando `include`

Al trabajar con entidades relacionadas (como un `Project` que posee múltiples `Task` asociadas), existen dos formas principales de cargar la información:

- **Lazy Loading (Carga Diferida):** Se recupera el registro padre y, cuando se requiere acceder a sus hijos en el código, se realiza una consulta adicional. Esto causa el problema clásico de rendimiento conocido como **Query N+1**, donde se terminan ejecutando múltiples consultas individuales a la base de datos.
- **Eager Loading (Carga Ansiosa):** Se carga el registro padre y todos sus registros relacionados en una sola consulta. Sequelize realiza esto mediante un `JOIN` a nivel SQL. Se implementa en Sequelize añadiendo la propiedad `include` al objeto de opciones de búsqueda (`findOne`, `findAll`, etc.).

**Ejemplo de Eager Loading básico:**

```javascript
const project = await Project.findOne({
  where: { id: projectId },
  include: [Task], // Realiza un LEFT OUTER JOIN entre projects y tasks
});
```

### 2.2 Selección de Atributos Específicos (`attributes`)

Por razones de **seguridad (no exponer contraseñas, hashes, o campos del sistema sensibles)** y **rendimiento (reducir el tamaño de la respuesta HTTP)**, nunca se debe retornar un `SELECT *` de forma indiscriminada.

Sequelize permite definir de manera explícita qué atributos queremos proyectar de la entidad principal y de las entidades incluidas mediante la propiedad `attributes`:

- **Inclusión explícita (whitelist):** `attributes: ['id', 'name', 'description']`
- **Exclusión específica (blacklist):** `attributes: { exclude: ['createdAt', 'updatedAt', 'password'] }`

### 2.3 Uso de Alias (`as`) definidos en las asociaciones de las entidades

Cuando se configuran las relaciones entre modelos (por ejemplo, `Project.hasMany(Task)`), es una buena práctica (y en ocasiones obligatorio, como en relaciones múltiples sobre la misma tabla) definir un alias usando la propiedad `as`.

- El alias determina el nombre de la propiedad del objeto devuelto por Sequelize donde se almacenarán los modelos relacionados.
- Si se define un alias al establecer la relación, **se debe usar el mismo alias** al hacer el `include`. De lo contrario, Sequelize arrojará un error indicando que la relación no ha sido configurada.

**Definición de asociación:**

```javascript
Project.hasMany(Task, {
  foreignKey: 'projectId',
  as: 'tasks', // Alias definido en plural para una relación "hasMany"
});
```

**Consulta utilizando el alias:**

```javascript
const project = await Project.findOne({
  where: { id: projectId },
  include: [
    {
      model: Task,
      as: 'tasks', // Obligatorio usar el mismo alias definido en el modelo
      attributes: ['id', 'title', 'completed'],
    },
  ],
});
// Resultado JSON esperado: { id: 1, name: "Plan de Trabajo", tasks: [...] }
```

---

## 3. Implementación de Código Limpio y Seguro (Layered Architecture)

A continuación, se detalla la implementación modularizada siguiendo una arquitectura por capas (_Layered Architecture_), aislando la capa de base de datos (Entidades y Asociaciones), la capa de persistencia (Repositorios), la capa de negocio (Servicios) y la capa de transporte/red (Controladores).

### 3.1 Definición de la Entidad Proyecto (`src/entities/project.entity.js`)

Para asegurar la completitud de la propuesta, primero definimos la nueva entidad `Project` en nuestro sistema.

```javascript
// src/entities/project.entity.js
import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/sequelize.js';

class Project extends Model {}

Project.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'user_id', // Cumple con convención snake_case en BD
    },
  },
  {
    sequelize,
    modelName: 'Project',
    tableName: 'projects',
    timestamps: true,
    underscored: true,
  }
);

export default Project;
```

---

### 3.2 Definición de Asociaciones (`src/entities/associations.js`)

Se mapean las relaciones entre `User`, `Project` y `Task`. Para soportar la relación `Project -> Task`, también actualizaremos conceptualmente la entidad `Task` para incluir una clave foránea `projectId` (`project_id` en la BD).

```javascript
// src/entities/associations.js
import User from './user.entity.js';
import Project from './project.entity.js';
import Task from './task.entity.js';

// Relaciones User <-> Project
User.hasMany(Project, {
  foreignKey: 'userId',
  as: 'projects',
});
Project.belongsTo(User, {
  foreignKey: 'userId',
  as: 'owner',
});

// Relaciones Project <-> Task
Project.hasMany(Task, {
  foreignKey: 'projectId',
  as: 'tasks',
});
Task.belongsTo(Project, {
  foreignKey: 'projectId',
  as: 'project',
});

// Relación User <-> Task (para tareas directas)
User.hasMany(Task, {
  foreignKey: 'userId',
  as: 'tasks',
});
Task.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});
```

---

### 3.3 Registro Global de Entidades (`src/entities/index.js`)

Asegura la inicialización y asociación correcta de todos los modelos al arrancar la aplicación.

```javascript
// src/entities/index.js
import './user.entity.js';
import './project.entity.js';
import './task.entity.js';

import './associations.js';
```

---

### 3.4 Capa de Persistencia: Repositorio de Proyectos (`src/repositories/project.repository.js`)

Este componente se encarga únicamente de interactuar con la base de datos para la entidad `Project`. Aplica el filtrado de seguridad por `userId` del usuario autenticado en la consulta SQL para garantizar el aislamiento de datos (seguridad a nivel de fila).

```javascript
// src/repositories/project.repository.js
import Project from '../entities/project.entity.js';
import Task from '../entities/task.entity.js';

/**
 * Busca un proyecto por su ID y su dueño de forma segura, incluyendo sus tareas asociadas.
 * Proyecta únicamente los atributos necesarios.
 *
 * @param {string} projectId - ID del proyecto a buscar.
 * @param {string} userId - ID del usuario autenticado (dueño del proyecto).
 * @returns {Promise<Project|null>} Instancia del modelo Project con tareas incluidas, o null.
 */
export const findProjectWithTasks = async (projectId, userId) => {
  return await Project.findOne({
    where: {
      id: projectId,
      userId: userId, // Filtro de seguridad multi-tenant
    },
    attributes: ['id', 'name', 'description', 'createdAt'],
    include: [
      {
        model: Task,
        as: 'tasks', // Usando el alias registrado en asociaciones
        attributes: ['id', 'title', 'description', 'completed', 'createdAt'],
        required: false,
      },
    ],
    order: [[{ model: Task, as: 'tasks' }, 'createdAt', 'ASC']],
  });
};

/**
 * Crea un proyecto asociado a un usuario.
 */
export const create = async (projectData) => {
  return await Project.create(projectData);
};
```

---

### 3.5 Capa de Persistencia: Repositorio de Tareas (`src/repositories/task.repository.js`)

Se introduce el método para buscar tareas paginadas filtradas por usuario y, opcionalmente, por proyecto. Se implementa `findAndCountAll()` para optimizar consultas de paginación.

```javascript
// src/repositories/task.repository.js
import Task from '../entities/task.entity.js';

// ... otros métodos existentes (create, findById, update, remove) ...

/**
 * Busca tareas paginadas y filtradas de manera segura por el ID del usuario y proyecto.
 *
 * @param {string} userId - ID del usuario propietario de las tareas.
 * @param {object} options - Opciones de filtrado y paginación.
 * @param {string} [options.projectId] - ID del proyecto (opcional).
 * @param {number} options.limit - Cantidad de registros por página.
 * @param {number} options.offset - Cantidad de registros a saltar.
 * @returns {Promise<{count: number, rows: Task[]}>} Objeto con total de ítems y las tareas encontradas.
 */
export const findTasksPaged = async (userId, { projectId, limit, offset }) => {
  const whereClause = { userId };

  if (projectId) {
    whereClause.projectId = projectId;
  }

  return await Task.findAndCountAll({
    where: whereClause,
    attributes: [
      'id',
      'title',
      'description',
      'completed',
      'projectId',
      'createdAt',
    ],
    limit: limit,
    offset: offset,
    order: [['createdAt', 'DESC']],
  });
};
```

---

### 3.6 Capa de Negocio: Servicios de Negocio

La capa de servicios maneja las reglas de negocio, la llamada a los repositorios y el formateo lógico de los datos de paginación.

#### Servicio de Proyectos (`src/services/project.service.js`):

```javascript
// src/services/project.service.js
import * as projectRepository from '../repositories/project.repository.js';
import { AppError } from '../utils/AppError.js';

export const getProjectDetails = async (projectId, userId) => {
  const project = await projectRepository.findProjectWithTasks(
    projectId,
    userId
  );

  if (!project) {
    throw new AppError('Proyecto no encontrado o acceso no autorizado', 404);
  }

  return project;
};

export const createProject = async (data) => {
  return await projectRepository.create(data);
};
```

#### Servicio de Tareas Paginadas (`src/services/task.service.js`):

Se agrega el servicio de obtención paginada.

```javascript
// src/services/task.service.js
import * as taskRepository from '../repositories/task.repository.js';
import { AppError } from '../utils/AppError.js';

// ... otros servicios de tareas ...

/**
 * Retorna las tareas paginadas y metadatos de paginación para el cliente.
 */
export const getPagedTasks = async (userId, { projectId, page, limit }) => {
  // 1. Calcular offset
  const offset = (page - 1) * limit;

  // 2. Consultar repositorio
  const { count: totalItems, rows: tasks } =
    await taskRepository.findTasksPaged(userId, {
      projectId,
      limit,
      offset,
    });

  // 3. Calcular total de páginas
  const totalPages = Math.ceil(totalItems / limit);

  // 4. Retornar datos listos y estructurados
  return {
    tasks,
    pagination: {
      totalItems,
      totalPages,
      currentPage: page,
      limit,
    },
  };
};
```

---

### 3.7 Capa de Red/Transporte: Controladores

Los controladores se limitan a recibir la petición, extraer y validar los parámetros de entrada (`params`, `query`, `body`), invocar a los servicios de negocio, y estructurar la respuesta JSON final cumpliendo estrictamente con el estándar requerido:
`{ "success": true, "message": "...", "data": { ... } }`

#### Controlador de Proyectos (`src/controllers/project.controller.js`):

```javascript
// src/controllers/project.controller.js
import * as projectService from '../services/project.service.js';
import { successResponse } from '../utils/response.js';

/**
 * Obtiene el detalle de un proyecto con todas sus tareas asociadas.
 */
export const getProjectWithTasks = async (req, res, next) => {
  try {
    const projectId = req.params.id;
    const userId = req.user.id; // Obtenido del middleware de autenticación (JWT)

    const project = await projectService.getProjectDetails(projectId, userId);

    return successResponse(
      res,
      project,
      'Proyecto y tareas asociadas obtenidos correctamente'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Crea un nuevo proyecto.
 */
export const createProject = async (req, res, next) => {
  try {
    const project = await projectService.createProject({
      ...req.body,
      userId: req.user.id,
    });
    return successResponse(res, project, 'Proyecto creado correctamente', 201);
  } catch (error) {
    next(error);
  }
};
```

#### Controlador de Tareas Paginadas (`src/controllers/task.controller.js`):

Se integra la lógica de extracción de query params, validación numérica, conversión con `parseInt` y control de valores por defecto.

```javascript
// src/controllers/task.controller.js
import * as taskService from '../services/task.service.js';
import { successResponse } from '../utils/response.js';

// ... otros controladores existentes (createTask, getTask, updateTask, etc.) ...

/**
 * Obtiene tareas paginadas aplicando filtros de seguridad por usuario.
 */
export const getTasksPaged = async (req, res, next) => {
  try {
    const userId = req.user.id; // Garantiza aislamiento de datos
    const { projectId } = req.query;

    // Validación y conversión de parámetros de paginación
    const rawPage = parseInt(req.query.page, 10);
    const rawLimit = parseInt(req.query.limit, 10);

    const page = !isNaN(rawPage) && rawPage > 0 ? rawPage : 1;
    const limit = !isNaN(rawLimit) && rawLimit > 0 ? rawLimit : 10;

    // Obtener los datos del servicio
    const result = await taskService.getPagedTasks(userId, {
      projectId,
      page,
      limit,
    });

    // Envío de respuesta con formato estandarizado
    return successResponse(
      res,
      result, // data contiene { tasks, pagination }
      'Listado de tareas paginado obtenido correctamente'
    );
  } catch (error) {
    next(error);
  }
};
```

---

## 4. Mejoras Arquitectónicas Avanzadas: Rutas Anidadas, Manejo de Errores y Seguridad (BOLA)

En la última fase del proyecto, implementamos mejoras clave de arquitectura y seguridad basadas en estándares del desarrollo moderno de APIs en Node.js.

### 4.1 Enrutamiento y Resolución Dinámica de Conflictos de Rutas

En esta API, implementamos una estructura de rutas adaptada para asociar tareas a proyectos mediante parámetros de ruta directos (`/tasks/:projectId`), cumpliendo con los requerimientos específicos del proyecto:

- **Creación Asociada (`POST /tasks/:projectId`)**: Permite crear una tarea asignada directamente al proyecto especificado en la URL. El ID del proyecto se extrae del parámetro de la ruta (`req.params.projectId`).
- **Consulta Dinámica e Híbrida (`GET /tasks/:idOrProjectId`)**: Dado que tanto la consulta de una tarea individual como el listado de tareas de un proyecto usan una estructura de parámetro de ruta en la raíz `/tasks/:id` en Express, resolvimos el conflicto de coincidencia de rutas a nivel de controlador.
  
  Cuando entra una solicitud a `GET /tasks/:id`, el controlador verifica dinámicamente si el ID corresponde a un proyecto existente del usuario. Si es así, actúa como el endpoint de listado paginado para dicho proyecto (`GET /tasks/:projectId?page=1&limit=2`). De lo contrario, procede a buscar y retornar el detalle de la tarea individual (`GET /tasks/:id`).

Esta técnica garantiza compatibilidad con la especificación de rutas requerida sin sacrificar la funcionalidad de consultar tareas individuales por su ID.

### 4.2 Manejo de Errores Asíncronos con `catchAsync`

Por defecto, Express 4 requiere que los errores en los controladores asíncronos sean capturados y pasados manualmente a la función `next(error)`. Esto suele generar bloques `try/catch` redundantes en cada controlador.

Para solucionar esto de manera elegante, implementamos el patrón decorador `catchAsync`:

```javascript
export const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
```

Este utilitario intercepta cualquier rechazo de promesa en la función controladora y lo redirige automáticamente al middleware global de errores (`errorHandler`), manteniendo el código del controlador limpio y libre de bloques repetitivos.

### 4.3 Prevención de BOLA (Broken Object Level Authorization)

La vulnerabilidad BOLA ocurre cuando una API confía ciegamente en el ID de un objeto enviado en el cuerpo o en la URL sin validar si el usuario autenticado tiene permisos sobre ese objeto.

En **TaskFlow API**, prevenimos esto validando a nivel de servicio (`task.service.js`) que el `projectId` provisto pertenezca efectivamente al `userId` logueado antes de realizar inserciones o lecturas:

```javascript
if (data.projectId) {
  const project = await projectRepository.findById(data.projectId, data.userId);
  if (!project) {
    throw new AppError('Proyecto no encontrado o acceso no autorizado', 404);
  }
}
```

Esto garantiza un aislamiento de inquilinos absoluto a nivel de datos.

---

## 5. Conclusión

Esta estructura proporciona un esquema desacoplado, escalable y altamente seguro para el manejo de recursos en **TaskFlow API**.

- El filtrado obligatorio por `userId` en las cláusulas `where` a nivel repositorio asegura que un usuario autenticado nunca pueda acceder, modificar o listar proyectos y tareas pertenecientes a otros usuarios (prevención de vulnerabilidades IDOR - _Insecure Direct Object References_).
- La paginación con `findAndCountAll()` reduce la huella en base de datos al realizar consultas optimizadas y no exponer todo el set de datos en una sola petición.
- El uso de alias y atributos delimitados en la proyección del eager loading (`include`) optimiza el tráfico de red y garantiza una respuesta JSON limpia y con fines específicos.
