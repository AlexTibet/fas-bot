import { Container } from 'inversify';

import CONFIG_TYPES from '../config/config.types';
import { IConfigService } from '../config/config.service.interface';
import { ConfigService } from '../config/config.service';

import SESSION_TYPES from '../session/session.types';
import { ISessionStoreService } from '../session/session.store.service.interface';
import { SessionStoreService } from '../session/session.store.service';

const container = new Container();

/** Config */
container.bind<IConfigService>(CONFIG_TYPES.IConfigService).to(ConfigService);

/** Session */
container
  .bind<ISessionStoreService>(SESSION_TYPES.ISessionStoreService)
  .to(SessionStoreService);

export default container;
