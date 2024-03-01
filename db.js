const { Pool } = require('pg');
const pool = new Pool({
    user: "postgres",
    password: "qwertyuiop",
    host: "localhost",
    port: 5432,
    database: "node_started"
});

module.exports = pool;