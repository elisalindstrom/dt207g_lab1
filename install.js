const { Client } = require("pg");
require('dotenv').config();

// Ansluter till databasen genom inställningar från env-fil
const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    ssl: {
        rejectUnauthorized: false,
    },
})

// Ansluter
client.connect((err) => {
    if (err) {
        console.log("Connection error: " + err);
    } else {
        console.log("Connected to database");
        createTables(); // Funktion som skapar tabell
    }
})

// Skapar tabellen courses
async function createTables() {
    try {
        const res = await client.query(`
            DROP TABLE IF EXISTS courses;
            CREATE TABLE IF NOT EXISTS courses (
                id SERIAL PRIMARY KEY,
                coursecode TEXT NOT NULL,
                coursename TEXT NOT NULL,
                syllabus TEXT NOT NULL,
                progression VARCHAR(1) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            `)
        console.log(res);
    } catch (err) {
        console.error(err);
    } finally {
        await client.end()
    }
}