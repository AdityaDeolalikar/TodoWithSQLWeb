// Refers to connection with the sql server
import mysql, { Connection } from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const db: Connection = mysql.createConnection({
  host: process.env.DB_HOST as string,
  user: process.env.DB_USER as string,
  password: process.env.DB_PASS as string,
  database: process.env.DB_NAME as string,
});

db.connect((err: mysql.QueryError | null) => {
  if (err) throw err;
  console.log("✅ MySQL Connected");
});

export default db;
