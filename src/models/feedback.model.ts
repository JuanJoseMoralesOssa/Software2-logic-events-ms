import {Entity, model, property, hasOne} from '@loopback/repository';
import {Inscripcion} from './inscripcion.model';

@model()
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
  descripcion: string;

  @property({
    type: 'number',
    required: true,
  })
  idInscripcion: number;

  @property({
    type: 'number',
  })
  inscripcionId?: number;

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
