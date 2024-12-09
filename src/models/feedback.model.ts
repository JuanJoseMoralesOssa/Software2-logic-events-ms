import {Entity, hasOne, model, property} from '@loopback/repository';
import {Inscripcion} from './inscripcion.model';

@model({
  // settings: {
  //   foreignKeys: {
  //     fk_inscripcion_id: {
  //       name: 'fk_inscripcion_id_feekback',
  //       entity: 'Inscripcion',
  //       entityKey: 'id',
  //       foreignKey: 'inscripcionId',
  //     },
  //   },
  // },
})
export class Feedback extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  comments: string;

  @property({
    type: 'number',
  })
  inscripcionId?: number;

  @property({
    type: 'number',
  })
  overallEventRating?: number;

  @property({
    type: 'number',
  })
  contentQuality?: number;

  @property({
    type: 'number',
  })
  organizationQuality?: number;

  @hasOne(() => Inscripcion)
  inscripcion: Inscripcion;

  constructor(data?: Partial<Feedback>) {
    super(data);
  }
}

export interface FeedbackRelations {
  // describe navigational properties here
}

export type FeedbackWithRelations = Feedback & FeedbackRelations;
