import { MiddlewareFn } from 'telegraf';
import { IBotContext } from '../context/context.interface';

export interface IStage {
  middleware(): MiddlewareFn<IBotContext>;
}
