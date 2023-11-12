import type { Context } from 'telegraf';
import type { Update } from 'telegraf/types';

export interface ISessionData {
  firstSessionData?: boolean;
  secondSessionData?: boolean;
}

export interface IBotContext<U extends Update = Update> extends Context<U> {
  session: ISessionData;
}
