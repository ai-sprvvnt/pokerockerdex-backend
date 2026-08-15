# PokeRockerDex Backend

API propia de **PokeRockerDex**, una aplicación full stack desarrollada como Proyecto Final de Desarrollo Web de TripleTen.

## Estado actual

La **Etapa 1** está aprobada y cerrada. La **Etapa 2 — Back-end** está implementada, validada localmente y desplegada en producción.

El backend definitivo incluye:

- infraestructura de desarrollo configurada;
- MongoDB y Mongoose integrados;
- modelos `User` y `Pokemon`;
- validación con Celebrate/Joi;
- manejo centralizado de errores;
- `POST /signup` con bcrypt;
- `POST /signin` con JWT;
- middleware de autorización;
- `GET /users/me`;
- `GET /teams` persistente por usuario;
- `POST /teams/pokemon` persistente por usuario;
- máximo 6 Pokémon;
- prevención de duplicados por usuario;
- `DELETE /teams/pokemon/:id` por `_id` MongoDB;
- ownership validado con respuesta 403;
- logging JSON en `request.log` y `error.log`;
- Helmet y rate limiting;
- configuración `trust proxy` para producción detrás de Nginx;
- servidor Node ligado a `127.0.0.1` en producción;
- backend definitivo desplegado con PM2;
- HTTPS validado públicamente;
- estado de PM2 persistido mediante `pm2 save`.

## Scripts

```bash
npm start
npm run dev
npm run lint
```

En desarrollo:

```text
http://localhost:3000
```

El puerto puede sobrescribirse mediante `process.env.PORT`.

## Variables de entorno

En desarrollo la aplicación funciona sin `.env`.

Producción utiliza:

```text
NODE_ENV=production
PORT=3001
DB_ADDRESS=mongodb://127.0.0.1:27017/pokerockerdex
JWT_SECRET=<secreto productivo>
```

`.env` está ignorado por Git y en la VM se mantiene con permisos restrictivos.

## Autenticación

### Registro

```http
POST /signup
```

Ejemplo:

```json
{
  "email": "usuario@example.com",
  "password": "Password123!",
  "name": "Felipe"
}
```

Respuesta exitosa:

```text
201 Created
```

La contraseña se almacena mediante bcrypt y no se devuelve al cliente.

### Inicio de sesión

```http
POST /signin
```

Ejemplo:

```json
{
  "email": "usuario@example.com",
  "password": "Password123!"
}
```

Respuesta:

```json
{
  "token": "<jwt>"
}
```

El JWT contiene `_id` del usuario y utiliza expiración de siete días.

## Autorización

Las rutas protegidas esperan:

```http
Authorization: Bearer <JWT>
```

Sin JWT válido:

```text
401 Unauthorized
```

Rutas públicas:

```text
POST /signup
POST /signin
```

Rutas protegidas:

```text
GET    /users/me
GET    /teams
POST   /teams/pokemon
DELETE /teams/pokemon/:id
```

## Usuario actual

```http
GET /users/me
Authorization: Bearer <JWT>
```

Respuesta:

```json
{
  "_id": "...",
  "email": "usuario@example.com",
  "name": "Felipe"
}
```

La contraseña nunca se expone en la respuesta.

## Recurso Pokémon

Modelo:

```text
pokemonId
name
image
types
owner
```

`pokemonId` corresponde a PokéAPI.

`_id` corresponde al documento MongoDB.

Existe un índice compuesto único:

```text
owner + pokemonId
```

para impedir duplicados dentro del equipo de un mismo usuario.

## Equipo persistente

### Obtener equipo

```http
GET /teams
Authorization: Bearer <JWT>
```

Los resultados se filtran por:

```text
owner = req.user._id
```

Respuesta:

```json
{
  "pokemon": [
    {
      "_id": "...",
      "id": 25,
      "name": "pikachu",
      "image": "...",
      "types": ["electric"]
    }
  ],
  "teamSize": 1,
  "maxTeamSize": 6
}
```

El campo `id` mantiene compatibilidad con el frontend y representa el ID de PokéAPI.

### Agregar Pokémon

```http
POST /teams/pokemon
Authorization: Bearer <JWT>
Content-Type: application/json
```

Ejemplo:

```json
{
  "id": 25,
  "name": "Pikachu",
  "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
  "types": ["Electric"]
}
```

Reglas:

- máximo 6 Pokémon;
- sin duplicados dentro del mismo usuario;
- el mismo Pokémon puede existir en equipos de usuarios distintos;
- persistencia real en MongoDB;
- nombre y tipos normalizados.

### Eliminar Pokémon

```http
DELETE /teams/pokemon/:id
Authorization: Bearer <JWT>
```

`:id` debe ser el `_id` MongoDB del documento.

Comportamiento:

```text
propio       -> 200
inexistente  -> 404
ajeno        -> 403
id inválido  -> 400
sin JWT      -> 401
```

El controlador verifica ownership antes de eliminar.

## Validación

Celebrate/Joi valida las solicitudes antes del controlador.

Validaciones disponibles:

```text
validateSignup
validateSignin
validateCreatePokemon
validatePokemonId
```

Mongoose aplica una segunda capa de validación al persistir.

## Errores

La API utiliza manejo centralizado y clases de error para:

```text
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
500 Internal Server Error
```

Los errores internos de Node.js o MongoDB no se envían directamente al cliente.

## Logging

La API genera:

```text
request.log
error.log
```

Características validadas:

- salida JSON válida;
- solicitudes HTTP registradas;
- errores registrados;
- archivos `.log` ignorados por Git;
- no se registran `Authorization`, Bearer tokens, contraseñas ni cookies.

## Seguridad HTTP

Se integraron:

- `helmet`;
- `express-rate-limit`;
- límite de 100 solicitudes por 15 minutos;
- headers estándar de rate limit;
- `X-Powered-By` eliminado;
- `trust proxy = 1` únicamente en producción;
- Node ligado a `127.0.0.1`, dejando Nginx como punto público de entrada.

## QA local confirmado

```text
/signup válido                         201
/signup duplicado                      409
/signup inválido                       400
/signin válido                         200 + JWT
/signin credenciales incorrectas       401
/signin inválido                       400
/users/me sin token                    401
/users/me con token válido             200
/users/me token inválido               401
/teams sin token                       401
GET /teams MongoDB                     200
POST /teams/pokemon                    201
duplicado mismo usuario                409
mismo Pokémon en usuario distinto      201
aislamiento por owner                  OK
máximo 6                               OK
séptimo Pokémon                        409
persistencia tras reinicio             OK
payload Pokémon inválido               400
DELETE propio                          200
DELETE inexistente                     404
DELETE ajeno                           403
DELETE id inválido                     400
ownership preserva recurso ajeno       OK
request.log JSON                       OK
error.log JSON                         OK
secretos en logs                       NO
Helmet                                 OK
rate limiter                           429 validado
npm audit                              0 vulnerabilidades
```

## QA HTTPS confirmado

Backend definitivo:

```text
https://api.sprvvnt.mooo.com
```

Validaciones públicas ejecutadas:

```text
GET /teams sin JWT                     401
POST /signup                           201
POST /signup duplicado                 409
POST /signin                           JWT válido
GET /users/me                          200
GET /teams usuario nuevo               200
POST /teams/pokemon                    201
GET /teams persistente                 200
DELETE /teams/pokemon/:id              200
GET /teams posterior                   teamSize 0
Helmet                                 OK
RateLimit                              OK
X-Powered-By                           ausente
request.log / error.log                JSON válido
secretos en logs                       NO
PM2                                    online
```

## Producción

Infraestructura:

```text
Internet
   ↓
Nginx :443
   ↓
127.0.0.1:3001
   ↓
PM2: pokerockerdex-api
   ↓
Node / Express
   ↓
MongoDB 127.0.0.1:27017
```

Componentes confirmados:

- Google Cloud VM;
- Ubuntu 22.04;
- Node.js 24.18.0;
- npm 11.16.0;
- MongoDB 7.0.37;
- Nginx;
- HTTPS con Certbot;
- PM2;
- `pokerockerdex-api` online;
- estado de procesos guardado en `~/.pm2/dump.pm2`.

Dominios:

```text
Frontend: https://sprvvnt.mooo.com
API:      https://api.sprvvnt.mooo.com
```

## Git — commits relevantes de Etapa 2

```text
bc42faf chore: configurar infraestructura de desarrollo del backend
d3c30e8 feat: configurar conexion con MongoDB
b46f50c feat: agregar modelo de usuario
d041241 feat: agregar modelo de pokemon
2db38bb feat: agregar validacion y manejo centralizado de errores
f820010 feat: implementar registro de usuarios
90eb892 feat: implementar inicio de sesion con JWT
b0c3066 feat: agregar autorizacion y usuario actual
c6c2be5 feat: persistir equipo de pokemon en MongoDB
45e6e61 feat: agregar eliminacion de pokemon con ownership
c44da4a feat: agregar logging de solicitudes y errores
86a169b feat: agregar medidas de seguridad al backend
5979ffb chore: corregir formato de editorconfig
a6d69f7 fix: configurar proxy seguro para produccion
3a2b0ba refactor: simplificar exportacion de configuracion
```

## Estado de entrega

La implementación de la Etapa 2 está preparada para revisión académica de TripleTen. El merge a `main` se realizará únicamente después de recibir la aprobación correspondiente.

## Aviso

PokeRockerDex es un proyecto educativo no oficial. No está afiliado, respaldado ni patrocinado por Nintendo, Game Freak, Creatures Inc. o The Pokémon Company.

Los nombres, personajes, imágenes y demás elementos relacionados con Pokémon pertenecen a sus respectivos titulares.

## Autor

[Felipe García](https://github.com/ai-sprvvnt)
