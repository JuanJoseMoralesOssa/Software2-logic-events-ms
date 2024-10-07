import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
  import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
Inscripcion,
NotificacionxInscripcion,
Notificacion,
} from '../models';
import {InscripcionRepository} from '../repositories';

export class InscripcionNotificacionController {
  constructor(
    @repository(InscripcionRepository) protected inscripcionRepository: InscripcionRepository,
  ) { }

  @get('/inscripcions/{id}/notificacions', {
    responses: {
      '200': {
        description: 'Array of Inscripcion has many Notificacion through NotificacionxInscripcion',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Notificacion)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Notificacion>,
  ): Promise<Notificacion[]> {
    return this.inscripcionRepository.notificaciones(id).find(filter);
  }

  @post('/inscripcions/{id}/notificacions', {
    responses: {
      '200': {
        description: 'create a Notificacion model instance',
        content: {'application/json': {schema: getModelSchemaRef(Notificacion)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Inscripcion.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Notificacion, {
            title: 'NewNotificacionInInscripcion',
            exclude: ['id'],
          }),
        },
      },
    }) notificacion: Omit<Notificacion, 'id'>,
  ): Promise<Notificacion> {
    return this.inscripcionRepository.notificaciones(id).create(notificacion);
  }

  @patch('/inscripcions/{id}/notificacions', {
    responses: {
      '200': {
        description: 'Inscripcion.Notificacion PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Notificacion, {partial: true}),
        },
      },
    })
    notificacion: Partial<Notificacion>,
    @param.query.object('where', getWhereSchemaFor(Notificacion)) where?: Where<Notificacion>,
  ): Promise<Count> {
    return this.inscripcionRepository.notificaciones(id).patch(notificacion, where);
  }

  @del('/inscripcions/{id}/notificacions', {
    responses: {
      '200': {
        description: 'Inscripcion.Notificacion DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Notificacion)) where?: Where<Notificacion>,
  ): Promise<Count> {
    return this.inscripcionRepository.notificaciones(id).delete(where);
  }
}
