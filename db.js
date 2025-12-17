import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

pool.query('SELECT NOW()')
  .then(() => console.log('✅ Connecté!'))
  .catch(err => console.error('❌ Erreur:', err.message));

export default pool;