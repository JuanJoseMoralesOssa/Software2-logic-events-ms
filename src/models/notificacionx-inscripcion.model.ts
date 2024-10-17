import {Entity, model, property} from '@loopback/repository';

@model(
  {
    settings: {
      foreignKeys: {
        fk_inscripcion_id: {
          name: 'fk_inscripcion_id_notificacionxinscripcion',
          entity: 'Inscripcion',
          entityKey: 'id',
          foreignKey: 'inscripcionId',
        },
        fk_notificacion_id: {
          name: 'fk_notificacion_id_notificacionxinscripcion',
          entity: 'Notificacion',
          entityKey: 'id',
          foreignKey: 'notificacionId',
      },
    },
  },
},
)
export class NotificacionxInscripcion extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

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
