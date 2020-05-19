# cloudeflare-dynamic-dns
Keep your Domain's A record pointing to your public IP address
**Warning:** This will patch ***ALL*** A records to your public IP

## How to install
```
$ git clone https://github.com/ZimGil/cloudeflare-dynamic-dns.git
$ cd cloudeflare-dynamic-dns
$ npm install
$ npm run build
```

## How to use
Some environment variables are needed (`.env` file is supported):
* `ZONE_ID` - Zone ID, can be found in your cloudflare site Overview.
* `CLOUDEFLARE_API_TOKEN` - [Create an API Token](https://dash.cloudflare.com/profile/api-tokens) - use the `Edit zone DNS` template and choose your Zone.
* `CRON_EXPRESSION`*(optional)* - A [`cron`](https://en.wikipedia.org/wiki/Cron) expression.
* `INTERVAL_IN_MINUTES` *(optional)* - How offten should the IP be verified in minutes. (Overriden by `CRON_EXPRESSION`)
* `LOG_FILES_PATH` *(optional)* - Path to log files directory (Defaults to `./log/`)

**NOTE:** In case of an invalid cron expression, single execution will replace the scheduled execution.

When all environment variables are set, run `npm start`
