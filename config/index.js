import config from './config';
import _ from 'lodash';

let env = process.env.NODE_ENV || 'dev';

// for parcel build && react
if (env === 'production') {
  env = 'prod';
}

const { defaults } = config;

const current = config[env];

if (!current) {
  throw new Error(`Can't find config for NODE_ENV=${env}`);
}

const result = _.merge({ env }, defaults, current);

export default result;
