import publicIp from 'public-ip';

import { getSavedIp, saveIp } from './ip-manager';

const ipPromises = [
  publicIp.v4(),
  getSavedIp()
];

Promise.all(ipPromises)
  .then(([currentIp, knownIp]) => currentIp !== knownIp ? saveIp(currentIp) : Promise.resolve());

