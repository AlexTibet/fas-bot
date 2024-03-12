import { Markup } from 'telegraf';
import type { Message } from 'telegraf/types';
import { ReplyKeyboardMarkup } from '@telegraf/types/markup';

import { IBotContext } from '../../context/context.interface';

import { IExpenseType } from '../../prisma/prisma.interface';

import { BaseScene } from '../base.scene';

import { AddExpensesSceneNames } from './add-expenses.constants';

export class SelectTypeScene extends BaseScene {
  constructor() {
    super(AddExpensesSceneNames.SELECT_TYPE);
    this.init();
  }

  public init(): void {
    this._scene.enter((ctx: IBotContext) => this.enter(ctx));
    this._scene.leave((ctx: IBotContext) => this.leave(ctx));
    this._scene.on('message', (ctx: IBotContext) => this.valueHandler(ctx));
  }

  protected async enter(ctx: IBotContext): Promise<void> {
    await super.enter(ctx);
    const keyboard = this.createTypesKeyboard(ctx.session.user.expenseTypes);
    const _msg = await ctx.reply('Какой тип расходов?', keyboard);

    this.addMsgId(ctx, _msg.message_id);
  }

  private async valueHandler(ctx: IBotContext): Promise<void> {
    const msg = <Message.TextMessage>ctx.message;

    this.addMsgId(ctx, msg.message_id);

    const type = await this._prisma.findExpenseTypeByName(
      ctx.session.user.id,
      msg.text,
    );

    if (!type) {
      const keyboard = this.createTypesKeyboard(ctx.session.user.expenseTypes);
      const _msg = await ctx.reply(
        `Неизвестный тип: ${msg.text}\nНужно указать существующий тип.`,
        keyboard,
      );

      this.addMsgId(ctx, _msg.message_id);

      return;
    }

    ctx.session.sceneData.addExpenses.type = type;

    await ctx.scene.enter(AddExpensesSceneNames.SELECT_DATE);
  }

  private createTypesKeyboard(
    types: IExpenseType[],
  ): Markup.Markup<ReplyKeyboardMarkup> {
    const buttons = types.map((type) => Markup.button.text(type.name));

    return Markup.keyboard(buttons, { columns: 3 });
  }
}
