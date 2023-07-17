
import https from 'https';
import fs from 'fs';

const base = 'https://www.sreality.cz';
const path = '/api/cs/v2/estates';
const perPage = 500;
const query = `?category_main_cb=2&category_type_cb=1&per_page=${perPage}&tms=1689448155345`;

function request(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function scrape() {
  const response = await request(`${base}${path}${query}`);
  const data = JSON.parse(response);

  fs.writeFileSync('data.json', JSON.stringify(data._embedded.estates, null, 2));
  console.log('Response Match:', data._embedded.estates.length === perPage);
}

scrape();
