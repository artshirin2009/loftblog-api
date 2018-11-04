var express = require("express");
var dotenv = require("dotenv").config();
var bodyParser = require("body-parser"); //добавляем парсер для обработки данных так как post запросы прилетают в body

var mongo = require("mongodb").MongoClient;

var app = express(); // создали сервер

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.get("/", function(req, res) {
  res.send("Hello Artur defsdfswdwesdfdsddsfs");
});
app.get("/users", function(req, res) {
  mongo.connect(
    url,
    {
      useNewUrlParser: true
    },
    function(err, client) {
      console.log("Connected successfully to server");
      const db = client.db(dbName);
      // Get the documents collection
      const collection = db.collection("users");
      collection.find({}).toArray(function(err, result) {
        if (err) throw err;
        res.send(result);
        client.close();
      });
    }
  );
});

app.get("/users/:id", function(req, res) {
  mongo.connect(
    url,
    {
      useNewUrlParser: true
    },
    function(err, client) {
      console.log("Connected successfully to server");
      const db = client.db(dbName);
      // Get the documents collection
      console.log(typeof req.params.id);
      const collection = db.collection("users");
      collection
        .find({
          _id: req.params.id
        })
        .toArray(function(err, result) {
          if (err) throw err;
          res.send(result);
          client.close();
        });
    }
  );
});
app.post("/users", function(req, res) {
  mongo.connect(
    url,
    {
      useNewUrlParser: true
    },
    function(err, client) {
      console.log("Connected successfully to server");
      var user = {
        _id: req.body.id,
        name: req.body.name,
        age: req.body.age
      };
      const db = client.db(dbName);
      // Get the documents collection
      const collection = db.collection("users");
      collection.insertOne(user, function(err, result) {
        collection.find({}).toArray(function(err, result) {
          if (err) throw err;
          res.send(result);
          client.close();
        });
      });
    }
  );
});

app.put("/users/", function(req, res) {
  mongo.connect(
    url,
    {
      useNewUrlParser: true
    },
    // function (err, client) {
    //   console.log("Connected successfully to server");
    //   const db = client.db(dbName);
    //   // Get the documents collection
    //   const collection = db.collection("users");
    //   collection.find({
    //     _id: req.body.id
    //   }).toArray(function (err, result) {
    //     if (err) throw err;
    //     console.log(result[0]._id);
    //     collection.deleteOne({
    //       _id: req.body.id
    //     });
    //     var user = {
    //       _id: result[0]._id,
    //       name: req.body.name,
    //       age: req.body.age
    //     };
    //     collection.insertOne(user);
    //     res.send(user);
    //     client.close();
    //   });
    // }
    function(err, client) {
      console.log("Connected successfully to server");
      const db = client.db(dbName);
      // Get the documents collection
      const collection = db.collection("users");
      try {
        collection.updateOne(
          {
            _id: req.body.id
          },
          {
            $set: {
              name: req.body.name,
              age: req.body.age
            }
          },
          {
            upsert: true
          },
          function(err, result) {
            res.send(result);
          }
        );
      } catch (e) {
        console.log(e);
      }

      client.close();
    }
  );
});

//   var userToEdit = users.find(function(user) {
//     return user.id === Number(req.params.id);
//   });
//   userToEdit.name = req.body.name;
//   res.send(userToEdit);
//   console.log(userToEdit.name);

app.delete("/delete/:id", function(req, res) {
  mongo.connect(
    url,
    {
      useNewUrlParser: true
    },
    function(err, client) {
      console.log("Connected successfully to server");
      const db = client.db(dbName);
      // Get the documents collection
      const collection = db.collection("users");
      collection.deleteOne(
        {
          _id: req.params.id
        },
        function() {
          collection.find().toArray(function(err, result) {
            if (err) throw err;
            res.send(result);
            client.close();
          });
        }
      );
    }
  );

  //   var userToDelete = users.find(function(user) {
  //     return user.id === Number(req.body.id);
  //   });
  //   var userToDeleteIndex = users.indexOf(userToDelete);

  //   users.splice(userToDeleteIndex, 1);
  //   res.send(users);
  //   console.log(userToDeleteIndex);
});

// Connection URL
const url = "mongodb://localhost:27017";

// Database Name
const dbName = "myproject";

// Use connect method to connect to the server

app.listen(process.env.PORT, function(db) {
  console.log(
    `Api app started on port - ${process.env.PORT}; ${process.env.SERVER_URL}:${
      process.env.PORT
    }`
  );
});
