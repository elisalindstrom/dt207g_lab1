const express = require("express");
const app = express(); // Skapat webbserver
const port = 3000; // Använder port 3000
app.use(express.static("public"));
app.set("view engine", "ejs");

// Routing
app.get("/", (req, res) => {
    res.render("index");
});

app.get("/form", (req, res) => {
    res.render("form");
});

app.get("/about", (req, res) => {
    res.render("about");
})

// Starta applikationen
app.listen(port, () => {
    console.log("Servern är igång")
});