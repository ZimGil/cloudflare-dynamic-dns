import publicIp from 'public-ip';
import cron from 'node-cron';

import { getRootARecordContent, saveIp } from './ip-manager';
import logger from './logger';

const interval = process.env.INTERVAL_IN_MINUTES;

if (!interval) {
  run();
} else {
  let cronExpression = `*/${interval} * * * *`;
  cronExpression = cron.validate(cronExpression) ? cronExpression : '0 * * * *'
  cron.schedule(cronExpression, run);
}


function run() {
  const ipPromises = [
    publicIp.v4().then((ip) => (logger.debug(`Current IP: ${ip}`), ip)),
    getRootARecordContent()
  ];

  Promise.all(ipPromises)
    .then(([currentIp, knownIp]) => currentIp !== knownIp ? saveIp(currentIp) : noop())
    .catch(logger.error);
}

function noop() {
  logger.info('Current record matches current IP')
}