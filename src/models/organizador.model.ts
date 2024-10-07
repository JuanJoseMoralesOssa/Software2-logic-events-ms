import {Entity, model, property, hasMany} from '@loopback/repository';
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
    required: true,
  })
  rol: string;

  @property({
    type: 'string',
  })
  facultad?: string;

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
