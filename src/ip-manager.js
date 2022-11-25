import axios from 'axios';
import { size, sample, reduce, map } from 'lodash';
import logger from './logger';

const cloudflareApi = 'https://api.cloudflare.com/client/v4';
const apiToken = process.env.CLOUDEFLARE_API_TOKEN;
const zoneIds = process.env.ZONE_ID.split(',');
axios.defaults.headers.common['Authorization'] = `Bearer ${apiToken}`;
axios.defaults.headers.common['Content-Type'] = 'application/json';
let recordsByZoneId = {};

export function patchRecords(content) {
  const patchPromises = reduce(recordsByZoneId, (promises, records, zoneId) => [...promises, ...records.map(({id, name}) => {
    const URI = `${cloudflareApi}/zones/${zoneId}/dns_records/${id}`;
    return axios.patch(URI, {content})
      .then(() => logger.debug(`Record for ${name} patched to ${content}`));
  })], []);

  return Promise.all(patchPromises)
    .then(() => logger.info(`All records patched to ${content}`));
}

export function getCurrentContent() {
  return getARecords()
    .then((_recordsByZoneId) => recordsByZoneId = Object.fromEntries(_recordsByZoneId))
    .then(() => size(recordsByZoneId) && map(recordsByZoneId, (records) => records[0].content));
}

function getARecords() {
  return Promise.all(zoneIds.map((zoneId) => {
    const URI = `${cloudflareApi}/zones/${zoneId}/dns_records/`;

    return axios.get(`${cloudflareApi}/zones/${zoneId}/dns_records/`)
    .then(({data}) => [zoneId, data.result.filter(({type}) => type === 'A')]);
  }));
}
