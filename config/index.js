import config from './config';
import nconf from 'nconf';
import _ from 'lodash';

let env = process.env.NODE_ENV || 'dev';

let { defaults } = config;

let current = config[env];

if (!current) {
  throw new Error(`Can"t find config for NODE_ENV=${env}`);
}

let result = _.merge({ env }, defaults, current);

export default nconf.defaults(result);
