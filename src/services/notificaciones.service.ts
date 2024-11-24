import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import axios from 'axios';

@injectable({scope: BindingScope.TRANSIENT})
export class NotificacionesService {
  constructor(/* Add @inject to inject parameters */) {}

  async EnviarNotificacion(datos: any, url: string): Promise<boolean> {
    try {
      await axios.post(url, datos, {
        headers: {'Content-Type': 'application/json'},
      });
      console.log('Mensaje enviado con exito');
      return true;
    } catch (error) {
      console.error(
        `Error al enviar notificación: ${error.message}, ` +
          JSON.stringify(error.response.data),
      );
      return false;
    }
  }
}
