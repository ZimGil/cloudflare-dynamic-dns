import publicIp from 'public-ip';
import cron from 'node-cron';

import { patchRecords, getCurrentContent } from './ip-manager';
import logger, { ipChangeLogger } from './logger';

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
    getCurrentContent().then((ip) => (logger.debug(`Known IP: ${ip}`), ip)),
  ];

  Promise.all(ipPromises)
    .then(([currentIp, knownIp]) => {
      if (currentIp !== knownIp) {
        ipChangeLogger.warn(`Public IP Changed from ${knownIp} to ${currentIp}`);
        return patchRecords(currentIp);
      }
      logger.info('Current record matches current IP');
    })
    .catch((e) => logger.error(e))
    .finally(() => isRunning = false);
}
