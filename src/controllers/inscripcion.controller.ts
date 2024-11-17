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
import {Inscripcion} from '../models';
import {EventoRepository, InscripcionRepository} from '../repositories';

export class InscripcionController {
  constructor(
    @repository(InscripcionRepository)
    public inscripcionRepository : InscripcionRepository,
    @repository(EventoRepository)
    public eventoRepository : EventoRepository,
  ) {}

  @post('/inscripcion')
  @response(200, {
    description: 'Inscripcion model instance',
    content: {'application/json': {schema: getModelSchemaRef(Inscripcion)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Inscripcion, {
            title: 'NewInscripcion',
            exclude: ['id'],
          }),
        },
      },
    })
    inscripcion: Omit<Inscripcion, 'id'>,
  ): Promise<Inscripcion> {
    // Validar que el evento asociado existe
    const eventoExists = await this.eventoRepository.exists(inscripcion.eventoId);
    if (!eventoExists) {
      throw new HttpErrors.NotFound(
        `El evento con ID ${inscripcion.eventoId} no existe.`
      );
    }
    // Verificar si el cupo ya está completo
    const evento = await this.eventoRepository.findById(inscripcion.eventoId);
    const totalInscripciones = await this.inscripcionRepository.count({
    eventoId: inscripcion.eventoId,
    });

    // Verificar solapamientos (si aplica)
    const existingInscripciones = await this.inscripcionRepository.find({
      where: {participanteId: inscripcion.participanteId},
    });

    if (totalInscripciones.count >= evento.cupoInscripcion) {
      throw new HttpErrors.BadRequest(
      `No hay plazas disponibles para el evento "${evento.titulo}".`
      );
    }

    if (existingInscripciones.length > 0) {
      const conflictingInscripciones = await this.inscripcionRepository.find({
        where: {
          participanteId: inscripcion.participanteId,
        },
        include: [
          {
            relation: 'evento',
            scope: {
              where: {
                and: [
                  {fechaInicio: {lte: evento.fechaFinal}},
                  {fechaFinal: {gte: evento.fechaInicio}},
                ],
              },
            },
          },
        ],
      });

      if (conflictingInscripciones.length > 0) {
        throw new HttpErrors.BadRequest(
          `El participante ya está inscrito en un evento que se solapa con estas fechas.`
        );
      }
    }

    // Crear la inscripción si no hay conflictos
    return this.inscripcionRepository.create(inscripcion);
  }



  @get('/incripcion/count')
  @response(200, {
    description: 'Inscripcion model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Inscripcion) where?: Where<Inscripcion>,
  ): Promise<Count> {
    return this.inscripcionRepository.count(where);
  }

  @get('/incripcion')
  @response(200, {
    description: 'Array of Inscripcion model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Inscripcion, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Inscripcion) filter?: Filter<Inscripcion>,
  ): Promise<Inscripcion[]> {
    return this.inscripcionRepository.find(filter);
  }

  @patch('/incripcion')
  @response(200, {
    description: 'Inscripcion PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Inscripcion, {partial: true}),
        },
      },
    })
    inscripcion: Inscripcion,
    @param.where(Inscripcion) where?: Where<Inscripcion>,
  ): Promise<Count> {
    return this.inscripcionRepository.updateAll(inscripcion, where);
  }

  @get('/incripcion/{id}')
  @response(200, {
    description: 'Inscripcion model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Inscripcion, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Inscripcion, {exclude: 'where'}) filter?: FilterExcludingWhere<Inscripcion>
  ): Promise<Inscripcion> {
    return this.inscripcionRepository.findById(id, filter);
  }

  @patch('/incripcion/{id}')
  @response(204, {
    description: 'Inscripcion PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Inscripcion, {partial: true}),
        },
      },
    })
    inscripcion: Inscripcion,
  ): Promise<void> {
    await this.inscripcionRepository.updateById(id, inscripcion);
  }

  @put('/incripcion/{id}')
  @response(204, {
    description: 'Inscripcion PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() inscripcion: Inscripcion,
  ): Promise<void> {
    await this.inscripcionRepository.replaceById(id, inscripcion);
  }

  @del('/incripcion/{id}')
  @response(204, {
    description: 'Inscripcion DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.inscripcionRepository.deleteById(id);
  }
}
