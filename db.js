const { Pool } = require('pg');
const pool = new Pool({
    user: "personmeetsdb_user",
    password: "n024Me6LyYUx44YCQXh7f5NUupD9NWPu",
    host: "dpg-cnh66g6n7f5s73ah2oi0-a.oregon-postgres.render.com",
    port: 5432,
    database: "personmeetsdb",
    ssl: {
    rejectUnauthorized: false 
  }
});

module.exports = pool;
