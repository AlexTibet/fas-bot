import { Markup, Telegraf } from 'telegraf';
import { InlineKeyboardMarkup } from '@telegraf/types/markup';

import { IBotContext } from '../../context/context.interface';

import { Command } from '../command';
import { AddExpensesSceneNames } from '../../scenes/add-expenses/add-expenses.constants';

export class StartCommand extends Command {
  name = StartCommand.name;

  constructor(bot: Telegraf<IBotContext>) {
    super(bot);
  }

  handle(): void {
    this.bot.start(async (ctx: IBotContext) => this.process(ctx));

    this.bot.action('add_expenses_callback', async (ctx: IBotContext) => {
      await ctx.scene.enter(AddExpensesSceneNames.ADD_VALUE);
    });
  }

  private async process(ctx: IBotContext): Promise<void> {
    ctx.session ??= { user: ctx.from };
    const keyboard = this.createStartKeyboard();

    await ctx.reply(`Привет ${ctx.session.user?.first_name || '!'}`, keyboard);
  }

  private createStartKeyboard(): Markup.Markup<InlineKeyboardMarkup> {
    return Markup.inlineKeyboard(
      [Markup.button.callback('Добавить расходы', 'add_expenses_callback')],
      { columns: 1 },
    );
  }
}
