---
title: Integraciones
description: GitHub, LinkedIn, Slack, Deel, BambooHR, Google Workspace, Resource Guru, Small Improvements, GitLab, Lattice, webhooks — configuración OAuth, sincronización y mapeo de datos.
section: admin
order: 9
---

# Integraciones

Next.js SaaS AI Template puede conectarse con sistemas externos para sincronizar personas, habilidades o actividad y enriquecer perfiles. Los admins configuran **integraciones** (OAuth, API keys, webhooks) y **mapeo de datos** para que la información correcta entre y salga.

## Integraciones soportadas (resumen)

| Integración            | Uso típico                                                                          | Notas de configuración                                                   |
| ---------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| **GitHub**             | Vincular perfiles a GitHub; sincronizar repos, actividad o habilidades desde código | App OAuth; mapear identidad GitHub a persona en Next.js SaaS AI Template |
| **LinkedIn**           | Importar perfil o habilidades desde LinkedIn                                        | OAuth o API; mapeo de nombre, título, habilidades                        |
| **Slack**              | Notificaciones, bot o vinculación de identidad                                      | OAuth; webhook o token de bot para eventos                               |
| **Deel**               | Sincronizar contratistas/empleados y contratos                                      | API key; mapear entidades Deel a miembros del tenant                     |
| **BambooHR**           | Sincronizar datos de RR. HH. (nombre, título, departamento, manager)                | API key; mapear campos a persona y estructura org                        |
| **Google Workspace**   | Identidad, calendario o sincronización de directorio                                | OAuth; scope y mapeo para calendario o directorio                        |
| **Resource Guru**      | Sincronizar asignación de recursos o proyectos                                      | API; mapear proyectos/recursos a Next.js SaaS AI Template                |
| **Small Improvements** | Importar metas, 1:1s o feedback                                                     | API; mapear a OKRs, reuniones 1:1 o feedback                             |
| **GitLab**             | Similar a GitHub — repos, actividad, habilidades                                    | OAuth o token; mapear identidad y proyectos                              |
| **Lattice**            | Metas, performance o datos de engagement                                            | API; mapear a OKRs o performance según corresponda                       |
| **Webhooks**           | Eventos salientes (p. ej. persona actualizada, assessment enviado)                  | Configurar URL, secret, eventos; reintentos opcionales                   |

La disponibilidad exacta depende de tu tenant y del despliegue. Usá **Admin** → **Integraciones** para ver cuáles están habilitadas.

## Configuración OAuth

Para integraciones que usan **OAuth** (p. ej. GitHub, LinkedIn, Slack, Google):

1. **Creá una app** en el portal de desarrolladores del proveedor. Obtené **Client ID** y **Client Secret**.
2. **Configurá la redirect URI** — Usá la URL que Next.js SaaS AI Template te indica (p. ej. `https://your-tenant.saas-template.app/api/auth/callback/github`). Debe coincidir exactamente.
3. En **Admin** → **Integraciones**, seleccioná la integración e ingresá **Client ID** y **Client Secret**. Guardá.
4. **Scopes** — Solicitá solo los scopes que necesites (p. ej. leer perfil, leer repos). Documentá por qué cada scope es necesario para cumplimiento.
5. Los miembros pueden **conectar** su cuenta desde perfil o configuración; autorizan mediante la pantalla de consentimiento del proveedor.

> **Tip:** Usá una app OAuth dedicada por ambiente (p. ej. dev vs prod) y rotá los secrets si se exponen.

## Sincronización y mapeo de datos

Una vez conectada una integración:

- **Sync** — Dispará una sincronización única o programada. La integración obtiene datos (p. ej. de BambooHR o Deel) y actualiza Next.js SaaS AI Template (personas, roles, relaciones).
- **Data mapping** — Definí cómo los campos del proveedor se mapean a Next.js SaaS AI Template:
  - **Person**: ID externo → person ID; nombre, email, título, departamento → campos del perfil.
  - **Manager / 1:1**: jerarquía o relaciones del proveedor → `person_relations` (p. ej. manager, one_to_one).
  - **Custom fields**: mapeá campos específicos del proveedor a custom fields del tenant si está soportado.

El mapeo suele configurarse en la configuración de la integración (Admin → Integraciones → [Integración] → Mapping). Guardá y ejecutá un sync de prueba para verificar.

## Evidencia automática de sincronizaciones

Cada vez que una sincronización procesa a una persona, Next.js SaaS AI Template **crea automáticamente un registro de evidencia** en el perfil de esa persona. Esto proporciona un rastro de auditoría transparente de lo que se sincronizó y cuándo.

| Integración            | Título de evidencia (ejemplo)                       | Qué captura                                                                    |
| ---------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------ |
| **GitHub**             | "GitHub Profile — 25 repos, TypeScript, Python"     | Repos escaneados, lenguajes encontrados, habilidades inferidas, contribuciones |
| **Deel**               | "Deel Profile — Senior Engineer, employee"          | Título, tipo de empleo, país, zona horaria, fechas                             |
| **Resource Guru**      | "Resource Guru — 15 bookings across 3 projects"     | Reservas sincronizadas, proyectos, rango de fechas                             |
| **Small Improvements** | "Small Improvements — 5 objectives, 3 recognitions" | Objetivos creados/actualizados, reconocimientos recibidos                      |

- Los registros de evidencia aparecen en la pestaña **Evidencia** de la persona (visible para la persona y su manager).
- Cada sincronización **actualiza** la evidencia existente de esa integración en lugar de crear duplicados. La **fecha de última sincronización** siempre está actualizada.
- El tipo de evidencia se muestra como "Sincronización" en la UI.

> **Tip:** Ejecutá sincronizaciones regularmente para mantener los registros de evidencia actualizados. Cada persona puede ver su evidencia de integración junto con CVs y links subidos.

## Búsqueda semántica y embeddings

Las sincronizaciones de integraciones también contribuyen a la **búsqueda semántica** (People Finder, AI Assistant). Cuando una sincronización crea o actualiza datos:

- Las **nuevas habilidades** creadas por el sync de GitHub obtienen embeddings para búsqueda de habilidades.
- Los **perfiles de personas** actualizados por syncs de Deel o Resource Guru regeneran su embedding de perfil, para que los resultados de People Finder estén actualizados.
- Las **importaciones masivas** (habilidades, capacidades, personas) también generan embeddings automáticamente.

Esto significa que cuantas más integraciones uses, más ricos y precisos serán los resultados de People Finder y búsqueda con IA.

## Webhooks (salientes)

Los **Webhooks** envían eventos desde Next.js SaaS AI Template a tu sistema (p. ej. "person created", "assessment submitted"):

1. **Admin** → **Integraciones** → **Webhooks** (u **Outbound**).
2. **Agregar webhook** — URL, secret opcional para firmar payloads y **event types** a los que suscribirse.
3. Guardá. Next.js SaaS AI Template enviará un payload JSON por POST a la URL en cada evento seleccionado. Implementá idempotencia y verificá la firma.

Usá webhooks para mantener herramientas externas sincronizadas o para disparar flujos (p. ej. Slack, HRIS) cuando ocurran eventos clave en Next.js SaaS AI Template.
