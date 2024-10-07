import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Evento,
  Organizador,
} from '../models';
import {EventoRepository} from '../repositories';

export class EventoOrganizadorController {
  constructor(
    @repository(EventoRepository)
    public eventoRepository: EventoRepository,
  ) { }

  @get('/eventos/{id}/organizador', {
    responses: {
      '200': {
        description: 'Organizador belonging to Evento',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Organizador),
          },
        },
      },
    },
  })
  async getOrganizador(
    @param.path.number('id') id: typeof Evento.prototype.id,
  ): Promise<Organizador> {
    return this.eventoRepository.organizador(id);
  }
}
