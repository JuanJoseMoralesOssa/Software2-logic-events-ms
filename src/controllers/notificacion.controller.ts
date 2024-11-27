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
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {Notificacion} from '../models';
import {
  InscripcionRepository,
  NotificacionRepository,
  NotificacionxInscripcionRepository,
} from '../repositories';

export class NotificacionController {
  constructor(
    @repository(NotificacionRepository)
    public notificacionRepository: NotificacionRepository,
    @repository(InscripcionRepository)
    public inscripcionRepository: InscripcionRepository,
    @repository(NotificacionxInscripcionRepository)
    public notificacionxInscripcionRepository: NotificacionxInscripcionRepository,
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
