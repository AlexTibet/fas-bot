import { Scenes } from 'telegraf';
import type { Message } from 'telegraf/types';

import { IBotContext } from '../../context/context.interface';
import { defaultKeyboard } from '../../utils/default.keyboard';

import { AddExpensesSceneNames } from './add-expenses.constants';

export class AddCommentScene {
  private readonly _scene: Scenes.BaseScene<IBotContext>;
  constructor() {
    this._scene = new Scenes.BaseScene<IBotContext>(
      AddExpensesSceneNames.ADD_COMMENT,
    );
    this.init();
  }

  public get scene(): Scenes.BaseScene<IBotContext> {
    return this._scene;
  }

  private init(): void {
    this._scene.enter((ctx: IBotContext) => this.enter(ctx));
    this._scene.leave((ctx: IBotContext) => this.leave(ctx));
    this._scene.on('message', (ctx: IBotContext) => this.valueHandler(ctx));
  }

  private async enter(ctx: IBotContext): Promise<void> {
    await ctx.reply('Введите комментарий:');
  }

  private async leave(ctx: IBotContext): Promise<void> {
    await ctx.reply('Коментарий добавлен', defaultKeyboard);
  }

  private async valueHandler(ctx: IBotContext): Promise<void> {
    const message = <Message.TextMessage>ctx.message;

    await ctx.editMessageText(
      `Комментарий ${message.text} ${ctx.session.currency || ''}`,
    );
    await ctx.scene.enter(AddExpensesSceneNames.SELECT_TYPE);
  }
}
