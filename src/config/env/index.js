import _ from 'lodash';
import generateConfig from './config.default';
import configDev from './config.dev';
import configTest from './config.test';
import configProd from './config.prod';

let config = generateConfig();
let envCfg;
switch (process.env.NODE_ENV) {
case 'production':
  envCfg = configProd;
  break;
case 'test':
  envCfg = configTest;
  break;
default:
  envCfg = configDev;
  break;
}
let cfg = _.merge({}, config, envCfg);
cfg._baseUrl = cfg.api + cfg.suffix;
cfg.baseUploadUrl = cfg.api + cfg.suffix + '/auth';
cfg.baseDownUrl = cfg.api + '/auth';
cfg.downUrl = cfg.api + cfg.suffix + '/auth.';
cfg.fileUrl = {
  baseUrl: cfg.downUrl,
  baseUrlNoAuth: cfg._baseUrl,
  upFileurl: cfg.baseUploadUrl + '/customer.file.import/v1.0',
  reportDownload: '/report.list.download/v1.0'
};
cfg.extendCfg = o => {
  _.merge(cfg, o);
};
export { cfg };
