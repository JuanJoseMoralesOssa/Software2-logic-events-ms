import {AuthenticationBindings, AuthenticationStrategy} from '@loopback/authentication';
import {AuthenticationMetadata} from '@loopback/authentication/src/types';
import {inject} from '@loopback/context';
import {HttpErrors, Request} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import parseBearerToken from 'parse-bearer-token';
import {SeguridadConfig} from '../config/seguridad.config';
const fetch = require('node-fetch');

export class AuthStrategy implements AuthenticationStrategy {
  name: string = 'auth';

  constructor(
    @inject(AuthenticationBindings.METADATA)
    private metadata: AuthenticationMetadata[],
  ) {

  }

  /**
   * Atenticación deun usuario frente a una acción en la base de datos.
   * @param request la solicitud con el token
   * @returns el perfil de usuacio, undefined cuando no se tiene el permiso o httpError
   */
  async authenticate(request: Request): Promise<UserProfile | undefined> {

    let token = parseBearerToken(request);
    console.log('Antes del if', "token = " + token);
    if (token) {
      console.log('despues del if', "token = " + token);
      let idMenu: string = this.metadata[0].options![0];
      let accion: string = this.metadata[0].options![1];
      console.log(this.metadata);

      // conectar con ms-seguridad
      const datos = {token: token, idMenu: idMenu, accion: accion};
      const urlValidarPermisos = `${SeguridadConfig.securityMicroserviceLink}/validar-permiso`;
      let res = undefined;
      try {
        await fetch(urlValidarPermisos, {
          method: 'post',
          body: JSON.stringify(datos),
          headers: {'Content-Type': 'application/json'},
        }).then((res: any) => res.json())
          .then((json: any) => {
            res = json;
          });
        if (res) {
          let perfil: UserProfile = Object.assign({
            permitido: "OK"
          });
          return perfil;
        } else {
          return undefined;
        }
      } catch (e) {
        throw new HttpErrors[401]("No es posible realizar esta acción por falta de permisos");
      }
    }
    throw new HttpErrors[401]("No es posible realizar esta acción por falta de un token");
  }

}
