import {Entity, model, property, hasMany} from '@loopback/repository';
import {Inscripcion} from './inscripcion.model';
import {NotificacionxInscripcion} from './notificacionx-inscripcion.model';

@model()
export class Notificacion extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'date',
    required: true,
  })
  fecha: string;

  @property({
    type: 'string',
    required: true,
  })
  asunto: string;

  @property({
    type: 'string',
    required: true,
  })
  mensaje: string;

  @property({
    type: 'string',
    required: true,
  })
  remitente: string;

  @property({
    type: 'string',
    required: true,
  })
  destinatario: string;

  @hasMany(() => Inscripcion, {through: {model: () => NotificacionxInscripcion}})
  inscripciones: Inscripcion[];

  constructor(data?: Partial<Notificacion>) {
    super(data);
  }
}

export interface NotificacionRelations {
  // describe navigational properties here
}

export type NotificacionWithRelations = Notificacion & NotificacionRelations;
