import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {Participante, ParticipanteRelations, Inscripcion} from '../models';
import {InscripcionRepository} from './inscripcion.repository';

export class ParticipanteRepository extends DefaultCrudRepository<
  Participante,
  typeof Participante.prototype.id,
  ParticipanteRelations
> {

  public readonly inscripciones: HasManyRepositoryFactory<Inscripcion, typeof Participante.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('InscripcionRepository') protected inscripcionRepositoryGetter: Getter<InscripcionRepository>,
  ) {
    super(Participante, dataSource);
    this.inscripciones = this.createHasManyRepositoryFactoryFor('inscripciones', inscripcionRepositoryGetter,);
    this.registerInclusionResolver('inscripciones', this.inscripciones.inclusionResolver);
  }
}
