import { MongoClient, Collection } from 'mongodb';

import { IConfigService } from '../config/config.service.interface';

import { IBotContext } from '../context/context.interface';

interface ISessionCollections {
  key: string;
  session: IBotContext;
}

export class MongoSessionStore {
  private readonly _client: MongoClient;
  private readonly _connection: Promise<MongoClient>;
  private readonly _collection: Collection<ISessionCollections>;

  constructor(config: IConfigService) {
    this._client = new MongoClient(config.get('MONGO_DB_URL'));
    this._connection = this._client.connect();
    this._collection = this._client
      .db('fas-bot')
      .collection<ISessionCollections>('telegramm-sessions');
  }

  async get(key: string): Promise<IBotContext | undefined> {
    await this._connection;
    const collection = await this._collection.findOne({ key });

    return collection?.session;
  }

  async set(key: string, session: IBotContext): Promise<void> {
    await this._connection;
    await this._collection.updateOne(
      { key },
      { $set: { key, session } },
      { upsert: true },
    );
  }

  async delete(key: string): Promise<void> {
    await this._connection;
    await this._collection.deleteOne({ key });
  }
}
