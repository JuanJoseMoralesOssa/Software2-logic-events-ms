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
  Certificado,
  Inscripcion,
} from '../models';
import {CertificadoRepository} from '../repositories';

export class CertificadoInscripcionController {
  constructor(
    @repository(CertificadoRepository) protected certificadoRepository: CertificadoRepository,
  ) { }

  @get('/certificados/{id}/inscripcion', {
    responses: {
      '200': {
        description: 'Certificado has one Inscripcion',
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
    return this.certificadoRepository.inscripcion(id).get(filter);
  }

  @post('/certificados/{id}/inscripcion', {
    responses: {
      '200': {
        description: 'Certificado model instance',
        content: {'application/json': {schema: getModelSchemaRef(Inscripcion)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Certificado.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Inscripcion, {
            title: 'NewInscripcionInCertificado',
            exclude: ['id'],
            optional: ['certificadoId']
          }),
        },
      },
    }) inscripcion: Omit<Inscripcion, 'id'>,
  ): Promise<Inscripcion> {
    return this.certificadoRepository.inscripcion(id).create(inscripcion);
  }

  @patch('/certificados/{id}/inscripcion', {
    responses: {
      '200': {
        description: 'Certificado.Inscripcion PATCH success count',
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
    return this.certificadoRepository.inscripcion(id).patch(inscripcion, where);
  }

  @del('/certificados/{id}/inscripcion', {
    responses: {
      '200': {
        description: 'Certificado.Inscripcion DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Inscripcion)) where?: Where<Inscripcion>,
  ): Promise<Count> {
    return this.certificadoRepository.inscripcion(id).delete(where);
  }
}
