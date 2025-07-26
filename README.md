## About project

### Descripción General
Este proyecto consiste en una plataforma integral para la gestión de canchas de fútbol y organización de eventos deportivos. El sistema permite la interacción entre tres tipos de usuarios: dueños de canchas, organizadores de torneos y jugadores, cada uno con funcionalidades específicas que responden a sus necesidades dentro del ecosistema deportivo amateur.

El objetivo de la plataforma es facilitar la reserva y administración de canchas, la organización de torneos y la participación de jugadores en partidos de manera sencilla, eficiente y centralizada.

### Funcionalidades por Rol
#### Dueños de Canchas

  * Publicación de canchas con detalles e imágenes.
  * Activación o desactivación de la visibilidad de cada cancha.
  * Configuración de disponibilidad horaria por día de la semana.
  * Gestión de reservas: aceptar, cancelar u ocupar franjas horarias manualmente.

#### Organizadores de Torneos
  * Creación de torneos personalizados con reglas y formato propio.
  * Reserva de canchas para las distintas fechas del torneo.
  * Generación automática o manual del fixture.
  * Gestión de inscripciones y equipos participantes.

#### Jugadores
  * Creación de equipos y gestión de sus integrantes.
  * Inscripción a torneos con su equipo.
  * Reserva de canchas para partidos amistosos.
  * Participación en partidos de dos tipos:
  * Partidos cerrados: se definen previamente los equipos participantes.
  * Partidos abiertos: cualquier jugador puede inscribirse individualmente para completar los cupos.

## Ejecución

### Dependencias
  * Docker
  * Docker-compose

Para poder probar el proyecto se deben ejecutar los siguientes comandos:
```bash
docker-compose build
docker-compose up
```

### Tecnologías Utilizadas

Backend: Spring
Frontend: React
Base de datos: PostgreSQL
Autenticación: JWT

Este proyecto se encuentra bajo la licencia MIT.
