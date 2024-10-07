import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {NotificacionxInscripcion} from '../models';
import {NotificacionxInscripcionRepository} from '../repositories';

export class NotificacionxInscripcionController {
  constructor(
    @repository(NotificacionxInscripcionRepository)
    public notificacionxInscripcionRepository : NotificacionxInscripcionRepository,
  ) {}

  @post('/notificacion-inscripcion')
  @response(200, {
    description: 'NotificacionxInscripcion model instance',
    content: {'application/json': {schema: getModelSchemaRef(NotificacionxInscripcion)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(NotificacionxInscripcion, {
            title: 'NewNotificacionxInscripcion',
            exclude: ['id'],
          }),
        },
      },
    })
    notificacionxInscripcion: Omit<NotificacionxInscripcion, 'id'>,
  ): Promise<NotificacionxInscripcion> {
    return this.notificacionxInscripcionRepository.create(notificacionxInscripcion);
  }

  @get('/notificacion-inscripcion/count')
  @response(200, {
    description: 'NotificacionxInscripcion model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(NotificacionxInscripcion) where?: Where<NotificacionxInscripcion>,
  ): Promise<Count> {
    return this.notificacionxInscripcionRepository.count(where);
  }

  @get('/notificacion-inscripcion')
  @response(200, {
    description: 'Array of NotificacionxInscripcion model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(NotificacionxInscripcion, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(NotificacionxInscripcion) filter?: Filter<NotificacionxInscripcion>,
  ): Promise<NotificacionxInscripcion[]> {
    return this.notificacionxInscripcionRepository.find(filter);
  }

  @patch('/notificacion-inscripcion')
  @response(200, {
    description: 'NotificacionxInscripcion PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(NotificacionxInscripcion, {partial: true}),
        },
      },
    })
    notificacionxInscripcion: NotificacionxInscripcion,
    @param.where(NotificacionxInscripcion) where?: Where<NotificacionxInscripcion>,
  ): Promise<Count> {
    return this.notificacionxInscripcionRepository.updateAll(notificacionxInscripcion, where);
  }

  @get('/notificacion-inscripcion/{id}')
  @response(200, {
    description: 'NotificacionxInscripcion model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(NotificacionxInscripcion, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(NotificacionxInscripcion, {exclude: 'where'}) filter?: FilterExcludingWhere<NotificacionxInscripcion>
  ): Promise<NotificacionxInscripcion> {
    return this.notificacionxInscripcionRepository.findById(id, filter);
  }

  @patch('/notificacion-inscripcion/{id}')
  @response(204, {
    description: 'NotificacionxInscripcion PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(NotificacionxInscripcion, {partial: true}),
        },
      },
    })
    notificacionxInscripcion: NotificacionxInscripcion,
  ): Promise<void> {
    await this.notificacionxInscripcionRepository.updateById(id, notificacionxInscripcion);
  }

  @put('/notificacion-inscripcion/{id}')
  @response(204, {
    description: 'NotificacionxInscripcion PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() notificacionxInscripcion: NotificacionxInscripcion,
  ): Promise<void> {
    await this.notificacionxInscripcionRepository.replaceById(id, notificacionxInscripcion);
  }

  @del('/notificacion-inscripcion/{id}')
  @response(204, {
    description: 'NotificacionxInscripcion DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.notificacionxInscripcionRepository.deleteById(id);
  }
}
