import {Entity, model, property, belongsTo, hasMany} from '@loopback/repository';
import {Organizador} from './organizador.model';
import {Inscripcion} from './inscripcion.model';

@model()
export class Evento extends Entity {
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
  facultad: string;

  @property({
    type: 'string',
    required: true,
  })
  tematica: string;

  @property({
    type: 'date',
    required: true,
  })
  fechaInicio: string;

  @property({
    type: 'date',
    required: true,
  })
  fechaFinal: string;

  @property({
    type: 'string',
    required: true,
  })
  tipoEvento: string;

  @property({
    type: 'number',
    required: true,
  })
  cupoInscripcion: number;

  @property({
    type: 'number',
  })
  numeroAsistentes?: number;

  @property({
    type: 'number',
    required: true,
  })
  idOrganizador: number;

  @belongsTo(() => Organizador)
  organizadorId: number;

  @hasMany(() => Inscripcion)
  inscripcions: Inscripcion[];

  constructor(data?: Partial<Evento>) {
    super(data);
  }
}

export interface EventoRelations {
  // describe navigational properties here
}

export type EventoWithRelations = Evento & EventoRelations;
