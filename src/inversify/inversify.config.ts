import { Container } from 'inversify';

import CONFIG_TYPES from '../config/config.types';
import { IConfigService } from '../config/config.service.interface';
import { ConfigService } from '../config/config.service';

import SESSION_TYPES from '../session/session.types';
import { ISessionStoreService } from '../session/session.store.service.interface';
import { SessionStoreService } from '../session/session.store.service';

import PRISMA_TYPES from '../prisma/prisma.types';
import { IPrismaService } from '../prisma/prisma.interface';
import { PrismaService } from '../prisma/prisma.service';

import UTILS_TYPES from '../utils/utils.types';
import { ILogger } from '../utils/logger/logger.interface';
import { LoggerService } from '../utils/logger/logger.service';

const container = new Container();

/** Config */
container
  .bind<IConfigService>(CONFIG_TYPES.IConfigService)
  .to(ConfigService)
  .inSingletonScope();

/** Session */
container
  .bind<ISessionStoreService>(SESSION_TYPES.ISessionStoreService)
  .to(SessionStoreService)
  .inSingletonScope();

/** Prisma */
container
  .bind<IPrismaService>(PRISMA_TYPES.IPrismaService)
  .to(PrismaService)
  .inSingletonScope();

/** Utils */
container
  .bind<ILogger>(UTILS_TYPES.ILogger)
  .to(LoggerService)
  .inSingletonScope();

export default container;
