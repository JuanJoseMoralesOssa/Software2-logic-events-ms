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
  Evento,
} from '../models';
import {InscripcionRepository} from '../repositories';

export class InscripcionEventoController {
  constructor(
    @repository(InscripcionRepository)
    public inscripcionRepository: InscripcionRepository,
  ) { }

  @get('/inscripcions/{id}/evento', {
    responses: {
      '200': {
        description: 'Evento belonging to Inscripcion',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Evento),
          },
        },
      },
    },
  })
  async getEvento(
    @param.path.number('id') id: typeof Inscripcion.prototype.id,
  ): Promise<Evento> {
    return this.inscripcionRepository.evento(id);
  }
}
