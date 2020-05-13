import publicIp from 'public-ip';
import cron from 'node-cron';

import { getRootARecordContent, saveIp } from './ip-manager';
import logger from './logger';

const interval = process.env.INTERVAL_IN_MINUTES;
let isRunning = false;

if (!interval) {
  run();
} else {
  let cronExpression = `*/${interval} * * * *`;
  cronExpression = cron.validate(cronExpression) ? cronExpression : '0 * * * *'
  cron.schedule(cronExpression, run);
}


function run() {
  if (isRunning) {return;}
  isRunning = true;
  const ipPromises = [
    publicIp.v4().then((ip) => (logger.debug(`Current IP: ${ip}`), ip)),
    getRootARecordContent()
  ];

  Promise.all(ipPromises)
    .then(([currentIp, knownIp]) => currentIp !== knownIp ? saveIp(currentIp) : noop())
    .catch((e) => logger.error(e))
    .finally(() => isRunning = false);
}

function noop() {
  logger.info('Current record matches current IP')
}
