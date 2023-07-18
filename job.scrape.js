
import https from 'https';
import sql from './db.js'

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

async function createTable() {
  await sql`CREATE TABLE estates (name TEXT, price INTEGER, locality TEXT, image TEXT)`;
}

async function insertRecord({name, price, locality, image }) {
  await sql`INSERT INTO estates ( name, price, locality, image) VALUES (${name}, ${price}, ${locality}, ${image})`;
}

async function scrape() {
  const response = await request(`${base}${path}${query}`);
  const data = JSON.parse(response);

  await sql`DROP TABLE estates`;
  await createTable();
  jsonData.forEach(l => {
    if(l.name && l.price && l.locality && l._links?.images[0]?.href) {
      insertRecord({
        name: l.name, 
        price: l.price, 
        locality: l.locality, 
        image: l._links?.images[0]?.href
      })
    }
  });

  console.log('Response Match:', data._embedded.estates.length === perPage);
}

scrape();
