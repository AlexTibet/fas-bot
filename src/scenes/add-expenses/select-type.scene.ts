import { Markup } from 'telegraf';
import type { Message } from 'telegraf/types';
import { ReplyKeyboardMarkup } from '@telegraf/types/markup';

import { IBotContext } from '../../context/context.interface';

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
    const keyboard = this.createTypesKeyboard();
    const _msg = await ctx.reply('Какой тип траты?', keyboard);

    this.addMsgId(ctx, _msg.message_id);
  }

  private async valueHandler(ctx: IBotContext): Promise<void> {
    const msg = <Message.TextMessage>ctx.message;

    ctx.session.sceneData.addExpenses.type = msg.text;

    const _msg = await ctx.reply(`Тип: ${msg.text}\n Готово.`);

    this.addMsgId(ctx, msg.message_id);
    this.addMsgId(ctx, _msg.message_id);

    await ctx.scene.leave();
  }

  private createTypesKeyboard(): Markup.Markup<ReplyKeyboardMarkup> {
    return Markup.keyboard(
      [
        Markup.button.text('Еда'),
        Markup.button.text('Транспорт'),
        Markup.button.text('Развлечения'),
        Markup.button.text('Прочее'),
      ],
      { columns: 3 },
    );
  }
}
