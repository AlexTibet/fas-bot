import { Container } from 'inversify';

import CONFIG_TYPES from '../config/config.types';
import { IConfigService } from '../config/config.service.interface';
import { ConfigService } from '../config/config.service';

const container = new Container();

container.bind<IConfigService>(CONFIG_TYPES.IConfigService).to(ConfigService);

export default container;
