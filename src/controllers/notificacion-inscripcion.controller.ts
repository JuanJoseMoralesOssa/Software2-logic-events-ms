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
Notificacion,
NotificacionxInscripcion,
Inscripcion,
} from '../models';
import {NotificacionRepository} from '../repositories';

export class NotificacionInscripcionController {
  constructor(
    @repository(NotificacionRepository) protected notificacionRepository: NotificacionRepository,
  ) { }

  @get('/notificacions/{id}/inscripcions', {
    responses: {
      '200': {
        description: 'Array of Notificacion has many Inscripcion through NotificacionxInscripcion',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Inscripcion)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Inscripcion>,
  ): Promise<Inscripcion[]> {
    return this.notificacionRepository.inscripciones(id).find(filter);
  }

  @post('/notificacions/{id}/inscripcions', {
    responses: {
      '200': {
        description: 'create a Inscripcion model instance',
        content: {'application/json': {schema: getModelSchemaRef(Inscripcion)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Notificacion.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Inscripcion, {
            title: 'NewInscripcionInNotificacion',
            exclude: ['id'],
          }),
        },
      },
    }) inscripcion: Omit<Inscripcion, 'id'>,
  ): Promise<Inscripcion> {
    return this.notificacionRepository.inscripciones(id).create(inscripcion);
  }

  @patch('/notificacions/{id}/inscripcions', {
    responses: {
      '200': {
        description: 'Notificacion.Inscripcion PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Inscripcion, {partial: true}),
        },
      },
    })
    inscripcion: Partial<Inscripcion>,
    @param.query.object('where', getWhereSchemaFor(Inscripcion)) where?: Where<Inscripcion>,
  ): Promise<Count> {
    return this.notificacionRepository.inscripciones(id).patch(inscripcion, where);
  }

  @del('/notificacions/{id}/inscripcions', {
    responses: {
      '200': {
        description: 'Notificacion.Inscripcion DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Inscripcion)) where?: Where<Inscripcion>,
  ): Promise<Count> {
    return this.notificacionRepository.inscripciones(id).delete(where);
  }
}
