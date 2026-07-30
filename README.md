# Nexus Love System

Sistema web interactivo con autenticación por roles (Admin/VIP), 
timeline de recuerdos con mapa integrado, y un "Digital Vault" de 
mensajes con desbloqueo temporal y contextual.

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
