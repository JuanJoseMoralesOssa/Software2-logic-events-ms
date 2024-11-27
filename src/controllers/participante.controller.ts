import {service} from '@loopback/core';
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
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {NotificacionesConfig} from '../config/notificaciones.config';
import {Participante} from '../models';
import {InscripcionRepository, ParticipanteRepository} from '../repositories';
import {NotificacionesService} from '../services/notificaciones.service';

export class ParticipanteController {
  constructor(
    @repository(ParticipanteRepository)
    public participanteRepository: ParticipanteRepository,
    @repository(InscripcionRepository)
    public inscripcionRepository: InscripcionRepository,
    @service(NotificacionesService)
    public servicioNotificaciones: NotificacionesService,
  ) {}

  @post('/participante')
  @response(200, {
    description: 'Participante model instance',
    content: {'application/json': {schema: getModelSchemaRef(Participante)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Participante, {
            title: 'NewParticipante',
            exclude: ['id'],
          }),
        },
      },
    })
    participante: Omit<Participante, 'id'>,
  ): Promise<Participante> {
    //enviar correo de bienvenida
    try {
      let datos = {
        correoDestino: participante.correo,
        nombreDestino:
          participante.primerNombre + ' ' + participante.primerApellido,
        asuntoCorreo: 'Bienvenida',
        contenidoCorreo: 'Bienvenido a la plataforma de eventos',
      };
      let url = NotificacionesConfig.urlNotificationBienvenida;
      try {
        this.servicioNotificaciones.EnviarNotificacion(datos, url);
        console.log('Mensaje aceptado');
      } catch (error) {
        console.log('error');
      }
    } catch (error) {
      console.log(error);
    }

    return this.participanteRepository.create(participante);
  }

  @get('/participante/count')
  @response(200, {
    description: 'Participante model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Participante) where?: Where<Participante>,
  ): Promise<Count> {
    return this.participanteRepository.count(where);
  }

  @get('/participante')
  @response(200, {
    description: 'Array of Participante model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Participante, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Participante) filter?: Filter<Participante>,
  ): Promise<Participante[]> {
    return this.participanteRepository.find(filter);
  }

  @patch('/participante')
  @response(200, {
    description: 'Participante PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Participante, {partial: true}),
        },
      },
    })
    participante: Participante,
    @param.where(Participante) where?: Where<Participante>,
  ): Promise<Count> {
    return this.participanteRepository.updateAll(participante, where);
  }

  @get('/participante/{id}')
  @response(200, {
    description: 'Participante model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Participante, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Participante, {exclude: 'where'})
    filter?: FilterExcludingWhere<Participante>,
  ): Promise<Participante> {
    return this.participanteRepository.findById(id, filter);
  }

  @patch('/participante/{id}')
  @response(204, {
    description: 'Participante PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Participante, {partial: true}),
        },
      },
    })
    participante: Participante,
  ): Promise<void> {
    await this.participanteRepository.updateById(id, participante);
  }

  @put('/participante/{id}')
  @response(204, {
    description: 'Participante PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() participante: Participante,
  ): Promise<void> {
    await this.participanteRepository.replaceById(id, participante);
  }

  @del('/participante/{id}')
  @response(204, {
    description: 'Participante DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    const inscripciones = await this.inscripcionRepository.find({
      where: {eventoId: id},
    });
    for (const inscripcion of inscripciones) {
      await this.inscripcionRepository.deleteById(inscripcion.id!);
    }
    await this.participanteRepository.deleteById(id);
  }
}
