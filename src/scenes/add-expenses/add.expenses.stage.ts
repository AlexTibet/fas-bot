import { MiddlewareFn, Scenes } from 'telegraf';

import { IBotContext } from '../../context/context.interface';

import { IStage } from '../stage.interface';

import { AddValueScene } from './add-value.scene';
import { SelectTypeScene } from './select-type.scene';
import { SelectDateScene } from './select-date.scene';
import { AddCommentScene } from './add-comment.scene';

export class AddExpensesStage implements IStage {
  public name = AddExpensesStage.name;
  private readonly _stage: Scenes.Stage<IBotContext>;

  constructor() {
    const addValue = new AddValueScene();
    const selectType = new SelectTypeScene();
    const selectDate = new SelectDateScene();
    const addComment = new AddCommentScene();

    this._stage = new Scenes.Stage<IBotContext>(
      [addValue.scene, selectType.scene, selectDate.scene, addComment.scene],
      { ttl: 100 },
    );
  }

  public middleware(): MiddlewareFn<IBotContext> {
    return this._stage.middleware();
  }
}
