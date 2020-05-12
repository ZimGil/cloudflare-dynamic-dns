import publicIp from 'public-ip';

import { getRootARecordContent, saveIp } from './ip-manager';
import logger from './logger';

const ipPromises = [
  publicIp.v4().then((ip) => (logger.debug(`Current IP: ${ip}`), ip)),
  getRootARecordContent()
];

Promise.all(ipPromises)
  .then(([currentIp, knownIp]) => currentIp !== knownIp ? saveIp(currentIp) : noop())
  .catch(logger.error);

function noop() {
  logger.info('Current record matches current IP')
}
