import {Entity, hasMany, model, property} from '@loopback/repository';
import {Inscripcion} from './inscripcion.model';

@model()
export class Participante extends Entity {
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
  primerNombre: string;

  @property({
    type: 'string',
  })
  segundoNombre?: string;

  @property({
    type: 'string',
    required: true,
  })
  primerApellido: string;

  @property({
    type: 'string',
  })
  segundoApellido?: string;

  @property({
    type: 'string',
    required: true,
  })
  correo: string;

  @property({
    type: 'string',
    required: true,
  })
  celular: string;

  @hasMany(() => Inscripcion)
  inscripciones: Inscripcion[];

  constructor(data?: Partial<Participante>) {
    super(data);
  }
}

export interface ParticipanteRelations {
  // describe navigational properties here
}

export type ParticipanteWithRelations = Participante & ParticipanteRelations;
