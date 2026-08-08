# Nexus Love System

Sistema web interactivo con autenticación por roles (Admin/VIP), timeline de recuerdos con mapa integrado, y un "Digital Vault" de mensajes con desbloqueo temporal y contextual.

## ✨ Features

- 🔐 **Auth con RBAC** — Roles Admin y VIP User, login personalizado
- 📊 **Dynamic Memory Counter** — Contador en tiempo real estilo "system uptime"
- 🗺️ **Timeline interactivo** — Mapa con pines personalizados sincronizado a tarjetas de eventos (estilo commit/changelog)
- 🔒 **Digital Vault** — Cartas "Open When..." y cápsulas temporales con countdown
- 🎮 **Easter Eggs** — Konami code, mensajes en consola, atributos ocultos en HTML
- 📱 Diseño responsivo, mobile-first

## 🛠 Stack

| Capa | Tecnología |
|---|---|
| Frontend/Backend | Next.js 14 (App Router) |
| Estilos | Tailwind CSS |
| Base de datos | MongoDB Atlas |
| ORM | Prisma |
| Auth | NextAuth.js (roles custom: admin / vip) |
| Mapas | React-Leaflet |
| Storage (fotos/videos) | Cloudinary |
| Tiempo real (countdown/contador) | Cálculo en cliente (Date.now()) |
| Despliegue | Vercel |

---

## 📋 Especificación por fases

### Fase 1 — Módulo de Autenticación y Control de Accesos (RBAC)

Dos roles de usuario para mantener la experiencia y la administración separadas:

- **Rol Admin (Tú):** acceso total. Formularios para agregar/editar eventos del timeline, subir contenido multimedia, programar cartas en el Vault y gestionar fechas de desbloqueo.
- **Rol VIP User (Ella):** experiencia inmersiva. Acceso a la lectura, apertura de cartas desbloqueadas, interacción con el mapa y desencadenamiento de Easter Eggs.

**Login personalizado:**
- Pantalla de acceso estilizada.
- Pista de contraseña basada en un chiste interno o memoria compartida.
- Animación de entrada suave al autenticarse con éxito.

---

### Fase 2 — Landing Page / Dashboard Principal (Post-Login)

Pantalla principal desplegada una vez superado el login, con los siguientes componentes:

**A. Dynamic Memory Counter ("System Uptime")**
- Ubicación: encabezado principal del Dashboard.
- Formato de visualización:
  - Header principal: `X Años, Y Meses, Z Días`
  - Sub-métrica estilo terminal: `[Total: 1,229 días de uptime continuo / 99.99% disponibilidad de amor]`
- Contador en tiempo real, con segundos transcurriendo dinámicamente.

**B. Easter Eggs integrados en la Home**
- **DevTools Console (F12):** mensaje formateado en consola del navegador con ASCII art y logs del sistema, por ejemplo:
  ```
  [SYSTEM INFO]: User authenticated as "The Most Amazing Girl".
  [STATUS]: Heart rate nominal. Love levels at maximum capacity.
  ```
- **Konami Code** (↑ ↑ ↓ ↓ ← → ← → B A): al ejecutar la secuencia en la Home, se activa un efecto especial (ej. lluvia de partículas, GIF retro o galería fotográfica secreta).
- **Atributos ocultos:** mensajes cariñosos escondidos en el código HTML (`data-custom-note="..."`) para cuando se inspeccione la página.

**C. Navegación principal (Nodos de acceso)**

Dos tarjetas/botones interactivos de gran tamaño:
1. Ir a **"Our Timeline & Map"**
2. Ir a **"The Digital Vault"**

---

### Fase 3 — Módulo 1: Interactive Timeline & Location Map

Experiencia visual e interactiva para recorrer la historia juntos.

**Integración con mapa (React-Leaflet):**
- Mapa interactivo centrado en los viajes y citas.
- Custom Markers: pines personalizados para cada lugar especial.
- Al hacer clic en un pin, el mapa hace scroll automático hacia la tarjeta del timeline correspondiente (o abre un modal interactivo).

**Estructura de las tarjetas del timeline (estilo commit):**
- Título del evento (ej. *Nuestra primera cita / feat(life): First Date*).
- Fecha y ubicación.
- Patch Notes (la historia): redacción detallada de lo sucedido ese día.
- Galería multimedia: fotos y reproductores de video embebidos.

**Capacidad de gestión (solo Admin):**
- Botón flotante **+ Agregar Nuevo Evento**.
- Formulario con subida de imágenes/videos, selector de coordenadas en el mapa y selector de fecha.
- Botón para editar cada evento del timeline.

---

### Fase 4 — Módulo 2: The Digital Vault (Cápsulas del Tiempo & Mensajes)

Baúl digital interactivo dividido en dos categorías de mensajes.

**A. Mensajes "Open When..." (disponibles por situación)**

Mapeo de emociones/momentos, por ejemplo:
- "Ábreme cuando me extrañes"
- "Ábreme cuando hayas tenido un buen día en el trabajo"
- "Ábreme cuando no puedas dormir"

Contenido al abrir: carta interactiva, video especial, nota de voz o galería de imágenes reanimantes.

**B. Cápsulas temporales (locked by date)**
- Tarjetas con temporizador inverso para fechas especiales (cumpleaños, aniversario, San Valentín).
- **Estado bloqueado:** candado con el mensaje "Disponible el [Fecha]" y cuenta regresiva; botones de apertura deshabilitados.
- **Estado desbloqueado:** se habilita automáticamente al llegar la fecha local/servidor.

**C. Capacidad de gestión (solo Admin)**
- Formulario para redactar nuevos mensajes del Vault.
- Opción para definir si el mensaje es de tipo Emocional/Libre o si requiere una Fecha de Desbloqueo Automático.
- Capacidad de editar los formularios y la fecha de desbloqueo si es necesario.

---

## 📁 Estructura del proyecto

```
/app
  /dashboard        # Home post-login, memory counter, easter eggs
  /timeline          # Módulo 1: timeline + mapa
  /vault             # Módulo 2: cartas y cápsulas
  /api               # Route handlers
/components
/lib
/models
```

## 🚧 Estado

**Fase 1 completada** — Auth + RBAC funcional.

### Setup local

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar entorno
cp .env.example .env
# Editar DATABASE_URL y NEXTAUTH_SECRET

# 3. MongoDB con replica set (requerido por Prisma para escrituras)
# Opción A — Docker:
docker compose up -d

# Opción B — MongoDB Atlas (recomendado para producción)

# 4. Sincronizar schema y seed
npx prisma db push
npm run db:seed

# 5. Desarrollo
npm run dev
```

### Credenciales de prueba (seed)

| Rol   | username           | Password   |
|-------|--------------------|------------|
| Admin | nicocarmona        | nico16783* |
| VIP   | isi                | 22022026   |

### Verificar Fase 1

```bash
npx tsx scripts/test-auth.ts
```
