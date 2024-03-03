import { MiddlewareFn, Scenes } from 'telegraf';

import { IBotContext } from '../../context/context.interface';

import { IStage } from '../stage.interface';

import { AddValueScene } from './add-value.scene';
import { SelectTypeScene } from './select-type.scene';
import { AddCommentScene } from './add-comment.scene';

export class AddExpensesStage implements IStage {
  private readonly _stage: Scenes.Stage<IBotContext>;
  constructor() {
    const addValue = new AddValueScene();
    const selectType = new SelectTypeScene();
    const addComment = new AddCommentScene();

    this._stage = new Scenes.Stage<IBotContext>(
      [addValue.scene, selectType.scene, addComment.scene],
      { ttl: 10 },
    );
  }

  public middleware(): MiddlewareFn<IBotContext> {
    return this._stage.middleware();
  }
}
