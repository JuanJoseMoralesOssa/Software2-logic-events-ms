import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {Organizador, OrganizadorRelations, Evento} from '../models';
import {EventoRepository} from './evento.repository';

export class OrganizadorRepository extends DefaultCrudRepository<
  Organizador,
  typeof Organizador.prototype.id,
  OrganizadorRelations
> {

  public readonly eventos: HasManyRepositoryFactory<Evento, typeof Organizador.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('EventoRepository') protected eventoRepositoryGetter: Getter<EventoRepository>,
  ) {
    super(Organizador, dataSource);
    this.eventos = this.createHasManyRepositoryFactoryFor('eventos', eventoRepositoryGetter,);
    this.registerInclusionResolver('eventos', this.eventos.inclusionResolver);
  }
}
