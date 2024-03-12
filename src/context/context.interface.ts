import { Context, Scenes } from 'telegraf';

import { IAddExpensesSceneData } from '../scenes/add-expenses/add-expenses.constants';

import { IUser } from '../prisma/prisma.interface';

interface ISceneSession extends Scenes.SceneSessionData {
  // will be available under `ctx.scene.session.mySceneSessionProp`
  messageIds: number[];
  leaveText: string;
}

export interface ISessionData extends Scenes.SceneSession<ISceneSession> {
  user: IUser;
  sceneData: ISceneData;
}

export interface ISceneData {
  addExpenses: IAddExpensesSceneData;
}

export interface IBotContext extends Context {
  session: ISessionData;
  scene: Scenes.SceneContextScene<IBotContext, ISceneSession>;
}
