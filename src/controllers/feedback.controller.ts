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
  HttpErrors,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {Feedback} from '../models';
import {FeedbackRepository, InscripcionRepository} from '../repositories';

export class FeedbackController {
  constructor(
    @repository(FeedbackRepository)
    public feedbackRepository: FeedbackRepository,
    @repository(InscripcionRepository)
    public inscripcionRepository: InscripcionRepository,
  ) {}

  @post('/feedback')
  @response(200, {
    description: 'Feedback model instance',
    content: {'application/json': {schema: getModelSchemaRef(Feedback)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Feedback, {
            title: 'NewFeedback',
            exclude: ['id'],
          }),
        },
      },
    })
    feedback: Omit<Feedback, 'id'>,
  ): Promise<Feedback> {
    const inscripcion = await this.inscripcionRepository.findById(
      feedback.inscripcionId,
    );
    if (!inscripcion) {
      throw new HttpErrors.NotFound(
        `Inscripción con ID ${feedback.inscripcionId} no encontrada.`,
      );
    }
    const feedbackCreado = await this.feedbackRepository.create(feedback);
    await this.inscripcionRepository.updateById(feedback.inscripcionId, {
      feedbackId: feedbackCreado.id,
    });
    return feedbackCreado;
  }

  @get('/feedback/count')
  @response(200, {
    description: 'Feedback model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Feedback) where?: Where<Feedback>): Promise<Count> {
    return this.feedbackRepository.count(where);
  }

  @get('/feedback')
  @response(200, {
    description: 'Array of Feedback model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Feedback, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Feedback) filter?: Filter<Feedback>,
  ): Promise<Feedback[]> {
    return this.feedbackRepository.find(filter);
  }

  @patch('/feedback')
  @response(200, {
    description: 'Feedback PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Feedback, {partial: true}),
        },
      },
    })
    feedback: Feedback,
    @param.where(Feedback) where?: Where<Feedback>,
  ): Promise<Count> {
    return this.feedbackRepository.updateAll(feedback, where);
  }

  @get('/feedback/{id}')
  @response(200, {
    description: 'Feedback model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Feedback, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Feedback, {exclude: 'where'})
    filter?: FilterExcludingWhere<Feedback>,
  ): Promise<Feedback> {
    return this.feedbackRepository.findById(id, filter);
  }

  @patch('/feedback/{id}')
  @response(204, {
    description: 'Feedback PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Feedback, {partial: true}),
        },
      },
    })
    feedback: Feedback,
  ): Promise<void> {
    await this.feedbackRepository.updateById(id, feedback);
  }

  @put('/feedback/{id}')
  @response(204, {
    description: 'Feedback PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() feedback: Feedback,
  ): Promise<void> {
    await this.feedbackRepository.replaceById(id, feedback);
  }

  @del('/feedback/{id}')
  @response(204, {
    description: 'Feedback DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    // Borra el feedback
    const feedback = await this.feedbackRepository.findById(id);
    if (!feedback) {
      throw new HttpErrors.NotFound(`El feedback con ID ${id} no existe.`);
    }
    if (feedback.inscripcionId)
      // await this.inscripcionRepository.deleteById(feedback.inscripcionId);
      await this.inscripcionRepository.updateById(feedback.inscripcionId, {
        feedbackId: undefined,
      });
    await this.feedbackRepository.deleteById(id);
  }
}
