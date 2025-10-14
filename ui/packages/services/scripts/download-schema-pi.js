const http = require('http');
const https = require('https');
const fs = require('fs');
const { join } = require('path');

const url = `${process.env.API_URL_PI}/graphql/schema.graphql`;
const path = join(__dirname, '../src/graphql/pi/schemas/schema.graphql');


var request = null;

function handleResponse(response) {
    console.log(response);
    if (response.statusCode === 200) {

        response.setEncoding('utf8');
        let rawData = '';
        response.on('data', (chunk) => { rawData += chunk; });
        response.on('end', () => {
            try {
            fs.writeFileSync(path, rawData);
            } catch (e) {
            console.error(e.message);
            }
        });

        /*
        var file = fs.createWriteStream(path);
        response.pipe(file);
        */
    }
};


if (url.startsWith('https')) { request = https.get(url, handleResponse); }
else { request = http.get(url, handleResponse); }

request.setTimeout(60000, function() {
    request.destroy();
});