# Okra Scrape Pages

## Install packages
```shell
$ npm install
```

## Running the scraping script on cli
```bash
$ node utils/scrape_organization.js
```
 
## Running the live server
```shell
$ npm start
```

### The server can be accessed on http://localhost:3000/
This will return the data of the scrapped website, the website to scrap is set via an 
environment variable `SCRAPE_URL` that can be modified in `./config/index.js`

### To use a local docker instance as your mongo DB, simply run the following to spin up a fast instance
```shell
$ docker compose up
```

This exposes mongoDB on port `27017`


