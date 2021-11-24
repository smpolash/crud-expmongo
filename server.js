// import * as express from "express";
const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require('mongodb').MongoClient;

// App bootstrap
const app = express();
// Config
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

// Routing;
// We normally abbreviate `request` to `req` and `response` to `res`.

// app.get('/', (req, res) => {
//     console.log(`listening from root.`);
//     res.send(`Here is the first response.`);
//     res.sendFile(__dirname + '/index.html')
// });


// Database connections

const URI = "mongodb+srv://yoda:JQgqrNl02y1oc7v5@cluster1.kyo5f.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const Client = new MongoClient(URI, { useNewUrlParser: true, useUnifiedTopology: true });

Client.connect()
    .then((client) => {   
            
        console.log(`connected to mongodb atlas...`);

        const db = client.db("star-wars-quotes");
        const collection = db.collection("quotes");

        // perform actions on the collection object
        // client.close();

        app.get('/', (req, res) => { 
            collection.find().toArray()
                .then(result => {
                    // console.log(result);
                    res.render('index.ejs', { quotes: result });
                })
                .catch(err => {
                    console.error(err);
                });            
        });

        app.post('/quotes', (req, res) => {
            // console.log(`Hellooooooooooooo!`);
            // console.log(req.body);

            collection.insertOne(req.body)
                .then(result => { 
                    // console.log(result);
                    res.redirect('/');
                })
                .catch(err => { 
                    console.error(err);
                });
        });
       
    })
    .catch((err) => {
        console.error(err);
    });

// Server 
app.listen("3000", function() {
    console.log(`listening on: 3000...`);
});