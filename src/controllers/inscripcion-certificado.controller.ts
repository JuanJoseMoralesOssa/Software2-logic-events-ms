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
  Certificado,
} from '../models';
import {InscripcionRepository} from '../repositories';

export class InscripcionCertificadoController {
  constructor(
    @repository(InscripcionRepository) protected inscripcionRepository: InscripcionRepository,
  ) { }

  @get('/inscripcions/{id}/certificado', {
    responses: {
      '200': {
        description: 'Inscripcion has one Certificado',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Certificado),
          },
        },
      },
    },
  })
  async get(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Certificado>,
  ): Promise<Certificado> {
    return this.inscripcionRepository.certificado(id).get(filter);
  }

  @post('/inscripcions/{id}/certificado', {
    responses: {
      '200': {
        description: 'Inscripcion model instance',
        content: {'application/json': {schema: getModelSchemaRef(Certificado)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Inscripcion.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Certificado, {
            title: 'NewCertificadoInInscripcion',
            exclude: ['id'],
            optional: ['inscripcionId']
          }),
        },
      },
    }) certificado: Omit<Certificado, 'id'>,
  ): Promise<Certificado> {
    return this.inscripcionRepository.certificado(id).create(certificado);
  }

  @patch('/inscripcions/{id}/certificado', {
    responses: {
      '200': {
        description: 'Inscripcion.Certificado PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Certificado, {partial: true}),
        },
      },
    })
    certificado: Partial<Certificado>,
    @param.query.object('where', getWhereSchemaFor(Certificado)) where?: Where<Certificado>,
  ): Promise<Count> {
    return this.inscripcionRepository.certificado(id).patch(certificado, where);
  }

  @del('/inscripcions/{id}/certificado', {
    responses: {
      '200': {
        description: 'Inscripcion.Certificado DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Certificado)) where?: Where<Certificado>,
  ): Promise<Count> {
    return this.inscripcionRepository.certificado(id).delete(where);
  }
}
