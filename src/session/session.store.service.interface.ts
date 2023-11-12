import { SessionStore } from 'telegraf';

import { ISessionData } from '../context/context.interface';

export interface ISessionStoreService {
  getStore(): SessionStore<ISessionData>;
}
