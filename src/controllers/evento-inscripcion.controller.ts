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
  Evento,
  Inscripcion,
} from '../models';
import {EventoRepository} from '../repositories';

export class EventoInscripcionController {
  constructor(
    @repository(EventoRepository) protected eventoRepository: EventoRepository,
  ) { }

  @get('/eventos/{id}/inscripcions', {
    responses: {
      '200': {
        description: 'Array of Evento has many Inscripcion',
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
    return this.eventoRepository.inscripcions(id).find(filter);
  }

  @post('/eventos/{id}/inscripcions', {
    responses: {
      '200': {
        description: 'Evento model instance',
        content: {'application/json': {schema: getModelSchemaRef(Inscripcion)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Evento.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Inscripcion, {
            title: 'NewInscripcionInEvento',
            exclude: ['id'],
            optional: ['eventoId']
          }),
        },
      },
    }) inscripcion: Omit<Inscripcion, 'id'>,
  ): Promise<Inscripcion> {
    return this.eventoRepository.inscripcions(id).create(inscripcion);
  }

  @patch('/eventos/{id}/inscripcions', {
    responses: {
      '200': {
        description: 'Evento.Inscripcion PATCH success count',
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
    return this.eventoRepository.inscripcions(id).patch(inscripcion, where);
  }

  @del('/eventos/{id}/inscripcions', {
    responses: {
      '200': {
        description: 'Evento.Inscripcion DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Inscripcion)) where?: Where<Inscripcion>,
  ): Promise<Count> {
    return this.eventoRepository.inscripcions(id).delete(where);
  }
}
