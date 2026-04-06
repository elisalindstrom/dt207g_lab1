const { Client } = require("pg"); // PostgreSQL
require('dotenv').config(); // Läser in variabler från env-filen
const express = require("express");
const app = express(); // Skapa webbserver
app.set("view engine", "ejs"); // EJS som view engine
app.use(express.static("public")); // Möjliggör statiska filer
app.use(express.urlencoded({ extended: true })); // Utläsa formulärdata

// Anslutning till databas
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

//Anslut till databasen
client.connect((err) => {
    if (err) {
        console.log("Connection error: " + err);
    } else {
        console.log("Connected to database");
    }
})

// Routing
app.get("/", async (req, res) => {
    res.render("index");
});

app.get("/form", (req, res) => {
    res.render("form");
});

app.get("/about", (req, res) => {
    res.render("about");
})

// Starta applikationen
app.listen(process.env.PORT, () => {
    console.log("Servern startad på http://localhost:" + process.env.PORT)
});