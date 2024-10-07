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
  Organizador,
  Evento,
} from '../models';
import {OrganizadorRepository} from '../repositories';

export class OrganizadorEventoController {
  constructor(
    @repository(OrganizadorRepository) protected organizadorRepository: OrganizadorRepository,
  ) { }

  @get('/organizadors/{id}/eventos', {
    responses: {
      '200': {
        description: 'Array of Organizador has many Evento',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Evento)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Evento>,
  ): Promise<Evento[]> {
    return this.organizadorRepository.eventos(id).find(filter);
  }

  @post('/organizadors/{id}/eventos', {
    responses: {
      '200': {
        description: 'Organizador model instance',
        content: {'application/json': {schema: getModelSchemaRef(Evento)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Organizador.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Evento, {
            title: 'NewEventoInOrganizador',
            exclude: ['id'],
            optional: ['organizadorId']
          }),
        },
      },
    }) evento: Omit<Evento, 'id'>,
  ): Promise<Evento> {
    return this.organizadorRepository.eventos(id).create(evento);
  }

  @patch('/organizadors/{id}/eventos', {
    responses: {
      '200': {
        description: 'Organizador.Evento PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Evento, {partial: true}),
        },
      },
    })
    evento: Partial<Evento>,
    @param.query.object('where', getWhereSchemaFor(Evento)) where?: Where<Evento>,
  ): Promise<Count> {
    return this.organizadorRepository.eventos(id).patch(evento, where);
  }

  @del('/organizadors/{id}/eventos', {
    responses: {
      '200': {
        description: 'Organizador.Evento DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Evento)) where?: Where<Evento>,
  ): Promise<Count> {
    return this.organizadorRepository.eventos(id).delete(where);
  }
}
