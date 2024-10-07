import {Entity, model, property, belongsTo, hasOne, hasMany} from '@loopback/repository';
import {Evento} from './evento.model';
import {Participante} from './participante.model';
import {Feedback} from './feedback.model';
import {Certificado} from './certificado.model';
import {Notificacion} from './notificacion.model';
import {NotificacionxInscripcion} from './notificacionx-inscripcion.model';

@model()
export class Inscripcion extends Entity {
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
  idEvento: number;

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
