import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Inscripcion,
  Participante,
} from '../models';
import {InscripcionRepository} from '../repositories';

export class InscripcionParticipanteController {
  constructor(
    @repository(InscripcionRepository)
    public inscripcionRepository: InscripcionRepository,
  ) { }

  @get('/inscripcions/{id}/participante', {
    responses: {
      '200': {
        description: 'Participante belonging to Inscripcion',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Participante),
          },
        },
      },
    },
  })
  async getParticipante(
    @param.path.number('id') id: typeof Inscripcion.prototype.id,
  ): Promise<Participante> {
    return this.inscripcionRepository.participante(id);
  }
}
