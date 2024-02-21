import { Markup, Scenes } from 'telegraf';
import { IBotContext } from '../../context/context.interface';
import { AddExpensesSceneNames } from './add-expenses.constants';
import { ReplyKeyboardMarkup } from '@telegraf/types/markup';
import type { Message } from 'telegraf/types';

export class SelectTypeScene {
  private readonly _scene: Scenes.BaseScene<IBotContext>;
  constructor() {
    this._scene = new Scenes.BaseScene<IBotContext>(
      AddExpensesSceneNames.SELECT_TYPE,
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
    const keyboard = this.createTypesKeyboard();

    await ctx.reply('Какой тип траты?', keyboard);
  }

  private async valueHandler(ctx: IBotContext): Promise<void> {
    const message = <Message.TextMessage>ctx.message;

    console.log(message.text);
    await ctx.reply(`Тип: ${message.text}\n Готово.`);
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
