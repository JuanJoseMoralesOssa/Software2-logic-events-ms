import {service} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {NotificacionesConfig} from '../config/notificaciones.config';
import {Evento} from '../models';
import {EventoRepository, InscripcionRepository, NotificacionRepository, NotificacionxInscripcionRepository, OrganizadorRepository} from '../repositories';
import {NotificacionesService} from '../services/notificaciones.service';

export class EventoController {
  constructor(
    @repository(EventoRepository)
    public eventoRepository: EventoRepository,
    @repository(InscripcionRepository)
    public inscripcionRepository: InscripcionRepository,
    @repository(NotificacionRepository)
    public notificacionRepository: NotificacionRepository,
    @repository(OrganizadorRepository)
    public organizadorRepository: OrganizadorRepository,
    @repository(NotificacionxInscripcionRepository)
    public notificacionesxInscripcionRepository: NotificacionxInscripcionRepository,
    @service(NotificacionesService)
    public servicioNotificaciones: NotificacionesService,
  ) {}

  @post('/evento')
  @response(200, {
    description: 'Evento model instance',
    content: {'application/json': {schema: getModelSchemaRef(Evento)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Evento, {
            title: 'NewEvento',
            exclude: ['id', 'numeroAsistentes'], // Ignora 'numeroAsistentes'
          }),
        },
      },
    })
    evento: Omit<Evento, 'id' | 'numeroAsistentes'>, // Eliminar 'numeroAsistentes' del tipo
  ): Promise<Evento> {
    // Verificar conflicto de lugar y horario
    const conflictingEvents = await this.eventoRepository.find({
      where: {
        lugar: evento.lugar,
        or: [
          {
            and: [
              {fechaInicio: {lte: evento.fechaFinal}},
              {fechaFinal: {gte: evento.fechaInicio}},
            ],
          },
        ],
      },
    });

    if (conflictingEvents.length > 0) {
      throw new HttpErrors.Conflict(
        'Ya existe un evento en este lugar en el mismo rango de fechas y horas.',
      );
    }

    // Verificar que el organizador no tenga otro evento en el mismo horario
    const organizerConflicts = await this.eventoRepository.find({
      where: {
        organizadorId: evento.organizadorId,
        or: [
          {
            and: [
              {fechaInicio: {lte: evento.fechaFinal}},
              {fechaFinal: {gte: evento.fechaInicio}},
            ],
          },
        ],
      },
    });

    if (organizerConflicts.length > 0) {
      throw new HttpErrors.Conflict(
        'Este organizador ya tiene un evento programado en el mismo rango de fechas y horas.',
      );
    }
    // Crear el evento si no hay conflictos
    return this.eventoRepository.create(evento);
  }

  @get('/evento/count')
  @response(200, {
    description: 'Evento model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Evento) where?: Where<Evento>): Promise<Count> {
    return this.eventoRepository.count(where);
  }

  @get('/evento')
  @response(200, {
    description: 'Array of Evento model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Evento, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Evento) filter?: Filter<Evento>): Promise<Evento[]> {
    return this.eventoRepository.find(filter);
  }

  @patch('/evento')
  @response(200, {
    description: 'Evento PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Evento, {partial: true}),
        },
      },
    })
    evento: Evento,
    @param.where(Evento) where?: Where<Evento>,
  ): Promise<Count> {
    return this.eventoRepository.updateAll(evento, where);
  }

  @get('/evento/{id}')
  @response(200, {
    description: 'Evento model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Evento, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Evento, {exclude: 'where'})
    filter?: FilterExcludingWhere<Evento>,
  ): Promise<Evento> {
    return this.eventoRepository.findById(id, filter);
  }

  @patch('/evento/{id}')
  @response(204, {
    description: 'Evento PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Evento, {partial: true}),
        },
      },
    })
    evento: Evento,
  ): Promise<void> {
    await this.eventoRepository.updateById(id, evento);
  }

  @patch('/CambioEvento/{id}')
  @response(204, {
    description: 'Evento PATCH success',
  })
  async updateId(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Evento, {partial: true}),
        },
      },
    })
    evento: Evento,
  ): Promise<void> {
    // Obtener el evento original de la base de datos
    const eventoOriginal = await this.eventoRepository.findById(id);

    // Verificar cambios en fechas
    const fechaInicioCambiada = evento.fechaInicio && evento.fechaInicio !== eventoOriginal.fechaInicio;
    const fechaFinalCambiada = evento.fechaFinal && evento.fechaFinal !== eventoOriginal.fechaFinal;

    if (fechaInicioCambiada || fechaFinalCambiada) {
      // Notificación por cambio de fechas
      const inscripciones = await this.eventoRepository.inscripcions(eventoOriginal.id).find();
      console.log(inscripciones);
      const organizador = await this.organizadorRepository.findById(eventoOriginal.organizadorId);
      for (const inscripcion of inscripciones) {
        const participante = await this.inscripcionRepository.participante(inscripcion.id);

        const datos = {
          correoDestino: participante.correo,
          nombreDestino: `${participante.primerNombre} ${participante.primerApellido}`,
          asuntoCorreo: 'Cambio de agenda',
          contenidoCorreo: `El evento "${eventoOriginal.titulo}" se dispondra en las fechas: \n
            ${evento.fechaInicio} hasta ${evento.fechaFinal} en ${eventoOriginal.lugar}.`,
        };

        const url = NotificacionesConfig.urlNotificationUpdateevento;

        try {
          await this.servicioNotificaciones.EnviarNotificacion(datos, url);
        } catch (error) {
          console.error(`Error al enviar notificación: ${error.message}`);
        }

        let notificacion =await this.notificacionRepository.create({
          asunto: 'Cambio de agenda',
          fecha: String(new Date()),
          mensaje: datos.contenidoCorreo,
          remitente: `${organizador.primerNombre} ${organizador.primerApellido}`,
          destinatario: datos.nombreDestino,
        });

        await this.notificacionesxInscripcionRepository.create({
          notificacionId: notificacion.id,
          inscripcionId: inscripcion.id,
        });

      }
    } else {
      // Notificación para otros cambios (anuncio)
      const inscripciones = await this.eventoRepository.inscripcions(eventoOriginal.id).find();
      const organizador = await this.eventoRepository.organizador(evento.id);

      for (const inscripcion of inscripciones) {
        const participante = await this.inscripcionRepository.participante(inscripcion.id);

        const datos = {
          correoDestino: participante.correo,
          nombreDestino: `${participante.primerNombre} ${participante.primerApellido}`,
          asuntoCorreo: 'Actualización de evento',
          contenidoCorreo: `El evento "${evento.titulo}" ha sido actualizado. Por favor, revisa los cambios recientes en la plataforma.`,
        };

        const url = NotificacionesConfig.urlNotificationUpdateevento;

        try {
          await this.servicioNotificaciones.EnviarNotificacion(datos, url);
        } catch (error) {
          console.error(`Error al enviar notificación: ${error.message}`);
        }

        let notificacion =await this.notificacionRepository.create({
          fecha: String(new Date()),
          asunto: 'Anuncio',
          mensaje: datos.contenidoCorreo,
          remitente: `${organizador.primerNombre} ${organizador.primerApellido}`,
          destinatario: datos.nombreDestino,
        });

        await this.notificacionesxInscripcionRepository.create({
          notificacionId: notificacion.id,
          inscripcionId: inscripcion.id,
        });
      }
    }

    // Actualizar el evento en la base de datos
    await this.eventoRepository.updateById(id, evento);
  }


  @put('/evento/{id}')
  @response(204, {
    description: 'Evento PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() evento: Evento,
  ): Promise<void> {
    await this.eventoRepository.replaceById(id, evento);
  }

  @del('/evento/{id}')
  @response(204, {
    description: 'Evento DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    // Eliminar inscripciones antes de eliminar el evento
    const inscripciones = await this.inscripcionRepository.find({
      where: {eventoId: id},
    });
    for (const inscripcion of inscripciones) {
      await this.inscripcionRepository.deleteById(inscripcion.id!);
    }
    await this.eventoRepository.deleteById(id);
  }
}
