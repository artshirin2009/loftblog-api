var express = require("express");
var bodyParser = require("body-parser"); //добавляем парсер для обработки данных так как post запросы прилетают в body

var app = express(); // создали сервер

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

var artists = [
  {
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

app.get("/", function(req, res) {
  console.log(req.params);
  res.send("Hello Api");
});
app.get("/artists", function(req, res) {
  res.send(artists);
});
app.get("/artists/:id", function(req, res) {
  console.log(req.params.id);
  res.send(artists[req.params.id]);
});
app.post("/artists", function(req, res) {
  var artist = {
    id: Date.now(),
    name: req.body.name
  };
  artists.push(artist);
  console.log(artist);
  res.send(artist);
});

app.put("/art/:id", function(req, res) {
  var artistToEdit = artists.find(function(artist) {
    return artist.id === Number(req.params.id);
  });
  artistToEdit.name = req.body.name;
  res.send(artistToEdit);

  console.log(artistToEdit.name);
});

app.delete("/delete/", function(req, res) {
  var artistToDelete = artists.find(function(artist) {
    return artist.id === Number(req.body.id);
  });
  var artistToDeleteIndex = artists.indexOf(artistToDelete);

  artists.splice(artistToDeleteIndex, 1);
  res.send(artists);
  console.log(artistToDeleteIndex);
});

var serverAdress = `http://localhost:3000/`;
var port = 3000;
app.listen(3000, function() {
  console.log(`Api app started on port - ${port}; ${serverAdress}`);
});
