var express = require("express");
var dotenv = require('dotenv').config();
var serverConfig = require('./config');
var bodyParser = require("body-parser"); //добавляем парсер для обработки данных так как post запросы прилетают в body

var MongoClient = require('mongodb').MongoClient;
var db;
var app = express(); // создали сервер

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

var artists = [{
        id: 1,
        name: "Metallica"
    },
    {
        id: 2,
        name: "Iron Maiden"
    },
    {
        id: 3,
        name: "Deep Purple"
    }
];

app.get("/", function (req, res) {
    console.log(req.params);
    res.send("Hello Api");
});
app.get("/artists", function (req, res) {
    res.send(artists);
});
app.get("/artists/:id", function (req, res) {
    console.log(req.params.id);
    res.send(artists[req.params.id]);
});
app.post("/artists", function (req, res) {
    var artist = {
        id: Date.now(),
        name: req.body.name
    };
    artists.push(artist);
    console.log(artist);
    res.send(artist);
});

app.put("/art/:id", function (req, res) {
    var artistToEdit = artists.find(function (artist) {
        return artist.id === Number(req.params.id);
    });
    artistToEdit.name = req.body.name;
    res.send(artistToEdit);

    console.log(artistToEdit.name);
});

app.delete("/delete/", function (req, res) {
    var artistToDelete = artists.find(function (artist) {
        return artist.id === Number(req.body.id);
    });
    var artistToDeleteIndex = artists.indexOf(artistToDelete);

    artists.splice(artistToDeleteIndex, 1);
    res.send(artists);
    console.log(artistToDeleteIndex);
});
var port = process.env.PORT;
console.log(process.env.PORT)

// Connecting to DataBase and then listening port 3000

MongoClient.connect(process.env.DB_URL, {
    useNewUrlParser: true,
}, function (err, database) {
    if (err) {
        return console.log(err)
    }
    db = database;
    app.listen(process.env.PORT, function () {
        console.log(`Api app started on port - ${process.env.PORT}; ${process.env.SERVER_URL}:${process.env.PORT}`);
    });
})