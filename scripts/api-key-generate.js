#!/usr/bin/env node

import fs from 'fs';
import 'dotenv/config';

const { APIGATEWAY_APIKEY, APIGATEWAY_ENDPOINT } = process.env;

const content = `const clippy = document.querySelector('super-clippy);\n\nclippy.apiKey='${APIGATEWAY_APIKEY}';\nclippy.endpoint='${APIGATEWAY_ENDPOINT}';`;

fs.writeFile('./demo/addApi.js', content, (err) => {
  if (err) throw err;
  console.log('API Key file created successfully!');
});
