import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {NotificacionxInscripcion, NotificacionxInscripcionRelations} from '../models';

export class NotificacionxInscripcionRepository extends DefaultCrudRepository<
  NotificacionxInscripcion,
  typeof NotificacionxInscripcion.prototype.id,
  NotificacionxInscripcionRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(NotificacionxInscripcion, dataSource);
  }
}
