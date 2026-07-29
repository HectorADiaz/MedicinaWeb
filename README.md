# MedicinaWeb - Documentación Técnica

## Resumen del Proyecto

**MedicinaWeb** (también conocido como "Pill Tracker") es una aplicación web de gestión médica desarrollada en React + TypeScript. Permite administrar perfiles de pacientes, medicamentos y tratamientos médicos.

---

## Stack Tecnológico

| Categoría | Tecnología | Versión |
|-----------|------------|---------|
| Framework | React | 18 |
| Lenguaje | TypeScript | 5.8.3 |
| Bundler | Vite | 6.3.5 |
| Routing | React Router DOM | 7.9.5 |
| Formularios | React Hook Form | 7.65.0 |
| Validación | Zod | 4.1.12 |
| Iconos | Lucide React | 0.577.0 |
| Package Manager | pnpm | 11.5.1 |
| Transpiler | SWC | via Vite plugin |

---

## Cómo Empezar (Setup)

### Prerrequisitos

- Node.js >= 18
- pnpm 11.5.1 (definido en `packageManager`)
- Backend corriendo en `https://localhost:5001`

### Pasos

```bash
# 1. Clonar el repositorio
git clone <url-del-repo>
cd MedicinaWeb

# 2. Crear archivo .env en la raíz
echo "VITE_API_URL=https://localhost:5001" > .env

# 3. Instalar dependencias (ejecuta verificación de seguridad)
pnpm install

# 4. Iniciar servidor de desarrollo
pnpm dev
```

### Generar Tipos del API (Opcional)

Si el backend Swagger está disponible:

```bash
pnpm generate-types
```

> **Nota**: Requiere acceso a `https://localhost:5001/swagger/v1/swagger.json`

---

## Arquitectura del Proyecto

```
MedicinaWeb/
├── public/                    # Assets estáticos
├── scripts/
│   └── verify-package-age.mjs # Script de seguridad (supply chain)
├── src/
│   ├── assets/                # SVGs y recursos
│   ├── components/
│   │   ├── common/            # Componentes reutilizables (Modal)
│   │   └── layout/            # Estructura de la aplicación
│   │       ├── Header/
│   │       ├── MainLayout/
│   │       ├── Sidebar/
│   │       └── footer/
│   ├── features/              # Módulos de funcionalidad
│   │   ├── medication/        # Gestión de medicamentos
│   │   └── person/            # Gestión de personas/pacientes
│   ├── hooks/                 # Custom hooks
│   ├── services/              # Capa de servicios (API)
│   │   └── person/
│   │       ├── IPersonProvider.ts    # Interfaz
│   │       ├── OnlinePersonProvider.ts # Implementación HTTP
│   │       ├── types.ts             # Re-exportación de tipos
│   │       └── index.ts             # Factory/Inyección
│   ├── types/                 # Tipos globales y autogenerados
│   ├── App.tsx                # Componente raíz con rutas
│   ├── main.tsx               # Punto de entrada
│   ├── index.css              # Estilos globales
│   └── vite-env.d.ts          # Tipos de Vite
├── index.html                 # HTML base
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json              # Config TS raíz (references)
├── tsconfig.app.json          # Config TS para la app
├── tsconfig.node.json         # Config TS para Node scripts
├── vite.config.ts             # Configuración de Vite
└── eslint.config.js           # Configuración de ESLint
```

---

## Convenciones y Buenas Prácticas

### TypeScript

- **Modo estricto habilitado**: `strict: true` en `tsconfig.app.json`
- **Verificación de parámetros sin usar**: `noUnusedLocals`, `noUnusedParameters`
- **Tipos derivados del API**: Los DTOs se extraen del esquema OpenAPI autogenerado
- **Uso de `import type`**: Para importaciones de solo tipos

```typescript
// Ejemplo de tipado derivado del API
import type { components } from './api-schema';
export type PersonReadDto = components["schemas"]["PersonReadDto"];
```

### Estructura de Archivos

- **Features**: Cada módulo en `src/features/{nombre}/` contiene componentes y estilos propios
- **Services**: Implementan el patrón Provider con interfaz separada
- **Hooks**: Lógica de negocio reusable en `src/hooks/`
- **Components**: Componentes genéricos en `src/components/common/`

### Patrón Provider (Dependency Inversion)

```typescript
// IPersonProvider.ts - Interfaz
export interface IPersonProvider {
  getAll(): Promise<PersonReadDto[]>;
  getById(id: number): Promise<PersonReadDto | undefined>;
  create(person: PersonCreateDto): Promise<PersonReadDto>;
  update(person: PersonUpdateDto): Promise<void>;
  delete(id: number): Promise<void>;
}

// index.ts - Inyección de dependencia
export const personProvider: IPersonProvider = OnlinePersonProvider;
```

**Beneficios**:
- Facilita testing con mocks
- Permite cambiar implementación (online/offline) sin modificar consumidores
- Separa la lógica de negocio del transporte HTTP

### Flujo de Datos

```
┌─────────────┐    ┌─────────────┐    ┌──────────────────┐    ┌─────────────┐
│  Component  │───▶│  Hook       │───▶│  Provider        │───▶│  API        │
│  (UI)       │    │  (State)    │    │  (HTTP Client)   │    │  (Backend)  │
└─────────────┘    └─────────────┘    └──────────────────┘    └─────────────┘
     │                   │                    │                      │
     │  usePeople()      │  personProvider    │  fetch()             │
     │  ←─────────────── │  .getAll()         │  ←───────────────── │
     │                   │                    │                      │
     ▼                   ▼                    ▼                      ▼
  Renderiza         Estado local         Transforma            .NET API
  datos             (useState)           respuesta             /api/Person
```

**Ejemplo completo del flujo**:

```typescript
// 1. Componente (PersonList.tsx)
const { people, isLoading } = usePeople();

// 2. Hook (usePeople.ts)
const data = await personProvider.getAll();
setPeople(data);

// 3. Provider (OnlinePersonProvider.ts)
return request<PersonReadDto[]>('/api/Person');

// 4. API Response
{ statusCode: 200, success: true, data: [...], message: null, errors: null }
```

### Custom Hooks

Los hooks encapsulan estado y lógica de negocio:

```typescript
// usePeople.ts
export function usePeople() {
  // Estado local
  const [people, setPeople] = useState<PersonReadDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Operaciones CRUD
  return { people, isLoading, error, createPerson, updatePerson, deletePerson };
}
```

### Formularios (React Hook Form)

- Uso de `useForm` con validación declarativa
- Manejo de errores con `formState.errors`
- Soporte para modo crear/editar con `initialData`
- Estados de carga con `isSubmitting`

### Manejo de Errores

```typescript
// Patrón consistente en servicios
try {
  const data = await personProvider.getAll();
  setPeople(data);
} catch (err: unknown) {
  const message = err instanceof Error ? err.message : 'Error al cargar';
  setError(message);
}
```

### API Response Wrapper

El backend usa un formato estandarizado:

```typescript
interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string | null;
  data: T;
  errors: string[] | null;
}
```

---

## Configuración del Entorno

### Variables de Entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `VITE_API_URL` | URL base del API | `https://localhost:5001` |

### Proxy de Desarrollo

En `vite.config.ts`, las peticiones a `/api` se redirigen al backend:

```typescript
server: {
  proxy: {
    '/api': {
      target: 'https://localhost:5001',
      changeOrigin: true,
      secure: false,
    },
  },
},
```

### Generación de Tipos del API

```bash
pnpm generate-types
```

Este comando usa `openapi-typescript` para generar `src/types/api-schema.ts` desde el Swagger del backend.

---

## Seguridad

### Supply Chain Protection

El script `scripts/verify-package-age.mjs` previene ataques de supply chain:

- **Verificación de antigüedad**: Bloquea paquetes publicados hace menos de 3 días
- **Solo en fresh installs**: No verifica si `node_modules/` ya existe
- **Parsing del lockfile**: Extrae versiones exactas de `pnpm-lock.yaml`

**Uso**:
```bash
# Se ejecuta automáticamente con pnpm install
pnpm install

# Para saltar verificación (no recomendado)
pnpm install --ignore-scripts
```

### TypeScript Strict Mode

Las siguientes reglas previenen errores comunes:

| Regla | Propósito |
|-------|-----------|
| `strict` | Habilita todas las verificaciones estrictas |
| `noUnusedLocals` | Detecta variables declaradas sin usar |
| `noUnusedParameters` | Detecta parámetros sin usar |
| `noFallthroughCasesInSwitch` | Previene fallthrough en switch |
| `erasableSyntaxOnly` | Solo permite sintaxis TypeScript erasable |

---

## Comandos Disponibles

| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Inicia servidor de desarrollo |
| `pnpm build` | Compila TypeScript y genera bundle de producción |
| `pnpm lint` | Ejecuta ESLint en todo el proyecto |
| `pnpm preview` | Sirve el bundle de producción localmente |
| `pnpm generate-types` | Genera tipos TypeScript desde Swagger |

---

## Paleta de Colores (CSS Variables)

```css
:root {
  --primary-blue: #007BFF;
  --primary-btn-menu: #6cabfd;
  --success-green: #2ECC71;
  --secondary-gray: #6C757D;
  --danger-red: #FF6B6B;
  --neutral-border: #A8A8A8;
  --bg-input: #FFFFFF;
  --text-main: #2D3436;
  --focus-input: #707070;
  --radius-md: 5px;
  --input-width: 400px;
}
```

---

## Rutas de la Aplicación

| Ruta | Componente | Descripción |
|------|------------|-------------|
| `/` | `DashboardView` | Dashboard principal (placeholder) |
| `/personas` | `PersonList` | Gestión de perfiles de pacientes |
| `/medicamentos` | `MedicationList` | Gestión de medicamentos (WIP) |
| `/tratamientos` | `TreatmentsView` | Gestión de tratamientos (placeholder) |
| `*` | 404 | Página no encontrada |

---

## Endpoints del API

### Persona (`/api/Person`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/Person` | Obtiene todas las personas |
| GET | `/api/Person/{id}` | Obtiene persona por ID |
| POST | `/api/Person` | Crea nueva persona |
| PUT | `/api/Person/{id}` | Actualiza persona existente |
| DELETE | `/api/Person/{id}` | Elimina persona |

### DTOs

```typescript
// PersonReadDto
{
  id: number;
  firstName: string;
  lastName: string;
  nickName: string;
  birthday: string;
  email: string;
  phone: string;
}

// PersonCreateDto
{
  firstName: string;
  lastName: string;
  nickName: string;
  birthday: string;
  email: string;
  phone: string;
}

// PersonUpdateDto
{
  id: number;
  firstName: string;
  lastName: string;
  nickName: string;
  birthday: string;
  email: string;
  phone: string;
}

// BiometricReadDto - Datos biométricos del paciente
{
  id: number;
  personId: number;
  weight: number;
  height: number;
  bloodType: string;
  notes: string;
}
```

---

## Guía para Modelos de AI

### Contexto

Esta es una aplicación médica web en desarrollo activo. El objetivo es gestión de pacientes, medicamentos y tratamientos.

### Puntos Clave para Generar Código

1. **Siempre usar TypeScript estricto**: No usar `any`, definir tipos explícitos
2. **Seguir el patrón Provider**: Crear interfaz + implementación + factory
3. **Usar React Hook Form**: Para todos los formularios
4. **Mantener separación de concerns**: Features independientes, servicios abstraídos
5. **Re-exportar tipos**: Desde `src/types/` hacia `src/services/*/types.ts`
6. **Custom hooks para lógica**: Nunca en componentes directamente
7. **CSS Modules o CSS Files**: Por componente, no inline styles

### Estructura de un Nuevo Feature

```
src/features/{nombre}/
├── {Nombre}List.tsx        # Vista principal con tabla
├── {Nombre}List.css        # Estilos de la lista
├── {Nombre}Form.tsx        # Formulario de crear/editar
├── {Nombre}Form.css        # Estilos del formulario
```

### Estructura de un Nuevo Servicio

```
src/services/{nombre}/
├── I{Nombre}Provider.ts    # Interfaz
├── Online{Nombre}Provider.ts # Implementación HTTP
├── types.ts                # Re-exportación de tipos
└── index.ts                # Factory con inyección
```

### Patrón de Error Handling

```typescript
// En hooks
try {
  await provider.action();
  return { success: true };
} catch (err: unknown) {
  const message = err instanceof Error ? err.message : 'Error genérico';
  setError(message);
  return { success: false, message };
}
```

### Patrón de Formulario

```typescript
const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
  values: initialData ? mapToForm(initialData) : defaultValues,
});
```

---

## Configuración ESLint

El proyecto usa ESLint con flat config (`eslint.config.js`):

```javascript
// Plugins habilitados
- @eslint/js (recommended)
- typescript-eslint (recommended)
- eslint-plugin-react-hooks (recommended)
- eslint-plugin-react-refresh (warn: only-export-components)
```

**Ejecutar linting**:
```bash
pnpm lint
```

---

## Troubleshooting

| Problema | Causa | Solución |
|----------|-------|----------|
| Error SSL al generar tipos | Certificado autofirmado | El script ya incluye `NODE_TLS_REJECT_UNAUTHORIZED=0` |
| Paquete bloqueado por verify-package-age | Paquete publicado hace < 3 días | Esperar 3 días o usar `pnpm install --ignore-scripts` |
| Error CORS en desarrollo | Backend no permite origen | Verificar que el backend corre en `https://localhost:5001` |
| Tipos no coinciden con API | Schema desactualizado | Ejecutar `pnpm generate-types` |
| `@types/react` incompatible | v19 instalada con React 18 | Ver sección Known Issues |

---

## Known Issues

### Incompatibilidad de Tipos React

**Problema**: `@types/react: "^19.1.2"` estaba instalado pero el proyecto usa React 18.

**Riesgo**: Los tipos de React 19 pueden incluir breaking changes no compatibles.

**Estado**: ✅ Corregido - `@types/react@18.3.31` y `@types/react-dom@18.3.7` instalados.

### Typo en Directorio

**Problema**: `src/components/layout/Siderbar/` debería ser `Sidebar/`.

**Estado**: ✅ Corregido - Directorio renombrado a `Sidebar/` e imports actualizados.

---

## Pendientes / Roadmap

- [ ] Implementar módulo de Medicamentos (CRUD completo)
- [ ] Implementar módulo de Tratamientos
- [ ] Dashboard con tomas pendientes
- [ ] Autenticación y autorización
- [ ] Tests unitarios y de integración
- [ ] Responsive design completo
- [ ] PWA support

---

## Licencia

Proyecto privado. No distribuir sin autorización.
