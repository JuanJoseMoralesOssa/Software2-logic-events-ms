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
  Participante,
  Inscripcion,
} from '../models';
import {ParticipanteRepository} from '../repositories';

export class ParticipanteInscripcionController {
  constructor(
    @repository(ParticipanteRepository) protected participanteRepository: ParticipanteRepository,
  ) { }

  @get('/participantes/{id}/inscripcions', {
    responses: {
      '200': {
        description: 'Array of Participante has many Inscripcion',
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
    return this.participanteRepository.inscripciones(id).find(filter);
  }

  @post('/participantes/{id}/inscripcions', {
    responses: {
      '200': {
        description: 'Participante model instance',
        content: {'application/json': {schema: getModelSchemaRef(Inscripcion)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Participante.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Inscripcion, {
            title: 'NewInscripcionInParticipante',
            exclude: ['id'],
            optional: ['participanteId']
          }),
        },
      },
    }) inscripcion: Omit<Inscripcion, 'id'>,
  ): Promise<Inscripcion> {
    return this.participanteRepository.inscripciones(id).create(inscripcion);
  }

  @patch('/participantes/{id}/inscripcions', {
    responses: {
      '200': {
        description: 'Participante.Inscripcion PATCH success count',
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
    return this.participanteRepository.inscripciones(id).patch(inscripcion, where);
  }

  @del('/participantes/{id}/inscripcions', {
    responses: {
      '200': {
        description: 'Participante.Inscripcion DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Inscripcion)) where?: Where<Inscripcion>,
  ): Promise<Count> {
    return this.participanteRepository.inscripciones(id).delete(where);
  }
}
