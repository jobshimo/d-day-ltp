# D-Day en Omaha Beach — Aplicación de aprendizaje

Aplicación educativa interactiva para aprender las reglas de **D-Day at Omaha Beach** (edición Devir). Diseñada para jugadores nuevos que quieren dominar las reglas desde cero, con ejercicios prácticos y exámenes de repaso.

## Estado del proyecto

- **v1 completa** — Módulo 1 jugable de extremo a extremo, Módulo 4 como PoC de resolución de fuego.
- 156 tests (Vitest) + 12 tests E2E (Playwright). Todo verde.

## Estructura del repositorio

```
war-game/
├── apps/
│   ├── learning-app/          # Aplicación Angular 21 (cliente)
│   ├── learning-app-e2e/      # Tests E2E Playwright
│   └── api/                   # API NestJS (servicio de contenido)
├── libs/
│   ├── shared/content-schema/ # Interfaces TypeScript compartidas
│   ├── domain/course/         # Lógica de desbloqueo de módulos
│   ├── domain/drill/          # Evaluador de ejercicios (puro TS)
│   ├── domain/progress/       # Puerto ProgressRepository
│   ├── application/course-store/   # Flux store de módulos (Angular signals)
│   ├── application/drill-store/    # Flux store de ejercicios
│   ├── infrastructure/idb-adapter/ # Adaptador IndexedDB (progreso local)
│   ├── content/               # Contenido de los módulos (TypeScript)
│   └── ui/board-renderer/     # Componente SVG de tablero (Angular)
└── d-day/                     # Material fuente: reglas PDF y texto
```

## Requisitos previos

- Node.js 20+
- npm 10+

## Primeros pasos

### Instalar dependencias

```bash
npm install
```

### Levantar la aplicación

```bash
npx nx serve learning-app
```

Acceder en `http://localhost:4200`.

### Levantar la API

```bash
npx nx serve api
```

Disponible en `http://localhost:3000`. Endpoints: `GET /api/health`, `GET /api/modules`, `GET /api/modules/:id`.

## Tests

### Tests unitarios (Vitest)

```bash
# Todos los proyectos
npx nx run-many --target=test --all

# Un proyecto específico
npx nx run learning-app:test
npx nx run api:test
```

### Tests E2E (Playwright)

```bash
# Requiere la aplicación corriendo en localhost:4200
npx playwright test --config=apps/learning-app-e2e/playwright.config.ts
```

Si la aplicación no está corriendo, Playwright la inicia automáticamente vía `nx serve`.

### Build de producción

```bash
npx nx run-many --target=build --all
```

### Lint

```bash
npx nx run-many --target=lint --all
```

## Contenido del curso (v1)

| Módulo | Estado | Contenido |
|--------|--------|-----------|
| Módulo 1 — El juego y sus piezas | Completo | 3 lecciones, 3 ejercicios, examen de 5 preguntas |
| Módulo 2 — El desembarco | Stub | Solo metadatos |
| Módulo 3 — Movimiento | Stub | Solo metadatos |
| Módulo 4 — Resolución de fuego | Vista previa (PoC) | 1 lección, 1 ejercicio interactivo de selección |
| Módulos 5–8 | Stub | Solo metadatos |

## Arquitectura

Arquitectura hexagonal con capas enforzadas por etiquetas Nx:

```
ui → application → domain ← infrastructure
         ↑
       content (shared, framework-free)
```

- **Angular 21**: sin Zone.js, señales, componentes standalone.
- **Estado**: Flux stores con `signal()` y `computed()`. Sin NgRx.
- **Progreso**: IndexedDB (local-first). Puerto listo para adaptador HTTP en v2.
- **Tests**: Vitest para todo el workspace. Sin Jest, sin Karma.

## Hoja de ruta (v2)

- Contenido completo de los Módulos 2, 3, 5–8
- Persistencia de progreso en servidor (NestJS + DB)
- Autenticación y cuentas de usuario
- Integración de erratas Devir confirmadas
