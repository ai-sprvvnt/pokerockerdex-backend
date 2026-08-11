# PokeRockerDex Backend

API propia de **PokeRockerDex**, una aplicación full stack desarrollada como Proyecto Final de Desarrollo Web de TripleTen.

## Estado del proyecto

El backend definitivo de PokeRockerDex se desarrollará formalmente en la **Etapa 2 — Back-end**.

Durante la corrección de la **Etapa 1.2 — Integración con API** se implementó una API mínima temporal con Node.js y Express para cubrir un flujo real de escritura solicitado en la primera revisión de TripleTen y conectar la vista de equipo del frontend con un servidor propio.

Esta implementación temporal permite:

- consultar el equipo actual;
- agregar Pokémon mediante una solicitud POST real;
- validar los datos recibidos;
- impedir Pokémon duplicados;
- limitar el equipo a un máximo de seis integrantes.

Los datos se almacenan **en memoria** y se pierden cuando se reinicia el proceso Node. Esta limitación es intencional para la Etapa 1.2; la persistencia definitiva mediante MongoDB pertenece a una etapa posterior.

## API temporal disponible

### Consultar el equipo

```http
GET /teams
```

Respuesta de ejemplo:

```json
{
  "pokemon": [],
  "teamSize": 0,
  "maxTeamSize": 6
}
```

### Agregar un Pokémon

```http
POST /teams/pokemon
Content-Type: application/json
```

Cuerpo esperado:

```json
{
  "id": 25,
  "name": "pikachu",
  "image": "https://example.com/pikachu.png",
  "types": ["electric"]
}
```

Respuesta exitosa:

```text
201 Created
```

## Validaciones actuales

Para aceptar un Pokémon, el backend comprueba que:

- el cuerpo sea un objeto válido;
- `id` sea un entero positivo;
- `name` sea un string no vacío;
- `image` sea un string;
- `types` sea un array con al menos un tipo válido.

Reglas del equipo:

- máximo 6 Pokémon;
- no se permiten IDs duplicados.

Códigos usados actualmente:

```text
200  consulta correcta del equipo
201  Pokémon agregado correctamente
400  payload inválido
409  Pokémon duplicado o equipo lleno
```

## Persistencia temporal

El equipo se mantiene en un array en memoria dentro del proceso Node.

```text
reinicio del servidor
        ↓
el equipo vuelve a estar vacío
```

No debe interpretarse como la persistencia definitiva del proyecto.

## Tecnologías actuales

- Node.js
- Express 5
- CORS
- JavaScript CommonJS

Las tecnologías de la Etapa 2 —como MongoDB, Mongoose, JWT, bcrypt, validación avanzada, logging y manejo centralizado de errores— todavía no forman parte de esta implementación temporal.

## Instalación

Clona el repositorio:

```bash
git clone git@github.com:ai-sprvvnt/pokerockerdex-backend.git
cd pokerockerdex-backend
```

Instala dependencias:

```bash
npm install
```

Inicia el servidor:

```bash
npm start
```

Por defecto el servidor utiliza:

```text
http://localhost:3001
```

También puede recibir el puerto mediante:

```text
process.env.PORT
```

## Estructura actual relevante

```text
pokerockerdex-backend/
├── app.js
├── package.json
└── routes/
    └── teams.js
```

## Integración con el frontend

Repositorio:

https://github.com/ai-sprvvnt/pokerockerdex-frontend

El frontend utiliza un cliente separado:

```text
src/utils/MainApi.js
```

Flujo temporal de Etapa 1.2:

```text
PokéAPI GET
   ↓
PokemonDetail
   ↓
POST /teams/pokemon
   ↓
PokeRockerDex Backend
   ↓
GET /teams
   ↓
/my-team
```

## Próxima evolución — Etapa 2

La API temporal no sustituye el backend definitivo.

En la Etapa 2 se desarrollará la arquitectura full stack prevista, incluyendo al menos:

- modelo de usuario;
- modelo persistente para los datos/equipo;
- MongoDB y Mongoose;
- registro de usuarios;
- inicio de sesión;
- JWT;
- autorización;
- persistencia por usuario;
- endpoints GET, POST y DELETE definitivos;
- validación de solicitudes;
- manejo centralizado de errores;
- logging;
- configuración segura mediante variables de entorno;
- despliegue mediante HTTPS.

Los nombres y rutas definitivos se cerrarán contra los criterios oficiales de la Etapa 2 antes de comenzar su implementación.

## Deploy

La API temporal se utiliza actualmente durante el desarrollo y las pruebas de la corrección de Etapa 1.2.

El despliegue full stack definitivo se realizará en una etapa posterior junto con la implementación persistente y la configuración de producción.

## Aviso

PokeRockerDex es un proyecto educativo no oficial. No está afiliado, respaldado ni patrocinado por Nintendo, Game Freak, Creatures Inc. o The Pokémon Company.

Los nombres, personajes, imágenes y demás elementos relacionados con Pokémon pertenecen a sus respectivos titulares.

## Autor

[Felipe García](https://github.com/ai-sprvvnt)
