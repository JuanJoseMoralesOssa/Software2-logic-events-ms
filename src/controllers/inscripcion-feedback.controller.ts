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
  Feedback,
} from '../models';
import {InscripcionRepository} from '../repositories';

export class InscripcionFeedbackController {
  constructor(
    @repository(InscripcionRepository) protected inscripcionRepository: InscripcionRepository,
  ) { }

  @get('/inscripcions/{id}/feedback', {
    responses: {
      '200': {
        description: 'Inscripcion has one Feedback',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Feedback),
          },
        },
      },
    },
  })
  async get(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Feedback>,
  ): Promise<Feedback> {
    return this.inscripcionRepository.feedback(id).get(filter);
  }

  @post('/inscripcions/{id}/feedback', {
    responses: {
      '200': {
        description: 'Inscripcion model instance',
        content: {'application/json': {schema: getModelSchemaRef(Feedback)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Inscripcion.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Feedback, {
            title: 'NewFeedbackInInscripcion',
            exclude: ['id'],
            optional: ['inscripcionId']
          }),
        },
      },
    }) feedback: Omit<Feedback, 'id'>,
  ): Promise<Feedback> {
    return this.inscripcionRepository.feedback(id).create(feedback);
  }

  @patch('/inscripcions/{id}/feedback', {
    responses: {
      '200': {
        description: 'Inscripcion.Feedback PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Feedback, {partial: true}),
        },
      },
    })
    feedback: Partial<Feedback>,
    @param.query.object('where', getWhereSchemaFor(Feedback)) where?: Where<Feedback>,
  ): Promise<Count> {
    return this.inscripcionRepository.feedback(id).patch(feedback, where);
  }

  @del('/inscripcions/{id}/feedback', {
    responses: {
      '200': {
        description: 'Inscripcion.Feedback DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Feedback)) where?: Where<Feedback>,
  ): Promise<Count> {
    return this.inscripcionRepository.feedback(id).delete(where);
  }
}
