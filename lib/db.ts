import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  host: '0.0.0.0',
  database: 'postgres',
  password: 'postgres',
  port: +(process.env.PGPORT || 5432),
});

export default pool;
