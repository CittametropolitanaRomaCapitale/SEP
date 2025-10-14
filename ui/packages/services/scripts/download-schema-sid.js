const http = require('http');
const https = require('https');
const fs = require('fs');
const { join } = require('path');

const url = `${process.env.API_URL_SID}/graphql/schema.graphql`;
const path = join(__dirname, '../src/graphql/sid/schemas/schema.graphql');

if (url.startsWith('https')) {
  const request = https.get(url, function (response) {
    if (response.statusCode === 200) {
      var file = fs.createWriteStream(path);
      response.pipe(file);
    }
    request.setTimeout(60000, function () {
      request.destroy();
    });
  });
} else {
  const request = http.get(url, function (response) {
    if (response.statusCode === 200) {
      var file = fs.createWriteStream(path);
      response.pipe(file);
    }
    request.setTimeout(60000, function () {
      request.destroy();
    });
  });
}
