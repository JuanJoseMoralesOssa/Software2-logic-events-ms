import {/* inject, */ BindingScope, injectable} from '@loopback/core';
const axios = require('axios');

const LOGIC_URL = 'http://localhost:3000/';

@injectable({scope: BindingScope.TRANSIENT})
export class LogicaNegocioService {
  constructor() {}

  async obtenerQR(participanteId: number, eventoId: number): Promise<string> {
    try {
      const response = await axios.post(
        LOGIC_URL+`codigo-qr/${participanteId}/${eventoId}`,
        {
          headers: {'Content-Type': 'application/json'},
        },
      );
      return response.data.qrCode || '';
    } catch (error) {
      console.error(
        `Error al obtener QR: ${error.message}, ` +
          JSON.stringify(error.response.data),
      );
      return '';
    }
  }
}
