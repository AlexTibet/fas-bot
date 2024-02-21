import { Context, Scenes } from 'telegraf';
import type { User } from 'telegraf/types';

interface ISceneSession extends Scenes.SceneSessionData {
  // will be available under `ctx.scene.session.mySceneSessionProp`
  mySceneSessionProp: number;
}

export interface ISessionData extends Scenes.SceneSession<ISceneSession> {
  user?: User;
  currency?: string;
}

export interface IBotContext extends Context {
  session: ISessionData;
  scene: Scenes.SceneContextScene<IBotContext, ISceneSession>;
}
