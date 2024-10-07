import {Entity, model, property} from '@loopback/repository';

@model()
export class NotificacionxInscripcion extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'number',
    required: true,
  })
  idNotificacion: number;

  @property({
    type: 'number',
    required: true,
  })
  idInscripcion: number;

  @property({
    type: 'number',
  })
  inscripcionId?: number;

  @property({
    type: 'number',
  })
  notificacionId?: number;

  constructor(data?: Partial<NotificacionxInscripcion>) {
    super(data);
  }
}

export interface NotificacionxInscripcionRelations {
  // describe navigational properties here
}

export type NotificacionxInscripcionWithRelations = NotificacionxInscripcion & NotificacionxInscripcionRelations;
