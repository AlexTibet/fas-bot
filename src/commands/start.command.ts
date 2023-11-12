import { Markup, Telegraf } from 'telegraf';

import { IBotContext } from '../context/context.interface';

import { Command } from './command';

export class StartCommand extends Command {
  name = StartCommand.name;

  constructor(bot: Telegraf<IBotContext>) {
    super(bot);
  }

  handle(): void {
    this.bot.start(async (ctx: IBotContext) => {
      ctx.session ??= { firstSessionData: false, secondSessionData: false };

      const keyboard = Markup.inlineKeyboard([
        Markup.button.callback('First', 'first_callback'),
        Markup.button.callback('Second', 'second_callback'),
      ]);

      await ctx.reply('Hello World!', keyboard);
    });

    this.bot.action('first_callback', async (ctx: IBotContext) => {
      ctx.session.firstSessionData = true;
      await ctx.editMessageText('First edited hello world');
    });

    this.bot.action('second_callback', async (ctx: IBotContext) => {
      ctx.session.secondSessionData = true;
    });
  }
}
