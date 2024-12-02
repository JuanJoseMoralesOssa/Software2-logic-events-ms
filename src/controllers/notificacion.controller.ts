import {service} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef, HttpErrors, param,
  patch,
  post,
  put,
  requestBody,
  response
} from '@loopback/rest';
import {NotificacionesConfig} from '../config/notificaciones.config';
import {Notificacion} from '../models';
import {
  EventoRepository,
  InscripcionRepository,
  NotificacionRepository,
  NotificacionxInscripcionRepository,
  ParticipanteRepository
} from '../repositories';
import {NotificacionesService} from '../services/notificaciones.service';
export class NotificacionController {
  constructor(
    @repository(NotificacionRepository)
    public notificacionRepository: NotificacionRepository,
    @repository(InscripcionRepository)
    public inscripcionRepository: InscripcionRepository,
    @repository(NotificacionxInscripcionRepository)
    public notificacionxInscripcionRepository: NotificacionxInscripcionRepository,
    @repository(EventoRepository)
    public eventoRepository: EventoRepository,
    @repository(ParticipanteRepository)
    public partipanteRepository: ParticipanteRepository,
    @service(NotificacionesService)
    public servicioNotificaciones: NotificacionesService,
  ) {}

  @post('/notificacion')
  @response(200, {
    description: 'Notificacion model instance',
    content: {'application/json': {schema: getModelSchemaRef(Notificacion)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Notificacion, {
            title: 'NewNotificacion',
            exclude: ['id'],
          }),
        },
      },
    })
    notificacion: Omit<Notificacion, 'id'>,
  ): Promise<Notificacion> {
    return this.notificacionRepository.create(notificacion);
  }

  @post('/Recordatorio')
  @response(200, {
    description: 'Notificacion model instance',
    content: {'application/json': {schema: getModelSchemaRef(Notificacion)}},
  })
  async createRecordatorio(
    @requestBody() eventoId: number // Recibe solo el valor numérico de eventoId
  ) {
    // Verificar si el evento existe
    console.log('EventoId', eventoId);
    const evento = await this.eventoRepository.findById(eventoId);
    console.log('Evento', evento);
    if (!evento) {
      throw new HttpErrors.NotFound(`Evento con ID ${eventoId} no encontrado.`);
    }
    const inscripciones = await this.eventoRepository.inscripcions(evento.id).find();
    const organizador = await this.eventoRepository.organizador(evento.id);
    for (const inscripcion of inscripciones) {
      const participante = await this.partipanteRepository.findById(inscripcion.participanteId);
      const notificacion = new Notificacion({
        fecha: String(new Date()), // Fecha actual
        asunto: 'Recordatorio', // Valores por defecto o específicos
        mensaje: 'Le recordamos los detalles del evento: ' + evento.titulo +
        '\n El que se llevara acabo el ' + evento.fechaInicio + ' en ' + evento.lugar
        + '\n El evento es organizado por: ' + organizador.primerNombre + ' ' + organizador.primerApellido
        + '\n y lleva como descripcion ' + evento.descripcion
        + '\n Esperamos contar con su presencia'
        + '\n Atentamente Facultad de ' + evento.facultad,
        remitente: organizador.primerNombre + ' ' + organizador.primerApellido,
        destinatario : participante.primerNombre + ' ' + participante.primerApellido,
      });
      // Guardar la notificación en la base de datos
      const notificacionGuardada = await this.notificacionRepository.create(notificacion);
      // Crear la relación entre la notificación y la inscripción
      const datos = {
        correoDestino: participante.correo,
        nombreDestino: `${participante.primerNombre} ${participante.primerApellido}`,
        asuntoCorreo: notificacionGuardada.asunto,
        contenidoCorreo: notificacionGuardada.mensaje,
      };

      const url = NotificacionesConfig.urlNotificationUpdateevento;

      try {
        await this.servicioNotificaciones.EnviarNotificacion(datos, url);
      } catch (error) {
        console.error(`Error al enviar notificación: ${error.message}`);
      }

      await this.notificacionxInscripcionRepository.create({
        notificacionId: notificacionGuardada.id,
        inscripcionId: inscripcion.id,
      });
    }
  }



  @get('/notificacion/count')
  @response(200, {
    description: 'Notificacion model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Notificacion) where?: Where<Notificacion>,
  ): Promise<Count> {
    return this.notificacionRepository.count(where);
  }

  @get('/notificacion')
  @response(200, {
    description: 'Array of Notificacion model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Notificacion, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Notificacion) filter?: Filter<Notificacion>,
  ): Promise<Notificacion[]> {
    return this.notificacionRepository.find(filter);
  }

  @patch('/notificacion')
  @response(200, {
    description: 'Notificacion PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Notificacion, {partial: true}),
        },
      },
    })
    notificacion: Notificacion,
    @param.where(Notificacion) where?: Where<Notificacion>,
  ): Promise<Count> {
    return this.notificacionRepository.updateAll(notificacion, where);
  }

  @get('/notificacion/{id}')
  @response(200, {
    description: 'Notificacion model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Notificacion, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Notificacion, {exclude: 'where'})
    filter?: FilterExcludingWhere<Notificacion>,
  ): Promise<Notificacion> {
    return this.notificacionRepository.findById(id, filter);
  }

  @patch('/notificacion/{id}')
  @response(204, {
    description: 'Notificacion PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Notificacion, {partial: true}),
        },
      },
    })
    notificacion: Notificacion,
  ): Promise<void> {
    await this.notificacionRepository.updateById(id, notificacion);
  }

  @put('/notificacion/{id}')
  @response(204, {
    description: 'Notificacion PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() notificacion: Notificacion,
  ): Promise<void> {
    await this.notificacionRepository.replaceById(id, notificacion);
  }

  @del('/notificacion/{id}')
  @response(204, {
    description: 'Notificacion DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    const notificacion = await this.notificacionRepository.findById(id);
    const notificacionesxInscripcion =
      await this.notificacionxInscripcionRepository.find({
        where: {
          notificacionId: id,
        },
      });

    for (const notificacionxInscripcion of notificacionesxInscripcion) {
      await this.notificacionxInscripcionRepository.deleteById(
        notificacionxInscripcion.id!,
      );
    }

    await this.notificacionRepository.deleteById(id);
  }
}
