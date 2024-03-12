import { Markup } from 'telegraf';
import type { Message } from 'telegraf/types';
import { InlineKeyboardMarkup } from '@telegraf/types/markup';

import { IBotContext } from '../../context/context.interface';

import { BaseScene } from '../base.scene';

import { AddExpensesSceneNames } from './add-expenses.constants';

enum CallbackNames {
  TODAY_DATE = 'today_callback',
  SELECT_DATE = 'select_date_callback',
}

export class SelectDateScene extends BaseScene {
  constructor() {
    super(AddExpensesSceneNames.SELECT_DATE);
    this.init();
  }

  public init(): void {
    this._scene.enter((ctx: IBotContext) => this.enter(ctx));
    this._scene.leave((ctx: IBotContext) => this.leave(ctx));
    this._scene.on('message', (ctx: IBotContext) => this.valueHandler(ctx));
  }

  protected async enter(ctx: IBotContext): Promise<void> {
    await super.enter(ctx);

    this._scene.action(CallbackNames.TODAY_DATE, async (ctx: IBotContext) =>
      this.todayHandler(ctx),
    );
    this._scene.action(CallbackNames.SELECT_DATE, async (ctx: IBotContext) =>
      this.selectDateHandler(ctx),
    );

    const keyboard = this.createSelectDateSceneKeyboard();
    const _msg = await ctx.reply('Какую дату указать?', keyboard);

    this.addMsgId(ctx, _msg.message_id);
  }

  private async valueHandler(ctx: IBotContext): Promise<void> {
    const msg = <Message.TextMessage>ctx.message;

    this.addMsgId(ctx, msg.message_id);

    try {
      const [day, month, year] = msg.text.split('.');

      ctx.session.sceneData.addExpenses.date = new Date(
        `${month}.${day}.${year}`,
      );

      await ctx.scene.enter(AddExpensesSceneNames.ADD_COMMENT);
    } catch (err) {
      this._logger.error(
        `[Scenes]: select data handler error: { tgId: ${ctx.from?.id}}`,
        err as object,
      );
      const _msg = await ctx.reply('Дата должна быть в формате ДД.ММ.ГГГГ:');

      this.addMsgId(ctx, _msg.message_id);
    }
  }

  private createSelectDateSceneKeyboard(): Markup.Markup<InlineKeyboardMarkup> {
    return Markup.inlineKeyboard(
      [
        Markup.button.callback('Сегодня', CallbackNames.TODAY_DATE),
        Markup.button.callback('Другая', CallbackNames.SELECT_DATE),
      ],
      { columns: 2 },
    );
  }

  private async todayHandler(ctx: IBotContext): Promise<void> {
    ctx.session.sceneData.addExpenses.date = new Date();

    await ctx.scene.enter(AddExpensesSceneNames.ADD_COMMENT);
  }

  private async selectDateHandler(ctx: IBotContext): Promise<void> {
    const _msg = await ctx.reply('Укажите дату в формате ДД.ММ.ГГГГ:');

    this.addMsgId(ctx, _msg.message_id);
  }
}
