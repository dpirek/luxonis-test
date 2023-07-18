import postgres from 'postgres';

const sql = postgres({
  database: process.env.DB_NAME ? process.env.DB_NAME : '',
  username: process.env.DB_USER ? process.env.DB_PASSWORD : '',
  password: process.env.DB_PASSWORD ? process.env.DB_PASSWORD : ''
});

export default sql;