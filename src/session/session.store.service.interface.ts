import { SessionStore } from 'telegraf';

import { IBotContext } from '../context/context.interface';

export interface ISessionStoreService {
  getStore(): SessionStore<IBotContext>;
}
