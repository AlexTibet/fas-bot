import { Markup } from 'telegraf';
import type { Message } from 'telegraf/types';
import { InlineKeyboardMarkup } from '@telegraf/types/markup';

import { IBotContext } from '../../context/context.interface';
import { defaultKeyboard } from '../../utils/default.keyboard';

import { BaseScene } from '../base.scene';
import { AddExpensesSceneNames } from './add-expenses.constants';

const COMMENT_MAX_LENGTH = 100;

export class AddCommentScene extends BaseScene {
  constructor() {
    super(AddExpensesSceneNames.ADD_COMMENT);
    this.init();
  }

  public init(): void {
    this._scene.enter((ctx: IBotContext) => this.enter(ctx));
    this._scene.leave((ctx: IBotContext) => this.leave(ctx));
    this._scene.on('message', (ctx: IBotContext) => this.valueHandler(ctx));
  }

  async enter(ctx: IBotContext): Promise<void> {
    await super.enter(ctx);
    const keyboard = this.createCommentSceneKeyboard();

    this._scene.action('add_comment_callback', async (ctx: IBotContext) =>
      this.addCommentHandler(ctx),
    );
    this._scene.action('not_comment_callback', async (ctx: IBotContext) =>
      this.notCommentHandler(ctx),
    );

    const _msg = await ctx.reply('Добавить комментарий?', keyboard);

    this.addMsgId(ctx, _msg.message_id);
  }

  async leave(ctx: IBotContext): Promise<void> {
    const { value, type, date, comment } = ctx.session.sceneData.addExpenses;

    if (value && type && date) {
      await this._prisma.createExpense(
        value,
        ctx.session.user.id,
        type.id,
        date,
        comment,
      );

      let _msg = `${date.toLocaleDateString()} \\- *${value}* **${type.name}**`;

      if (comment) _msg += `\n**${comment}**`;

      await ctx.replyWithMarkdownV2(_msg, defaultKeyboard);
    }

    ctx.session.sceneData.addExpenses = {};
    await super.leave(ctx);
  }

  private async valueHandler(ctx: IBotContext): Promise<void> {
    const msg = <Message.TextMessage>ctx.message;

    if (msg.text && msg.text.length <= COMMENT_MAX_LENGTH) {
      ctx.session.sceneData.addExpenses.comment = msg.text;

      await ctx.scene.leave();
    } else {
      const _msg = await ctx.reply(
        `Комментарий должен быть не более ${COMMENT_MAX_LENGTH} символов`,
      );

      this.addMsgId(ctx, _msg.message_id);
    }
  }

  private createCommentSceneKeyboard(): Markup.Markup<InlineKeyboardMarkup> {
    return Markup.inlineKeyboard(
      [
        Markup.button.callback('Да', 'add_comment_callback'),
        Markup.button.callback('Нет', 'not_comment_callback'),
      ],
      { columns: 2 },
    );
  }

  private async addCommentHandler(ctx: IBotContext): Promise<void> {
    const _msg = await ctx.reply('Напишите комментарий:');

    this.addMsgId(ctx, _msg.message_id);
  }

  private async notCommentHandler(ctx: IBotContext): Promise<void> {
    await ctx.scene.leave();
  }
}
