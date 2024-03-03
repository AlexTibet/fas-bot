import { MiddlewareFn } from 'telegraf';
import { IBotContext } from '../context/context.interface';

export interface IStage {
  name: string;
  middleware(): MiddlewareFn<IBotContext>;
}
