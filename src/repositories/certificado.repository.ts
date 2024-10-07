import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasOneRepositoryFactory} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {Certificado, CertificadoRelations, Inscripcion} from '../models';
import {InscripcionRepository} from './inscripcion.repository';

export class CertificadoRepository extends DefaultCrudRepository<
  Certificado,
  typeof Certificado.prototype.id,
  CertificadoRelations
> {

  public readonly inscripcion: HasOneRepositoryFactory<Inscripcion, typeof Certificado.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('InscripcionRepository') protected inscripcionRepositoryGetter: Getter<InscripcionRepository>,
  ) {
    super(Certificado, dataSource);
    this.inscripcion = this.createHasOneRepositoryFactoryFor('inscripcion', inscripcionRepositoryGetter);
    this.registerInclusionResolver('inscripcion', this.inscripcion.inclusionResolver);
  }
}
