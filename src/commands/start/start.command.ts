import { Markup, Telegraf } from 'telegraf';
import { InlineKeyboardMarkup } from '@telegraf/types/markup';

import { IBotContext } from '../../context/context.interface';
import { AddExpensesSceneNames } from '../../scenes/add-expenses/add-expenses.constants';
import { sceneDataDefault } from '../../scenes/scene-data.default';

import { IPrismaService } from '../../prisma/prisma.interface';
import PRISMA_TYPES from '../../prisma/prisma.types';

import container from '../../inversify/inversify.config';

import { ILogger } from '../../utils/logger/logger.interface';
import UTILS_TYPES from '../../utils/utils.types';
import { defaultKeyboard } from '../../utils/default.keyboard';

import { Command } from '../command';

export class StartCommand extends Command {
  public readonly name = StartCommand.name;
  private readonly _logger: ILogger;
  private readonly _prisma: IPrismaService;

  constructor(bot: Telegraf<IBotContext>) {
    super(bot);
    this._logger = container.get<ILogger>(UTILS_TYPES.ILogger);
    this._prisma = container.get<IPrismaService>(PRISMA_TYPES.IPrismaService);
  }

  handle(): void {
    this.bot.start(async (ctx: IBotContext) => this.process(ctx));
    this.bot.action('add_expenses_callback', async (ctx: IBotContext) => {
      await ctx.scene.enter(AddExpensesSceneNames.ADD_VALUE);
    });
  }

  private async process(ctx: IBotContext): Promise<void> {
    this._logger.log(`[COMMAND] ${this.name}: `, ctx.from);

    if (ctx.from!.is_bot) return;

    const tId = ctx.from!.id;
    const name =
      ctx.from!.username ?? ctx.from!.first_name + ctx.from!.last_name;

    const user = await this._prisma.findOrCreateUser(tId, name);

    ctx.session = {
      user,
      sceneData: sceneDataDefault,
    };

    const keyboard = this.createStartKeyboard();

    await ctx.reply('FAS-Bot', defaultKeyboard);
    await ctx.reply(`Привет ${ctx.from!.first_name || '!'}`, keyboard);
  }

  private createStartKeyboard(): Markup.Markup<InlineKeyboardMarkup> {
    return Markup.inlineKeyboard(
      [
        Markup.button.callback('Добавить расходы', 'add_expenses_callback'),
        Markup.button.callback('Показать расходы', 'get_expenses_callback'),
      ],
      { columns: 1 },
    );
  }
}
