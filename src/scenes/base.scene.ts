import { Scenes } from 'telegraf';
import { IBotContext } from '../context/context.interface';

export abstract class BaseScene {
  protected readonly _scene: Scenes.BaseScene<IBotContext>;

  protected constructor(name: string) {
    this._scene = new Scenes.BaseScene<IBotContext>(name);
  }

  public abstract init(): void;

  public get scene(): Scenes.BaseScene<IBotContext> {
    return this._scene;
  }

  protected async enter(ctx: IBotContext): Promise<void> {
    ctx.scene.session.messageIds = [];
  }

  protected async leave(ctx: IBotContext): Promise<void> {
    for await (const id of ctx.scene.session.messageIds) {
      await ctx.deleteMessage(id);
    }

    // await ctx.reply(ctx.scene.session.leaveText, defaultKeyboard);
  }

  protected addMsgId(ctx: IBotContext, id: number): void {
    ctx.scene.session.messageIds.push(id);
  }
}
