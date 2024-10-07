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
import {Inscripcion} from '../models';
import {InscripcionRepository} from '../repositories';

export class InscripcionController {
  constructor(
    @repository(InscripcionRepository)
    public inscripcionRepository : InscripcionRepository,
  ) {}

  @post('/incripcion')
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
    return this.inscripcionRepository.create(inscripcion);
  }

  @get('/incripcion/count')
  @response(200, {
    description: 'Inscripcion model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Inscripcion) where?: Where<Inscripcion>,
  ): Promise<Count> {
    return this.inscripcionRepository.count(where);
  }

  @get('/incripcion')
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

  @patch('/incripcion')
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

  @get('/incripcion/{id}')
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
    @param.filter(Inscripcion, {exclude: 'where'}) filter?: FilterExcludingWhere<Inscripcion>
  ): Promise<Inscripcion> {
    return this.inscripcionRepository.findById(id, filter);
  }

  @patch('/incripcion/{id}')
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

  @put('/incripcion/{id}')
  @response(204, {
    description: 'Inscripcion PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() inscripcion: Inscripcion,
  ): Promise<void> {
    await this.inscripcionRepository.replaceById(id, inscripcion);
  }

  @del('/incripcion/{id}')
  @response(204, {
    description: 'Inscripcion DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.inscripcionRepository.deleteById(id);
  }
}
