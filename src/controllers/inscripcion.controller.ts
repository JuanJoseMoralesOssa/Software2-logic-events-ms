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
import {Inscripcion} from '../models';
import {
  CertificadoRepository,
  EventoRepository,
  FeedbackRepository,
  InscripcionRepository,
  NotificacionRepository,
  NotificacionxInscripcionRepository,
  ParticipanteRepository,
} from '../repositories';
import {LogicaNegocioService, NotificacionesService} from '../services';

export class InscripcionController {
  constructor(
    @repository(InscripcionRepository)
    public inscripcionRepository: InscripcionRepository,
    @repository(CertificadoRepository)
    public certificadoRepository: CertificadoRepository,
    @repository(FeedbackRepository)
    public feedbackRepository: FeedbackRepository,
    @repository(EventoRepository)
    public eventoRepository: EventoRepository,
    @repository(ParticipanteRepository)
    public participanteRepository: ParticipanteRepository,
    @repository(NotificacionRepository)
    public notificacionRepository: NotificacionRepository,
    @repository(NotificacionxInscripcionRepository)
    public notificacionxInscripcionRepository: NotificacionxInscripcionRepository,
    @service(LogicaNegocioService)
    public servicioLogicaNegocio: LogicaNegocioService,
    @service(NotificacionesService)
    public servicioNotificaciones: NotificacionesService,
  ) {}

  @post('/inscripcion')
  @response(200, {
    description: 'Inscripcion model instance',
    content: {'application/json': {schema: getModelSchemaRef(Inscripcion)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Inscripcion, {
            title: 'NewInscripcion',
            exclude: ['id'],
          }),
        },
      },
    })
    inscripcion: Omit<Inscripcion, 'id'>,
  ): Promise<Inscripcion> {
    // Validar que el evento asociado existe
    const eventoExists = await this.eventoRepository.exists(
      inscripcion.eventoId,
    );
    if (!eventoExists) {
      throw new HttpErrors.NotFound(
        `El evento con ID ${inscripcion.eventoId} no existe.`,
      );
    }
    // Verificar si el cupo ya está completo
    const evento = await this.eventoRepository.findById(inscripcion.eventoId);
    const totalInscripciones = await this.inscripcionRepository.count({
      eventoId: inscripcion.eventoId,
    });

    // Verificar solapamientos (si aplica)
    const existingInscripciones = await this.inscripcionRepository.find({
      where: {participanteId: inscripcion.participanteId},
    });

    if (totalInscripciones.count >= evento.cupoInscripcion) {
      throw new HttpErrors.BadRequest(
        `No hay plazas disponibles para el evento "${evento.titulo}".`,
      );
    }

    if (existingInscripciones.length > 0) {
      const existingInscripciones = await this.inscripcionRepository.find({
        where: {
          participanteId: inscripcion.participanteId,
        },
        fields: {eventoId: true},
      });

      const existingEventoIds = existingInscripciones.map(
        inscripcion => inscripcion.eventoId,
      );
      const conflictingEventos = await this.eventoRepository.find({
        where: {
          id: {inq: existingEventoIds},
          fechaInicio: {lte: evento.fechaFinal},
          fechaFinal: {gte: evento.fechaInicio},
        },
      });

      console.log(conflictingEventos);
      if (conflictingEventos.length > 0) {
        throw new HttpErrors.BadRequest(
          `El participante ya está inscrito en un evento que se solapa con estas fechas.`,
        );
      }
    }

    inscripcion.fecha = new Date().toISOString();
    const qrcode = await this.servicioLogicaNegocio.obtenerQR(
      inscripcion.participanteId,
      inscripcion.eventoId,
    );

    const participante = await this.participanteRepository.findById(
      inscripcion.participanteId,
    );

    if (!participante) {
      throw new HttpErrors.NotFound(
        `El participante con ID ${inscripcion.participanteId} no existe.`,
      );
    }

    if (!participante.correo) {
      throw new HttpErrors.NotFound(
        `El participante con ID ${inscripcion.participanteId} no tiene correo.`,
      );
    }

    //   // Enviar Qr al correo del participante
    try {
      let datos = {
        correoDestino: participante.correo,
        nombreDestino:
          participante.primerNombre + ' ' + participante.primerApellido,
        asuntoCorreo: 'Codigo QR de asistencia',
        contenidoCorreo: qrcode,
      };
      let url = NotificacionesConfig.urlNotificationQR;
      console.log(datos);
      try {
        this.servicioNotificaciones.EnviarNotificacion(datos, url);
      } catch (error) {
        console.error('Error al enviar notificación: ' + error.message);
      }
    } catch (error) {
      console.error('Error al enviar notificación: ' + error.message);
    }

    // Crear la inscripción si no hay conflictos
    return this.inscripcionRepository.create(inscripcion);
  }

  @get('/inscripcion/count')
  @response(200, {
    description: 'Inscripcion model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Inscripcion) where?: Where<Inscripcion>,
  ): Promise<Count> {
    return this.inscripcionRepository.count(where);
  }

  @get('/inscripcion')
  @response(200, {
    description: 'Array of Inscripcion model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Inscripcion, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Inscripcion) filter?: Filter<Inscripcion>,
  ): Promise<Inscripcion[]> {
    return this.inscripcionRepository.find(filter);
  }

  @patch('/inscripcion')
  @response(200, {
    description: 'Inscripcion PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Inscripcion, {partial: true}),
        },
      },
    })
    inscripcion: Inscripcion,
    @param.where(Inscripcion) where?: Where<Inscripcion>,
  ): Promise<Count> {
    return this.inscripcionRepository.updateAll(inscripcion, where);
  }

  @get('/inscripcion/{id}')
  @response(200, {
    description: 'Inscripcion model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Inscripcion, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Inscripcion, {exclude: 'where'})
    filter?: FilterExcludingWhere<Inscripcion>,
  ): Promise<Inscripcion> {
    return this.inscripcionRepository.findById(id, filter);
  }

  @patch('/inscripcion/{id}')
  @response(204, {
    description: 'Inscripcion PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Inscripcion, {partial: true}),
        },
      },
    })
    inscripcion: Inscripcion,
  ): Promise<void> {
    await this.inscripcionRepository.updateById(id, inscripcion);
  }

  @put('/inscripcion/{id}')
  @response(204, {
    description: 'Inscripcion PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() inscripcion: Inscripcion,
  ): Promise<void> {
    await this.inscripcionRepository.replaceById(id, inscripcion);
  }

  @del('/inscripcion/{id}')
  @response(204, {
    description: 'Inscripcion DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    // Eliminar la inscripción y el feedback asociado (si existe)
    const inscripcion = await this.inscripcionRepository.findById(id);

    if (!inscripcion) {
      throw new HttpErrors.NotFound(`La inscripción con ID ${id} no existe.`);
    }

    if (inscripcion.feedbackId)
      await this.feedbackRepository.deleteById(inscripcion.feedbackId);

    if (inscripcion.certificadoId)
      await this.certificadoRepository.deleteById(inscripcion.certificadoId);

    if (inscripcion.notificaciones && inscripcion.notificaciones.length > 0) {
      for (const notificacion of inscripcion.notificaciones) {
        await this.notificacionxInscripcionRepository.deleteAll({
          notificacionId: notificacion.id,
          inscripcionId: inscripcion.id,
        });
        await this.notificacionRepository.deleteById(notificacion.id);
      }
    }

    await this.inscripcionRepository.deleteById(id);
  }
}
