# 📚 Booking API

API RESTful para gestión de reservas de habitaciones de hotel, construida con Node.js, Express, TypeScript y PostgreSQL.

## 🚀 Características

- ✅ Servidor Express con TypeScript
- ✅ Base de datos PostgreSQL con Neon
- ✅ ORM Drizzle para manejo de base de datos
- ✅ Migraciones de base de datos
- ✅ Variables de entorno con dotenv
- ✅ Hot reload en desarrollo con tsx
- ✅ Autenticación JWT con Argon2
- ✅ Sistema de roles (Admin/Usuario)
- ✅ Validación de datos con Zod
- ✅ CRUD completo de habitaciones
- ✅ Sistema de reservas con estados
- ✅ Manejo de errores centralizado

## 🛠️ Tecnologías

- **Runtime:** Node.js
- **Framework:** Express.js
- **Lenguaje:** TypeScript
- **Base de datos:** PostgreSQL (Neon)
- **ORM:** Drizzle ORM
- **Validación:** Zod
- **Autenticación:** JWT + Argon2
- **Package Manager:** pnpm

## 📋 Requisitos previos

Antes de comenzar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (v18 o superior)
- [pnpm](https://pnpm.io/) (v10.20.0 o superior)
- Una cuenta en [Neon](https://neon.tech/) para la base de datos PostgreSQL

## 📦 Instalación

1. Clona el repositorio:
```bash
git clone <tu-repositorio>
cd booking-api
```

2. Instala las dependencias:
```bash
pnpm install
```

3. Crea un archivo `.env` en la raíz del proyecto:
```bash
touch .env
```

4. Configura las variables de entorno (ver sección de Configuración)

## ⚙️ Configuración

Agrega las siguientes variables de entorno en tu archivo `.env`:

```env
# Servidor
PORT=3000

# Base de datos
DATABASE_URL=postgresql://usuario:password@host/database?sslmode=require

# JWT
JWT_SECRET=tu_clave_secreta_muy_segura
```

### Obtener DATABASE_URL de Neon:

1. Crea un proyecto en [Neon](https://neon.tech/)
2. Copia la cadena de conexión desde el dashboard
3. Pégala en tu archivo `.env`

## 🗄️ Base de datos

### Esquema actual

El proyecto incluye tres tablas principales:

- **users**: Gestión de usuarios con autenticación
  - id, name, email, password (hash con Argon2), is_admin

- **rooms**: Habitaciones disponibles para reservar
  - id, name, type (Normal/VIP/Presidential), price_per_night, is_available

- **bookings**: Reservas realizadas por los usuarios
  - id, user_id, room_id, start_date, end_date, status (PENDING/CONFIRMED/CANCELLED), created_at

### Ejecutar migraciones

```bash
# Generar migraciones desde el esquema
pnpm db:generate

# Aplicar migraciones a la base de datos
pnpm db:migrate
```

## 🚀 Uso

### Modo desarrollo

Inicia el servidor en modo desarrollo con hot reload:

```bash
pnpm dev
```

El servidor estará disponible en `http://localhost:3000`

### Health Check

Verifica que el servidor esté funcionando:

```bash
curl http://localhost:3000/health
```

Respuesta esperada:
```json
{
  "status": "ok"
}
```

## 🔑 API Endpoints

### Autenticación

#### Registro de usuario
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123"
}
```

#### Inicio de sesión
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "password123"
}
```

Respuesta:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Habitaciones

#### Listar todas las habitaciones
```bash
GET /api/rooms
```

#### Obtener habitación por ID
```bash
GET /api/rooms/:id
```

#### Crear habitación (requiere admin)
```bash
POST /api/rooms
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Suite 101",
  "type": "VIP",
  "price_per_night": "150.00"
}
```

### Reservas

Todas las rutas de reservas requieren autenticación.

#### Crear reserva
```bash
POST /api/bookings
Authorization: Bearer <token>
Content-Type: application/json

{
  "room_id": 1,
  "start_date": "2026-02-01T14:00:00",
  "end_date": "2026-02-05T12:00:00"
}
```

#### Listar mis reservas
```bash
GET /api/bookings
Authorization: Bearer <token>
```

#### Cancelar reserva
```bash
PATCH /api/bookings/:id
Authorization: Bearer <token>
```

## 📜 Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Inicia el servidor en modo desarrollo |
| `pnpm db:generate` | Genera archivos de migración desde el esquema |
| `pnpm db:migrate` | Aplica las migraciones a la base de datos |

## 📁 Estructura del proyecto

```
booking-api/
├── drizzle/                  # Archivos de migración generados
├── src/
│   ├── db/
│   │   ├── db.ts             # Configuración de conexión a BD
│   │   └── schema.ts         # Definición del esquema de tablas
│   ├── middleware/
│   │   ├── auth.middleware.ts    # Middleware de autenticación JWT
│   │   ├── role.middleware.ts    # Middleware de verificación de roles
│   │   └── validate.middleware.ts # Middleware de validación con Zod
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts  # Controladores de autenticación
│   │   │   ├── auth.routes.ts      # Rutas de autenticación
│   │   │   ├── auth.services.ts    # Lógica de negocio de auth
│   │   │   └── schemas/            # Esquemas de validación
│   │   ├── booking/
│   │   │   ├── booking.controller.ts  # Controladores de reservas
│   │   │   ├── booking.route.ts       # Rutas de reservas
│   │   │   ├── booking.service.ts     # Lógica de negocio de reservas
│   │   │   └── schemas/               # Esquemas de validación
│   │   └── rooms/
│   │       ├── rooms.controller.ts    # Controladores de habitaciones
│   │       ├── rooms.router.ts        # Rutas de habitaciones
│   │       ├── rooms.services.ts      # Lógica de negocio de habitaciones
│   │       └── schemas/               # Esquemas de validación
│   ├── routes/
│   │   └── main.ts           # Router principal que agrupa todas las rutas
│   ├── types/
│   │   └── express.d.ts      # Extensiones de tipos para Express
│   ├── utils/
│   │   └── errors.ts         # Utilidades para manejo de errores
│   └── app.ts                # Punto de entrada de la aplicación
├── .env                      # Variables de entorno (no incluir en git)
├── drizzle.config.ts         # Configuración de Drizzle Kit
├── package.json              # Dependencias y scripts
├── tsconfig.json             # Configuración de TypeScript
└── README.md                 # Este archivo
```

## 🔒 Seguridad

- Las contraseñas se hashean con Argon2 antes de almacenarse
- Los endpoints protegidos requieren token JWT válido
- Validación de datos de entrada con Zod
- Los tokens JWT incluyen información del usuario (id, email, is_admin)



## 📝 Licencia

ISC

---

Desarrollado con ❤️ por darthBelial
