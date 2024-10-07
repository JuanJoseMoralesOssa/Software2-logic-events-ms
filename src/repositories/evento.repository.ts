import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor, HasManyRepositoryFactory} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {Evento, EventoRelations, Organizador, Inscripcion} from '../models';
import {OrganizadorRepository} from './organizador.repository';
import {InscripcionRepository} from './inscripcion.repository';

export class EventoRepository extends DefaultCrudRepository<
  Evento,
  typeof Evento.prototype.id,
  EventoRelations
> {

  public readonly organizador: BelongsToAccessor<Organizador, typeof Evento.prototype.id>;

  public readonly inscripcions: HasManyRepositoryFactory<Inscripcion, typeof Evento.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('OrganizadorRepository') protected organizadorRepositoryGetter: Getter<OrganizadorRepository>, @repository.getter('InscripcionRepository') protected inscripcionRepositoryGetter: Getter<InscripcionRepository>,
  ) {
    super(Evento, dataSource);
    this.inscripcions = this.createHasManyRepositoryFactoryFor('inscripcions', inscripcionRepositoryGetter,);
    this.registerInclusionResolver('inscripcions', this.inscripcions.inclusionResolver);
    this.organizador = this.createBelongsToAccessorFor('organizador', organizadorRepositoryGetter,);
    this.registerInclusionResolver('organizador', this.organizador.inclusionResolver);
  }
}
