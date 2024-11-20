import {
  repository
} from '@loopback/repository';
import {
  get,
  param,
  response
} from '@loopback/rest';
import QRCode from 'qrcode'; // Importamos el paquete qrcode
import {EventoRepository, ParticipanteRepository} from '../repositories'; // Repositorios necesarios

export class CodigoQrController {
  constructor(
    @repository(ParticipanteRepository)
    public participanteRepository: ParticipanteRepository,
    @repository(EventoRepository)
    public eventoRepository: EventoRepository, // Usamos el repositorio de Evento para obtener los eventos
  ) { }

  // Endpoint para crear un código QR para un participante y un evento
  @get('/codigo-qr/{participanteId}/{eventoId}')
  @response(200, {
    description: 'Generar código QR con la información del participante y evento',
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
    // Obtener participante
    const participante = await this.participanteRepository.findById(participanteId);
    // Obtener evento
    const evento = await this.eventoRepository.findById(eventoId);

    // Crear un objeto con la información que será codificada en el QR
    const data = {
      participante: {
        primerNombre: participante.primerNombre,
        primerApellido: participante.primerApellido,
        correo: participante.correo,
        celular: participante.celular,
      },
      evento: {
        titulo: evento.titulo,
        lugar: evento.lugar,
        fechaInicio: evento.fechaInicio,
        fechaFinal: evento.fechaFinal,
      },
    };

    // Generar el código QR con la información del participante y evento
    const qrCode = await QRCode.toDataURL(JSON.stringify(data));

    // Retornar el QR generado como una URL de imagen
    return {qrCode};
  }
}
