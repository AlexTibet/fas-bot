import { Collection, MongoClient } from 'mongodb';

import { IConfigService } from '../config/config.service.interface';

import { ISessionData } from '../context/context.interface';

import container from '../inversify/inversify.config';

import { ILogger } from '../utils/logger/logger.interface';
import UTILS_TYPES from '../utils/utils.types';

interface ISessionCollections {
  key: string;
  session: ISessionData;
}

export class MongoSessionStore {
  private readonly _client: MongoClient;
  private readonly _collection: Collection<ISessionCollections>;
  private readonly _logger: ILogger;

  constructor(config: IConfigService) {
    this._logger = container.get<ILogger>(UTILS_TYPES.ILogger);
    this._client = new MongoClient(config.get('MONGO_DB_URL'));

    this._client
      .connect()
      .then((c) => this._logger.info(`[Mongo] connection: ${c.options.dbName}`))
      .catch((err) => this._logger.error('[Mongo] connection ERROR:', err));

    this._collection = this._client
      .db('fas-bot')
      .collection<ISessionCollections>('telegram-sessions');
  }

  async get(key: string): Promise<ISessionData | undefined> {
    const collection = await this._collection.findOne({ key });

    this._logger.log(
      `[MongoSessionStore] ${this.get.name}: ${key} `,
      collection as object,
    );

    return collection?.session;
  }

  async set(key: string, session: ISessionData): Promise<void> {
    await this._collection.updateOne(
      { key },
      { $set: { key, session } },
      { upsert: true },
    );
    this._logger.log(`[MongoSessionStore] ${this.set.name}: ${key} `, session);
  }

  async delete(key: string): Promise<void> {
    await this._collection.deleteOne({ key });
    this._logger.log(`[MongoSessionStore] ${this.delete.name}: ${key}`);
  }
}
