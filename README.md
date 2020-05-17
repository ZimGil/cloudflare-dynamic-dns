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
* `ZONE_ID` - Zone ID, can be found in your cloudflare site Overview
* `CLOUDEFLARE_API_TOKEN` - [Create an API Token](https://dash.cloudflare.com/profile/api-tokens) - use the `Edit zone DNS` template and choose your Zone
* `INTERVAL_IN_MINUTES` - How offten should the IP be verified in minutes. (If ommited or invalid, will run a single time)

When all environment variables are set, run `npm start`
