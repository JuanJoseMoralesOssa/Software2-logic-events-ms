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
  Feedback,
  Inscripcion,
} from '../models';
import {FeedbackRepository} from '../repositories';

export class FeedbackInscripcionController {
  constructor(
    @repository(FeedbackRepository) protected feedbackRepository: FeedbackRepository,
  ) { }

  @get('/feedbacks/{id}/inscripcion', {
    responses: {
      '200': {
        description: 'Feedback has one Inscripcion',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Inscripcion),
          },
        },
      },
    },
  })
  async get(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Inscripcion>,
  ): Promise<Inscripcion> {
    return this.feedbackRepository.inscripcion(id).get(filter);
  }

  @post('/feedbacks/{id}/inscripcion', {
    responses: {
      '200': {
        description: 'Feedback model instance',
        content: {'application/json': {schema: getModelSchemaRef(Inscripcion)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Feedback.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Inscripcion, {
            title: 'NewInscripcionInFeedback',
            exclude: ['id'],
            optional: ['feedbackId']
          }),
        },
      },
    }) inscripcion: Omit<Inscripcion, 'id'>,
  ): Promise<Inscripcion> {
    return this.feedbackRepository.inscripcion(id).create(inscripcion);
  }

  @patch('/feedbacks/{id}/inscripcion', {
    responses: {
      '200': {
        description: 'Feedback.Inscripcion PATCH success count',
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
    return this.feedbackRepository.inscripcion(id).patch(inscripcion, where);
  }

  @del('/feedbacks/{id}/inscripcion', {
    responses: {
      '200': {
        description: 'Feedback.Inscripcion DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Inscripcion)) where?: Where<Inscripcion>,
  ): Promise<Count> {
    return this.feedbackRepository.inscripcion(id).delete(where);
  }
}
