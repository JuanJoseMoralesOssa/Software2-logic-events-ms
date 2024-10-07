import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyThroughRepositoryFactory} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {Notificacion, NotificacionRelations, Inscripcion, NotificacionxInscripcion} from '../models';
import {NotificacionxInscripcionRepository} from './notificacionx-inscripcion.repository';
import {InscripcionRepository} from './inscripcion.repository';

export class NotificacionRepository extends DefaultCrudRepository<
  Notificacion,
  typeof Notificacion.prototype.id,
  NotificacionRelations
> {

  public readonly inscripciones: HasManyThroughRepositoryFactory<Inscripcion, typeof Inscripcion.prototype.id,
          NotificacionxInscripcion,
          typeof Notificacion.prototype.id
        >;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('NotificacionxInscripcionRepository') protected notificacionxInscripcionRepositoryGetter: Getter<NotificacionxInscripcionRepository>, @repository.getter('InscripcionRepository') protected inscripcionRepositoryGetter: Getter<InscripcionRepository>,
  ) {
    super(Notificacion, dataSource);
    this.inscripciones = this.createHasManyThroughRepositoryFactoryFor('inscripciones', inscripcionRepositoryGetter, notificacionxInscripcionRepositoryGetter,);
    this.registerInclusionResolver('inscripciones', this.inscripciones.inclusionResolver);
  }
}
