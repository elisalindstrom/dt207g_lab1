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
    try {
        const result = await client.query(
            "SELECT * FROM courses ORDER BY progression ASC"
        );
        res.render("index", { courses: result.rows });
    } catch (error) {
        console.log(error);
    }
});

app.get("/form", (req, res) => {
    res.render("form", {
        errors: []
    });
});

app.get("/about", (req, res) => {
    res.render("about");
})

// Formulärdata
app.post("/form", async (req, res) => {
    const coursecode = req.body.coursecode;
    const coursename = req.body.coursename;
    const syllabus = req.body.syllabus;
    const progression = req.body.progression;

    let errors = [];

    try {
        // Validera input
        if (coursecode === "") {
            errors.push("Fyll i kurskod");
        }

        let result = await client.query("SELECT * FROM courses WHERE coursecode ILIKE $1", [coursecode]);
        
        if (result.rows.length > 0) {
            errors.push("Kursen är redan sparad")
        }

        if (coursename === "") {
            errors.push("Fyll i kursnamn");
        }

       if (syllabus === "") {
            errors.push("Fyll i URL till kursplan");
        }

        if (progression === "") {
            errors.push("Välj progression");
        }

        // Hantera errors
        if (errors.length > 0) {
            res.render("form", { errors });
            return;
        }

        // Lägg till värden i databasen
        await client.query(
            "INSERT INTO courses(coursecode, coursename, syllabus, progression) VALUES($1, $2, $3, $4)", [coursecode, coursename, syllabus, progression]
        );
        // Redirect till startsida
        res.redirect("/");
    } catch (error) {
        console.error(error);
    }
});

// Radera kurs
app.get("/delete/:id", async (req, res) => {
    const id = req.params.id;

    try {
        await client.query("DELETE FROM courses WHERE id = $1", [id]);
        // Redirect till startsida
        res.redirect("/");
    } catch (error) {
        console.error(error);
    }
});

// Starta applikationen
app.listen(process.env.PORT, () => {
    console.log("Servern startad på http://localhost:" + process.env.PORT)
});