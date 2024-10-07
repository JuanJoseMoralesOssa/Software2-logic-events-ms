import {Entity, hasOne, model, property} from '@loopback/repository';
import {Inscripcion} from './inscripcion.model';

@model()
export class Certificado extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
  })
  descripcion?: string;

  @hasOne(() => Inscripcion)
  inscripcion: Inscripcion;

  @property({
    type: 'number',
  })
  inscripcionId?: number;

  constructor(data?: Partial<Certificado>) {
    super(data);
  }
}

export interface CertificadoRelations {
  // describe navigational properties here
}

export type CertificadoWithRelations = Certificado & CertificadoRelations;
