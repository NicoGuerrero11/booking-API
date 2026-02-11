# 📚 Booking API

API RESTful para gestión de reservas de habitaciones de hotel, construida con Node.js, Express, TypeScript y PostgreSQL.

## ✨ Características Principales

- ✅ **Documentación interactiva** con Swagger/OpenAPI
- ✅ **Paginación** en listados de habitaciones y reservas
- ✅ **Tests automatizados** con Jest (14 tests passing)
- ✅ **Autenticación JWT** con Argon2
- ✅ **Sistema de roles** (Admin/Usuario)
- ✅ **Validación de datos** con Zod
- ✅ **PostgreSQL Serverless** con Neon
- ✅ **Validación de fechas** con detección de solapamiento
- ✅ **TypeScript** con hot reload

## 🛠️ Stack Tecnológico

| Categoría | Tecnología |
|-----------|------------|
| **Runtime** | Node.js 20+ |
| **Framework** | Express.js |
| **Lenguaje** | TypeScript |
| **Base de datos** | Neon (PostgreSQL Serverless) |
| **ORM** | Drizzle ORM |
| **Validación** | Zod |
| **Autenticación** | JWT + Argon2 |
| **Documentación** | Swagger/OpenAPI 3.0 |
| **Testing** | Jest + Supertest |
| **Package Manager** | pnpm |

## 🏗️ Arquitectura

### Diagrama de Flujo
```
┌─────────────────────────────────────────────────────────────┐
│                      BOOKING API                            │
│                    Arquitectura REST                        │
└─────────────────────────────────────────────────────────────┘

                         ┌──────────────┐
                         │   Cliente    │
                         │  (Browser/   │
                         │   Postman)   │
                         └──────┬───────┘
                                │
                         HTTP/JSON
                                │
                                ▼
                    ┌───────────────────────┐
                    │   Express Server      │
                    │   (Port 3000)         │
                    │                       │
                    │  Middleware Stack:    │
                    │  ├─ express.json()    │
                    │  ├─ CORS              │
                    │  ├─ authMiddleware    │
                    │  ├─ roleMiddleware    │
                    │  └─ validateBody      │
                    └───────────┬───────────┘
                                │
                ┌───────────────┼───────────────┐
                │               │               │
                ▼               ▼               ▼
        ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
        │    Auth      │ │    Rooms     │ │   Bookings   │
        │   Module     │ │   Module     │ │    Module    │
        │              │ │              │ │              │
        │ • Register   │ │ • List (GET) │ │ • Create     │
        │ • Login      │ │ • Create     │ │ • List       │
        │ • JWT Gen    │ │ • Update     │ │ • Cancel     │
        │              │ │ • Delete     │ │ • Validate   │
        └──────┬───────┘ └──────┬───────┘ └──────┬───────┘
               │                │                │
               └────────────────┼────────────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │    Drizzle ORM        │
                    │                       │
                    │  • Query Builder      │
                    │  • Type Safety        │
                    │  • Migrations         │
                    └───────────┬───────────┘
                                │
                         PostgreSQL
                                │
                                ▼
                    ┌───────────────────────┐
                    │   Neon PostgreSQL     │
                    │   (Serverless)        │
                    │                       │
                    │  Tables:              │
                    │  ├─ users             │
                    │  ├─ rooms             │
                    │  └─ bookings          │
                    └───────────────────────┘
```

### Flujo de Request

**1. Request Incoming**
```
Cliente → HTTP Request → Express Server
```

**2. Middleware Processing**
```
Request → JSON Parser → CORS → Auth Verify → Role Check → Validation
```

**3. Business Logic**
```
Controller → Service Layer → Business Rules
```

**4. Database Access**
```
Service → Drizzle ORM → SQL Query → Neon PostgreSQL
```

**5. Response**
```
Database → ORM → Service → Controller → JSON Response → Cliente
```

### Ejemplo: Crear una Reserva
```
1. POST /api/bookings
   ↓
2. authMiddleware verifica JWT ✅
   ↓
3. validateBody verifica datos con Zod ✅
   ↓
4. booking.controller recibe request
   ↓
5. booking.service.createBooking()
   ├─ Verifica que habitación existe
   ├─ Verifica disponibilidad
   ├─ Detecta solapamiento de fechas
   └─ Crea reserva
   ↓
6. Drizzle ORM ejecuta INSERT
   ↓
7. Neon PostgreSQL guarda en DB
   ↓
8. Response: { booking: {...}, message: "..." }
```

### Características por Capa

**🔐 Seguridad**
- JWT con expiración de 7 días
- Contraseñas hasheadas con Argon2
- Middleware de roles (Admin/Usuario)
- Validación de entrada con Zod

**🚀 Performance**
- Paginación en endpoints de listado
- Índices en columnas frecuentes
- Connection pooling con Neon

**🧪 Calidad**
- 14 tests automatizados
- Cobertura de casos críticos
- Validación de solapamiento de fechas

**📚 Documentación**
- Swagger UI interactiva
- Ejemplos en cada endpoint
- Schemas reutilizables

## 📋 Requisitos Previos

- [Node.js](https://nodejs.org/) v18 o superior
- [pnpm](https://pnpm.io/) v10.20.0 o superior
- Cuenta en [Neon](https://neon.tech/) (PostgreSQL serverless)

## 🚀 Inicio Rápido

### 1. Clonar e instalar
```bash
git clone https://github.com/NicoGuerrero11/booking-API.git
cd booking-API
pnpm install
```

### 2. Configurar variables de entorno
```bash
cp .env.example .env
```

Edita `.env` con tus credenciales:
```env
PORT=3000
DATABASE_URL=postgresql://user:pass@ep-xxx.neon.tech/dbname?sslmode=require
JWT_SECRET=your-super-secret-jwt-key-change-this
```

### 3. Inicializar base de datos
```bash
pnpm db:push
```

### 4. Iniciar servidor
```bash
pnpm dev
```

### 5. Explorar la API

- **API Base**: http://localhost:3000
- **Swagger Docs**: http://localhost:3000/api-docs 📚
- **Health Check**: http://localhost:3000/health

## 📚 Documentación API (Swagger)

Este proyecto incluye documentación **interactiva y ejecutable** con Swagger UI.

### Acceder a Swagger

Inicia el servidor y visita: **http://localhost:3000/api-docs**

### Características de Swagger

- ✅ **Interfaz interactiva**: Prueba endpoints sin Postman
- ✅ **Autenticación JWT**: Click en "Authorize" y pega tu token
- ✅ **Ejemplos de requests**: Cada endpoint tiene ejemplos listos
- ✅ **Respuestas documentadas**: Ver códigos 200, 400, 401, 404, etc.
- ✅ **Schemas reutilizables**: User, Room, Booking

### Probar en Swagger

1. **Registrarse**: POST `/api/auth/register`
2. **Hacer login**: POST `/api/auth/login` → Copiar token
3. **Autorizar**: Click en "Authorize" 🔒 → Pegar token
4. **Probar endpoints protegidos**: GET `/api/bookings`, POST `/api/rooms`, etc.

## 🗄️ Base de Datos

### PostgreSQL con Neon

Este proyecto usa **[Neon](https://neon.tech)** - PostgreSQL Serverless.

**¿Por qué Neon?**
- ✅ Serverless (sin administrar servidores)
- ✅ Escalado automático
- ✅ Setup en segundos
- ✅ Free tier generoso (512 MB, 10 branches)
- ✅ Branching (como Git pero para tu DB)

### Obtener DATABASE_URL

1. Crea cuenta en [Neon](https://neon.tech)
2. Crea un proyecto
3. Copia la connection string
4. Pégala en `.env`
5. Ejecuta `pnpm db:push`

### Schema
```sql
users
├─ id (serial, PK)
├─ name (varchar)
├─ email (varchar, unique)
├─ password (varchar, hashed with Argon2)
└─ is_admin (boolean)

rooms
├─ id (serial, PK)
├─ name (varchar)
├─ type (enum: Normal, VIP, Presidential)
├─ price_per_night (numeric)
└─ is_available (boolean)

bookings
├─ id (serial, PK)
├─ user_id (int, FK → users)
├─ room_id (int, FK → rooms)
├─ start_date (timestamp)
├─ end_date (timestamp)
├─ status (enum: PENDING, CONFIRMED, CANCELLED)
└─ created_at (timestamp)
```

## 🔌 API Endpoints

### 📖 Autenticación

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/api/auth/register` | Registrar nuevo usuario | No |
| POST | `/api/auth/login` | Iniciar sesión (retorna JWT) | No |

### 🏠 Habitaciones

| Método | Ruta | Descripción | Auth | Rol |
|--------|------|-------------|------|-----|
| GET | `/api/rooms` | Listar habitaciones (con paginación) | No | - |
| GET | `/api/rooms/:id` | Obtener habitación por ID | No | - |
| POST | `/api/rooms` | Crear habitación | Sí | Admin |
| PUT | `/api/rooms/:id` | Actualizar habitación | Sí | Admin |
| DELETE | `/api/rooms/:id` | Eliminar habitación | Sí | Admin |

### 📅 Reservas

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| GET | `/api/bookings` | Listar mis reservas (con paginación) | Sí |
| POST | `/api/bookings` | Crear reserva | Sí |
| GET | `/api/bookings/:id` | Obtener reserva por ID | Sí |
| PATCH | `/api/bookings/:id` | Cancelar reserva | Sí |

## 📄 Paginación

Los endpoints `GET /api/rooms` y `GET /api/bookings` soportan paginación.

### Parámetros

| Parámetro | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| `page` | number | 1 | Número de página |
| `limit` | number | 10 | Items por página (máx: 100) |

### Filtros adicionales

**GET /api/rooms:**
- `type`: Normal, VIP, Presidential
- `available`: true, false

**GET /api/bookings:**
- `status`: PENDING, CONFIRMED, CANCELLED

### Ejemplos
```bash
# Página 1, 10 items
GET /api/rooms?page=1&limit=10

# Solo habitaciones VIP disponibles
GET /api/rooms?type=VIP&available=true

# Mis reservas confirmadas, página 2
GET /api/bookings?status=CONFIRMED&page=2&limit=5
```

### Respuesta
```json
{
  "data": [
    { "id": 1, "name": "Suite 101", ... },
    { "id": 2, "name": "Suite 102", ... }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

## 🧪 Testing

Este proyecto incluye una suite de tests automatizados con Jest.

### Ejecutar tests
```bash
# Todos los tests
pnpm test
```

### Coverage
```
Test Suites: 3 passed, 3 total
Tests:       14 passed, 14 total
```

**Módulos testeados:**
- ✅ **Auth middleware** (3 tests)
  - Verificación de tokens
  - Flujo register → login → endpoint protegido
  - Rechazo de tokens inválidos

- ✅ **Rooms endpoints** (4 tests)
  - Paginación
  - Filtros (type, available)
  - Estructura de respuesta

- ✅ **Bookings** (7 tests)
  - Creación de reservas
  - Validación de fechas
  - **Detección de solapamiento** (crítico)
  - Reservas consecutivas
  - Autenticación

## 📜 Scripts Disponibles
```bash
pnpm dev          # Desarrollo con hot reload
pnpm build        # Compilar TypeScript
pnpm start        # Iniciar en producción
pnpm test         # Ejecutar tests
pnpm db:push      # Aplicar schema a DB
pnpm db:generate  # Generar migraciones desde el esquema
pnpm db:migrate   # Aplicar migraciones a la DB
pnpm db:studio    # Abrir Drizzle Studio (GUI)
```

## 📁 Estructura del Proyecto
```
booking-API/
├── src/
│   ├── db/
│   │   ├── db.ts                    # Conexión a Neon
│   │   └── schema.ts                # Schema de Drizzle
│   ├── middleware/
│   │   ├── auth.middleware.ts       # JWT auth
│   │   ├── role.middleware.ts       # Role-based access
│   │   └── validate.middleware.ts   # Zod validation
│   ├── modules/
│   │   ├── auth/                    # Auth module
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.routes.ts
│   │   │   ├── auth.services.ts
│   │   │   └── schemas/
│   │   ├── rooms/                   # Rooms module
│   │   │   ├── rooms.controller.ts
│   │   │   ├── rooms.router.ts
│   │   │   ├── rooms.services.ts
│   │   │   └── schemas/
│   │   └── booking/                 # Bookings module
│   │       ├── booking.controller.ts
│   │       ├── booking.route.ts
│   │       ├── booking.service.ts
│   │       └── schemas/
│   ├── routes/
│   │   └── main.ts                  # Main router
│   ├── test/                        # Test suite
│   │   ├── auth.middleware.test.ts
│   │   ├── rooms.test.ts
│   │   └── bookings.test.ts
│   ├── types/
│   │   └── express.d.ts             # Type extensions
│   ├── swagger.ts                   # Swagger config
│   ├── app.ts                       # Express app
│   └── server.ts                    # Entry point
├── .env.example                     # Environment template
├── package.json
├── tsconfig.json
└── README.md
```

## 🔒 Seguridad

- 🔐 Contraseñas hasheadas con **Argon2** (más seguro que bcrypt)
- 🎫 Autenticación con **JWT** (tokens válidos por 7 días)
- ✅ Validación de datos con **Zod**
- 🛡️ Middleware de roles (Admin/Usuario)

## 🔗 Enlaces Útiles

- [Swagger Docs](http://localhost:3000/api-docs) - Documentación interactiva
- [Neon Console](https://console.neon.tech/) - Administrar tu DB
- [Drizzle Studio](https://orm.drizzle.team/drizzle-studio/overview) - GUI para DB

## 📝 Licencia

ISC

---

⭐ **Desarrollado con ❤️ por [Nico Guerrero](https://github.com/NicoGuerrero11)**