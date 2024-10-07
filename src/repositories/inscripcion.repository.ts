import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor, HasOneRepositoryFactory, HasManyThroughRepositoryFactory} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {Inscripcion, InscripcionRelations, Evento, Participante, Feedback, Certificado, Notificacion, NotificacionxInscripcion} from '../models';
import {EventoRepository} from './evento.repository';
import {ParticipanteRepository} from './participante.repository';
import {FeedbackRepository} from './feedback.repository';
import {CertificadoRepository} from './certificado.repository';
import {NotificacionxInscripcionRepository} from './notificacionx-inscripcion.repository';
import {NotificacionRepository} from './notificacion.repository';

export class InscripcionRepository extends DefaultCrudRepository<
  Inscripcion,
  typeof Inscripcion.prototype.id,
  InscripcionRelations
> {

  public readonly evento: BelongsToAccessor<Evento, typeof Inscripcion.prototype.id>;

  public readonly participante: BelongsToAccessor<Participante, typeof Inscripcion.prototype.id>;

  public readonly feedback: HasOneRepositoryFactory<Feedback, typeof Inscripcion.prototype.id>;

  public readonly certificado: HasOneRepositoryFactory<Certificado, typeof Inscripcion.prototype.id>;

  public readonly notificaciones: HasManyThroughRepositoryFactory<Notificacion, typeof Notificacion.prototype.id,
          NotificacionxInscripcion,
          typeof Inscripcion.prototype.id
        >;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('EventoRepository') protected eventoRepositoryGetter: Getter<EventoRepository>, @repository.getter('ParticipanteRepository') protected participanteRepositoryGetter: Getter<ParticipanteRepository>, @repository.getter('FeedbackRepository') protected feedbackRepositoryGetter: Getter<FeedbackRepository>, @repository.getter('CertificadoRepository') protected certificadoRepositoryGetter: Getter<CertificadoRepository>, @repository.getter('NotificacionxInscripcionRepository') protected notificacionxInscripcionRepositoryGetter: Getter<NotificacionxInscripcionRepository>, @repository.getter('NotificacionRepository') protected notificacionRepositoryGetter: Getter<NotificacionRepository>,
  ) {
    super(Inscripcion, dataSource);
    this.notificaciones = this.createHasManyThroughRepositoryFactoryFor('notificaciones', notificacionRepositoryGetter, notificacionxInscripcionRepositoryGetter,);
    this.registerInclusionResolver('notificaciones', this.notificaciones.inclusionResolver);
    this.certificado = this.createHasOneRepositoryFactoryFor('certificado', certificadoRepositoryGetter);
    this.registerInclusionResolver('certificado', this.certificado.inclusionResolver);
    this.feedback = this.createHasOneRepositoryFactoryFor('feedback', feedbackRepositoryGetter);
    this.registerInclusionResolver('feedback', this.feedback.inclusionResolver);
    this.participante = this.createBelongsToAccessorFor('participante', participanteRepositoryGetter,);
    this.registerInclusionResolver('participante', this.participante.inclusionResolver);
    this.evento = this.createBelongsToAccessorFor('evento', eventoRepositoryGetter,);
    this.registerInclusionResolver('evento', this.evento.inclusionResolver);
  }
}
