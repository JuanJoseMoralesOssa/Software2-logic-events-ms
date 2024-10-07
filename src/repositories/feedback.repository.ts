import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasOneRepositoryFactory} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {Feedback, FeedbackRelations, Inscripcion} from '../models';
import {InscripcionRepository} from './inscripcion.repository';

export class FeedbackRepository extends DefaultCrudRepository<
  Feedback,
  typeof Feedback.prototype.id,
  FeedbackRelations
> {

  public readonly inscripcion: HasOneRepositoryFactory<Inscripcion, typeof Feedback.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('InscripcionRepository') protected inscripcionRepositoryGetter: Getter<InscripcionRepository>,
  ) {
    super(Feedback, dataSource);
    this.inscripcion = this.createHasOneRepositoryFactoryFor('inscripcion', inscripcionRepositoryGetter);
    this.registerInclusionResolver('inscripcion', this.inscripcion.inclusionResolver);
  }
}
