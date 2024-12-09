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
  HttpErrors,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {NotificacionesConfig} from '../config/notificaciones.config';
import {Certificado} from '../models';
import {
  CertificadoRepository,
  EventoRepository,
  InscripcionRepository,
} from '../repositories';
import {NotificacionesService} from '../services';

export class CertificadoController {
  constructor(
    @repository(CertificadoRepository)
    public certificadoRepository: CertificadoRepository,
    @repository(InscripcionRepository)
    public inscripcionRepository: InscripcionRepository,
    @repository(EventoRepository)
    public eventoRepository: EventoRepository,
    @service(NotificacionesService)
    public servicioNotificaciones: NotificacionesService,
  ) {}

  @post('/certificado')
  @response(200, {
    description: 'Certificado model instance',
    content: {'application/json': {schema: getModelSchemaRef(Certificado)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Certificado, {
            title: 'NewCertificado',
            exclude: ['id'],
          }),
        },
      },
    })
    certificado: Omit<Certificado, 'id'>,
  ): Promise<Certificado> {
    // Validar que la inscripción asociada existe
    const inscripcionExists = await this.certificadoRepository.inscripcion(
      certificado.inscripcionId,
    );
    if (!inscripcionExists) {
      throw new HttpErrors.NotFound(
        `La inscripción con ID ${certificado.inscripcionId} no existe.`,
      );
    }
    // Crear el certificado
    const createdCertificado =
      await this.certificadoRepository.create(certificado);

  // Actualizar el certificadoId en la inscripción
  await this.inscripcionRepository.updateById(certificado.inscripcionId, {
    certificadoId: createdCertificado.id,
  });
  // Aumentar el numero de asistentes en el evento
  const inscripcion = await this.inscripcionRepository.findById(certificado.inscripcionId);
  const evento = await this.eventoRepository.findById(inscripcion.eventoId);
  await this.eventoRepository.updateById(inscripcion.eventoId, {
    numeroAsistentes: (evento.numeroAsistentes ?? 0) + 1,
  });
  const participante = await this.inscripcionRepository.participante(inscripcion.id);
  const organizador = await this.eventoRepository.organizador(evento.id);
  // Retornar el certificado creado
  try{
    let datos = {
      correoDestino: participante.correo,
      nombreDestino: participante.primerNombre + ' ' + participante.primerApellido,
      asuntoCorreo: 'Certificado de asistencia',
      contenidoCorreo: `${evento.titulo}`+" de la facultad de "+ `${evento.facultad}` + " que dio comienzo el: \n"  + `${evento.fechaInicio}` + " hasta el " + `${evento.fechaFinal}` + " en " + `${evento.lugar}` + "\n organizado por " + `${organizador.primerNombre}` + " " + `${organizador.primerApellido}`,
    }
    let url = NotificacionesConfig.urlNotificationCertificado;
    console.log(datos);
    try{
      this.servicioNotificaciones.EnviarNotificacion(datos,url);
    }catch(error){
      console.error('Error al enviar notificación: ' + error.message);
    }
  }catch(error){
    console.error('Error al enviar notificación: ' + error.message);
  }
  console.log(createdCertificado);
  return createdCertificado;
  }

  @get('/certificado/count')
  @response(200, {
    description: 'Certificado model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Certificado) where?: Where<Certificado>,
  ): Promise<Count> {
    return this.certificadoRepository.count(where);
  }

  @get('/certificado')
  @response(200, {
    description: 'Array of Certificado model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Certificado, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Certificado) filter?: Filter<Certificado>,
  ): Promise<Certificado[]> {
    return this.certificadoRepository.find(filter);
  }

  @patch('/certificado')
  @response(200, {
    description: 'Certificado PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Certificado, {partial: true}),
        },
      },
    })
    certificado: Certificado,
    @param.where(Certificado) where?: Where<Certificado>,
  ): Promise<Count> {
    return this.certificadoRepository.updateAll(certificado, where);
  }

  @get('/certificado/{id}')
  @response(200, {
    description: 'Certificado model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Certificado, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Certificado, {exclude: 'where'})
    filter?: FilterExcludingWhere<Certificado>,
  ): Promise<Certificado> {
    return this.certificadoRepository.findById(id, filter);
  }

  @patch('/certificado/{id}')
  @response(204, {
    description: 'Certificado PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Certificado, {partial: true}),
        },
      },
    })
    certificado: Certificado,
  ): Promise<void> {
    await this.certificadoRepository.updateById(id, certificado);
  }

  @put('/certificado/{id}')
  @response(204, {
    description: 'Certificado PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() certificado: Certificado,
  ): Promise<void> {
    await this.certificadoRepository.replaceById(id, certificado);
  }

  @del('/certificado/{id}')
  @response(204, {
    description: 'Certificado DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {

    const certificado = await this.certificadoRepository.findById(id);
    if (!certificado) {
      throw new HttpErrors.NotFound(`Certificado con ID ${id} no existe.`);
    }

    await this.inscripcionRepository.updateById(certificado.inscripcionId, {
      certificadoId: undefined,
    });

    await this.certificadoRepository.deleteById(id);
  }
}
