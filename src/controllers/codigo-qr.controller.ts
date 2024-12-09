import {service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors, param, post, requestBody, response} from '@loopback/rest';
import {NotificacionesConfig} from '../config/notificaciones.config';
import {
  CertificadoRepository,
  EventoRepository,
  InscripcionRepository,
  ParticipanteRepository,
} from '../repositories';
import {NotificacionesService} from '../services';

export class CodigoQrController {
  constructor(

    @repository(ParticipanteRepository)
    public participanteRepository: ParticipanteRepository,
    @repository(InscripcionRepository)
    public inscripcionRepository: InscripcionRepository,
    @repository(EventoRepository)
    public eventoRepository: EventoRepository,
    @repository(CertificadoRepository)
    public certificadoRepository: CertificadoRepository,
    @service(NotificacionesService)
    public servicioNotificaciones: NotificacionesService,
  ) { }

  @post('/codigo-qr/{participanteId}/{eventoId}')
  @response(200, {
    description:
      'Generar código QR con información compacta del participante y evento',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            qrCode: {type: 'string'},
          },
        },
      },
    },
  })
  async generateQRCode(
    @param.path.number('participanteId') participanteId: number,
    @param.path.number('eventoId') eventoId: number,
  ): Promise<{qrCode: string}> {
    // Validar existencia del participante
    const participante =
      await this.participanteRepository.findById(participanteId);
    if (!participante) {
      throw new HttpErrors.NotFound(
        `Participante con ID ${participanteId} no encontrado.`,
      );
    }

    // Validar existencia del evento
    const evento = await this.eventoRepository.findById(eventoId);
    if (!evento) {
      throw new HttpErrors.NotFound(`Evento con ID ${eventoId} no encontrado.`);
    }

    // Verificar si existe inscripción
    const inscripcion = await this.inscripcionRepository.findOne({
        where: {eventoId, participanteId},
    })

    // Compactar los datos para el QR
    const qrData = `${participanteId},${participante.primerNombre},${participante.primerNombre},${eventoId},${evento.titulo},`;
      // Codificar en base64
    const encodedData = Buffer.from(qrData).toString('base64');
    // Generar código QR
    const qrCode = JSON.stringify(encodedData);

    // Retornar el código QR generado
    return {qrCode};
  }

// Endpoint para validar el código QR
@post('/codigo-qr/validar/{eventoId}')
@response(200, {
  description: 'Validar código QR y marcar asistencia',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          isValid: {type: 'boolean'},
          message: {type: 'string'},
        },
      },
    },
  },
})
async validateQRCode(
  @param.path.number('eventoId') eventoId: number,
  @requestBody({
    description: 'Código QR en formato string',
    content: {
      'text/plain': {schema: {type: 'string'}}, // Cambiado para recibir un string
    },
  })
  qrCode: string, // Ahora recibe directamente un string
): Promise<{isValid: boolean; message: string}> {
  try {
    // Decodificar el código QR
    const qrData = Buffer.from(qrCode, 'base64').toString('utf-8');
    const [participanteIdStr, primerNombre, primerApellido, eventoIdFromQRStr, eventotitulo,] = qrData.split(',');
    const participanteId = Number(participanteIdStr);
    const eventoIdFromQR = Number(eventoIdFromQRStr);

    // Verificar que el ID del evento coincida con el proporcionado en el path
    if (eventoIdFromQR !== eventoId) {
      throw new HttpErrors.BadRequest(
        'El código QR no corresponde al evento proporcionado.',
      );
    }
    const evento = await this.eventoRepository.findById(eventoId);
    const inscripcion = await this.inscripcionRepository.findOne({
      where: {participanteId, eventoId},
    });

    if (!inscripcion) {
      throw new HttpErrors.NotFound(
        'Inscripción no encontrada para los datos proporcionados.',
      );
    }


    // Marcar asistencia si aún no se ha marcado
    if (!inscripcion.asistencia) {
      inscripcion.asistencia = true;
      await this.eventoRepository.updateById(inscripcion.eventoId, {
        numeroAsistentes: (evento.numeroAsistentes ?? 0) + 1,
      });
      const participante = await this.inscripcionRepository.participante(inscripcion.id);
      const organizador = await this.eventoRepository.organizador(evento.id);
      await this.inscripcionRepository.updateById(inscripcion.id, inscripcion);
      //Crear certificado
      const certificado = {
        inscripcionId: inscripcion.id,
        descripcion: 'Certificado de asistencia a ' + evento.titulo,
      };
      try {
        const certificadofinal = await this.certificadoRepository.create(certificado);
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
      }catch(error){
        console.error('Error al crear certificado: ' + error.message);
      }

    }
    return {
      isValid: true,
      message: 'Código QR válido y asistencia registrada.',
    };
  } catch (error) {
    if (error instanceof HttpErrors.HttpError) {
      throw error; // Error manejado específicamente
    }
    throw new HttpErrors.BadRequest(
      'Error al procesar el código QR. Verifique el formato.',
    );
  }
}

}
