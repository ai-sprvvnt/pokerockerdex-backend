# PokeRockerDex Backend

API propia de PokeRockerDex para administrar usuarios, autenticación y equipos personales de Pokémon.

## Estado del proyecto

Proyecto Final de Desarrollo Web de TripleTen. Actualmente se encuentra en la etapa de planificación y preparación.

## Funcionalidades previstas

- Registrar usuarios.
- Iniciar sesión mediante JWT.
- Mantener rutas protegidas.
- Crear automáticamente un equipo por usuario.
- Consultar el equipo personal.
- Editar el nombre del equipo.
- Agregar hasta seis Pokémon.
- Evitar integrantes duplicados.
- Eliminar integrantes.
- Impedir que un usuario modifique recursos ajenos.

## Endpoints previstos

### Autenticación y usuario

```text
POST /signup
POST /signin
GET  /users/me
```

### Equipo personal

```text
GET    /teams/me
PATCH  /teams/me
POST   /teams/me/members
DELETE /teams/me/members/:pokeApiId
```

## Tecnologías previstas

- Node.js
- Express
- MongoDB
- Mongoose
- JSON Web Token
- bcrypt
- Celebrate y Joi
- ESLint

## Instalación

```bash
git clone git@github.com:ai-sprvvnt/pokerockerdex-backend.git
cd pokerockerdex-backend
npm install
npm start
```

## Variables de entorno previstas

```env
PORT=
MONGODB_URI=
JWT_SECRET=
NODE_ENV=
```

Las credenciales reales no deben subirse al repositorio. Se documentarán mediante un archivo `.env.example`.

## Front-end

https://github.com/ai-sprvvnt/pokerockerdex-frontend

## API externa relacionada

El front-end utilizará PokéAPI v2 para consultar información pública de Pokémon. El back-end almacenará solamente los datos mínimos necesarios para representar el equipo del usuario.

## Aviso

PokeRockerDex es un proyecto educativo no oficial. No está afiliado, respaldado ni patrocinado por Nintendo, Game Freak, Creatures Inc. o The Pokémon Company.

Los nombres, personajes, imágenes y demás elementos relacionados con Pokémon pertenecen a sus respectivos titulares.
