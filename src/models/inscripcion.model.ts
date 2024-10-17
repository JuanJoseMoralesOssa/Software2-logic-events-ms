import {belongsTo, Entity, hasMany, hasOne, model, property} from '@loopback/repository';
import {Certificado} from './certificado.model';
import {Evento} from './evento.model';
import {Feedback} from './feedback.model';
import {Notificacion} from './notificacion.model';
import {NotificacionxInscripcion} from './notificacionx-inscripcion.model';
import {Participante} from './participante.model';

@model(
  {
    settings: {
      foreignKeys: {
        fk_evento_id: {
          name: 'fk_evento_id_inscripcion',
          entity: 'Evento',
          entityKey: 'id',
          foreignKey: 'eventoId',
        },
        fk_participante_id: {
          name: 'fk_participante_id_inscripcion',
          entity: 'Participante',
          entityKey: 'id',
          foreignKey: 'participanteId',
        },
        fk_feedback_id: {
          name: 'fk_feedback_id_inscripcion',
          entity: 'Feedback',
          entityKey: 'id',
          foreignKey: 'feedbackId',
        },
        fk_certificado_id: {
          name: 'fk_certificado_id_inscripcion',
          entity: 'Certificado',
          entityKey: 'id',
          foreignKey: 'certificadoId',
        },
      },
    },
  },
)
export class Inscripcion extends Entity {
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

  @belongsTo(() => Evento)
  eventoId: number;

  @belongsTo(() => Participante)
  participanteId: number;

  @hasOne(() => Feedback)
  feedback: Feedback;

  @property({
    type: 'number',
  })
  feedbackId?: number;

  @property({
    type: 'number',
  })
  certificadoId?: number;

  @hasOne(() => Certificado)
  certificado: Certificado;

  @hasMany(() => Notificacion, {through: {model: () => NotificacionxInscripcion}})
  notificaciones: Notificacion[];

  constructor(data?: Partial<Inscripcion>) {
    super(data);
  }
}

export interface InscripcionRelations {
  // describe navigational properties here
}

export type InscripcionWithRelations = Inscripcion & InscripcionRelations;
