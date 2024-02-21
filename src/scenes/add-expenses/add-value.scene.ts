import { Scenes } from 'telegraf';
import type { Message } from 'telegraf/types';

import { IBotContext } from '../../context/context.interface';
import { AddExpensesSceneNames } from './add-expenses.constants';

export class AddValueScene {
  private readonly _scene: Scenes.BaseScene<IBotContext>;
  constructor() {
    this._scene = new Scenes.BaseScene<IBotContext>(
      AddExpensesSceneNames.ADD_VALUE,
    );
    this.init();
  }

  public get scene(): Scenes.BaseScene<IBotContext> {
    return this._scene;
  }

  private init(): void {
    this._scene.enter((ctx: IBotContext) => this.enter(ctx));
    this._scene.on('message', (ctx: IBotContext) => this.valueHandler(ctx));
  }

  private async enter(ctx: IBotContext): Promise<void> {
    await ctx.reply('Введите сумму:');
  }

  private async valueHandler(ctx: IBotContext): Promise<void> {
    const message = <Message.TextMessage>ctx.message;

    console.log(message.text);
    await ctx.reply(`Добавляю ${message.text} ${ctx.session.currency || ''}`);
    await ctx.scene.enter(AddExpensesSceneNames.SELECT_TYPE);
  }
}
