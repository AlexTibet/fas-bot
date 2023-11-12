import { injectable, inject } from 'inversify';
import { SessionStore } from 'telegraf';

import { ISessionData } from '../context/context.interface';

import CONFIG_TYPES from '../config/config.types';
import { IConfigService } from '../config/config.service.interface';

import { ISessionStoreService } from './session.store.service.interface';
import { MongoSessionStore } from './mongo.session.store';

@injectable()
export class SessionStoreService implements ISessionStoreService {
  constructor(
    @inject(CONFIG_TYPES.IConfigService)
    private readonly config: IConfigService,
  ) {}

  getStore(): SessionStore<ISessionData> {
    return new MongoSessionStore(this.config);
  }
}
