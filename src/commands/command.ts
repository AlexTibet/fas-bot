import { Telegraf } from 'telegraf';

import { IBotContext } from '../context/context.interface';

import { ICommand } from './command.interface';

export abstract class Command implements ICommand {
  abstract name: string;
  protected constructor(protected bot: Telegraf<IBotContext>) {}

  abstract handle(): void;
}
