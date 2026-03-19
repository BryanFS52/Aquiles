# Team Scrum Mock → Backend (Guía de limpieza)

Este módulo quedó con lógica **temporal** para trabajar sin backend.
Todo lo temporal está marcado con `MOCK-TEMP` en el código.

## 1) Activar backend sin borrar nada

En `app/components/features/teamScrum/mockData.ts`:
- Cambia:
  - `export const USE_TEAM_SCRUM_MOCK = true;`
- Por:
  - `export const USE_TEAM_SCRUM_MOCK = false;`

Con eso, la app vuelve a ejecutar la lógica real de Redux + GraphQL.

## 2) Qué puedes borrar cuando backend esté estable

### Archivo completo temporal
- `app/components/features/teamScrum/mockData.ts`

### Bloques temporales dentro de archivos
Busca y elimina bloques comentados con:
- `MOCK-TEMP START`
- `MOCK-TEMP END`
- `MOCK-TEMP`

Archivos donde están:
- `app/components/features/teamScrum/useTeamScrum.ts`
- `app/components/features/teamScrum/modalNewTeam.tsx`
- `app/(routes)/dashboard/teamScrum/page.tsx`

## 3) Qué NO borrar

Conserva toda la lógica marcada como:
- `BACKEND ORIGINAL`

Esa es la ruta funcional real (slices, dispatch, GraphQL) que usarás al conectar backend.

## 4) Validación rápida

Después de limpiar:
1. Abre Teams Scrum.
2. Verifica que carga fichas del instructor real.
3. Crea, edita y elimina un team.
4. Asigna y remueve roles.

Si algo falla, vuelve temporalmente `USE_TEAM_SCRUM_MOCK = true` mientras se corrige endpoint o payload.
