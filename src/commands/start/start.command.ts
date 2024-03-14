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
import { GetExpensesSceneNames } from '../../scenes/get-expenses/get-expenses.constants';

enum StartCommandCallbackNames {
  ADD_EXPENSES = 'add_expenses_callback',
  GET_EXPENSES = 'get_expenses_callback',
}

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
    this.bot.action(
      StartCommandCallbackNames.ADD_EXPENSES,
      async (ctx: IBotContext) => {
        await ctx.scene.enter(AddExpensesSceneNames.ADD_VALUE);
      },
    );
    this.bot.action(
      StartCommandCallbackNames.GET_EXPENSES,
      async (ctx: IBotContext) => {
        await ctx.scene.enter(GetExpensesSceneNames.SELECT_FILTER);
      },
    );
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
        Markup.button.callback(
          'Добавить расходы',
          StartCommandCallbackNames.ADD_EXPENSES,
        ),
        Markup.button.callback(
          'Показать расходы',
          StartCommandCallbackNames.GET_EXPENSES,
        ),
      ],
      { columns: 1 },
    );
  }
}
