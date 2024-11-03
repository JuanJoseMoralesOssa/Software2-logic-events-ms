import {
  belongsTo,
  Entity,
  hasMany,
  model,
  property,
} from '@loopback/repository';
import {Inscripcion} from './inscripcion.model';
import {Organizador} from './organizador.model';

@model({
  settings: {
    foreignKeys: {
      fk_organizador_id: {
        name: 'fk_organizador_id_evento',
        entity: 'Organizador',
        entityKey: 'id',
        foreignKey: 'organizadorId',
      },
    },
  },
})
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
  titulo: string;

  @property({
    type: 'string',
    // required: true,
  })
  facultad?: string;

  @property({
    type: 'string',
    // required: true,
  })
  tematica?: string;

  @property({
    type: 'string',
    // required: true,
  })
  tipoEvento?: string;

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
    type: 'number',
    required: true,
  })
  cupoInscripcion: number;

  @property({
    type: 'number',
  })
  numeroAsistentes?: number;

  @property({
    type: 'string',
    required: true,
  })
  lugar?: string;

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
