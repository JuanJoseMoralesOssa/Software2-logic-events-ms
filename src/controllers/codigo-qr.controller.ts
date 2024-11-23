import {
  repository
} from '@loopback/repository';
import {
  get,
  HttpErrors,
  param,
  response
} from '@loopback/rest';
import QRCode from 'qrcode';
import {
  EventoRepository,
  InscripcionRepository,
  ParticipanteRepository
} from '../repositories';

export class CodigoQrController {
  constructor(
    @repository(ParticipanteRepository)
    public participanteRepository: ParticipanteRepository,
    @repository(InscripcionRepository)
    public inscripcionRepository: InscripcionRepository,
    @repository(EventoRepository)
    public eventoRepository: EventoRepository,
  ) { }

  @get('/codigo-qr/{participanteId}/{eventoId}')
  @response(200, {
    description: 'Generar código QR con información compacta del participante y evento',
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
    const participante = await this.participanteRepository.findById(participanteId);
    if (!participante) {
      throw new HttpErrors.NotFound(`Participante con ID ${participanteId} no encontrado.`);
    }

    // Validar existencia del evento
    const evento = await this.eventoRepository.findById(eventoId);
    if (!evento) {
      throw new HttpErrors.NotFound(`Evento con ID ${eventoId} no encontrado.`);
    }

    // Compactar los datos para el QR
    const data = {
      participante: {
        primerNombre: participante.primerNombre,
        primerApellido: participante.primerApellido,
        segundoNombre: participante.segundoNombre, // Si existe
        segundoApellido: participante.segundoApellido, // Si existe
        correo: participante.correo,
      },
      evento: {
        titulo: evento.titulo,
        descripcion: evento.descripcion, // Información adicional
        lugar: evento.lugar,
        fechaInicio: evento.fechaInicio,
        fechaFinal: evento.fechaFinal,
      },
    };

    // Generar código QR
    const qrCode = await QRCode.toDataURL(JSON.stringify(data));

    // Verificar si existe inscripción
    const inscripcion = await this.inscripcionRepository.findOne({
      where: {eventoId, participanteId},
    });

    if (inscripcion) {
      // Actualizar la inscripción con el QR
      inscripcion.asistencia = qrCode;
      await this.inscripcionRepository.updateById(inscripcion.id, inscripcion);
    }

    // Retornar el código QR generado
    return {qrCode};
  }
}
