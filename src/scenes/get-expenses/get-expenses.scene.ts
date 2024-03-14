import { IBotContext } from '../../context/context.interface';
import { GetExpensesSceneNames } from './get-expenses.constants';
import { BaseScene } from '../base.scene';
import { Markup } from 'telegraf';
import { InlineKeyboardMarkup } from '@telegraf/types/markup';

enum GetExpensesCallbackNames {
  TODAY = 'today_callback',
  YESTERDAY = 'yesterday_callback',
  WEEK = 'way_callback',
  MONTH = 'month_callback',
  YEAR = 'year_callback',
}

export class GetExpensesScene extends BaseScene {
  constructor() {
    super(GetExpensesSceneNames.SELECT_FILTER);
    this.init();
  }

  init(): void {
    this._scene.enter((ctx: IBotContext) => this.enter(ctx));
    this._scene.leave((ctx: IBotContext) => this.leave(ctx));
  }

  protected async enter(ctx: IBotContext): Promise<void> {
    await super.enter(ctx);

    this._scene.action(
      GetExpensesCallbackNames.TODAY,
      async (ctx: IBotContext) => this.todayHandler(ctx),
    );
    this._scene.action(
      GetExpensesCallbackNames.YESTERDAY,
      async (ctx: IBotContext) => this.yesterdayHandler(ctx),
    );
    this._scene.action(
      GetExpensesCallbackNames.WEEK,
      async (ctx: IBotContext) => this.weekHandler(ctx),
    );
    this._scene.action(
      GetExpensesCallbackNames.MONTH,
      async (ctx: IBotContext) => this.monthHandler(ctx),
    );
    this._scene.action(
      GetExpensesCallbackNames.YEAR,
      async (ctx: IBotContext) => this.yearHandler(ctx),
    );

    const keyboard = this.createKeyboard();
    const _msg = await ctx.reply('За какое время?', keyboard);

    this.addMsgId(ctx, _msg.message_id);
  }

  private createKeyboard(): Markup.Markup<InlineKeyboardMarkup> {
    return Markup.inlineKeyboard(
      [
        Markup.button.callback('Сегодня', GetExpensesCallbackNames.TODAY),
        Markup.button.callback('Вчера', GetExpensesCallbackNames.YESTERDAY),
        Markup.button.callback('Неделя', GetExpensesCallbackNames.WEEK),
        Markup.button.callback('Месяц', GetExpensesCallbackNames.MONTH),
        Markup.button.callback('Год', GetExpensesCallbackNames.YEAR),
      ],
      { columns: 2 },
    );
  }

  async todayHandler(ctx: IBotContext): Promise<void> {
    const today = this.getToday();
    const answers = await this.getAnswers(ctx.session.user.id, { gte: today });

    await this.sendAnswer(ctx, answers);
  }

  async yesterdayHandler(ctx: IBotContext): Promise<void> {
    const today = this.getToday();
    const yesterday = this.getYesterday(today);

    const answers = await this.getAnswers(ctx.session.user.id, {
      gte: yesterday,
      lte: today,
    });

    await this.sendAnswer(ctx, answers);
  }

  async weekHandler(ctx: IBotContext): Promise<void> {
    const today = this.getToday();
    const weekAgo = this.getWeekAgo(today);

    const answers = await this.getAnswers(ctx.session.user.id, {
      gte: weekAgo,
      lte: today,
    });

    await this.sendAnswer(ctx, answers);
  }

  async monthHandler(ctx: IBotContext): Promise<void> {
    const today = this.getToday();
    const monthAgo = this.getMonthAgo(today);

    const answers = await this.getAnswers(ctx.session.user.id, {
      gte: monthAgo,
      lte: today,
    });

    await this.sendAnswer(ctx, answers);
  }

  async yearHandler(ctx: IBotContext): Promise<void> {
    const today = this.getToday();
    const yearAgo = this.getYearAgo(today);

    const answers = await this.getAnswers(ctx.session.user.id, {
      gte: yearAgo,
      lte: today,
    });

    await this.sendAnswer(ctx, answers);
  }

  private async sendAnswer(ctx: IBotContext, answers: string[]): Promise<void> {
    for await (const answer of answers) {
      await ctx.replyWithMarkdownV2(answer);
    }
  }

  private getToday(): Date {
    const today = new Date();

    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();

    return new Date(`${month}.${day}.${year}`);
  }

  private getYesterday(today: Date): Date {
    const date = new Date(today);

    return new Date(date.setDate(date.getDate() - 1));
  }

  private getWeekAgo(today: Date): Date {
    const date = new Date(today);

    return new Date(date.setDate(date.getDate() - 7));
  }

  private getMonthAgo(today: Date): Date {
    const date = new Date(today);

    return new Date(date.setMonth(date.getMonth() - 1));
  }

  private getYearAgo(today: Date): Date {
    const date = new Date(today);

    return new Date(date.setFullYear(date.getFullYear() - 1));
  }

  private async getAnswers(
    userId: string,
    filter: {
      gte: Date;
      lte?: Date;
    },
  ): Promise<string[]> {
    const where = {
      userId,
      date: {
        gte: filter.gte,
        lte: filter.lte,
      },
    };

    const expenses = await this._prisma.client.expense.findMany({
      where,
      orderBy: { date: 'desc' },
      include: { type: true },
    });

    const data = await this._prisma.client.expense.aggregate({
      where,
      _sum: { value: true },
    });

    const answerArray = expenses.map((e) => {
      const date = e.date.toLocaleDateString();
      const msg = `${date} \\- *${e.value}* **${e.type.name}** `;

      return msg + (e.comment ?? '');
    });

    const answer = [`Сумма: ${data._sum.value || 0}\n`];

    const batchSize = 100;
    const numBatches = Math.ceil(answerArray.length / batchSize);

    for (let i = 0; i < numBatches; i++) {
      const batch = answerArray.slice(i * batchSize, (i + 1) * batchSize);

      answer.push(batch.join('\n'));
    }

    return answer;
  }
}
