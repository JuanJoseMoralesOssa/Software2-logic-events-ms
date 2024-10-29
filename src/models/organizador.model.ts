import {Entity, hasMany, model, property} from '@loopback/repository';
import {Evento} from './evento.model';

@model()
export class Organizador extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
  })
  facultad?: string;

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

  @hasMany(() => Evento)
  eventos: Evento[];

  constructor(data?: Partial<Organizador>) {
    super(data);
  }
}

export interface OrganizadorRelations {
  // describe navigational properties here
}

export type OrganizadorWithRelations = Organizador & OrganizadorRelations;
