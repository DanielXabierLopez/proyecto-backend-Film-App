# Guía de Trello — Movie App

Cómo usamos el tablero de Trello en el proyecto. Las tareas están en `TAREAS.md`.

## Columnas

| Columna | Qué va ahí | Cuándo pasa a la siguiente |
|---|---|---|
| **Backlog** | Todo lo pendiente del proyecto, ordenado por prioridad (lo más importante arriba) | Cuando en la planificación del sprint decidimos hacerla ahora |
| **Por hacer** | Solo las tareas del **sprint actual** | Cuando alguien se la asigna y empieza |
| **En proceso** | Lo que alguien está haciendo ahora mismo | Cuando el código está listo y se abre la PR |
| **En revisión** | Tareas con la PR abierta, pendientes de que las revise un compañero | Cuando la PR se aprueba y se mergea a `main` |
| **Hecho** | Tareas mergeadas y funcionando | Se queda ahí |

- Las tarjetas avanzan hacia la derecha. Si en la revisión sale un error, la tarjeta **vuelve a "En proceso"**.
- **Backlog ≠ Por hacer.** El Backlog es "algún día"; Por hacer es "este sprint".

## Etiquetas

Cada bloque de `TAREAS.md` tiene su etiqueta: Configuración inicial, Autenticación, Búsqueda de películas, Favoritos, Administrador — películas, Vistas generales, Usuarios y perfil, Calidad y entrega.

## Atajos útiles

Pasa el ratón por encima de una tarjeta, sin hacer clic, y pulsa:

| Tecla | Qué hace |
|---|---|
| `Espacio` | Te asigna la tarjeta o te quita de ella |
| `q` | Muestra solo tus tarjetas |
| `n` | Crea una tarjeta debajo de la que tienes el ratón |
| `1`–`9` | Pone o quita la etiqueta de ese color |
| `?` | Muestra todos los atajos |

## Normas del equipo

- **Asígnate la tarjeta antes de empezar** (`Espacio`). Así nadie hace dos veces la misma tarea.
- **Una sola tarea "En proceso" por persona.** Termina antes de empezar otra.
- **Story points en el título**, por ejemplo `[3] POST /api/logout`. Los decidimos juntos en la planificación.
- **Checklist de "Hecho" en cada tarjeta.** Una tarjeta no pasa a Hecho sin cumplirlo:
  - Test escrito antes del código (TDD)
  - Test pasando
  - Swagger actualizado (si es un endpoint)
  - PR aprobada y mergeada

## Trello + GitHub

- Activad el **Power-Up de GitHub** y enlazad la PR a su tarjeta. Quien revisa la encuentra directamente ahí.
- **Nombrad la rama como la tarea**, por ejemplo `feature/login-jwt`.
- Una tarjeta en "En revisión" **siempre** debe tener una PR enlazada.

## Hábitos Scrum

- **Daily de 10 minutos** delante del tablero. Cada uno responde: qué hice, qué voy a hacer y si algo me bloquea.
- **Planificación al empezar cada sprint:** elegimos tarjetas del Backlog y las pasamos a Por hacer.
- **Retrospectiva corta al terminar cada sprint:** qué ha funcionado y qué cambiamos.
- El tablero tiene que reflejar la realidad. Si no movemos las tarjetas, deja de servir.

> Mejor simple: miembros, etiquetas y checklists. Añadid Power-Ups o automatizaciones solo si de verdad hacen falta.
