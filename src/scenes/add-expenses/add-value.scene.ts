import type { Message } from 'telegraf/types';

import { IBotContext } from '../../context/context.interface';
import { AddExpensesSceneNames } from './add-expenses.constants';
import { BaseScene } from '../base.scene';

export class AddValueScene extends BaseScene {
  constructor() {
    super(AddExpensesSceneNames.ADD_VALUE);
    this.init();
  }

  init(): void {
    this._scene.enter((ctx: IBotContext) => this.enter(ctx));
    this._scene.leave((ctx: IBotContext) => this.leave(ctx));
    this._scene.on('message', (ctx: IBotContext) => this.valueHandler(ctx));
  }

  protected async enter(ctx: IBotContext): Promise<void> {
    await super.enter(ctx);
    ctx.session.sceneData.addExpenses = {};
    const msg = await ctx.reply('Введите число:');

    this.addMsgId(ctx, msg.message_id);
  }
  private async valueHandler(ctx: IBotContext): Promise<void> {
    const msg = <Message.TextMessage>ctx.message;

    this.addMsgId(ctx, msg.message_id);

    try {
      ctx.session.sceneData.addExpenses.value = Number(msg.text);
      await ctx.scene.enter(AddExpensesSceneNames.SELECT_TYPE);
    } catch (err) {
      console.log(err);
      await this.errorHandler(ctx);
    }
  }

  private async errorHandler(ctx: IBotContext): Promise<void> {
    const _msg = await ctx.reply('Значение должно быть числом');

    this.addMsgId(ctx, _msg.message_id);
  }
}
