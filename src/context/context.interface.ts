import { Context } from 'telegraf';

interface SessionData {
  firstSessionData: string;
  secondSessionData: string;
}

export interface IBotContext extends Context {
  session: SessionData;
}
