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
import {Organizador} from '../models';
import {EventoRepository, OrganizadorRepository} from '../repositories';

export class OrganizadorController {
  constructor(
    @repository(OrganizadorRepository)
    public organizadorRepository: OrganizadorRepository,
    @repository(EventoRepository)
    public eventoRepository: EventoRepository,
  ) {}

  @post('/organizador')
  @response(200, {
    description: 'Organizador model instance',
    content: {'application/json': {schema: getModelSchemaRef(Organizador)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Organizador, {
            title: 'NewOrganizador',
            exclude: ['id'],
          }),
        },
      },
    })
    organizador: Omit<Organizador, 'id'>,
  ): Promise<Organizador> {
    return this.organizadorRepository.create(organizador);
  }

  @get('/organizador/count')
  @response(200, {
    description: 'Organizador model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Organizador) where?: Where<Organizador>,
  ): Promise<Count> {
    return this.organizadorRepository.count(where);
  }

  @get('/organizador')
  @response(200, {
    description: 'Array of Organizador model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Organizador, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Organizador) filter?: Filter<Organizador>,
  ): Promise<Organizador[]> {
    return this.organizadorRepository.find(filter);
  }

  @patch('/organizador')
  @response(200, {
    description: 'Organizador PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Organizador, {partial: true}),
        },
      },
    })
    organizador: Organizador,
    @param.where(Organizador) where?: Where<Organizador>,
  ): Promise<Count> {
    return this.organizadorRepository.updateAll(organizador, where);
  }

  @get('/organizador/{id}')
  @response(200, {
    description: 'Organizador model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Organizador, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Organizador, {exclude: 'where'})
    filter?: FilterExcludingWhere<Organizador>,
  ): Promise<Organizador> {
    return this.organizadorRepository.findById(id, filter);
  }

  @patch('/organizador/{id}')
  @response(204, {
    description: 'Organizador PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Organizador, {partial: true}),
        },
      },
    })
    organizador: Organizador,
  ): Promise<void> {
    await this.organizadorRepository.updateById(id, organizador);
  }

  @put('/organizador/{id}')
  @response(204, {
    description: 'Organizador PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() organizador: Organizador,
  ): Promise<void> {
    await this.organizadorRepository.replaceById(id, organizador);
  }

  @del('/organizador/{id}')
  @response(204, {
    description: 'Organizador DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    const eventos = await this.eventoRepository.find({
      where: {organizadorId: id},
    });
    for (const evento of eventos) {
      await this.eventoRepository.deleteById(evento.id);
    }
    await this.organizadorRepository.deleteById(id);
  }
}
