import { Telegraf } from 'telegraf';

import { IBotContext } from '../context/context.interface';

import { Command } from './command';

export class StartCommand extends Command {
  name = StartCommand.name;
  constructor(bot: Telegraf<IBotContext>) {
    super(bot);
  }

  handle(): void {
    this.bot.start((ctx) => {
      ctx.reply('Hello World!');
    });
  }
}
